import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { motion } from "framer-motion";
import useCountUp from "../hooks/useCountUp";

const featureLabels = {
  age: "Age", alt: "ALT (Liver Enzyme)", creatinine: "Creatinine",
  bmi: "BMI", obese: "Obesity", platelet_count: "Platelet Count",
  abdominal_pain: "Abdominal Pain", wbc: "White Blood Cell Count",
  race: "Race", ast: "AST (Liver Enzyme)", bowel_changes: "Bowel Changes",
  hypertension: "Hypertension", gender: "Gender",
  family_history_crc: "Family History of CRC",
  lynch_any: "Lynch Syndrome Variant",
  apc_any: "APC Variant",
  mutyh_any: "MUTYH Variant",
  smad4_any: "SMAD4 Variant",
  stk11_any: "STK11 Variant",
  bmpr1a_any: "BMPR1A Variant",
  rectal_bleeding: "Rectal Bleeding",
  high_creatinine: "High Creatinine",
  high_platelets: "High Platelets",
  low_platelets: "Low Platelets",
  "Smoking: 100 Cigs Lifetime": "Smoking (100+ Cigarettes)",
  "Alcohol: Alcohol Participant": "Alcohol Use",
  "Alcohol: Drink Frequency Past Year": "Drink Frequency",
  "Income: Annual Income": "Annual Income",
  "Education Level: Highest Grade": "Education Level",
  "Employment: Employment Status": "Employment Status",
  "Insurance: Health Insurance": "Health Insurance",
  "Marital Status: Current Marital Status": "Marital Status",
  "The Basics: Sexual Orientation": "Sexual Orientation",
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
  const counted = useCountUp(risk_score, { duration: 1.5, decimals: 1, start: true });

  const handlePDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, 210, 28, "F");
    doc.setFontSize(16);
    doc.setTextColor(255);
    doc.text("CRC Risk Assessment Report", 14, 18);

    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text("Generated: " + new Date().toLocaleString(), 14, 38);
    doc.text("Model: XGBoost v3 · AUC 0.8003 · 34 features", 14, 44);

    doc.setFontSize(24);
    doc.setTextColor(30);
    doc.text(risk_score + "%", 14, 62);
    doc.setFontSize(12);
    doc.text(risk_level + " RISK", 50, 62);

    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text(c.message, 14, 72);

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

    doc.setFontSize(8);
    doc.setTextColor(160);
    doc.text("Research tool only — not for clinical diagnosis.", 14, doc.lastAutoTable.finalY + 12);
    doc.text("Queensborough Community College, CUNY · Prof. Zeynep Akcay Ozkan", 14, doc.lastAutoTable.finalY + 17);

    doc.save("crc_risk_report.pdf");
  };

  // Circular progress ring geometry (PDF spec: r=54, viewBox 120×120)
  const R = 54;
  const C = 2 * Math.PI * R; // ≈ 339.292
  const fraction = risk_score / 100;

  return (
    <div>
      {/* ── Header — buttons fade in last ── */}
      <div className="mb-6 flex items-start justify-between">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Risk Assessment Result</h2>
          <p className="text-gray-500 text-sm mt-1">XGBoost v3 model · 34 features · NIH All of Us data</p>
        </motion.div>
        <motion.div
          className="flex gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.5 }}
        >
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
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* ── Score Card — circular ring draws in ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className={`${c.bg} border ${c.border} rounded-xl p-6 flex flex-col items-center`}
        >
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${c.badgeBg} ${c.text} mb-4`}>
            RISK SCORE
          </span>

          <svg width="200" height="200" viewBox="0 0 120 120">
            {/* track */}
            <circle cx="60" cy="60" r={R} fill="none" stroke="#e5e7eb" strokeWidth="8" />
            {/* animated progress */}
            <motion.circle
              cx="60" cy="60" r={R} fill="none" stroke={c.gauge} strokeWidth="8"
              strokeDasharray={C}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
              initial={{ strokeDashoffset: C }}
              animate={{ strokeDashoffset: C * (1 - fraction) }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
              style={{ willChange: "stroke-dashoffset" }}
            />
            <text x="60" y="58" textAnchor="middle" fontSize="22" fontWeight="700" fill={c.gauge}>
              {counted}%
            </text>
            <text x="60" y="74" textAnchor="middle" fontSize="8" fill="#94a3b8">Cancer Risk</text>
          </svg>

          <motion.span
            className={`mt-3 text-lg font-bold ${c.text}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            {risk_level} RISK
          </motion.span>
          <motion.p
            className={`mt-2 text-sm ${c.text} text-center max-w-xs leading-relaxed opacity-80`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 1.4, duration: 0.5 }}
          >
            {c.message}
          </motion.p>
        </motion.div>

        {/* ── Top Factors — staggered waterfall bars ── */}
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
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.5 + i * 0.1, duration: 0.4 }}
                >
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-medium text-gray-700">
                      {featureLabels[f.feature] || f.feature}
                    </span>
                    <span className={`font-medium ${isRisk ? "text-red-500" : "text-emerald-500"}`}>
                      {isRisk ? "↑ Risk" : "↓ Protective"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full ${isRisk ? "bg-red-400" : "bg-emerald-400"}`}
                      initial={{ width: 0 }}
                      animate={{ width }}
                      transition={{ delay: 1.5 + i * 0.1, duration: 0.5, ease: "easeOut" }}
                      style={{ willChange: "width" }}
                    />
                  </div>
                </motion.div>
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
      <motion.div
        className="mt-5 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700 flex items-start gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.5 }}
      >
        <span className="mt-0.5 flex-shrink-0">⚠️</span>
        <span>This tool is for research purposes only and should not be used as a substitute for professional medical advice, diagnosis, or treatment.</span>
      </motion.div>
    </div>
  );
}
