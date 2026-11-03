// Single source of truth mapping DB tables/columns <-> the field names used by the frontend.
// kind: 'binary' (0/1), 'int', 'real'
const TABLES = {
  patients: [
    { col: 'gallstone_status', key: 'Gallstone Status', kind: 'binary' },
    { col: 'age', key: 'Age', kind: 'int', min: 0, max: 120 },
    { col: 'gender', key: 'Gender', kind: 'binary' },
  ],
  comorbidities: [
    { col: 'comorbidity', key: 'Comorbidity', kind: 'int', min: 0, max: 10 }, // number of comorbid conditions
    { col: 'cad', key: 'Coronary Artery Disease (CAD)', kind: 'binary' },
    { col: 'hypothyroidism', key: 'Hypothyroidism', kind: 'binary' },
    { col: 'hyperlipidemia', key: 'Hyperlipidemia', kind: 'binary' },
    { col: 'diabetes', key: 'Diabetes Mellitus (DM)', kind: 'binary' },
  ],
  body_composition: [
    { col: 'height', key: 'Height', kind: 'real' },
    { col: 'weight', key: 'Weight', kind: 'real' },
    { col: 'bmi', key: 'Body Mass Index (BMI)', kind: 'real' },
    { col: 'tbw', key: 'Total Body Water (TBW)', kind: 'real' },
    { col: 'ecw', key: 'Extracellular Water (ECW)', kind: 'real' },
    { col: 'icw', key: 'Intracellular Water (ICW)', kind: 'real' },
    { col: 'ecf_tbw', key: 'Extracellular Fluid/Total Body Water (ECF/TBW)', kind: 'real' },
    { col: 'tbfr', key: 'Total Body Fat Ratio (TBFR) (%)', kind: 'real' },
    { col: 'lean_mass', key: 'Lean Mass (LM) (%)', kind: 'real' },
    { col: 'protein', key: 'Body Protein Content (Protein) (%)', kind: 'real' },
    { col: 'vfr', key: 'Visceral Fat Rating (VFR)', kind: 'real' },
    { col: 'bone_mass', key: 'Bone Mass (BM)', kind: 'real' },
    { col: 'muscle_mass', key: 'Muscle Mass (MM)', kind: 'real' },
    { col: 'obesity_pct', key: 'Obesity (%)', kind: 'real' },
    { col: 'tfc', key: 'Total Fat Content (TFC)', kind: 'real' },
    { col: 'vfa', key: 'Visceral Fat Area (VFA)', kind: 'real' },
    { col: 'vma', key: 'Visceral Muscle Area (VMA) (Kg)', kind: 'real' },
    { col: 'hfa', key: 'Hepatic Fat Accumulation (HFA)', kind: 'real' },
  ],
  lab_results: [
    { col: 'glucose', key: 'Glucose', kind: 'real' },
    { col: 'total_cholesterol', key: 'Total Cholesterol (TC)', kind: 'real' },
    { col: 'ldl', key: 'Low Density Lipoprotein (LDL)', kind: 'real' },
    { col: 'hdl', key: 'High Density Lipoprotein (HDL)', kind: 'real' },
    { col: 'triglyceride', key: 'Triglyceride', kind: 'real' },
    { col: 'ast', key: 'Aspartat Aminotransferaz (AST)', kind: 'real' },
    { col: 'alt', key: 'Alanin Aminotransferaz (ALT)', kind: 'real' },
    { col: 'alp', key: 'Alkaline Phosphatase (ALP)', kind: 'real' },
    { col: 'creatinine', key: 'Creatinine', kind: 'real' },
    { col: 'gfr', key: 'Glomerular Filtration Rate (GFR)', kind: 'real' },
    { col: 'crp', key: 'C-Reactive Protein (CRP)', kind: 'real' },
    { col: 'hgb', key: 'Hemoglobin (HGB)', kind: 'real' },
    { col: 'vitamin_d', key: 'Vitamin D', kind: 'real' },
  ],
}

const CHILD_TABLES = ['comorbidities', 'body_composition', 'lab_results']

const SQL_TYPE = { binary: 'INTEGER', int: 'INTEGER', real: 'REAL' }

function columnDef(f) {
  const checks = { binary: ` CHECK (${f.col} IN (0, 1))` }
  const check =
    f.kind === 'binary'
      ? checks.binary
      : f.kind === 'int'
        ? ` CHECK (${f.col} BETWEEN ${f.min} AND ${f.max})`
        : ''
  return `${f.col} ${SQL_TYPE[f.kind]} NOT NULL${check}`
}

function buildSchema() {
  const patientCols = TABLES.patients.map(columnDef).join(',\n  ')
  const parts = [
    `CREATE TABLE IF NOT EXISTS patients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ${patientCols},
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);`,
  ]
  for (const table of CHILD_TABLES) {
    const cols = TABLES[table].map(columnDef).join(',\n  ')
    parts.push(`CREATE TABLE IF NOT EXISTS ${table} (
  patient_id INTEGER PRIMARY KEY REFERENCES patients(id) ON DELETE CASCADE,
  ${cols}
);`)
  }
  parts.push('CREATE INDEX IF NOT EXISTS idx_patients_age ON patients(age);')
  parts.push('CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(gallstone_status);')
  return parts.join('\n\n')
}

const ALL_FIELDS = Object.entries(TABLES).flatMap(([table, fields]) =>
  fields.map((f) => ({ ...f, table }))
)

module.exports = { TABLES, CHILD_TABLES, ALL_FIELDS, buildSchema }
