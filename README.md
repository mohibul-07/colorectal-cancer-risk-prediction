# Colorectal Cancer Risk Prediction Using Machine Learning

![Python](https://img.shields.io/badge/Python-3.10+-blue) ![XGBoost](https://img.shields.io/badge/XGBoost-2.0-orange) ![AUC](https://img.shields.io/badge/AUC-0.8003-green) ![License: MIT](https://img.shields.io/badge/License-MIT-yellow)

A machine learning system for colorectal cancer risk prediction integrating clinical, socioeconomic, and germline genomic data from the NIH All of Us Research Program.

**Research conducted at Queensborough Community College, CUNY**
**Advisor: Professor Zeynep Akcay Ozkan**

---

## Key Results

| Model | AUC | Notes |
|---|---|---|
| Logistic Regression | 0.8384 | Baseline |
| Random Forest | 0.8931 | |
| XGBoost v2 (temporal leakage) | 0.8979 | 93–95% of lab values post-diagnosis |
| **XGBoost v3 (clean, 6mo–2yr window)** | **0.8003** | **Current production model** |

- **Optimal threshold:** 0.24 (maximizes cancer recall for screening context)
- **Lynch syndrome enrichment:** 14× higher in cancer cases vs controls
- **APC variant enrichment:** 27× higher in cancer cases (p = 0.000012)
- **Top predictors (SHAP):** Age, Smoking, WBC, Alcohol Use, Annual Income, Creatinine

> **Note on v2 → v3:** A temporal leakage audit found that 93–95% of lab values in the original model were measured *after* CRC diagnosis — information unavailable at time of screening. Features were re-extracted using a strict 6-month to 2-year pre-diagnosis window. The AUC dropped from 0.8979 to 0.8003, which remains well above published benchmarks of 0.65–0.73.

## Dataset

- **Source:** NIH All of Us Researcher Workbench — Controlled Tier (CDR v2024Q3R9)
- **Size:** 12,248 patients (3,062 cancer cases, 9,186 controls)
- **Design:** Case-control study
- **Features:** 34 total — demographics, lifestyle, socioeconomic, clinical labs, symptoms, genomic

> ⚠️ Raw patient data is not included in this repository in compliance with the All of Us Data User Code of Conduct.

## Genomic Feature Engineering

Queried germline whole genome sequencing data from the All of Us Controlled Tier for pathogenic and likely pathogenic variants (ClinVar) in cancer-associated genes.

### Lynch Syndrome Variants (DNA Mismatch Repair Genes)

| Gene | Controls | Cancer Cases | Enrichment |
|---|---|---|---|
| lynch_any | 0.42% | 5.88% | 14× |
| MLH1 | 0.01% | 1.01% | 100× |
| MSH6 | 0.07% | 0.72% | 10× |

### APC Variants (Tumor Suppressor)

| Gene | Controls | Cancer Cases | Enrichment | p-value |
|---|---|---|---|---|
| apc_any | 0.09% | 2.43% | 27× | 0.000012 |

### Additional Germline Features (v3)

All six germline genes are now included as model features:

| Gene | Controls | Cancer Cases | Enrichment | Pathway |
|---|---|---|---|---|
| mutyh_any | 0.31% | 0.59% | 1.9× | Base excision repair |
| smad4_any | 0.04% | 0.08% | 2× | TGF-β signaling |
| stk11_any | 0.02% | 0.04% | 2× | Peutz-Jeghers syndrome |
| bmpr1a_any | 0.02% | 0.03% | 1.5× | Juvenile polyposis |

## Methodology

1. **Data Query** — BigQuery on All of Us CDR via OMOP schema
2. **Feature Engineering** — Lab cleaning, unit standardization, categorical encoding, genomic variant annotation
3. **Temporal Leakage Audit** — Re-extracted all clinical features using a 6-month to 2-year pre-diagnosis window; removed 93–95% of post-diagnosis lab measurements
4. **SMOTE** — Applied on training set only to handle 75/25 class imbalance
5. **Model Training** — Random Forest, XGBoost, Logistic Regression
6. **Hyperparameter Tuning** — RandomizedSearchCV (20 iterations, 5-fold CV)
7. **Threshold Tuning** — Optimized for cancer recall in screening context
8. **SHAP Analysis** — Feature importance and direction of effect via TreeExplainer

## Clinical Decision Support Application

A full-stack web application where physicians can input patient data and receive real-time risk assessments.

**Live demo:**
- Frontend: [colorectal-cancer-risk-prediction.vercel.app](https://colorectal-cancer-risk-prediction.vercel.app)
- Backend API: [crc-risk-predictor-api.onrender.com](https://crc-risk-predictor-api.onrender.com)

**Features:**
- 5-tab dashboard: Risk Assessment, Model Performance, Feature Importance, Genomic Findings, Methods
- Cancer risk score (0–100%) with gauge visualization
- SHAP-based explanation of top driving factors for each individual patient
- Risk category (Low / Moderate / High) based on tuned threshold
- PDF report export
- Temporal leakage story and comparison with published benchmarks

**Tech stack:** React + Vite + Tailwind (frontend), FastAPI (backend), deployed on Vercel and Render

## Polygenic Risk Score (In Progress)

A polygenic risk score (PRS) pipeline is under development using Hail on All of Us v8 microarray data (1.7M SNPs, 447K participants). 11 out of 20 known CRC GWAS SNPs (from Huyghe et al. 2019) were matched in the array. The PRS will be integrated as an additional feature in a future model version.

## Repository Structure

```
├── notebooks/          # Jupyter notebooks for each pipeline stage
├── backend/            # FastAPI prediction server
│   ├── main.py
│   ├── predict.py
│   └── models/
│       ├── best_xgb_v3_clean.pkl   # Current model (v3, temporally clean)
│       ├── model_metadata_v3.json
│       └── best_xgb_v2_apc.pkl     # Legacy (temporal leakage, do not use)
├── frontend/           # React + Vite + Tailwind dashboard
├── results/            # SHAP plots, threshold tuning chart
├── presentation/       # Academic presentation slides
├── data/
│   └── df_checkpoint_apc.csv
├── shap_importance_v3.csv
├── feature_cols_v3.txt
└── requirements.txt
```

## Installation

```bash
git clone https://github.com/mohibul-07/colorectal-cancer-risk-prediction.git
cd colorectal-cancer-risk-prediction
pip install -r requirements.txt
```

## Citation

If you use this work, please cite:

```
Alam, M. (2026). Colorectal Cancer Risk Prediction Using Machine Learning.
Queensborough Community College, CUNY.
Advisor: Prof. Zeynep Akcay Ozkan.
```
