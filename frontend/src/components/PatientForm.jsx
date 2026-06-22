import { useState } from "react";

const defaultValues = {
  age: 55, gender: 1, race: 1, ethnicity: 0,
  alcohol_participant: 1, alcohol_frequency: 2, smoking_100_cigs: 0,
  education_level: 3, employment_status: 1, annual_income: 3,
  health_insurance: 1, marital_status: 1, sexual_orientation: 1,
  bmi: 27.5, obese: 0, hypertension: 0,
  platelet_count: 250, creatinine: 0.9, high_creatinine: 0,
  high_platelets: 0, low_platelets: 0, alt: 25, ast: 22, wbc: 6.5,
  rectal_bleeding: 0, bowel_changes: 0, abdominal_pain: 0,
  family_history_crc: 0, lynch_any: 0, apc_any: 0,
  mutyh_any: 0, smad4_any: 0, stk11_any: 0, bmpr1a_any: 0,
};

const sectionStyles = {
  demographics: { icon: "👤", accent: "border-l-indigo-500", badge: "bg-indigo-50 text-indigo-700" },
  clinical:     { icon: "🔬", accent: "border-l-sky-500",    badge: "bg-sky-50 text-sky-700" },
  symptoms:     { icon: "⚕️", accent: "border-l-rose-500",   badge: "bg-rose-50 text-rose-700" },
  lifestyle:    { icon: "📊", accent: "border-l-violet-500",  badge: "bg-violet-50 text-violet-700" },
  genomic:      { icon: "🧬", accent: "border-l-emerald-500", badge: "bg-emerald-50 text-emerald-700" },
};

function Section({ title, styleKey, children }) {
  const s = sectionStyles[styleKey];
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 border-l-4 ${s.accent} overflow-hidden`}>
      <div className="px-5 pt-5 pb-3 flex items-center gap-2.5">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.badge}`}>
          {s.icon} {title}
        </span>
      </div>
      <div className="px-5 pb-5 grid grid-cols-2 gap-x-4 gap-y-3">{children}</div>
    </div>
  );
}

