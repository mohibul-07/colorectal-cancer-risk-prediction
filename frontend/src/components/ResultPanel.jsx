import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const featureLabels = {
  age: "Age", alt: "ALT (Liver Enzyme)", creatinine: "Creatinine",
  bmi: "BMI", obese: "Obesity", platelet_count: "Platelet Count",
  abdominal_pain: "Abdominal Pain", wbc: "White Blood Cell Count",
  race: "Race", ast: "AST (Liver Enzyme)", bowel_changes: "Bowel Changes",
  hypertension: "Hypertension", gender: "Gender",
  family_history_crc: "Family History of CRC",
  lynch_any: "Lynch Syndrome Variant",
  apc_any: "APC Variant",
  rectal_bleeding: "Rectal Bleeding",
  weight_loss: "Unexplained Weight Loss",
  high_creatinine: "High Creatinine",
  high_platelets: "High Platelets",
  low_platelets: "Low Platelets",
};

const riskConfig = {
  LOW: {
    bg: "bg-emerald-50", border: "border-emerald-300", text: "text-emerald-700",
    gauge: "#10b981", badgeBg: "bg-emerald-100",
    message: "Patient is below screening threshold. Routine monitoring recommended.",
  },
  MODERATE: {
    bg: "bg-amber-50", border: "border-amber-300", text: "text-amber-700",
    gauge: "#f59e0b", badgeBg: "bg-amber-100",
    message: "Patient is above threshold. Consider colonoscopy referral.",
  },
  HIGH: {
    bg: "bg-red-50", border: "border-red-300", text: "text-red-700",
    gauge: "#ef4444", badgeBg: "bg-red-100",
    message: "High risk detected. Urgent colonoscopy referral and genetic counseling recommended.",
  },
};

export default function ResultPanel({ result, onReset }) {
  const { risk_score, risk_level, top_factors } = result;
  const c = riskConfig[risk_level];

  const handlePDF = () => {
    const doc = new jsPDF();

    // Header bar
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, 210, 28, "F");
    doc.setFontSize(16);
    doc.setTextColor(255);
    doc.text("CRC Risk Assessment Report", 14, 18);

    // Meta
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text("Generated: " + new Date().toLocaleString(), 14, 38);
    doc.text("Model: XGBoost v2 · AUC 0.8979 · 31 features", 14, 44);

    // Score
    doc.setFontSize(24);
    doc.setTextColor(30);
    doc.text(risk_score + "%", 14, 62);
    doc.setFontSize(12);
    doc.text(risk_level + " RISK", 50, 62);

    // Recommendation
    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text(c.message, 14, 72);

    // Factors table
    doc.setFontSize(12);
    doc.setTextColor(30);
    doc.text("Top Contributing Factors", 14, 86);
    autoTable(doc, {
      startY: 90,
      head: [["Factor", "Direction", "SHAP Impact"]],
      body: top_factors.map(f => [
        featureLabels[f.feature] || f.feature,
        f.direction,
        Math.abs(f.impact).toFixed(4),
      ]),
      headStyles: { fillColor: [79, 70, 229] },
      styles: { fontSize: 9 },
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(160);
    doc.text("Research tool only — not for clinical diagnosis.", 14, doc.lastAutoTable.finalY + 12);
    doc.text("Queensborough Community College, CUNY · Prof. Zeynep Akcay Ozkan", 14, doc.lastAutoTable.finalY + 17);

    doc.save("crc_risk_report.pdf");
  };

  // Gauge geometry
  const pct = risk_score / 100;
  const r = 70, cx = 110, cy = 100;
  const startAngle = Math.PI;
  const endAngle = Math.PI + pct * Math.PI;
  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy + r * Math.sin(endAngle);
  const largeArc = pct > 0.5 ? 1 : 0;

  return (
    <div>
      {/* ── Header ── */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Risk Assessment Result</h2>
          <p className="text-gray-500 text-sm mt-1">XGBoost v2 model · 31 features · NIH All of Us data</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handlePDF}
            className="flex items-center gap-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export PDF
          </button>
          <button onClick={onReset}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
            New Patient
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* ── Score Card ── */}
        <div className={`${c.bg} border ${c.border} rounded-xl p-6 flex flex-col items-center`}>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${c.badgeBg} ${c.text} mb-4`}>
            RISK SCORE
          </span>

          <svg width="220" height="120" viewBox="0 0 220 120">
            <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`}
              fill="none" stroke="#e2e8f0" strokeWidth="12" strokeLinecap="round" />
            <path d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`}
              fill="none" stroke={c.gauge} strokeWidth="12" strokeLinecap="round" />
            <text x={cx} y={cy-10} textAnchor="middle" fontSize="32" fontWeight="700" fill={c.gauge}>
              {risk_score}%
            </text>
            <text x={cx} y={cy+10} textAnchor="middle" fontSize="11" fill="#94a3b8">Cancer Risk</text>
            <text x={cx-r-2} y={cy+18} textAnchor="middle" fontSize="9" fill="#cbd5e1">0%</text>
            <text x={cx+r+2} y={cy+18} textAnchor="middle" fontSize="9" fill="#cbd5e1">100%</text>
          </svg>

          <span className={`mt-3 text-lg font-bold ${c.text}`}>{risk_level} RISK</span>
          <p className={`mt-2 text-sm ${c.text} text-center max-w-xs leading-relaxed opacity-80`}>
            {c.message}
          </p>
        </div>

        {/* ── Top Factors ── */}
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-600 mb-4 inline-block">
            TOP CONTRIBUTING FACTORS
          </span>

          <div className="space-y-3 mt-4">
            {top_factors.map((f, i) => {
              const isRisk = f.direction === "increases risk";
              const maxImpact = Math.abs(top_factors[0].impact);
              const width = `${Math.max((Math.abs(f.impact) / maxImpact) * 100, 4)}%`;
              return (
                <div key={i}>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-medium text-gray-700">
                      {featureLabels[f.feature] || f.feature}
                    </span>
                    <span className={`font-medium ${isRisk ? "text-red-500" : "text-emerald-500"}`}>
                      {isRisk ? "↑ Risk" : "↓ Protective"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${isRisk ? "bg-red-400" : "bg-emerald-400"}`}
                      style={{ width }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-gray-400 mt-5 leading-relaxed">
            SHAP values show each factor's contribution to this individual prediction.
            Positive values increase predicted risk; negative values are protective.
          </p>
        </div>
      </div>

      {/* ── Disclaimer ── */}
      <div className="mt-5 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700 flex items-start gap-2">
        <span className="mt-0.5 flex-shrink-0">⚠️</span>
        <span>This tool is for research purposes only and should not be used as a substitute for professional medical advice, diagnosis, or treatment.</span>
      </div>
    </div>
  );
}
