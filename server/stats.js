const { listPatients, recentActivity } = require('./patients')

const AGE_GROUPS = [
  { label: '<30', min: 0, max: 29 },
  { label: '30-39', min: 30, max: 39 },
  { label: '40-49', min: 40, max: 49 },
  { label: '50-59', min: 50, max: 59 },
  { label: '60-69', min: 60, max: 69 },
  { label: '70+', min: 70, max: 120 },
]

const BMI = 'Body Mass Index (BMI)'
const GLUCOSE = 'Glucose'
const TC = 'Total Cholesterol (TC)'
const STATUS = 'Gallstone Status'

// Clinical cut-offs used for the risk-factor panel. High-risk matches Summary Metrics.
const FACTORS = [
  { key: BMI, label: 'BMI > 30', test: (v) => v > 30 },
  { key: GLUCOSE, label: 'Glucose > 125', test: (v) => v > 125 },
  { key: TC, label: 'Cholesterol > 200', test: (v) => v > 200 },
  { key: 'Triglyceride', label: 'Triglyceride > 150', test: (v) => v > 150 },
  { key: 'Alanin Aminotransferaz (ALT)', label: 'ALT > 40', test: (v) => v > 40 },
  { key: 'Vitamin D', label: 'Vitamin D < 20', test: (v) => v < 20 },
]

const SIGNAL_FIELDS = [
  BMI,
  GLUCOSE,
  TC,
  'Low Density Lipoprotein (LDL)',
  'High Density Lipoprotein (HDL)',
  'Triglyceride',
  'Visceral Fat Rating (VFR)',
  'Total Fat Content (TFC)',
  'Muscle Mass (MM)',
  'Alanin Aminotransferaz (ALT)',
  'Aspartat Aminotransferaz (AST)',
  'C-Reactive Protein (CRP)',
  'Vitamin D',
  'Age',
]

const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0)
const round = (n, d = 1) => Math.round(n * 10 ** d) / 10 ** d
const variance = (xs, m) => (xs.length > 1 ? xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - 1) : 0)

// Cohen's d between patients with and without gallstones.
function effectSize(withStone, without, key) {
  const a = withStone.map((p) => p[key])
  const b = without.map((p) => p[key])
  if (a.length < 2 || b.length < 2) return 0
  const ma = mean(a)
  const mb = mean(b)
  const pooled = Math.sqrt(
    ((a.length - 1) * variance(a, ma) + (b.length - 1) * variance(b, mb)) / (a.length + b.length - 2)
  )
  return pooled === 0 ? 0 : (ma - mb) / pooled
}

function isHighRisk(p) {
  return p[BMI] > 30 || p[GLUCOSE] > 125 || p[TC] > 200
}

function summary() {
  const rows = listPatients()
  const total = rows.length
  const withStone = rows.filter((p) => p[STATUS] === 1)
  const without = rows.filter((p) => p[STATUS] === 0)
  const prevalence = total ? (withStone.length / total) * 100 : 0

  const groups = AGE_GROUPS.map((g) => {
    const members = rows.filter((p) => p.Age >= g.min && p.Age <= g.max)
    return {
      label: g.label,
      count: members.length,
      prevalence: members.length ? round((members.filter((p) => p[STATUS] === 1).length / members.length) * 100) : 0,
      avgBmi: round(mean(members.map((p) => p[BMI]))),
      avgGlucose: round(mean(members.map((p) => p[GLUCOSE]))),
      avgCholesterol: round(mean(members.map((p) => p[TC]))),
      avgVfr: round(mean(members.map((p) => p['Visceral Fat Rating (VFR)']))),
    }
  })

  const factors = FACTORS.map((f) => {
    const flagged = rows.filter((p) => f.test(p[f.key]))
    const flaggedStone = flagged.filter((p) => p[STATUS] === 1).length
    return {
      label: f.label,
      count: flagged.length,
      sharePct: total ? round((flagged.length / total) * 100) : 0,
      gallstonePct: flagged.length ? round((flaggedStone / flagged.length) * 100) : 0,
    }
  })

  const signals = SIGNAL_FIELDS.map((key) => ({ key, d: effectSize(withStone, without, key) }))
    .sort((a, b) => Math.abs(b.d) - Math.abs(a.d))
    .slice(0, 3)
    .map((s) => ({
      key: s.key,
      effectSize: round(s.d, 2),
      direction: s.d >= 0 ? 'higher' : 'lower',
      withGallstone: round(mean(withStone.map((p) => p[s.key]))),
      withoutGallstone: round(mean(without.map((p) => p[s.key]))),
    }))

  const conditions = [
    ['Diabetes', 'Diabetes Mellitus (DM)'],
    ['Hyperlipidemia', 'Hyperlipidemia'],
    ['Hypothyroidism', 'Hypothyroidism'],
    ['CAD', 'Coronary Artery Disease (CAD)'],
  ]
  const nodes = conditions.map(([name, key]) => ({ name, count: rows.filter((p) => p[key] === 1).length }))
  const links = []
  for (let i = 0; i < conditions.length; i++) {
    for (let j = i + 1; j < conditions.length; j++) {
      const count = rows.filter((p) => p[conditions[i][1]] === 1 && p[conditions[j][1]] === 1).length
      if (count > 0) links.push({ source: conditions[i][0], target: conditions[j][0], count })
    }
  }

  const ages = rows.map((p) => p.Age)
  const highRisk = rows.filter(isHighRisk).length

  return {
    totals: {
      patients: total,
      withGallstone: withStone.length,
      withoutGallstone: without.length,
      prevalencePct: round(prevalence),
      highRisk,
      highRiskPct: total ? round((highRisk / total) * 100) : 0,
      male: rows.filter((p) => p.Gender === 0).length,
      female: rows.filter((p) => p.Gender === 1).length,
      minAge: ages.length ? Math.min(...ages) : 0,
      maxAge: ages.length ? Math.max(...ages) : 0,
      avgAge: round(mean(ages)),
      avgBmi: round(mean(rows.map((p) => p[BMI]))),
      avgGlucose: round(mean(rows.map((p) => p[GLUCOSE]))),
      avgCholesterol: round(mean(rows.map((p) => p[TC]))),
    },
    ageGroups: groups,
    factors,
    signals,
    comorbidityGraph: { nodes, links },
    activity: recentActivity(5),
  }
}

module.exports = { summary }
