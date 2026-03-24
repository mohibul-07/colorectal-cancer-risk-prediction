from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from predict import predict_risk

app = FastAPI(title="CRC Risk Predictor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class PatientInput(BaseModel):
    age: float
    gender: int
    race: int
    ethnicity: int
    alcohol_participant: int
    alcohol_frequency: int
    smoking_100_cigs: int
    education_level: int
    employment_status: int
    annual_income: int
    health_insurance: int
    marital_status: int
    sexual_orientation: int
    bmi: float
    obese: int
    hypertension: int
    platelet_count: float
    creatinine: float
    high_creatinine: int
    high_platelets: int
    low_platelets: int
    alt: float
    ast: float
    wbc: float
    rectal_bleeding: int
    weight_loss: int
    bowel_changes: int
    abdominal_pain: int
    family_history_crc: int
    lynch_any: int

@app.get("/")
def root():
    return {"message": "CRC Risk Predictor API is running"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/predict")
def predict(patient: PatientInput):
    renamed = {
        "gender": patient.gender,
        "race": patient.race,
        "ethnicity": patient.ethnicity,
        "age": patient.age,
        "Alcohol: Alcohol Participant": patient.alcohol_participant,
        "Alcohol: Drink Frequency Past Year": patient.alcohol_frequency,
        "Education Level: Highest Grade": patient.education_level,
        "Employment: Employment Status": patient.employment_status,
        "Income: Annual Income": patient.annual_income,
        "Insurance: Health Insurance": patient.health_insurance,
        "Marital Status: Current Marital Status": patient.marital_status,
        "Smoking: 100 Cigs Lifetime": patient.smoking_100_cigs,
        "The Basics: Sexual Orientation": patient.sexual_orientation,
        "bmi": patient.bmi,
        "obese": patient.obese,
        "hypertension": patient.hypertension,
        "platelet_count": patient.platelet_count,
        "creatinine": patient.creatinine,
        "high_creatinine": patient.high_creatinine,
        "high_platelets": patient.high_platelets,
        "low_platelets": patient.low_platelets,
        "alt": patient.alt,
        "ast": patient.ast,
        "wbc": patient.wbc,
        "family_history_crc": patient.family_history_crc,
        "rectal_bleeding": patient.rectal_bleeding,
        "weight_loss": patient.weight_loss,
        "bowel_changes": patient.bowel_changes,
        "abdominal_pain": patient.abdominal_pain,
        "lynch_any": patient.lynch_any,
    }
    result = predict_risk(renamed)
    return result