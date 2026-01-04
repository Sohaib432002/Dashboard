import { useContext, useMemo, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { DataContext } from '../useContext'

/* ================= SAME THEME ================= */
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

/* ===== STYLES (ONLY COLORS CHANGED) ===== */
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

const LaboratoryResults = () => {
  const [minAge, setMinAge] = useState(0)
  const [maxAge, setMaxAge] = useState(100)
  const [gender, setGender] = useState('all')
  const [diabetes, setDiabetes] = useState('all')
  const [comorbidity, setComorbidity] = useState('all')
  const [gallstone, setGallstone] = useState('all') // NEW FILTER

  const { data } = useContext(DataContext)

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const age = Number(item['Age'] || 0)

      let genderValue = item['Gender']
      if (genderValue === '0' || genderValue?.toLowerCase() === 'male') genderValue = '0'
      if (genderValue === '1' || genderValue?.toLowerCase() === 'female') genderValue = '1'

      const diabetesValue = Number(item['Diabetes Mellitus (DM)'] || 0)
      const comorbValue = Number(item['Comorbidity'] || 0)

      let gsValue = item['Gallstone Status']
      if (gsValue === '1' || gsValue?.toLowerCase() === 'yes') gsValue = '1'
      if (gsValue === '0' || gsValue?.toLowerCase() === 'no') gsValue = '0'

      return (
        age >= minAge &&
        age <= maxAge &&
        (gender === 'all' || genderValue === gender) &&
        (diabetes === 'all' || diabetesValue === Number(diabetes)) &&
        (comorbidity === 'all' || comorbValue === Number(comorbidity)) &&
        (gallstone === 'all' || gsValue === gallstone)
      )
    })
  }, [data, minAge, maxAge, gender, diabetes, comorbidity, gallstone])

  const makeChartData = (key) =>
    filteredData.map((item, index) => ({
      id: index + 1,
      value: Number(item[key] || 0),
    }))

  const glucoseData = useMemo(() => makeChartData('Glucose'), [filteredData])
  const cholesterolData = useMemo(() => makeChartData('Total Cholesterol (TC)'), [filteredData])
  const ldlData = useMemo(() => makeChartData('Low Density Lipoprotein (LDL)'), [filteredData])
  const hdlData = useMemo(() => makeChartData('High Density Lipoprotein (HDL)'), [filteredData])

  return (
    <div
      style={{
        padding: 25,
        background: `linear-gradient(to bottom, ${THEME.bg}, #020617)`,
        minHeight: '100vh',
      }}
    >
      <h2 style={{ color: THEME.text, fontSize: 28, marginBottom: 20 }}>Laboratory Results</h2>

      {/* FILTERS */}
      <div style={{ ...cardStyle, display: 'flex', flexWrap: 'wrap', gap: 20 }}>
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

        <div>
          <label>Diabetes (DM):</label>
          <select
            value={diabetes}
            onChange={(e) => setDiabetes(e.target.value)}
            style={filterInputStyle}
          >
            <option value="all">All</option>
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </div>

        <div>
          <label>Comorbidity:</label>
          <select
            value={comorbidity}
            onChange={(e) => setComorbidity(e.target.value)}
            style={filterInputStyle}
          >
            <option value="all">All</option>
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </div>

        <div>
          <label>Gallstone:</label>
          <select
            value={gallstone}
            onChange={(e) => setGallstone(e.target.value)}
            style={filterInputStyle}
          >
            <option value="all">All</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>
      </div>

      {/* PATIENT COUNT */}
      <div style={{ margin: '15px 0', fontWeight: 600, color: THEME.text }}>
        Total Patients: {filteredData.length}
      </div>

      {/* CHARTS */}
      {[
        { title: 'Glucose Levels', data: glucoseData, color: THEME.accent1 },
        { title: 'Total Cholesterol (TC)', data: cholesterolData, color: THEME.accent2 },
        { title: 'LDL', data: ldlData, color: THEME.accent3 },
        { title: 'HDL', data: hdlData, color: THEME.accent4 },
      ].map((chart, idx) => (
        <div key={idx} style={cardStyle}>
          <h3 style={{ color: chart.color }}>{chart.title}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chart.data}>
              <CartesianGrid stroke={THEME.grid} strokeDasharray="3 3" />
              <XAxis dataKey="id" stroke={THEME.muted} />
              <YAxis stroke={THEME.muted} />
              <Tooltip
                contentStyle={{
                  backgroundColor: THEME.card,
                  border: `1px solid ${chart.color}`,
                  color: THEME.text,
                }}
              />
              <Line type="monotone" dataKey="value" stroke={chart.color} strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  )
}

export default LaboratoryResults
