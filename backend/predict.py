import pickle
import json
import numpy as np
import pandas as pd
import shap

# Load model and metadata
with open("models/best_xgb_model.pkl", "rb") as f:
    model = pickle.load(f)

with open("models/model_metadata.json", "r") as f:
    metadata = json.load(f)

FEATURES = metadata["feature_names"]
THRESHOLD = metadata["threshold"]

# Initialize SHAP explainer
explainer = shap.TreeExplainer(model)

def predict_risk(patient_data: dict):
    # Build dataframe in exact feature order
    row = {feat: patient_data.get(feat, 0) for feat in FEATURES}
    df = pd.DataFrame([row])

    # Get probability
    proba = float(model.predict_proba(df)[0][1])
    risk_score = round(proba * 100, 1)

    # Risk level
    if proba >= 0.6:
        risk_level = "HIGH"
    elif proba >= THRESHOLD:
        risk_level = "MODERATE"
    else:
        risk_level = "LOW"

    # SHAP
    shap_values = explainer.shap_values(df)
    shap_dict = dict(zip(FEATURES, shap_values[0]))
    top_factors = sorted(shap_dict.items(), key=lambda x: abs(x[1]), reverse=True)[:5]

    return {
        "risk_score": risk_score,
        "risk_level": risk_level,
        "threshold": THRESHOLD,
        "top_factors": [
            {
                "feature": feat,
                "impact": round(float(val), 4),
                "direction": "increases risk" if val > 0 else "decreases risk"
            }
            for feat, val in top_factors
        ]
    }