import { useState } from "react";
import PatientForm from "./components/PatientForm";
import ResultPanel from "./components/ResultPanel";

export default function App() {
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
    } catch (err) {
      setError("Could not connect to the prediction server. Make sure the backend is running.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 tracking-tight">CRC Risk Predictor</h1>
              <p className="text-xs text-gray-500">Colorectal Cancer Risk Assessment</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">XGBoost v2</span>
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">AUC 0.8979</span>
          </div>
        </div>
      </header>

      {/* ── Subheader ── */}
      <div className="bg-indigo-600">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <p className="text-indigo-100 text-xs">
            Trained on NIH All of Us Research Program data · 12,248 patients · 31 features
          </p>
          <div className="hidden sm:flex items-center gap-3 text-xs text-indigo-200">
            <span>Lynch</span>
            <span className="w-1 h-1 rounded-full bg-indigo-300" />
            <span>APC</span>
            <span className="w-1 h-1 rounded-full bg-indigo-300" />
            <span>SHAP</span>
          </div>
        </div>
      </div>

      {/* ── Main ── */}
      <main className="max-w-5xl mx-auto w-full px-6 py-8 flex-1">
        {!result ? (
          <PatientForm onSubmit={handleSubmit} loading={loading} error={error} />
        ) : (
          <ResultPanel result={result} onReset={() => { setResult(null); setError(null); }} />
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-400">
            Research tool only — not for clinical diagnosis
          </p>
          <p className="text-xs text-gray-400">
            Queensborough Community College, CUNY · Prof. Zeynep Akcay Ozkan
          </p>
        </div>
      </footer>
    </div>
  );
}
