from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
import joblib
import random
import logging
from datetime import datetime

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# -----------------------------
# Load tabular models
# -----------------------------
try:
    xgb_model = joblib.load("num_model/models/xgboost_model.pkl")
    rf_model = joblib.load("num_model/models/random_forest_model.pkl")
    svc_model = joblib.load("num_model/models/svc_model.pkl")
    logger.info("✅ All models loaded successfully")
except Exception as e:
    logger.error(f"❌ Error loading models: {e}")
    # You might want to handle this more gracefully in production
    raise

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

# Request counter for debugging
request_counter = 0

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
    logger.info(f"🔄 Processing prediction for {model_name}")
    logger.info(f"📥 Original input data: {input_data}")
    
    # Inject random top height based on first element
    original_first_element = input_data[0]
    if input_data[0] == 1:
        input_data[0] = random.choice(cloudburst_top_height_range)
        logger.info(f"🌩️  Cloudburst detected (was {original_first_element}), injected height: {input_data[0]}")
    else:
        input_data[0] = random.choice(non_cloudburst_top_height_range)
        logger.info(f"☁️  Non-cloudburst detected (was {original_first_element}), injected height: {input_data[0]}")

    logger.info(f"📊 Modified input data: {input_data}")
    
    features = np.array(input_data, dtype=float).reshape(1, -1)
    pred = model.predict(features)
    result = int(pred[0])
    
    logger.info(f"🎯 {model_name} prediction: {result}")
    return result

# -----------------------------
# Endpoint: Receive data & rolling predictions
# -----------------------------
@app.post("/data/")
async def predict_and_store(cloud: Optional[CloudArray] = None):
    global latest_result, request_counter
    
    request_counter += 1
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    logger.info(f"\n{'='*50}")
    logger.info(f"📡 REQUEST #{request_counter} - {timestamp}")
    logger.info(f"{'='*50}")
    
    if cloud is None:
        logger.warning("⚠️  No data received")
        raise HTTPException(status_code=400, detail="No cloud data provided")
    
    logger.info(f"📥 Received data: {cloud.data}")
    logger.info(f"📏 Data length: {len(cloud.data)}")
    
    final_prediction = None
    current_predictions = {}

    # Process each model
    for name, model in models.items():
        input_data = cloud.data.copy()  # copy to avoid modifying original

        # Get prediction and append
        try:
            pred = get_prediction(name, model, input_data)
            rolling_preds[name].append(pred)
            current_predictions[name] = pred
            logger.info(f"✅ {name}: prediction = {pred}")
        except Exception as e:
            logger.error(f"❌ Prediction failed for {name}: {e}")
            rolling_preds[name].append(None)
            current_predictions[name] = None

    # Log current rolling window status
    logger.info(f"\n📊 ROLLING WINDOW STATUS:")
    for name, preds in rolling_preds.items():
        logger.info(f"   {name}: {len(preds)}/{WINDOW_SIZE} predictions = {preds}")

    # Compute final prediction if window is full
    window_lengths = [len(preds) for preds in rolling_preds.values()]
    min_window_length = min(window_lengths) if window_lengths else 0
    
    logger.info(f"🔍 Window check: min_length={min_window_length}, required={WINDOW_SIZE}")
    
    if min_window_length >= WINDOW_SIZE:
        logger.info(f"🎯 COMPUTING FINAL PREDICTION (window full)")
        
        # Max vote per model over window (ignoring None values)
        per_model_votes = []
        for name, preds in rolling_preds.items():
            valid_preds = [p for p in preds if p is not None]
            if valid_preds:
                max_vote = max(valid_preds)
                per_model_votes.append(max_vote)
                logger.info(f"   {name}: max vote = {max_vote} from {valid_preds}")
            else:
                logger.warning(f"   {name}: no valid predictions!")
        
        # Majority voting across models
        if per_model_votes:
            majority_threshold = len(models) // 2 + 1
            positive_votes = sum(per_model_votes)
            final_prediction = 1 if positive_votes >= majority_threshold else 0
            logger.info(f"🗳️  Voting: {positive_votes}/{len(per_model_votes)} positive votes")
            logger.info(f"🎯 FINAL PREDICTION: {final_prediction} (threshold: {majority_threshold})")
        else:
            final_prediction = 0
            logger.warning("⚠️  No valid votes, defaulting to 0")
        
        # Clear rolling lists
        for key in rolling_preds.keys():
            rolling_preds[key].clear()
        logger.info("🔄 Rolling windows cleared")
    else:
        logger.info(f"⏳ Window not full yet ({min_window_length}/{WINDOW_SIZE})")

    # Update latest result
    latest_result = {
        "timestamp": timestamp,
        "request_number": request_counter,
        "received_data": cloud.data,
        "current_prediction": current_predictions,
        "rolling_window_status": {name: len(preds) for name, preds in rolling_preds.items()},
        "final_prediction": final_prediction,
        "window_full": min_window_length >= WINDOW_SIZE
    }
    
    logger.info(f"💾 Updated latest_result")
    logger.info(f"{'='*50}\n")

    return latest_result

# -----------------------------
# Endpoint: Get latest prediction
# -----------------------------
@app.get("/latest-result/")
async def get_latest_result():
    logger.info(f"📤 GET /latest-result/ called")
    
    if latest_result:
        logger.info(f"📋 Returning latest result from request #{latest_result.get('request_number', 'unknown')}")
        return latest_result
    else:
        logger.info("🔍 No data received yet")
        return {"message": "No data received yet"}

# -----------------------------
# Health check endpoint
# -----------------------------
@app.get("/health/")
async def health_check():
    return {
        "status": "healthy",
        "models_loaded": list(models.keys()),
        "window_size": WINDOW_SIZE,
        "requests_processed": request_counter,
        "current_window_status": {name: len(preds) for name, preds in rolling_preds.items()}
    }

# -----------------------------
# Reset endpoint for testing
# -----------------------------
@app.post("/reset/")
async def reset_state():
    global rolling_preds, latest_result, request_counter
    
    # Clear rolling predictions
    for key in rolling_preds.keys():
        rolling_preds[key].clear()
    
    latest_result = None
    request_counter = 0
    
    logger.info("🔄 State reset successfully")
    
    return {
        "message": "State reset successfully",
        "window_status": {name: len(preds) for name, preds in rolling_preds.items()},
        "request_counter": request_counter
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)