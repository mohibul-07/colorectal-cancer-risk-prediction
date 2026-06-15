# Colorectal Cancer Risk Prediction Using Machine Learning

![Python](https://img.shields.io/badge/Python-3.10+-blue) ![XGBoost](https://img.shields.io/badge/XGBoost-2.0-orange) ![AUC](https://img.shields.io/badge/AUC-0.8979-green) ![License: MIT](https://img.shields.io/badge/License-MIT-yellow)

A machine learning system for colorectal cancer risk prediction integrating clinical, socioeconomic, and germline genomic data from the NIH All of Us Research Program.

**Research conducted at Queensborough Community College, CUNY**
**Advisor: Professor Zeynep Akcay Ozkan**

---

## Key Results

| Model | AUC | Cancer Recall | Cancer Precision |
|---|---|---|---|
| Logistic Regression | 0.8384 | 0.74 | 0.51 |
| Random Forest | 0.8931 | 0.79 | 0.60 |
| **XGBoost v2 (tuned)** | **0.8979** | **0.86** | **0.59** |

- **Optimal threshold:** 0.24 (maximizes cancer recall for screening context)
- **Lynch syndrome enrichment:** 14× higher in cancer cases vs controls
- **APC variant enrichment:** 27× higher in cancer cases (p = 0.000012)
- **Top predictors (SHAP):** Age, ALT, Creatinine, BMI, Obesity

## Dataset

- **Source:** NIH All of Us Researcher Workbench — Controlled Tier (CDR v2024Q3R9)
- **Size:** 12,248 patients (3,062 cancer cases, 9,186 controls)
- **Design:** Case-control study
- **Features:** 31 total — demographics, lifestyle, socioeconomic, clinical labs, symptoms, genomic

> ⚠️ Raw patient data is not included in this repository in compliance with the All of Us Data User Code of Conduct.

## Genomic Feature Engineering

Queried germline whole genome sequencing data from the All of Us Controlled Tier for pathogenic and likely pathogenic variants (ClinVar) in cancer-associated genes.

### Lynch Syndrome Variants (DNA Mismatch Repair Genes)

| Gene | Controls | Cancer Cases | Enrichment |
|---|---|---|---|
| lynch_any | 0.19% | 2.68% | 14× |
| MLH1 | 0.01% | 1.01% | 100× |
| MSH6 | 0.07% | 0.72% | 10× |

### APC Variants (Tumor Suppressor)

| Gene | Controls | Cancer Cases | Enrichment | p-value |
|---|---|---|---|---|
| apc_any | 0.11% | 2.94% | 27× | 0.000012 |

### Rejected Candidates

- **MUTYH:** Only 1.9× enrichment — insufficient signal for inclusion
- **SMAD4, STK11, BMPR1A:** Too rare in the cohort to produce reliable estimates

## Methodology

1. **Data Query** — BigQuery on All of Us CDR via OMOP schema
2. **Feature Engineering** — Lab cleaning, unit standardization, categorical encoding, genomic variant annotation
3. **Leakage Prevention** — Removed polyp history (98.4% cancer rate = temporal leak), indication bias flags
4. **SMOTE** — Applied on training set only to handle 75/25 class imbalance
5. **Model Training** — Random Forest, XGBoost, Logistic Regression
6. **Hyperparameter Tuning** — RandomizedSearchCV (20 iterations, 5-fold CV)
7. **Threshold Tuning** — Optimized for cancer recall in screening context
8. **SHAP Analysis** — Feature importance and direction of effect

## Clinical Decision Support Application

A full-stack web application where physicians can input patient data and receive real-time risk assessments.

**Live demo:**
- Frontend: [colorectal-cancer-risk-prediction.vercel.app](https://colorectal-cancer-risk-prediction.vercel.app)
- Backend API: [crc-risk-predictor-api.onrender.com](https://crc-risk-predictor-api.onrender.com)

**Features:**
- Cancer risk score (0–100%)
- SHAP-based explanation of top driving factors for each individual patient
- Risk category (Low / Medium / High) based on tuned threshold
- PDF report export

**Tech stack:** React + Vite (frontend), FastAPI (backend), deployed on Vercel and Render

## Polygenic Risk Score (In Progress)

A polygenic risk score (PRS) pipeline is under development using Hail on All of Us v8 microarray data (1.7M SNPs, 447K participants). 11 out of 20 known CRC GWAS SNPs (from Huyghe et al. 2019) were matched in the array. The PRS will be integrated as an additional feature, and post-merge retraining is expected to push AUC beyond the current 0.8979.

## Repository Structure

```
├── notebooks/          # Jupyter notebooks for each pipeline stage
├── models/             # Trained model + metadata
│   ├── best_xgb_v2_apc.pkl
│   └── model_metadata.json
├── results/            # SHAP plots, threshold tuning chart
├── presentation/       # Academic presentation slides
├── app/                # Clinical decision support application
│   ├── frontend/       # React + Vite
│   └── backend/        # FastAPI
├── data/
│   └── df_checkpoint_apc.csv
├── src/                # Prediction utilities
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
