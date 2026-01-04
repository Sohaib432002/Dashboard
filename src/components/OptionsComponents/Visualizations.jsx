// Visualizations.jsx
import { useContext, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { DataContext } from '../useContext'

// ================= THEME =================
const THEME = {
  bg: '#0f172a',
  card: '#1e293b',
  text: '#e5e7eb',
  muted: '#94a3b8',
  barColors: ['#f43f5e', '#f97316', '#6366f1', '#14b8a6', '#facc15'],
  lineColors: ['#38bdf8', '#f472b6', '#a855f7'],
  pieColors: ['#22c55e', '#eab308', '#3b82f6', '#f97316', '#8b5cf6'],
}

const cardStyle = {
  background: THEME.card,
  padding: 22,
  borderRadius: 16,
  boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
  marginTop: 28,
  color: THEME.text,
  border: '1px solid rgba(255,255,255,0.08)',
}

// ===== PIE LABEL FUNCTION =====
const renderPieLabel = ({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`

const Visualizations = () => {
  // ================= FILTER STATES =================
  const [minAge, setMinAge] = useState(20)
  const [maxAge, setMaxAge] = useState(80)
  const [gender, setGender] = useState('all')
  const [gallstone, setGallstone] = useState('all') // NEW FILTER

  const { data } = useContext(DataContext)

  // ================= FILTER LOGIC =================
  const filteredData = useMemo(
    () =>
      data.filter((item) => {
        const age = Number(item['Age'] || 0)

        let g = item['Gender']
        if (g === '0' || g?.toLowerCase() === 'male') g = '0'
        if (g === '1' || g?.toLowerCase() === 'female') g = '1'

        let gs = item['Gallstone Status'] // new
        if (gs === '1' || gs?.toLowerCase() === 'yes') gs = '1'
        if (gs === '0' || gs?.toLowerCase() === 'no') gs = '0'

        return (
          age >= minAge &&
          age <= maxAge &&
          (gender === 'all' || g === gender) &&
          (gallstone === 'all' || gs === gallstone)
        )
      }),
    [data, minAge, maxAge, gender, gallstone]
  )

  // ================= CHART DATA =================
  const makeChartData = (key) =>
    filteredData.map((item, index) => ({
      id: index + 1,
      value: Number(item[key] || 0),
    }))

  const bmiData = makeChartData('Body Mass Index (BMI)')
  const glucoseData = makeChartData('Glucose')
  const cholesterolData = makeChartData('Total Cholesterol (TC)')

  const fatData = [
    {
      name: 'Visceral Fat',
      value: filteredData.reduce((acc, i) => acc + Number(i['Visceral Fat Rating (VFR)'] || 0), 0),
    },
    {
      name: 'Total Fat',
      value: filteredData.reduce((acc, i) => acc + Number(i['Total Fat Content (TFC)'] || 0), 0),
    },
  ]

  const muscleData = [
    {
      name: 'Muscle Mass',
      value: filteredData.reduce((acc, i) => acc + Number(i['Muscle Mass (MM)'] || 0), 0),
    },
    {
      name: 'Lean Mass',
      value: filteredData.reduce((acc, i) => acc + Number(i['Lean Mass (LM) (%)'] || 0), 0),
    },
  ]

  return (
    <div style={{ padding: 25, background: THEME.bg, minHeight: '100vh' }}>
      {/* ================= HEADER ================= */}
      <div
        style={{
          padding: '25px 30px',
          background: THEME.card,
          color: THEME.text,
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
        }}
      >
        <h1 style={{ fontSize: 34 }}>Patient Visualizations</h1>
        <p>Interactive analysis of BMI, Glucose, Cholesterol, Fat & Muscle Mass</p>
      </div>

      {/* ================= FILTERS ================= */}
      <div style={cardStyle}>
        <h2>Filters</h2>
        <div style={{ display: 'flex', gap: 30, flexWrap: 'wrap', marginTop: 10 }}>
          <div>
            <label>Min Age</label>
            <input
              type="number"
              value={minAge}
              onChange={(e) => setMinAge(Number(e.target.value))}
              style={{
                marginLeft: 10,
                padding: 8,
                borderRadius: 8,
                border: `1px solid ${THEME.muted}`,
                background: THEME.bg,
                color: THEME.text,
              }}
            />
          </div>

          <div>
            <label>Max Age</label>
            <input
              type="number"
              value={maxAge}
              onChange={(e) => setMaxAge(Number(e.target.value))}
              style={{
                marginLeft: 10,
                padding: 8,
                borderRadius: 8,
                border: `1px solid ${THEME.muted}`,
                background: THEME.bg,
                color: THEME.text,
              }}
            />
          </div>

          <div>
            <label>Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              style={{
                marginLeft: 10,
                padding: 8,
                borderRadius: 8,
                border: `1px solid ${THEME.muted}`,
                background: THEME.bg,
                color: THEME.text,
              }}
            >
              <option value="all">All</option>
              <option value="0">Male</option>
              <option value="1">Female</option>
            </select>
          </div>

          <div>
            <label>Gallstone</label>
            <select
              value={gallstone}
              onChange={(e) => setGallstone(e.target.value)}
              style={{
                marginLeft: 10,
                padding: 8,
                borderRadius: 8,
                border: `1px solid ${THEME.muted}`,
                background: THEME.bg,
                color: THEME.text,
              }}
            >
              <option value="all">All</option>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
          </div>
        </div>

        {/* ================= PATIENT COUNT LABEL ================= */}
        <div style={{ marginTop: 15, fontWeight: 600, color: THEME.text }}>
          Total Patients: {filteredData.length}
        </div>
      </div>

      {/* ================= BMI BAR ================= */}
      <div style={cardStyle}>
        <h2>BMI Trend</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={bmiData}>
            <CartesianGrid strokeDasharray="3 3" stroke={THEME.muted} />
            <XAxis dataKey="id" stroke={THEME.text} />
            <YAxis stroke={THEME.text} />
            <Tooltip contentStyle={{ background: THEME.card, borderRadius: 10 }} />
            <Bar dataKey="value">
              {bmiData.map((_, i) => (
                <Cell key={i} fill={THEME.barColors[i % THEME.barColors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ================= GLUCOSE LINE ================= */}
      <div style={cardStyle}>
        <h2>Glucose Levels</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={glucoseData}>
            <CartesianGrid strokeDasharray="3 3" stroke={THEME.muted} />
            <XAxis dataKey="id" stroke={THEME.text} />
            <YAxis stroke={THEME.text} />
            <Tooltip contentStyle={{ background: THEME.card, borderRadius: 10 }} />
            <Line type="monotone" dataKey="value" stroke={THEME.lineColors[0]} strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ================= CHOLESTEROL LINE ================= */}
      <div style={cardStyle}>
        <h2>Total Cholesterol</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={cholesterolData}>
            <CartesianGrid strokeDasharray="3 3" stroke={THEME.muted} />
            <XAxis dataKey="id" stroke={THEME.text} />
            <YAxis stroke={THEME.text} />
            <Tooltip contentStyle={{ background: THEME.card, borderRadius: 10 }} />
            <Line type="monotone" dataKey="value" stroke={THEME.lineColors[1]} strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ================= FAT PIE ================= */}
      <div style={cardStyle}>
        <h2>Fat Distribution</h2>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={fatData} dataKey="value" outerRadius={90} label={renderPieLabel}>
              {fatData.map((_, i) => (
                <Cell key={i} fill={THEME.pieColors[i % THEME.pieColors.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: THEME.card, borderRadius: 10 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* ================= MUSCLE PIE ================= */}
      <div style={cardStyle}>
        <h2>Muscle & Lean Mass</h2>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={muscleData} dataKey="value" outerRadius={90} label={renderPieLabel}>
              {muscleData.map((_, i) => (
                <Cell key={i} fill={THEME.pieColors[(i + 2) % THEME.pieColors.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: THEME.card, borderRadius: 10 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Visualizations
