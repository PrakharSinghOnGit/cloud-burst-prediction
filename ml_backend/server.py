from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
import joblib
import random

app = FastAPI()

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

# Rolling predictions per model
WINDOW_SIZE = 15
rolling_preds = {name: [] for name in models.keys()}

# Latest prediction result
latest_result = None

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
def get_prediction(model_name: str, model, input_data) -> int:
    """
    Handles tabular models for now
    Returns 0 or 1
    """
    # Inject random top height based on first element
    if input_data[0] == 1:
        input_data[0] = random.choice(cloudburst_top_height_range)
    else:
        input_data[0] = random.choice(non_cloudburst_top_height_range)

    features = np.array(input_data, dtype=float).reshape(1, -1)
    pred = model.predict(features)
    return int(pred[0])

# -----------------------------
# Endpoint: Receive data & rolling predictions
# -----------------------------
@app.post("/data/")
async def predict_and_store(cloud: Optional[CloudArray] = None):
    global latest_result

    final_prediction = None

    for name, model in models.items():
        if cloud is None:
            continue
        input_data = cloud.data.copy()  # copy to avoid modifying original

        # Get prediction and append
        try:
            pred = get_prediction(name, model, input_data)
        except Exception as e:
            print(f"Prediction failed for {name}: {e}")
            pred = None

        rolling_preds[name].append(pred)

    # Compute final prediction if window is full
    if len(next(iter(rolling_preds.values()))) >= WINDOW_SIZE:
        # Max vote per model over window
        per_model_votes = [max(preds) for preds in rolling_preds.values()]
        # Majority voting across models
        final_prediction = 1 if sum(per_model_votes) >= (len(models) // 2 + 1) else 0
        # Clear rolling lists
        for key in rolling_preds.keys():
            rolling_preds[key].clear()

    # Update latest result
    latest_result = {
        "current_prediction": {k: v[-1] if v else None for k, v in rolling_preds.items()},
        "final_prediction": final_prediction
    }

    return latest_result

# -----------------------------
# Endpoint: Get latest prediction
# -----------------------------
@app.get("/latest-result/")
async def get_latest_result():
    if latest_result:
        return latest_result
    return {"message": "No data received yet"}
