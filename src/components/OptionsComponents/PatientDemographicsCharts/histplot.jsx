// Histogram.jsx
import { useContext, useState } from 'react'
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts'
import { DataContext } from '../../useContext'

// ================= THEME =================
const THEME = {
  bg: '#0f172a',
  card: '#1e293b',
  text: '#e5e7eb',
  muted: '#94a3b8',
  barColors: ['#38bdf8', '#1c92f2'],
}

const Histogram = () => {
  const { data } = useContext(DataContext)

  const [minAge, setMinAge] = useState(0)
  const [maxAge, setMaxAge] = useState(100)
  const [stoneFilter, setStoneFilter] = useState('all')

  // ================= STEP 1: FILTER DATA =================
  const filteredData = data.filter((person) => {
    const age = Number(person.Age)
    if (isNaN(age)) return false
    if (age < minAge || age > maxAge) return false

    if (stoneFilter === 'yes') return person['Gallstone Status'] === '1'
    if (stoneFilter === 'no') return person['Gallstone Status'] === '0'

    return true
  })

  // ================= STEP 2: CREATE AGE BINS =================
  const ageBins = Array.from({ length: 10 }, (_, i) => ({
    range: `${i * 10}-${i * 10 + 9}`,
    count: 0,
  }))

  filteredData.forEach((person) => {
    const age = Number(person.Age)
    const index = Math.floor(age / 10)
    if (ageBins[index]) ageBins[index].count++
  })

  // ================= STYLES =================
  const cardStyle = {
    background: THEME.card,
    borderRadius: 16,
    padding: 20,
    color: THEME.text,
    boxShadow: '0 8px 20px rgba(56,189,248,0.15)',
  }

  const filterContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 20,
    justifyContent: 'center',
  }

  const inputStyle = {
    padding: '8px 12px',
    borderRadius: 8,
    background: THEME.bg,
    color: THEME.text,
    border: `1px solid ${THEME.muted}`,
  }

  return (
    <div style={cardStyle}>
      {/* ================= FILTERS ================= */}
      <div style={filterContainerStyle}>
        <div>
          <label>Min Age</label>
          <input
            type="number"
            value={minAge}
            min={0}
            onChange={(e) => setMinAge(Number(e.target.value))}
            style={inputStyle}
          />
        </div>

        <div>
          <label>Max Age</label>
          <input
            type="number"
            value={maxAge}
            min={0}
            onChange={(e) => setMaxAge(Number(e.target.value))}
            style={inputStyle}
          />
        </div>

        <div>
          <label>Gallstone</label>
          <select
            value={stoneFilter}
            onChange={(e) => setStoneFilter(e.target.value)}
            style={inputStyle}
          >
            <option value="all">All</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
      </div>

      {/* ================= BAR CHART ================= */}
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer>
          <BarChart data={ageBins}>
            <XAxis dataKey="range" stroke={THEME.text} />
            <YAxis stroke={THEME.text} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {ageBins.map((_, i) => (
                <Cell key={i} fill={THEME.barColors[i % THEME.barColors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Histogram
