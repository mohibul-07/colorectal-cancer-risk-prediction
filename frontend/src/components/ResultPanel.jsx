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
  rectal_bleeding: "Rectal Bleeding",
  weight_loss: "Unexplained Weight Loss",
};

const riskColors = {
  LOW: { bg: "bg-green-50", border: "border-green-400", text: "text-green-700", gauge: "#10b981" },
  MODERATE: { bg: "bg-yellow-50", border: "border-yellow-400", text: "text-yellow-700", gauge: "#f59e0b" },
  HIGH: { bg: "bg-red-50", border: "border-red-400", text: "text-red-700", gauge: "#ef4444" },
};

export default function ResultPanel({ result, onReset }) {
  const { risk_score, risk_level, top_factors } = result;
  const colors = riskColors[risk_level];

  const handlePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(15, 118, 110);
    doc.text("CRC Risk Assessment Report", 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text("Generated: " + new Date().toLocaleString(), 14, 28);
    doc.setFontSize(14);
    doc.setTextColor(30);
    doc.text("Risk Score: " + risk_score + "%", 14, 42);
    doc.text("Risk Level: " + risk_level, 14, 52);
    doc.setFontSize(12);
    doc.text("Top Contributing Factors:", 14, 66);
    autoTable(doc, {
      startY: 72,
      head: [["Factor", "Direction", "Impact"]],
      body: top_factors.map(f => [
        featureLabels[f.feature] || f.feature,
        f.direction,
        Math.abs(f.impact).toFixed(4)
      ]),
      headStyles: { fillColor: [15, 118, 110] },
    });
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text("Research tool only. Not for clinical diagnosis.", 14, doc.lastAutoTable.finalY + 15);
    doc.save("crc_risk_report.pdf");
  };

  const pct = risk_score / 100;
  const r = 70, cx = 110, cy = 100;
  const x1 = cx + r * Math.cos(Math.PI);
  const y1 = cy + r * Math.sin(Math.PI);
  const x2 = cx + r * Math.cos(Math.PI + pct * Math.PI);
  const y2 = cy + r * Math.sin(Math.PI + pct * Math.PI);
  const largeArc = pct > 0.5 ? 1 : 0;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Risk Assessment Result</h2>
          <p className="text-slate-500 text-sm mt-1">Based on XGBoost model trained on NIH All of Us data</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handlePDF}
            className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
            Export PDF
          </button>
          <button onClick={onReset}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
            New Patient
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`${colors.bg} border-2 ${colors.border} rounded-xl p-6 flex flex-col items-center`}>
          <h3 className="text-sm font-bold text-slate-600 mb-4">RISK SCORE</h3>
          <svg width="220" height="120" viewBox="0 0 220 120">
            <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`}
              fill="none" stroke="#e2e8f0" strokeWidth="14" strokeLinecap="round" />
            <path d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`}
              fill="none" stroke={colors.gauge} strokeWidth="14" strokeLinecap="round" />
            <text x={cx} y={cy-8} textAnchor="middle" fontSize="28" fontWeight="bold" fill={colors.gauge}>{risk_score}%</text>
            <text x={cx} y={cy+10} textAnchor="middle" fontSize="13" fill="#64748b">Risk Score</text>
            <text x={cx-r-4} y={cy+18} textAnchor="middle" fontSize="10" fill="#94a3b8">0%</text>
            <text x={cx+r+4} y={cy+18} textAnchor="middle" fontSize="10" fill="#94a3b8">100%</text>
          </svg>
          <div className={`mt-2 px-6 py-2 rounded-full ${colors.bg} border ${colors.border}`}>
            <span className={`text-lg font-bold ${colors.text}`}>{risk_level} RISK</span>
          </div>
          <p className={`mt-4 text-sm ${colors.text} text-center max-w-xs`}>
            {risk_level === "LOW" && "Patient is below screening threshold. Routine monitoring recommended."}
            {risk_level === "MODERATE" && "Patient is above threshold. Consider colonoscopy referral."}
            {risk_level === "HIGH" && "High risk. Urgent colonoscopy referral and genetic counseling recommended."}
          </p>
        </div>

        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-600 mb-4">TOP CONTRIBUTING FACTORS</h3>
          <div className="space-y-3">
            {top_factors.map((f, i) => {
              const isRisk = f.direction === "increases risk";
              const maxImpact = Math.abs(top_factors[0].impact);
              const width = `${(Math.abs(f.impact) / maxImpact) * 100}%`;
              return (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-700">{featureLabels[f.feature] || f.feature}</span>
                    <span className={isRisk ? "text-red-500" : "text-green-500"}>
                      {isRisk ? "↑ Increases risk" : "↓ Decreases risk"}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className={`h-2 rounded-full ${isRisk ? "bg-red-400" : "bg-green-400"}`} style={{ width }} />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-slate-400 mt-4">SHAP values — showing which factors most influenced this prediction.</p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
        ⚠️ This tool is for research purposes only and should not be used as a substitute for professional medical advice.
      </div>
    </div>
  );
}