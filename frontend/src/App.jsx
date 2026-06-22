import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PatientForm from "./components/PatientForm";
import ResultPanel from "./components/ResultPanel";
import DNAParticles from "./components/DNAParticles";
import AnimatedStat from "./components/AnimatedStat";

const TABS = ["Risk Assessment", "Model Performance", "Feature Importance", "Genomic Findings", "Methods"];

const SHAP_DATA = [
  { feature: "Age", value: 1.4465, note: "Strongest predictor — CRC incidence rises sharply after 50." },
  { feature: "Smoking (100+ Cigs)", value: 0.3231, note: "Established carcinogen; long-term smoking raises CRC risk." },
  { feature: "WBC Count", value: 0.2910, note: "Elevated counts may reflect subclinical inflammation." },
  { feature: "Alcohol Use", value: 0.2798, note: "Regular alcohol intake is a known modifiable risk factor." },
  { feature: "Annual Income", value: 0.2679, note: "Proxy for screening access and socioeconomic risk." },
  { feature: "Drink Frequency", value: 0.2622, note: "Higher drinking frequency compounds alcohol-related risk." },
  { feature: "Creatinine", value: 0.2447, note: "Renal-function marker captured pre-diagnosis." },
  { feature: "ALT (Liver Enzyme)", value: 0.1846, note: "Liver enzyme; metabolic-health signal." },
  { feature: "Education Level", value: 0.1552, note: "Correlates with health literacy and screening uptake." },
  { feature: "Employment Status", value: 0.1288, note: "Socioeconomic dimension of risk." },
  { feature: "Race", value: 0.1284, note: "Captures known disparities in CRC incidence." },
  { feature: "Marital Status", value: 0.1107, note: "Social-support proxy associated with outcomes." },
  { feature: "Hypertension", value: 0.1011, note: "Cardiometabolic comorbidity signal." },
  { feature: "Gender", value: 0.1004, note: "Males carry modestly higher baseline CRC risk." },
  { feature: "BMI", value: 0.0955, note: "Obesity is a recognized CRC risk factor." },
];

const GENOMIC_GENES = [
  { gene: "Lynch syndrome (MLH1/MSH2/MSH6/PMS2)", controls: "0.42%", cases: "5.88%", enrichment: "14×", note: "Mismatch repair deficiency" },
  { gene: "APC", controls: "0.09%", cases: "2.43%", enrichment: "27×", note: "Familial adenomatous polyposis" },
  { gene: "MUTYH", controls: "0.31%", cases: "0.59%", enrichment: "1.9×", note: "Base excision repair" },
  { gene: "SMAD4", controls: "0.04%", cases: "0.08%", enrichment: "2×", note: "TGF-β signaling" },
  { gene: "STK11", controls: "0.02%", cases: "0.04%", enrichment: "2×", note: "Peutz-Jeghers syndrome" },
  { gene: "BMPR1A", controls: "0.02%", cases: "0.03%", enrichment: "1.5×", note: "Juvenile polyposis" },
];

