import { useContext, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import Loader from '../LoadingSpinner'
import { DataContext } from '../useContext'

/* ================= THEME ================= */
const THEME = {
  bg: '#0f172a',
  card: '#020617',
  grid: '#1e293b',
  text: '#e5e7eb',
  muted: '#94a3b8',
  accent1: '#38bdf8', // Blue
  accent2: '#22c55e', // Green
  accent3: '#f97316', // Orange
  accent4: '#a855f7', // Purple
}

/* Pie colors */
const PIE_COLORS = [THEME.accent1, THEME.accent2, THEME.accent3, THEME.accent4]

const SymptomsClinicalData = () => {
  const [minAge, setMinAge] = useState(0)
  const [maxAge, setMaxAge] = useState(100)
  const [gallstone, setGallstone] = useState('All') // All / Yes / No

  const { data } = useContext(DataContext)

  /* ================= FILTER DATA ================= */
  const filtered = useMemo(() => {
    return data.filter((item) => {
      const age = Number(item.Age) // Convert string to number
      const ageMatch = age >= minAge && age <= maxAge

      let gallstoneMatch = true
      if (gallstone === 'Yes') gallstoneMatch = item['Gallstone Status'] === '1'
      if (gallstone === 'No') gallstoneMatch = item['Gallstone Status'] === '0'

      return ageMatch && gallstoneMatch
    })
  }, [data, minAge, maxAge, gallstone])

  /* ================= PIE DATA ================= */
  const symptomsData = useMemo(() => {
    const counts = {
      Comorbidity: 0,
      Diabetes: 0,
      CAD: 0,
      Hyperlipidemia: 0,
    }

    filtered.forEach((item) => {
      if (Number(item.Comorbidity) === 1) counts.Comorbidity++
      if (Number(item['Diabetes Mellitus (DM)']) === 1) counts.Diabetes++
      if (Number(item['Coronary Artery Disease (CAD)']) === 1) counts.CAD++
      if (Number(item.Hyperlipidemia) === 1) counts.Hyperlipidemia++
    })

    return Object.keys(counts)
      .map((key) => ({ name: key, value: counts[key] }))
      .filter((item) => item.value > 0)
  }, [filtered])

  /* ================= BAR DATA ================= */
  const clinicalData = useMemo(() => {
    return filtered.map((item, idx) => ({
      name: `P${idx + 1}`,
      BMI: Number(item['Body Mass Index (BMI)']),
      TBW: Number(item['Total Body Water (TBW)']),
      VFR: Number(item['Visceral Fat Rating (VFR)']),
    }))
  }, [filtered])

  if (data.length === 0) return <Loader />

  /* ================= STYLES ================= */
  const cardStyle = {
    background: THEME.card,
    borderRadius: 18,
    padding: 22,
    color: THEME.text,
    boxShadow: '0 10px 25px rgba(56,189,248,0.15)',
  }

  const inputStyle = {
    padding: '8px 12px',
    borderRadius: 8,
    background: THEME.bg,
    color: THEME.text,
    border: `1px solid ${THEME.accent1}`,
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: 30,
        background: `linear-gradient(to bottom, ${THEME.bg}, #020617)`,
      }}
    >
      <h2 style={{ color: THEME.text, fontSize: 28, marginBottom: 25 }}>
        Symptoms & Clinical Data
      </h2>

      {/* ================= FILTERS ================= */}
      <div style={{ ...cardStyle, display: 'flex', gap: 20, marginBottom: 30 }}>
        <div>
          <label>Min Age</label>
          <br />
          <input
            type="number"
            value={minAge}
            onChange={(e) => setMinAge(Number(e.target.value))}
            style={inputStyle}
          />
        </div>

        <div>
          <label>Max Age</label>
          <br />
          <input
            type="number"
            value={maxAge}
            onChange={(e) => setMaxAge(Number(e.target.value))}
            style={inputStyle}
          />
        </div>

        <div>
          <label>Gallstone</label>
          <br />
          <select
            value={gallstone}
            onChange={(e) => setGallstone(e.target.value)}
            style={inputStyle}
          >
            <option value="All">All</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
      </div>

      {/* ================= CHARTS ================= */}
      <div style={{ display: 'flex', gap: 25, flexWrap: 'wrap' }}>
        {/* ===== PIE CHART ===== */}
        <div style={{ ...cardStyle, flex: 1, minWidth: 350 }}>
          <h3 style={{ textAlign: 'center', color: THEME.accent1 }}>Symptoms Prevalence</h3>

          {symptomsData.length === 0 ? (
            <p style={{ textAlign: 'center', marginTop: 40, color: THEME.muted }}>
              No symptom data available for selected filters
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={symptomsData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={45}
                  outerRadius={115}
                  paddingAngle={4}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {symptomsData.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: THEME.card,
                    border: `1px solid ${THEME.accent1}`,
                    color: 'whitesmoke',
                  }}
                />

                <Legend verticalAlign="bottom" wrapperStyle={{ color: THEME.text }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* ===== BAR CHART ===== */}
        <div style={{ ...cardStyle, flex: 1, minWidth: 350 }}>
          <h3 style={{ textAlign: 'center', color: THEME.accent2 }}>Clinical Measures</h3>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={clinicalData}>
              <CartesianGrid stroke={THEME.grid} strokeDasharray="3 3" />

              <XAxis dataKey="name" stroke={THEME.muted} tick={{ fontSize: 12 }} />

              <YAxis stroke={THEME.muted} tick={{ fontSize: 12 }} />

              <Tooltip
                contentStyle={{
                  backgroundColor: THEME.card,
                  border: `1px solid ${THEME.accent3}`,
                  color: THEME.text,
                }}
              />

              <Legend wrapperStyle={{ color: THEME.text }} />

              <Bar dataKey="BMI" fill={THEME.accent1} radius={[8, 8, 0, 0]} />
              <Bar dataKey="TBW" fill={THEME.accent2} radius={[8, 8, 0, 0]} />
              <Bar dataKey="VFR" fill={THEME.accent3} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================= SUMMARY ================= */}
      <div style={{ ...cardStyle, marginTop: 30 }}>
        <h3 style={{ color: THEME.accent3 }}>Analysis & Summary</h3>
        <p>
          Total patients selected: <b>{filtered.length}</b>
        </p>
        <p>Pie chart shows prevalence of major symptoms.</p>
        <p>Bar chart compares BMI, TBW, and VFR.</p>
        <p style={{ fontSize: 12, color: THEME.muted }}>
          *Charts update dynamically based on filters.
        </p>
      </div>
    </div>
  )
}

export default SymptomsClinicalData
