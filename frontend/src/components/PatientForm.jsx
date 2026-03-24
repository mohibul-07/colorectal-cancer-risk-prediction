import { useState } from "react";

const defaultValues = {
  age: 55, gender: 1, race: 1, ethnicity: 0,
  alcohol_participant: 1, alcohol_frequency: 2, smoking_100_cigs: 0,
  education_level: 3, employment_status: 1, annual_income: 3,
  health_insurance: 1, marital_status: 1, sexual_orientation: 1,
  bmi: 27.5, obese: 0, hypertension: 0,
  platelet_count: 250, creatinine: 0.9, high_creatinine: 0,
  high_platelets: 0, low_platelets: 0, alt: 25, ast: 22, wbc: 6.5,
  rectal_bleeding: 0, weight_loss: 0, bowel_changes: 0, abdominal_pain: 0,
  family_history_crc: 0, lynch_any: 0,
};

function Section({ title, color, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
      <h3 className={`text-sm font-bold mb-4 pb-2 border-b ${color}`}>{title}</h3>
      <div className="grid grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Field({ label, name, value, onChange, min, max, step = "1", options }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
      {options ? (
        <select name={name} value={value} onChange={onChange}
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400">
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : (
        <input type="number" name={name} value={value} onChange={onChange}
          min={min} max={max} step={step}
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400" />
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
        <h2 className="text-2xl font-bold text-slate-800">Patient Risk Assessment</h2>
        <p className="text-slate-500 text-sm mt-1">Enter patient data to calculate colorectal cancer risk score</p>
      </div>

      <div className="grid grid-cols-1 gap-5">
        <Section title="Demographics" color="text-teal-600 border-teal-100">
          <Field label="Age (years)" name="age" value={form.age} onChange={handleChange} min="18" max="100" />
          <Field label="Gender" name="gender" value={form.gender} onChange={handleChange}
            options={[{value:1,label:"Male"},{value:2,label:"Female"},{value:3,label:"Other"}]} />
          <Field label="Race" name="race" value={form.race} onChange={handleChange}
            options={[{value:1,label:"White"},{value:2,label:"Black/African American"},{value:3,label:"Asian"},{value:4,label:"Other"}]} />
          <Field label="Ethnicity" name="ethnicity" value={form.ethnicity} onChange={handleChange}
            options={[{value:0,label:"Not Hispanic"},{value:1,label:"Hispanic/Latino"}]} />
        </Section>

        <Section title="Clinical Measurements" color="text-blue-600 border-blue-100">
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

        <Section title="Symptoms" color="text-red-600 border-red-100">
          <Field label="Rectal Bleeding" name="rectal_bleeding" value={form.rectal_bleeding} onChange={handleChange}
            options={[{value:0,label:"No"},{value:1,label:"Yes"}]} />
          <Field label="Unexplained Weight Loss" name="weight_loss" value={form.weight_loss} onChange={handleChange}
            options={[{value:0,label:"No"},{value:1,label:"Yes"}]} />
          <Field label="Bowel Changes" name="bowel_changes" value={form.bowel_changes} onChange={handleChange}
            options={[{value:0,label:"No"},{value:1,label:"Yes"}]} />
          <Field label="Abdominal Pain" name="abdominal_pain" value={form.abdominal_pain} onChange={handleChange}
            options={[{value:0,label:"No"},{value:1,label:"Yes"}]} />
        </Section>

        <Section title="Lifestyle & Socioeconomic" color="text-purple-600 border-purple-100">
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

        <Section title="Medical History & Genomic" color="text-green-600 border-green-100">
          <Field label="Family History of CRC" name="family_history_crc" value={form.family_history_crc} onChange={handleChange}
            options={[{value:0,label:"No"},{value:1,label:"Yes"}]} />
          <Field label="Lynch Syndrome Variant" name="lynch_any" value={form.lynch_any} onChange={handleChange}
            options={[{value:0,label:"No / Unknown"},{value:1,label:"Yes (pathogenic variant)"}]} />
        </Section>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
      )}

      <button type="submit" disabled={loading}
        className="mt-6 w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl text-lg transition disabled:opacity-50">
        {loading ? "Calculating Risk..." : "Calculate Cancer Risk Score"}
      </button>
    </form>
  );
}