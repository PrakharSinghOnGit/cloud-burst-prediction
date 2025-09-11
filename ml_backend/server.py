from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
import joblib
import random
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import pandas as pd

app = FastAPI()

# -----------------------------
# Load Dataset & Fit Scaler
# -----------------------------
df = pd.read_csv("num_model/data/cloudburst_dataset.csv")
X = df.drop(columns=["cloud_burst", "source_type"])
y = df["cloud_burst"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# -----------------------------
# Load tabular models
# -----------------------------
xgb_model = joblib.load("num_model/models/xgboost_model.pkl")
rf_model = joblib.load("num_model/models/random_forest_model.pkl")
svc_model = joblib.load("num_model/models/svc_model.pkl")

# -----------------------------
# Models dictionary
# -----------------------------
models = {
    "xgboost_tabular": xgb_model,
    "rf_tabular": rf_model,
    "svc_tabular": svc_model,
}

# -----------------------------
# Rolling predictions per model
# -----------------------------
WINDOW_SIZE = 15
rolling_preds = {name: [] for name in models.keys()}

# Latest prediction result
latest_result = None
last_input_data = None  # Store last received data

# -----------------------------
# Global lists for top heights
# -----------------------------
cloudburst_top_height_range = [14000, 15000, 16000, 17000, 18000]
non_cloudburst_top_height_range = [1000, 1200, 1400, 1600, 1800]

# -----------------------------
# IoT input schema
# -----------------------------
class CloudArray(BaseModel):
    data: List[float]

# -----------------------------
# Prediction helper
# -----------------------------
def get_prediction(model_name: str, model, input_data):
    """
    Returns both predicted class and probability of predicted class
    """
    # Inject random top height based on first element
    if input_data[0] == 1:
        input_data[0] = random.choice(cloudburst_top_height_range)
    else:
        input_data[0] = random.choice(non_cloudburst_top_height_range)

    # Convert to 2D and scale
    features = np.array(input_data, dtype=float).reshape(1, -1)
    features_scaled = scaler.transform(features)

    # Predict class
    pred = model.predict(features_scaled)[0]

    # Get probability for predicted class
    probs = model.predict_proba(features_scaled)[0]   # [prob_class0, prob_class1]
    pred_prob = probs[pred]                           # probability of predicted class

    return int(pred), float(pred_prob)

# -----------------------------
# Endpoint: Receive data & rolling predictions
# -----------------------------
@app.post("/data/")
async def predict_and_store(cloud: Optional[CloudArray] = None):
    global latest_result, last_input_data

    if cloud is None or not cloud.data:
        return {"error": "No input data provided"}

    # Store last input
    last_input_data = cloud.data.copy()

    final_prediction = None
    final_prediction_prob = None

    for name, model in models.items():
        input_data = cloud.data.copy()  # copy to avoid modifying original
        try:
            pred, pred_prob = get_prediction(name, model, input_data)
        except Exception as e:
            print(f"Prediction failed for {name}: {e}")
            pred, pred_prob = None, None

        # Store as tuple (prediction, probability)
        rolling_preds[name].append((pred, pred_prob))

    # Compute final prediction if window is full
    if len(next(iter(rolling_preds.values()))) >= WINDOW_SIZE:
        # Max vote per model over window
        per_model_votes = [max([p[0] for p in preds]) for preds in rolling_preds.values()]
        # Majority voting across models
        final_prediction = 1 if sum(per_model_votes) >= (len(models) // 2 + 1) else 0

        # Compute average probability of predicted class across models
        per_model_probs = []
        for preds in rolling_preds.values():
            # probability of final voted class per window entry
            class_probs = [p[1] if p[0] == final_prediction else 1 - p[1] for p in preds]
            per_model_probs.append(sum(class_probs) / len(class_probs))  # average per model

        final_prediction_prob = sum(per_model_probs) / len(per_model_probs)  # overall average

        # Clear rolling lists after final decision
        for key in rolling_preds.keys():
            rolling_preds[key].clear()

    # Update latest result (same structure as original code, just add _prob keys)
    latest_result = {
        "current_prediction": {k: v[-1][0] if v else None for k, v in rolling_preds.items()},
        "current_prediction_prob": {k: v[-1][1] if v else None for k, v in rolling_preds.items()},
        "final_prediction": final_prediction,
        "final_prediction_prob": final_prediction_prob,
        "window_status": {
            "current_size": len(next(iter(rolling_preds.values()))),
            "needed_for_final": max(0, WINDOW_SIZE - len(next(iter(rolling_preds.values()))))
        },
        "last_input": last_input_data
    }

    return latest_result

# -----------------------------
# Endpoint: Get latest prediction
# -----------------------------
@app.get("/latest-result/")
async def get_latest_result():
    if latest_result:
        return {
            "status": "success",
            "message": (
                "Final prediction not ready yet. Waiting for more data."
                if latest_result["final_prediction"] is None else
                "Final prediction computed successfully."
            ),
            "details": latest_result
        }
    return {"status": "error", "message": "No data received yet"}
