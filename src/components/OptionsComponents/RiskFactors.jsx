import { useContext, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from 'recharts'
import { DataContext } from '../useContext'

// ================= SAME THEME =================
const THEME = {
  bg: '#0f172a',
  card: '#020617',
  grid: '#1e293b',
  text: '#e5e7eb',
  muted: '#94a3b8',
  accent1: '#38bdf8',
  accent2: '#22c55e',
  accent3: '#f97316',
  accent4: '#a855f7',
}

// ================= STYLES =================
const cardStyle = {
  background: THEME.card,
  padding: 25,
  borderRadius: 16,
  boxShadow: '0 10px 25px rgba(56,189,248,0.15)',
  color: THEME.text,
  marginBottom: 30,
}

const filterInputStyle = {
  padding: '8px 12px',
  borderRadius: 8,
  marginRight: 15,
  background: THEME.bg,
  color: THEME.text,
  border: `1px solid ${THEME.accent1}`,
}

const RiskFactors = () => {
  const [minAge, setMinAge] = useState(20)
  const [maxAge, setMaxAge] = useState(80)
  const [gender, setGender] = useState('all')
  const [gallstone, setGallstone] = useState('all') // New state for Gallstone filter

  const { data } = useContext(DataContext)

  // ================= FILTERED DATA =================
  const filteredData = useMemo(
    () =>
      data.filter((item) => {
        const age = Number(item['Age'] || 0)

        let genderValue = item['Gender']
        if (genderValue === '0' || genderValue?.toLowerCase() === 'male') genderValue = '0'
        if (genderValue === '1' || genderValue?.toLowerCase() === 'female') genderValue = '1'

        let gallstoneValue = item['Gallstone'] || item['Gallstone Status'] || '0'
        if (gallstoneValue === 'Yes') gallstoneValue = '1'
        if (gallstoneValue === 'No') gallstoneValue = '0'

        const ageOk = age >= minAge && age <= maxAge
        const genderOk = gender === 'all' || genderValue === gender
        const gallstoneOk =
          gallstone === 'all' ||
          (gallstone === 'yes' && gallstoneValue === '1') ||
          (gallstone === 'no' && gallstoneValue === '0')

        return ageOk && genderOk && gallstoneOk
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
  const cholesterolData = makeChartData('Total Cholesterol (TC)')
  const glucoseData = makeChartData('Glucose')

  return (
    <div
      style={{
        padding: 25,
        background: `linear-gradient(to bottom, ${THEME.bg}, #020617)`,
        minHeight: '100vh',
      }}
    >
      {/* ================= HEADER ================= */}
      <div style={{ ...cardStyle, padding: '25px 30px', boxShadow: '0 4px 20px rgba(0,0,0,0.35)' }}>
        <h1 style={{ fontSize: 34, fontWeight: 600 }}>Risk Factors Analysis</h1>
        <p style={{ fontSize: 17, opacity: 0.9, lineHeight: 1.5 }}>
          Visual breakdown of BMI, Cholesterol, and Glucose levels to identify health-related risk
          factors among patients.
        </p>
      </div>

      {/* ================= FILTERS ================= */}
      <div style={cardStyle}>
        <h2 style={{ marginBottom: 12 }}>Filters</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <label>Min Age:</label>
            <input
              type="number"
              value={minAge}
              onChange={(e) => setMinAge(Number(e.target.value))}
              style={filterInputStyle}
            />
          </div>

          <div>
            <label>Max Age:</label>
            <input
              type="number"
              value={maxAge}
              onChange={(e) => setMaxAge(Number(e.target.value))}
              style={filterInputStyle}
            />
          </div>

          <div>
            <label>Gender:</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              style={filterInputStyle}
            >
              <option value="all">All</option>
              <option value="0">Male</option>
              <option value="1">Female</option>
            </select>
          </div>

          {/* ================= GALLSTONE FILTER ================= */}
          <div>
            <label>Gallstone:</label>
            <select
              value={gallstone}
              onChange={(e) => setGallstone(e.target.value)}
              style={filterInputStyle}
            >
              <option value="all">All</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>
      </div>

      {/* ================= BMI BAR ================= */}
      <div style={cardStyle}>
        <h2 style={{ color: THEME.accent1 }}>BMI (Body Mass Index)</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={bmiData}>
            <CartesianGrid stroke={THEME.grid} strokeDasharray="3 3" />
            <XAxis dataKey="id" stroke={THEME.muted} />
            <YAxis stroke={THEME.muted} />
            <Tooltip
              contentStyle={{
                backgroundColor: THEME.card,
                border: `1px solid ${THEME.accent1}`,
                color: THEME.text,
              }}
            />
            <Bar dataKey="value">
              {bmiData.map((_, i) => (
                <Cell
                  key={i}
                  fill={[THEME.accent1, THEME.accent2, THEME.accent3, THEME.accent4][i % 4]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ================= CHOLESTEROL LINE ================= */}
      <div style={cardStyle}>
        <h2 style={{ color: THEME.accent2 }}>Total Cholesterol</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={cholesterolData}>
            <CartesianGrid stroke={THEME.grid} strokeDasharray="3 3" />
            <XAxis dataKey="id" stroke={THEME.muted} />
            <YAxis stroke={THEME.muted} />
            <Tooltip
              contentStyle={{
                backgroundColor: THEME.card,
                border: `1px solid ${THEME.accent2}`,
                color: THEME.text,
              }}
            />
            <Line type="monotone" dataKey="value" stroke={THEME.accent2} strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ================= GLUCOSE LINE ================= */}
      <div style={cardStyle}>
        <h2 style={{ color: THEME.accent3 }}>Glucose Levels</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={glucoseData}>
            <CartesianGrid stroke={THEME.grid} strokeDasharray="3 3" />
            <XAxis dataKey="id" stroke={THEME.muted} />
            <YAxis stroke={THEME.muted} />
            <Tooltip
              contentStyle={{
                backgroundColor: THEME.card,
                border: `1px solid ${THEME.accent3}`,
                color: THEME.text,
              }}
            />
            <Line type="monotone" dataKey="value" stroke={THEME.accent3} strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default RiskFactors
