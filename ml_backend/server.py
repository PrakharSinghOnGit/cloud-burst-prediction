import joblib
import random
import numpy as np
import pandas as pd

import tensorflow as tf
from tensorflow.keras.preprocessing import image

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel
from typing import List, Optional

from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

# -----------------------------
# App + CORS
# -----------------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Load Dataset & Fit Scaler
# -----------------------------
df = pd.read_csv("num_model/data/cloudburst_dataset.csv")
X = df.drop(columns=["cloud_burst", "source_type"])
y = df["cloud_burst"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)

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
# Load vision models (.keras)
# -----------------------------
cnn_model = tf.keras.models.load_model("vision_model/models/cnn_binary_classification_model.keras")
dn_model = tf.keras.models.load_model("vision_model/models/DenseNet_model.keras")

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
WINDOW_SIZE = 5
rolling_preds = {name: [] for name in models.keys()}

# Vision predictions (once per window)
vision_preds = {}
image_received_in_window = False

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
# Vision preprocessing
# -----------------------------
def preprocess_image(contents: bytes, target_size=(128, 128)):
    """
    Preprocess raw image bytes for CNN/DenseNet models
    """
    from io import BytesIO
    from PIL import Image

    img = Image.open(BytesIO(contents)).convert("RGB")
    img = img.resize(target_size)
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0
    return img_array

# -----------------------------
# Endpoint: Receive image data
# -----------------------------
@app.post("/image/")
async def predict_image(file: UploadFile = File(...)):
    global vision_preds, image_received_in_window

    contents = await file.read()
    img = preprocess_image(contents, target_size=(128, 128))

    try:
        # CNN
        cnn_prob = float(cnn_model.predict(img)[0][0])
        cnn_class = int(cnn_prob > 0.5)

        # DenseNet
        dn_prob = float(dn_model.predict(img)[0][0])
        dn_class = int(dn_prob > 0.5)

    except Exception as e:
        return {"status": "error", "message": f"Image prediction failed: {e}"}

    vision_preds["cnn1"] = {"predicted_class": cnn_class, "probability": cnn_prob}
    vision_preds["cnn2"] = {"predicted_class": dn_class, "probability": dn_prob}
    image_received_in_window = True

    return {
        "status": "success",
        "predictions": vision_preds,
        "message": "Image predictions stored for current window"
    }

# -----------------------------
# Endpoint: Receive data & rolling predictions
# -----------------------------
@app.post("/data/")
async def predict_and_store(cloud: Optional[CloudArray] = None):
    global latest_result, last_input_data, vision_preds, image_received_in_window

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
        # Majority voting: tabular
        tabular_votes = [max([p[0] for p in preds]) for preds in rolling_preds.values()]

        # Add vision model votes
        all_votes = tabular_votes.copy()
        if image_received_in_window and vision_preds:
            if "cnn1" in vision_preds:
                all_votes.append(vision_preds["cnn1"]["predicted_class"])
            if "cnn2" in vision_preds:
                all_votes.append(vision_preds["cnn2"]["predicted_class"])

        # Majority decision
        final_prediction = 1 if sum(all_votes) >= (len(all_votes) // 2 + 1) else 0

        # Compute average probability of predicted class (tabular only)
        per_model_probs = []
        for preds in rolling_preds.values():
            class_probs = [p[1] if p[0] == final_prediction else 1 - p[1] for p in preds]
            per_model_probs.append(sum(class_probs) / len(class_probs))
        final_prediction_prob = sum(per_model_probs) / len(per_model_probs)

        # Reset for next window
        for key in rolling_preds.keys():
            rolling_preds[key].clear()
        vision_preds.clear()
        image_received_in_window = False

    # Update latest result
    latest_result = {
        "current_prediction": {k: v[-1][0] if v else None for k, v in rolling_preds.items()},
        "current_prediction_prob": {k: v[-1][1] if v else None for k, v in rolling_preds.items()},
        "vision_predictions": vision_preds if vision_preds else None,
        "final_prediction": final_prediction,
        "final_prediction_prob": final_prediction_prob,
        "window_status": {
            "current_size": len(next(iter(rolling_preds.values()))),
            "needed_for_final": max(0, WINDOW_SIZE - len(next(iter(rolling_preds.values()))))
        },
        "last_input": last_input_data,
        "image_status": "received" if image_received_in_window else "not received"
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
