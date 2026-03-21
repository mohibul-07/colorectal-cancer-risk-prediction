# Colorectal Cancer Risk Prediction Using Machine Learning

[![Python](https://img.shields.io/badge/Python-3.10-blue)](https://python.org)
[![XGBoost](https://img.shields.io/badge/XGBoost-2.0.3-green)](https://xgboost.readthedocs.io)
[![AUC](https://img.shields.io/badge/AUC-0.8948-teal)](/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A machine learning system for colorectal cancer risk prediction integrating clinical, socioeconomic, and germline genomic data from the NIH All of Us Research Program.

**Research conducted at Queensborough Community College, CUNY**  
**Advisor: Professor Zeynep Akcay Ozkan**

---

## Key Results

| Model | AUC | Cancer Recall | Cancer Precision |
|-------|-----|---------------|-----------------|
| Logistic Regression | 0.8384 | 0.74 | 0.51 |
| Random Forest | 0.8931 | 0.79 | 0.60 |
| **XGBoost (tuned)** | **0.8948** | **0.86** | **0.59** |

- **Optimal threshold:** 0.24 (maximizes cancer recall for screening context)
- **Lynch syndrome enrichment:** 14× higher in cancer cases vs controls
- **Top predictors (SHAP):** Age, ALT, Creatinine, BMI, Obesity

---

## Dataset

- **Source:** NIH All of Us Researcher Workbench — Controlled Tier (CDR v2024Q3R9)
- **Size:** 12,248 patients (3,062 cancer cases, 9,186 controls)
- **Design:** Case-control study
- **Features:** 30 total — demographics, lifestyle, socioeconomic, clinical labs, symptoms, genomic

> ⚠️ Raw patient data is not included in this repository in compliance with the All of Us Data User Code of Conduct.

---

## Genomic Feature Engineering

Queried germline whole genome sequencing data from the All of Us Controlled Tier for Lynch syndrome variants in DNA mismatch repair genes:

| Gene | Controls | Cancer Cases | Enrichment |
|------|----------|--------------|------------|
| lynch_any | 0.19% | 2.68% | **14×** |
| MLH1 | 0.01% | 1.01% | 100× |
| MSH6 | 0.07% | 0.72% | 10× |

Only **pathogenic** and **likely pathogenic** variants (ClinVar) were included to avoid capturing benign common SNPs.

---

## Methodology

1. **Data Query** — BigQuery on All of Us CDR via OMOP schema
2. **Feature Engineering** — Lab cleaning, unit standardization, categorical encoding
3. **Leakage Prevention** — Removed polyp history (98.4% cancer rate = temporal leak), indication bias flags
4. **SMOTE** — Applied on training set only to handle 75/25 class imbalance
5. **Model Training** — Random Forest, XGBoost, Logistic Regression
6. **Hyperparameter Tuning** — RandomizedSearchCV (20 iterations, 5-fold CV)
7. **Threshold Tuning** — Optimized for cancer recall in screening context
8. **SHAP Analysis** — Feature importance and direction of effect

---

## Repository Structure
```
├── notebooks/          # Jupyter notebooks for each pipeline stage
├── models/             # Trained model + metadata
│   ├── best_xgb_model.pkl
│   └── model_metadata.json
├── results/            # SHAP plots, threshold tuning chart
├── presentation/       # Academic presentation slides
├── src/                # Prediction utilities (coming soon)
└── requirements.txt
```

---

## Installation
```bash
git clone https://github.com/mohibul-07/colorectal-cancer-risk-prediction.git
cd colorectal-cancer-risk-prediction
pip install -r requirements.txt
```

---

## Clinical Application (In Development)

A web-based clinical decision support tool is currently being developed where physicians can input patient data and receive:
- A cancer risk score (0–100%)
- SHAP-based explanation of the top driving factors
- Risk category (Low / Medium / High) based on tuned threshold

---

## Citation

If you use this work, please cite:
```
alam, M. (2026). Colorectal Cancer Risk Prediction Using Machine Learning.
Queensborough Community College, CUNY.
Advisor: Prof. Zeynep Akcay Ozkan.
```

---

## License

MIT License — see [LICENSE](LICENSE) for details.
