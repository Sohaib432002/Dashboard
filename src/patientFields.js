// Form definition for a patient record. `key` matches the API / database field names.
const YES_NO = [
  { value: 0, label: 'No' },
  { value: 1, label: 'Yes' },
]

export const FIELD_GROUPS = [
  {
    title: 'Patient',
    fields: [
      { key: 'Age', label: 'Age (years)', type: 'int', min: 0, max: 120 },
      { key: 'Gender', label: 'Gender', type: 'select', options: [{ value: 0, label: 'Male' }, { value: 1, label: 'Female' }] },
      { key: 'Gallstone Status', label: 'Gallstones', type: 'select', options: YES_NO },
    ],
  },
  {
    title: 'Comorbidities',
    fields: [
      { key: 'Comorbidity', label: 'Comorbidity count', type: 'int', min: 0, max: 10 },
      { key: 'Coronary Artery Disease (CAD)', label: 'Coronary artery disease', type: 'select', options: YES_NO },
      { key: 'Hypothyroidism', label: 'Hypothyroidism', type: 'select', options: YES_NO },
      { key: 'Hyperlipidemia', label: 'Hyperlipidemia', type: 'select', options: YES_NO },
      { key: 'Diabetes Mellitus (DM)', label: 'Diabetes mellitus', type: 'select', options: YES_NO },
    ],
  },
  {
    title: 'Body Composition',
    fields: [
      'Height',
      'Weight',
      'Body Mass Index (BMI)',
      'Total Body Water (TBW)',
      'Extracellular Water (ECW)',
      'Intracellular Water (ICW)',
      'Extracellular Fluid/Total Body Water (ECF/TBW)',
      'Total Body Fat Ratio (TBFR) (%)',
      'Lean Mass (LM) (%)',
      'Body Protein Content (Protein) (%)',
      'Visceral Fat Rating (VFR)',
      'Bone Mass (BM)',
      'Muscle Mass (MM)',
      'Obesity (%)',
      'Total Fat Content (TFC)',
      'Visceral Fat Area (VFA)',
      'Visceral Muscle Area (VMA) (Kg)',
      'Hepatic Fat Accumulation (HFA)',
    ].map((key) => ({ key, label: key, type: 'real' })),
  },
  {
    title: 'Laboratory Results',
    fields: [
      'Glucose',
      'Total Cholesterol (TC)',
      'Low Density Lipoprotein (LDL)',
      'High Density Lipoprotein (HDL)',
      'Triglyceride',
      'Aspartat Aminotransferaz (AST)',
      'Alanin Aminotransferaz (ALT)',
      'Alkaline Phosphatase (ALP)',
      'Creatinine',
      'Glomerular Filtration Rate (GFR)',
      'C-Reactive Protein (CRP)',
      'Hemoglobin (HGB)',
      'Vitamin D',
    ].map((key) => ({ key, label: key, type: 'real' })),
  },
]

export const ALL_FIELDS = FIELD_GROUPS.flatMap((g) => g.fields)
