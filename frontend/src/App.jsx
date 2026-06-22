import { useState } from "react";
import PatientForm from "./components/PatientForm";
import ResultPanel from "./components/ResultPanel";

const TABS = ["Risk Assessment", "Model Performance", "Feature Importance", "Genomic Findings", "Methods"];

const SHAP_DATA = [
  { feature: "Age", value: 1.4465 },
  { feature: "Smoking (100+ Cigs)", value: 0.3231 },
  { feature: "WBC Count", value: 0.2910 },
  { feature: "Alcohol Use", value: 0.2798 },
  { feature: "Annual Income", value: 0.2679 },
  { feature: "Drink Frequency", value: 0.2622 },
  { feature: "Creatinine", value: 0.2447 },
  { feature: "ALT (Liver Enzyme)", value: 0.1846 },
  { feature: "Education Level", value: 0.1552 },
  { feature: "Employment Status", value: 0.1288 },
  { feature: "Race", value: 0.1284 },
  { feature: "Marital Status", value: 0.1107 },
  { feature: "Hypertension", value: 0.1011 },
  { feature: "Gender", value: 0.1004 },
  { feature: "BMI", value: 0.0955 },
];

const GENOMIC_GENES = [
  { gene: "Lynch syndrome (MLH1/MSH2/MSH6/PMS2)", controls: "0.42%", cases: "5.88%", enrichment: "14×", note: "Mismatch repair deficiency" },
  { gene: "APC", controls: "0.09%", cases: "2.43%", enrichment: "27×", note: "Familial adenomatous polyposis" },
  { gene: "MUTYH", controls: "0.31%", cases: "0.59%", enrichment: "1.9×", note: "Base excision repair" },
  { gene: "SMAD4", controls: "0.04%", cases: "0.08%", enrichment: "2×", note: "TGF-β signaling" },
  { gene: "STK11", controls: "0.02%", cases: "0.04%", enrichment: "2×", note: "Peutz-Jeghers syndrome" },
  { gene: "BMPR1A", controls: "0.02%", cases: "0.03%", enrichment: "1.5×", note: "Juvenile polyposis" },
];

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-5 text-center border border-white/20">
      <div className="text-4xl font-bold text-white">{value}</div>
      <div className="text-sm font-semibold text-indigo-200 mt-1">{label}</div>
      {sub && <div className="text-xs text-indigo-300 mt-0.5">{sub}</div>}
    </div>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({ children }) {
  return <h3 className="text-lg font-bold text-gray-900 mb-4">{children}</h3>;
}

function TabRiskAssessment({ onSubmit, loading, error, result, onReset }) {
  return result ? (
    <ResultPanel result={result} onReset={onReset} />
  ) : (
    <PatientForm onSubmit={onSubmit} loading={loading} error={error} />
  );
}