function Field({ label, name, value, onChange, min, max, step = "1", options, span2 }) {
  const baseClass = "w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white transition focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 hover:border-gray-300";
  return (
    <div className={span2 ? "col-span-2" : ""}>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      {options ? (
        <select name={name} value={value} onChange={onChange} className={baseClass}>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : (
        <input type="number" name={name} value={value} onChange={onChange}
          min={min} max={max} step={step} className={baseClass} />
      )}
    </div>
  );
}

export default function PatientForm({ onSubmit, loading, error }) {
  const [form, setForm] = useState(defaultValues);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Patient Risk Assessment</h2>
        <p className="text-gray-500 text-sm mt-1">Enter patient data across all categories to generate a risk score.</p>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {/* ── Demographics ── */}
        <Section title="Demographics" styleKey="demographics">
          <Field label="Age (years)" name="age" value={form.age} onChange={handleChange} min="18" max="100" />
          <Field label="Gender" name="gender" value={form.gender} onChange={handleChange}
            options={[{value:1,label:"Male"},{value:2,label:"Female"},{value:3,label:"Other"}]} />
          <Field label="Race" name="race" value={form.race} onChange={handleChange}
            options={[{value:1,label:"White"},{value:2,label:"Black/African American"},{value:3,label:"Asian"},{value:4,label:"Other"}]} />
          <Field label="Ethnicity" name="ethnicity" value={form.ethnicity} onChange={handleChange}
            options={[{value:0,label:"Not Hispanic"},{value:1,label:"Hispanic/Latino"}]} />
        </Section>

        {/* ── Clinical Measurements ── */}
        <Section title="Clinical Measurements" styleKey="clinical">
          <Field label="BMI" name="bmi" value={form.bmi} onChange={handleChange} min="10" max="80" step="0.1" />
          <Field label="Obese" name="obese" value={form.obese} onChange={handleChange}
            options={[{value:0,label:"No"},{value:1,label:"Yes"}]} />
          <Field label="Hypertension" name="hypertension" value={form.hypertension} onChange={handleChange}
            options={[{value:0,label:"No"},{value:1,label:"Yes"}]} />
          <Field label="Platelet Count (×10³/μL)" name="platelet_count" value={form.platelet_count} onChange={handleChange} min="0" max="1000" />
          <Field label="Creatinine (mg/dL)" name="creatinine" value={form.creatinine} onChange={handleChange} min="0" max="20" step="0.1" />
          <Field label="ALT (U/L)" name="alt" value={form.alt} onChange={handleChange} min="0" max="500" />
          <Field label="AST (U/L)" name="ast" value={form.ast} onChange={handleChange} min="0" max="500" />
          <Field label="WBC (×10³/μL)" name="wbc" value={form.wbc} onChange={handleChange} min="0" max="100" step="0.1" />
          <Field label="High Creatinine" name="high_creatinine" value={form.high_creatinine} onChange={handleChange}
            options={[{value:0,label:"No"},{value:1,label:"Yes"}]} />
          <Field label="High Platelets" name="high_platelets" value={form.high_platelets} onChange={handleChange}
            options={[{value:0,label:"No"},{value:1,label:"Yes"}]} />
          <Field label="Low Platelets" name="low_platelets" value={form.low_platelets} onChange={handleChange}
            options={[{value:0,label:"No"},{value:1,label:"Yes"}]} />
        </Section>

        {/* ── Symptoms ── */}
        <Section title="Symptoms" styleKey="symptoms">
          <Field label="Rectal Bleeding" name="rectal_bleeding" value={form.rectal_bleeding} onChange={handleChange}
            options={[{value:0,label:"No"},{value:1,label:"Yes"}]} />
          <Field label="Bowel Changes" name="bowel_changes" value={form.bowel_changes} onChange={handleChange}
            options={[{value:0,label:"No"},{value:1,label:"Yes"}]} />
          <Field label="Abdominal Pain" name="abdominal_pain" value={form.abdominal_pain} onChange={handleChange}
            options={[{value:0,label:"No"},{value:1,label:"Yes"}]} />
        </Section>

        {/* ── Lifestyle & Socioeconomic ── */}
        <Section title="Lifestyle & Socioeconomic" styleKey="lifestyle">
          <Field label="Alcohol Use" name="alcohol_participant" value={form.alcohol_participant} onChange={handleChange}
            options={[{value:0,label:"No"},{value:1,label:"Yes"}]} />
          <Field label="Drink Frequency" name="alcohol_frequency" value={form.alcohol_frequency} onChange={handleChange}
            options={[{value:0,label:"Never"},{value:1,label:"Monthly"},{value:2,label:"Weekly"},{value:3,label:"Daily"}]} />
          <Field label="Smoked 100+ Cigarettes" name="smoking_100_cigs" value={form.smoking_100_cigs} onChange={handleChange}
            options={[{value:0,label:"No"},{value:1,label:"Yes"}]} />
          <Field label="Education Level" name="education_level" value={form.education_level} onChange={handleChange}
            options={[{value:1,label:"Less than High School"},{value:2,label:"High School"},{value:3,label:"College"},{value:4,label:"Graduate"}]} />
          <Field label="Employment Status" name="employment_status" value={form.employment_status} onChange={handleChange}
            options={[{value:1,label:"Employed"},{value:2,label:"Unemployed"},{value:3,label:"Retired"}]} />
          <Field label="Annual Income" name="annual_income" value={form.annual_income} onChange={handleChange}
            options={[{value:1,label:"<$25K"},{value:2,label:"$25K-$50K"},{value:3,label:"$50K-$100K"},{value:4,label:">$100K"}]} />
          <Field label="Health Insurance" name="health_insurance" value={form.health_insurance} onChange={handleChange}
            options={[{value:0,label:"No"},{value:1,label:"Yes"}]} />
          <Field label="Marital Status" name="marital_status" value={form.marital_status} onChange={handleChange}
            options={[{value:1,label:"Single"},{value:2,label:"Married"},{value:3,label:"Divorced"},{value:4,label:"Widowed"}]} />
          <Field label="Sexual Orientation" name="sexual_orientation" value={form.sexual_orientation} onChange={handleChange}
            options={[{value:1,label:"Straight"},{value:2,label:"Gay/Lesbian"},{value:3,label:"Bisexual"},{value:4,label:"Other"}]} />
        </Section>

        {/* ── Medical History & Genomic ── */}
        <Section title="Medical History & Genomic" styleKey="genomic">
          <Field label="Family History of CRC" name="family_history_crc" value={form.family_history_crc} onChange={handleChange}
            options={[{value:0,label:"No"},{value:1,label:"Yes"}]} />
          <Field label="Lynch Syndrome Variant" name="lynch_any" value={form.lynch_any} onChange={handleChange}
            options={[{value:0,label:"No / Unknown"},{value:1,label:"Yes (pathogenic variant)"}]} />
          <Field label="APC Variant" name="apc_any" value={form.apc_any} onChange={handleChange}
            options={[{value:0,label:"No / Unknown"},{value:1,label:"Yes (pathogenic variant)"}]} />
          <Field label="MUTYH Variant" name="mutyh_any" value={form.mutyh_any} onChange={handleChange}
            options={[{value:0,label:"No / Unknown"},{value:1,label:"Yes (pathogenic variant)"}]} />
          <Field label="SMAD4 Variant" name="smad4_any" value={form.smad4_any} onChange={handleChange}
            options={[{value:0,label:"No / Unknown"},{value:1,label:"Yes (pathogenic variant)"}]} />
          <Field label="STK11 Variant" name="stk11_any" value={form.stk11_any} onChange={handleChange}
            options={[{value:0,label:"No / Unknown"},{value:1,label:"Yes (pathogenic variant)"}]} />
          <Field label="BMPR1A Variant" name="bmpr1a_any" value={form.bmpr1a_any} onChange={handleChange}
            options={[{value:0,label:"No / Unknown"},{value:1,label:"Yes (pathogenic variant)"}]} />
          <div className="col-span-2">
            <p className="text-xs text-gray-400 mt-1">
              Only pathogenic/likely pathogenic variants (ClinVar) are clinically relevant. Lynch: 14× enrichment · APC: 27× enrichment in cancer cases.
            </p>
          </div>
        </Section>
      </div>

      {error && (
        <div className="mt-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
          <span className="mt-0.5">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <button type="submit" disabled={loading}
        className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold py-3.5 rounded-xl text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
            Calculating Risk…
          </span>
        ) : "Calculate Cancer Risk Score"}
      </button>
    </form>
  );
}
