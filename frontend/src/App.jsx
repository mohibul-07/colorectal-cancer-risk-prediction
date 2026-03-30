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
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white py-4 px-6 shadow-lg">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-teal-400">CRC Risk Predictor</h1>
            <p className="text-xs text-slate-400">Colorectal Cancer Risk Assessment Tool</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Powered by XGBoost · AUC 0.8948</p>
            <p className="text-xs text-slate-500">NIH All of Us Research Program</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {!result ? (
          <PatientForm onSubmit={handleSubmit} loading={loading} error={error} />
        ) : (
          <ResultPanel result={result} onReset={() => { setResult(null); setError(null); }} />
        )}
      </main>

      <footer className="text-center py-4 text-xs text-slate-400">
        Research tool only — not for clinical diagnosis · Queensborough Community College, CUNY
      </footer>
    </div>
  );
}