function TabModelPerformance() {
  const benchmarks = [
    { model: "XGBoost v3 (this work, clean)", auc: "0.8003", note: "6mo–2yr pre-diagnosis window" },
    { model: "XGBoost v2 (temporal leakage)", auc: "0.8979", note: "Post-diagnosis lab values" },
    { model: "Yuan et al. 2020 (logistic)", auc: "0.73", note: "Published benchmark" },
    { model: "Boursi et al. 2016", auc: "0.70", note: "Published benchmark" },
    { model: "Freedman et al. 2009", auc: "0.65", note: "Published benchmark" },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6">
        <Card>
          <SectionTitle>Model AUC</SectionTitle>
          <div className="flex items-end gap-3 mb-2">
            <span className="text-5xl font-bold text-indigo-600">0.8003</span>
            <span className="text-gray-400 text-sm mb-2">ROC-AUC</span>
          </div>
          <p className="text-sm text-gray-500">Trained on NIH All of Us · 12,248 participants · 34 features · XGBoost v3</p>
          <div className="mt-4 flex gap-3">
            <div className="flex-1 bg-indigo-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-indigo-600">34</div>
              <div className="text-xs text-indigo-500 mt-0.5">Features</div>
            </div>
            <div className="flex-1 bg-emerald-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-emerald-600">0.24</div>
              <div className="text-xs text-emerald-500 mt-0.5">Threshold</div>
            </div>
            <div className="flex-1 bg-amber-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-amber-600">12,248</div>
              <div className="text-xs text-amber-500 mt-0.5">Patients</div>
            </div>
          </div>
        </Card>

        <Card>
          <SectionTitle>Temporal Leakage Correction</SectionTitle>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>v2 (leakage)</span><span className="font-semibold text-red-500">0.8979</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div className="bg-red-400 h-3 rounded-full" style={{ width: "89.79%" }} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>v3 (clean)</span><span className="font-semibold text-indigo-600">0.8003</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div className="bg-indigo-500 h-3 rounded-full" style={{ width: "80.03%" }} />
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4 leading-relaxed">
            93–95% of lab values in the original model were measured <em>after</em> CRC diagnosis. After restricting to a 6-month to 2-year pre-diagnosis window, the AUC dropped from 0.8979 to 0.8003 — still well above published benchmarks.
          </p>
        </Card>
      </div>

      <Card>
        <SectionTitle>Comparison with Published Models</SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 pb-3 pr-4">Model</th>
                <th className="text-right text-xs font-semibold text-gray-500 pb-3">AUC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {benchmarks.map((b, i) => (
                <tr key={i} className={i === 0 ? "bg-indigo-50/60" : ""}>
                  <td className="py-3 pr-4">
                    <div className={`font-medium ${i === 0 ? "text-indigo-700" : "text-gray-700"}`}>{b.model}</div>
                    <div className="text-xs text-gray-400">{b.note}</div>
                  </td>
                  <td className="py-3 text-right">
                    <span className={`text-base font-bold ${i === 0 ? "text-indigo-600" : i === 1 ? "text-red-400" : "text-gray-500"}`}>
                      {b.auc}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-4">Published benchmarks range 0.65–0.73. Our clean model at 0.8003 represents a meaningful improvement while maintaining temporal integrity.</p>
      </Card>
    </div>
  );
}

function TabFeatureImportance() {
  const max = SHAP_DATA[0].value;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="md:col-span-2">
        <SectionTitle>SHAP Feature Importance — Top 15 Features</SectionTitle>
        <p className="text-sm text-gray-500 mb-6">Mean absolute SHAP value across the test set. Higher values indicate greater influence on model predictions.</p>
        <div className="space-y-3">
          {SHAP_DATA.map((d, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-44 text-sm text-gray-700 font-medium text-right flex-shrink-0">{d.feature}</div>
              <div className="flex-1 bg-gray-100 rounded-full h-5 relative">
                <div
                  className="h-5 rounded-full bg-indigo-500 flex items-center justify-end pr-2 transition-all"
                  style={{ width: `${Math.max((d.value / max) * 100, 3)}%` }}
                >
                  <span className="text-white text-xs font-semibold">{d.value.toFixed(3)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-6">
          Source: <code className="bg-gray-100 px-1 rounded">shap_importance_v3.csv</code> · TreeExplainer on XGBoost v3 · 6mo–2yr pre-diagnosis temporal window
        </p>
      </Card>

      <Card>
        <SectionTitle>Old vs New Top Features</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-2">v2 (leakage)</div>
            <ul className="space-y-1 text-sm text-gray-600">
              {[["Age","1.54"],["ALT","0.80"],["Creatinine","0.76"],["BMI","0.56"],["Abdominal Pain","0.36"],["Lynch","0.12"]].map(([f,v])=>(
                <li key={f} className="flex justify-between"><span>{f}</span><span className="text-gray-400 font-mono">{v}</span></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-2">v3 (clean)</div>
            <ul className="space-y-1 text-sm text-gray-600">
              {[["Age","1.45"],["Smoking","0.32"],["WBC","0.29"],["Alcohol","0.28"],["Income","0.27"],["Creatinine","0.24"]].map(([f,v])=>(
                <li key={f} className="flex justify-between"><span>{f}</span><span className="text-indigo-500 font-mono">{v}</span></li>
              ))}
            </ul>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-4">Lab-based features (ALT, creatinine) dropped in importance after removing post-diagnosis leakage. Lifestyle factors (smoking, alcohol, income) now rank higher — more clinically meaningful for pre-diagnosis risk.</p>
      </Card>

      <Card>
        <SectionTitle>Interpretation Notes</SectionTitle>
        <ul className="space-y-3 text-sm text-gray-600">
          <li className="flex gap-2"><span className="text-indigo-500 font-bold mt-0.5">→</span><span><strong>Age</strong> dominates both models — expected for a cancer risk model.</span></li>
          <li className="flex gap-2"><span className="text-indigo-500 font-bold mt-0.5">→</span><span><strong>Smoking</strong> now ranks #2, reflecting a well-established CRC risk factor.</span></li>
          <li className="flex gap-2"><span className="text-indigo-500 font-bold mt-0.5">→</span><span><strong>WBC</strong> elevation pre-diagnosis may reflect subclinical inflammation.</span></li>
          <li className="flex gap-2"><span className="text-indigo-500 font-bold mt-0.5">→</span><span><strong>Income & alcohol</strong> capturing socioeconomic and behavioral risk dimensions.</span></li>
          <li className="flex gap-2"><span className="text-indigo-500 font-bold mt-0.5">→</span><span>Genomic features (Lynch, APC) have lower mean SHAP but extreme impact for variant carriers.</span></li>
        </ul>
      </Card>
    </div>
  );
}

function TabGenomicFindings() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-l-4 border-l-emerald-500">
          <div className="flex items-start gap-4">
            <div className="bg-emerald-100 rounded-xl p-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/><path d="M12 8v4l3 3"/>
              </svg>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-600">14×</div>
              <div className="text-sm font-semibold text-gray-700 mt-1">Lynch Syndrome Enrichment</div>
              <p className="text-xs text-gray-500 mt-1">0.42% controls vs 5.88% CRC cases (MLH1, MSH2, MSH6, PMS2 pathogenic variants)</p>
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-indigo-500">
          <div className="flex items-start gap-4">
            <div className="bg-indigo-100 rounded-xl p-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/><path d="M12 8v4l3 3"/>
              </svg>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600">27×</div>
              <div className="text-sm font-semibold text-gray-700 mt-1">APC Variant Enrichment</div>
              <p className="text-xs text-gray-500 mt-1">0.09% controls vs 2.43% CRC cases (familial adenomatous polyposis)</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <SectionTitle>Germline Variant Enrichment Table</SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 pb-3 pr-4">Gene / Syndrome</th>
                <th className="text-right text-xs font-semibold text-gray-500 pb-3 pr-4">Controls</th>
                <th className="text-right text-xs font-semibold text-gray-500 pb-3 pr-4">CRC Cases</th>
                <th className="text-right text-xs font-semibold text-gray-500 pb-3 pr-4">Enrichment</th>
                <th className="text-left text-xs font-semibold text-gray-500 pb-3">Pathway</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {GENOMIC_GENES.map((g, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 pr-4 font-medium text-gray-800">{g.gene}</td>
                  <td className="py-3 pr-4 text-right text-gray-500 font-mono">{g.controls}</td>
                  <td className="py-3 pr-4 text-right text-gray-700 font-mono font-semibold">{g.cases}</td>
                  <td className="py-3 pr-4 text-right">
                    <span className="bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded text-xs">{g.enrichment}</span>
                  </td>
                  <td className="py-3 text-xs text-gray-400">{g.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-4">Pathogenic/likely pathogenic variants only (ClinVar). Derived from NIH All of Us whole genome sequencing data.</p>
      </Card>

      <Card>
        <SectionTitle>Clinical Significance</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="font-semibold text-gray-800 mb-1">Lynch Syndrome</div>
            <p className="text-xs">Mismatch repair deficiency leads to microsatellite instability. Carriers have 40–80% lifetime CRC risk. Annual colonoscopy recommended from age 20–25.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="font-semibold text-gray-800 mb-1">APC (FAP)</div>
            <p className="text-xs">Familial adenomatous polyposis causes hundreds to thousands of colonic polyps. Near 100% CRC penetrance by age 40 if untreated. Prophylactic colectomy recommended.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="font-semibold text-gray-800 mb-1">Other Genes</div>
            <p className="text-xs">MUTYH (base excision repair), SMAD4 (juvenile polyposis), STK11 (Peutz-Jeghers), BMPR1A (juvenile polyposis) — lower prevalence but clinically actionable.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function TabMethods() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <SectionTitle>Dataset</SectionTitle>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex gap-2"><span className="text-indigo-500 font-bold">·</span><span><strong>Source:</strong> NIH All of Us Research Program</span></li>
          <li className="flex gap-2"><span className="text-indigo-500 font-bold">·</span><span><strong>Participants:</strong> 12,248 total (cases + controls)</span></li>
          <li className="flex gap-2"><span className="text-indigo-500 font-bold">·</span><span><strong>CRC Cases:</strong> Identified via ICD-10 codes (C18–C20)</span></li>
          <li className="flex gap-2"><span className="text-indigo-500 font-bold">·</span><span><strong>Genomics:</strong> Whole genome sequencing with ClinVar pathogenicity annotations</span></li>
          <li className="flex gap-2"><span className="text-indigo-500 font-bold">·</span><span><strong>Socioeconomic:</strong> Survey data (SDOH, lifestyle, insurance)</span></li>
          <li className="flex gap-2"><span className="text-indigo-500 font-bold">·</span><span><strong>Lab values:</strong> EHR-linked measurements from OMOP CDM</span></li>
        </ul>
      </Card>

      <Card>
        <SectionTitle>Temporal Leakage Audit</SectionTitle>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex gap-2"><span className="text-red-400 font-bold">·</span><span><strong>Problem:</strong> 93–95% of lab values in v2 were measured <em>after</em> CRC diagnosis — information unavailable at time of screening.</span></li>
          <li className="flex gap-2"><span className="text-indigo-500 font-bold">·</span><span><strong>Fix:</strong> Re-extracted all clinical features using measurements taken 6 months to 2 years before diagnosis date.</span></li>
          <li className="flex gap-2"><span className="text-indigo-500 font-bold">·</span><span><strong>Window:</strong> [diagnosis_date − 2yr, diagnosis_date − 6mo]</span></li>
          <li className="flex gap-2"><span className="text-indigo-500 font-bold">·</span><span><strong>Result:</strong> AUC dropped from 0.8979 → 0.8003, still above all published benchmarks (0.65–0.73).</span></li>
        </ul>
      </Card>

      <Card>
        <SectionTitle>XGBoost Hyperparameters</SectionTitle>
        <div className="font-mono text-xs bg-gray-50 rounded-lg p-4 space-y-1 text-gray-700">
          <div><span className="text-indigo-500">n_estimators</span>: 300</div>
          <div><span className="text-indigo-500">max_depth</span>: 4</div>
          <div><span className="text-indigo-500">learning_rate</span>: 0.05</div>
          <div><span className="text-indigo-500">subsample</span>: 0.8</div>
          <div><span className="text-indigo-500">colsample_bytree</span>: 0.8</div>
          <div><span className="text-indigo-500">scale_pos_weight</span>: balanced</div>
          <div><span className="text-indigo-500">eval_metric</span>: auc</div>
          <div><span className="text-indigo-500">early_stopping_rounds</span>: 20</div>
        </div>
      </Card>

      <Card>
        <SectionTitle>SHAP Explainability</SectionTitle>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex gap-2"><span className="text-indigo-500 font-bold">·</span><span><strong>Library:</strong> SHAP TreeExplainer (exact, not sampling)</span></li>
          <li className="flex gap-2"><span className="text-indigo-500 font-bold">·</span><span><strong>Global importance:</strong> Mean |SHAP| across test set</span></li>
          <li className="flex gap-2"><span className="text-indigo-500 font-bold">·</span><span><strong>Local explanation:</strong> Per-patient SHAP values returned with each prediction</span></li>
          <li className="flex gap-2"><span className="text-indigo-500 font-bold">·</span><span><strong>Threshold:</strong> 0.24 (chosen to balance sensitivity / specificity on validation set)</span></li>
        </ul>
        <div className="mt-4 text-xs text-gray-400">
          Institution: Queensborough Community College, CUNY · Supervisor: Prof. Zeynep Akcay Ozkan
        </div>
      </Card>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setError("Could not connect to the prediction server. Make sure the backend is running.");
    }
    setLoading(false);
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ── Hero ── */}
      <div className="bg-slate-900">
        <div className="max-w-[1400px] mx-auto px-6 py-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">CRC Risk Predictor</h1>
              <p className="text-sm text-slate-400">Colorectal Cancer Risk Assessment · NIH All of Us · XGBoost v3</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Model AUC" value="0.8003" sub="Above published benchmarks" />
            <StatCard label="Patients" value="12,248" sub="NIH All of Us" />
            <StatCard label="Features" value="34" sub="After leakage correction" />
            <StatCard label="Benchmarks" value="0.65–0.73" sub="Published range" />
          </div>
        </div>

        {/* ── Tab Bar ── */}
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex gap-0 border-b border-white/10 overflow-x-auto">
            {TABS.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className={`px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === i
                    ? "border-indigo-400 text-indigo-300"
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab Content ── */}
      <main className="max-w-[1400px] mx-auto w-full px-6 py-8 flex-1">
        {activeTab === 0 && (
          <TabRiskAssessment
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            result={result}
            onReset={handleReset}
          />
        )}
        {activeTab === 1 && <TabModelPerformance />}
        {activeTab === 2 && <TabFeatureImportance />}
        {activeTab === 3 && <TabGenomicFindings />}
        {activeTab === 4 && <TabMethods />}
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-400">Research tool only — not for clinical diagnosis</p>
          <p className="text-xs text-gray-400">Queensborough Community College, CUNY · Prof. Zeynep Akcay Ozkan</p>
        </div>
      </footer>
    </div>
  );
}