/* ── Reusable scroll-triggered reveal ── */
function Reveal({ children, className = "", y = 30, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      className={className}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
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

/* ── Typewriter title ── */
function Typewriter({ text, speed = 50, className = "" }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  const done = displayed.length >= text.length;
  return (
    <span className={className}>
      {displayed}
      <span className={`inline-block w-[2px] -mb-0.5 ${done ? "opacity-0" : "animate-pulse"}`} style={{ height: "1em", background: "currentColor" }} />
    </span>
  );
}

/* ════════════ TAB 1 — Risk Assessment ════════════ */
function TabRiskAssessment({ onSubmit, loading, error, result, onReset }) {
  return (
    <AnimatePresence mode="wait">
      {result ? (
        <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <ResultPanel result={result} onReset={onReset} />
        </motion.div>
      ) : (
        <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
          <PatientForm onSubmit={onSubmit} loading={loading} error={error} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ════════════ TAB 2 — Model Performance ════════════ */
function TabModelPerformance() {
  const benchmarks = [
    { model: "XGBoost v3 (this work, clean)", auc: 0.8003, note: "6mo–2yr pre-diagnosis window", ours: true },
    { model: "XGBoost v2 (temporal leakage)", auc: 0.8979, note: "Post-diagnosis lab values", legacy: true },
    { model: "Yuan et al. 2020 (logistic)", auc: 0.73, note: "Published benchmark" },
    { model: "Boursi et al. 2016", auc: 0.70, note: "Published benchmark" },
    { model: "Freedman et al. 2009", auc: 0.65, note: "Published benchmark" },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6">
        <Reveal>
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
        </Reveal>

        <Reveal delay={0.1}>
          <Card>
            <SectionTitle>Temporal Leakage Correction</SectionTitle>
            <div className="flex items-center justify-center gap-4 py-4">
              <div className="relative text-3xl font-bold text-gray-400">
                0.8979
                <motion.span
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="absolute left-0 top-1/2 h-[3px] w-full bg-red-500 origin-left"
                />
              </div>
              <motion.svg
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                width="32" height="24" viewBox="0 0 32 24" fill="none" stroke="#6366f1" strokeWidth="2"
              >
                <path d="M2 12h26M20 4l8 8-8 8" strokeLinecap="round" strokeLinejoin="round" />
              </motion.svg>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1, type: "spring", stiffness: 200 }}
                className="text-3xl font-bold text-emerald-600"
              >
                0.8003
              </motion.div>
            </div>
            <p className="text-center text-xs font-medium text-emerald-600 mb-3">
              Temporal leakage removed — this is the honest number
            </p>
            <p className="text-xs text-gray-400 leading-relaxed">
              93–95% of lab values in the original model were measured <em>after</em> CRC diagnosis. After restricting to a 6-month to 2-year pre-diagnosis window, the AUC dropped from 0.8979 to 0.8003 — still well above published benchmarks.
            </p>
          </Card>
        </Reveal>
      </div>

      <Reveal delay={0.15}>
        <Card>
          <SectionTitle>Comparison with Published Models</SectionTitle>
          <div className="space-y-4">
            {benchmarks.map((b, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline text-sm mb-1">
                  <span className={`font-medium ${b.ours ? "text-indigo-700" : b.legacy ? "text-red-400" : "text-gray-600"}`}>{b.model}</span>
                  <span className={`font-bold ${b.ours ? "text-indigo-600" : b.legacy ? "text-red-400" : "text-gray-500"}`}>{b.auc.toFixed(4)}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${b.auc * 100}%` }}
                    viewport={{ once: true }}
                    transition={
                      b.ours
                        ? { type: "spring", stiffness: 100, damping: 15, delay: 0.5 }
                        : { duration: 0.8, ease: "easeOut", delay: i * 0.1 }
                    }
                    className={`h-3 rounded-full ${
                      b.ours ? "bg-gradient-to-r from-teal-500 to-indigo-500" : b.legacy ? "bg-red-300" : "bg-gray-300"
                    }`}
                    style={{ willChange: "width" }}
                  />
                </div>
                <div className="text-xs text-gray-400 mt-0.5">{b.note}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">Published benchmarks range 0.65–0.73. Our clean model at 0.8003 represents a meaningful improvement while maintaining temporal integrity.</p>
        </Card>
      </Reveal>
    </div>
  );
}

/* ════════════ TAB 3 — Feature Importance ════════════ */
function ShapBar({ d, i, max }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      className="flex items-center gap-4 transition-opacity duration-200 group-hover/bars:opacity-40 hover:!opacity-100"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="w-44 text-sm text-gray-700 font-medium text-right flex-shrink-0">{d.feature}</div>
      <div className="flex-1 relative">
        <div className="bg-gray-100 rounded-full h-5">
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: `${Math.max((d.value / max) * 100, 3)}%`, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
            className={`h-5 rounded-full flex items-center justify-end pr-2 bg-gradient-to-r from-teal-500 to-teal-400 ${hover ? "brightness-110" : ""}`}
            style={{ willChange: "width" }}
          >
            <span className="text-white text-xs font-semibold">{d.value.toFixed(3)}</span>
          </motion.div>
        </div>
        <AnimatePresence>
          {hover && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="absolute z-10 left-0 top-7 bg-slate-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg max-w-xs"
            >
              <span className="font-semibold text-teal-300">SHAP {d.value.toFixed(4)}</span> · {d.note}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TabFeatureImportance() {
  const max = SHAP_DATA[0].value;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Reveal className="md:col-span-2">
        <Card>
          <SectionTitle>SHAP Feature Importance — Top 15 Features</SectionTitle>
          <p className="text-sm text-gray-500 mb-6">Mean absolute SHAP value across the test set. Hover a bar for the exact value and a clinical note.</p>
          <div className="space-y-3 group/bars">
            {SHAP_DATA.map((d, i) => (
              <ShapBar key={d.feature} d={d} i={i} max={max} />
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-6">
            Source: <code className="bg-gray-100 px-1 rounded">shap_importance_v3.csv</code> · TreeExplainer on XGBoost v3 · 6mo–2yr pre-diagnosis temporal window
          </p>
        </Card>
      </Reveal>

      <Reveal delay={0.1}>
        <Card>
          <SectionTitle>Old vs New Top Features</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-2">v2 (leakage)</div>
              <ul className="space-y-1 text-sm text-gray-600">
                {[["Age", "1.54"], ["ALT", "0.80"], ["Creatinine", "0.76"], ["BMI", "0.56"], ["Abdominal Pain", "0.36"], ["Lynch", "0.12"]].map(([f, v]) => (
                  <li key={f} className="flex justify-between"><span>{f}</span><span className="text-gray-400 font-mono">{v}</span></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-2">v3 (clean)</div>
              <ul className="space-y-1 text-sm text-gray-600">
                {[["Age", "1.45"], ["Smoking", "0.32"], ["WBC", "0.29"], ["Alcohol", "0.28"], ["Income", "0.27"], ["Creatinine", "0.24"]].map(([f, v]) => (
                  <li key={f} className="flex justify-between"><span>{f}</span><span className="text-indigo-500 font-mono">{v}</span></li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">Lab-based features (ALT, creatinine) dropped in importance after removing post-diagnosis leakage. Lifestyle factors (smoking, alcohol, income) now rank higher — more clinically meaningful for pre-diagnosis risk.</p>
        </Card>
      </Reveal>

      <Reveal delay={0.15}>
        <Card>
          <SectionTitle>Interpretation Notes</SectionTitle>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex gap-2"><span className="text-indigo-500 font-bold mt-0.5">→</span><span><strong>Age</strong> dominates both models — expected for a cancer risk model.</span></li>
            <li className="flex gap-2"><span className="text-indigo-500 font-bold mt-0.5">→</span><span><strong>Smoking</strong> now ranks #2, reflecting a well-established CRC risk factor.</span></li>
            <li className="flex gap-2"><span className="text-indigo-500 font-bold mt-0.5">→</span><span><strong>WBC</strong> elevation pre-diagnosis may reflect subclinical inflammation.</span></li>
            <li className="flex gap-2"><span className="text-indigo-500 font-bold mt-0.5">→</span><span><strong>Income &amp; alcohol</strong> capturing socioeconomic and behavioral risk dimensions.</span></li>
            <li className="flex gap-2"><span className="text-indigo-500 font-bold mt-0.5">→</span><span>Genomic features (Lynch, APC) have lower mean SHAP but extreme impact for variant carriers.</span></li>
          </ul>
        </Card>
      </Reveal>
    </div>
  );
}

/* ════════════ TAB 4 — Genomic Findings ════════════ */
function EnrichmentNumber({ value, color }) {
  return (
    <motion.div
      animate={{ textShadow: [`0 0 0px ${color}`, `0 0 12px ${color}`, `0 0 0px ${color}`] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="text-4xl font-bold"
      style={{ color }}
    >
      {value}
    </motion.div>
  );
}

function TabGenomicFindings() {
  return (
    <div className="space-y-6">
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={{ show: { transition: { staggerChildren: 0.12 } } }}
      >
        {[
          { num: "14×", color: "#059669", border: "border-l-emerald-500", bg: "bg-emerald-100", stroke: "#059669", title: "Lynch Syndrome Enrichment", desc: "0.42% controls vs 5.88% CRC cases (MLH1, MSH2, MSH6, PMS2 pathogenic variants)" },
          { num: "27×", color: "#4f46e5", border: "border-l-indigo-500", bg: "bg-indigo-100", stroke: "#4f46e5", title: "APC Variant Enrichment", desc: "0.09% controls vs 2.43% CRC cases (familial adenomatous polyposis)" },
        ].map((c) => (
          <motion.div
            key={c.title}
            variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }}
            whileHover={{ y: -4 }}
            className={`bg-white rounded-xl shadow-sm border border-gray-100 border-l-4 ${c.border} p-6`}
            style={{ willChange: "transform" }}
          >
            <div className="flex items-start gap-4">
              <div className={`${c.bg} rounded-xl p-3`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z" /><path d="M12 8v4l3 3" />
                </svg>
              </div>
              <div>
                <EnrichmentNumber value={c.num} color={c.color} />
                <div className="text-sm font-semibold text-gray-700 mt-1">{c.title}</div>
                <p className="text-xs text-gray-500 mt-1">{c.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <Reveal delay={0.1}>
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
      </Reveal>

      <Reveal delay={0.15}>
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
      </Reveal>
    </div>
  );
}

/* ════════════ TAB 5 — Methods ════════════ */
function TabMethods() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Reveal>
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
      </Reveal>

      <Reveal delay={0.1}>
        <Card>
          <SectionTitle>Temporal Leakage Audit</SectionTitle>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex gap-2"><span className="text-red-400 font-bold">·</span><span><strong>Problem:</strong> 93–95% of lab values in v2 were measured <em>after</em> CRC diagnosis — information unavailable at time of screening.</span></li>
            <li className="flex gap-2"><span className="text-indigo-500 font-bold">·</span><span><strong>Fix:</strong> Re-extracted all clinical features using measurements taken 6 months to 2 years before diagnosis date.</span></li>
            <li className="flex gap-2"><span className="text-indigo-500 font-bold">·</span><span><strong>Window:</strong> [diagnosis_date − 2yr, diagnosis_date − 6mo]</span></li>
            <li className="flex gap-2"><span className="text-indigo-500 font-bold">·</span><span><strong>Result:</strong> AUC dropped from 0.8979 → 0.8003, still above all published benchmarks (0.65–0.73).</span></li>
          </ul>
        </Card>
      </Reveal>

      <Reveal delay={0.15}>
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
      </Reveal>

      <Reveal delay={0.2}>
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
      </Reveal>
    </div>
  );
}

/* ════════════ APP ════════════ */
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
      <motion.div
        className="bg-slate-900 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <DNAParticles />

        <div className="max-w-[1400px] mx-auto px-6 py-10 relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                <Typewriter text="CRC Risk Predictor" />
              </h1>
              <motion.p
                className="text-sm text-slate-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.4 }}
              >
                Colorectal Cancer Risk Assessment · NIH All of Us · XGBoost v3
              </motion.p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <AnimatedStat value={0.8003} from={0.5} duration={1.5} decimals={4} label="Model AUC" sub="Above published benchmarks" />
            <AnimatedStat value={12248} duration={2} label="Patients" sub="NIH All of Us" delay={0.1} />
            <AnimatedStat value={34} duration={1} label="Features" sub="After leakage correction" delay={0.2} />
            <AnimatedStat display="0.65–0.73" label="Benchmarks" sub="Published range" delay={0.3} />
          </div>
        </div>

        {/* ── Tab Bar ── */}
        <motion.div
          className="max-w-[1400px] mx-auto px-6 relative z-10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <div className="flex gap-0 border-b border-white/10 overflow-x-auto">
            {TABS.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className={`relative px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === i ? "text-indigo-300" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {tab}
                {activeTab === i && (
                  <motion.div layoutId="tab-indicator" className="absolute left-0 right-0 bottom-0 h-0.5 bg-teal-400" />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* ── Tab Content ── */}
      <main className="max-w-[1400px] mx-auto w-full px-6 py-8 flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {activeTab === 0 && (
              <TabRiskAssessment onSubmit={handleSubmit} loading={loading} error={error} result={result} onReset={handleReset} />
            )}
            {activeTab === 1 && <TabModelPerformance />}
            {activeTab === 2 && <TabFeatureImportance />}
            {activeTab === 3 && <TabGenomicFindings />}
            {activeTab === 4 && <TabMethods />}
          </motion.div>
        </AnimatePresence>
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
