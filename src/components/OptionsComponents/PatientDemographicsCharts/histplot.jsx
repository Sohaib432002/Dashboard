// Histogram.jsx
import { useContext, useState } from 'react'
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts'
import { DataContext } from '../../useContext'

// ================= THEME =================
const THEME = {
  bg: '#0f172a', // page background
  card: '#1e293b', // card background
  text: '#e5e7eb', // main text
  muted: '#94a3b8', // axis / border
  barColors: ['#38bdf8', '#1c92f2'], // gradient / bars
}

const Histogram = () => {
  const [minAge, setMinAge] = useState(0)
  const [maxAge, setMaxAge] = useState(100)
  const { data } = useContext(DataContext)

  // ================= AGE BINS =================
  const ageBins = Array.from({ length: 10 }, (_, i) => ({
    range: `${i * 10}-${i * 10 + 10}`,
    start: i * 10,
    end: i * 10 + 10,
    count: 0,
  }))

  data.forEach((person) => {
    const age = parseInt(person['Age'])
    if (!isNaN(age)) {
      const binIndex = Math.floor(age / 10)
      if (ageBins[binIndex]) ageBins[binIndex].count++
    }
  })

  const chartData = ageBins.filter((bin) => bin.start >= minAge && bin.end <= maxAge)

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

  const filterItemStyle = { display: 'flex', flexDirection: 'column', width: 150 }

  const inputStyle = {
    padding: '8px 12px',
    borderRadius: 8,
    background: THEME.bg,
    color: THEME.text,
    border: `1px solid ${THEME.muted}`,
    outline: 'none',
    width: '100%',
  }

  const titleStyle = {
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: 600,
    color: THEME.text,
    fontSize: 16,
  }

  return (
    <div style={cardStyle}>
      {/* ================= FILTERS ================= */}
      <div style={filterContainerStyle}>
        <div style={filterItemStyle}>
          <label style={{ marginBottom: 5 }}>Min Age</label>
          <input
            type="number"
            value={minAge}
            onChange={(e) => setMinAge(parseInt(e.target.value))}
            style={inputStyle}
            min={0}
          />
        </div>

        <div style={filterItemStyle}>
          <label style={{ marginBottom: 5 }}>Max Age</label>
          <input
            type="number"
            value={maxAge}
            onChange={(e) => setMaxAge(parseInt(e.target.value))}
            style={inputStyle}
            min={0}
          />
        </div>
      </div>

      {/* ================= BAR CHART ================= */}
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="range" stroke={THEME.text} tick={{ fontSize: 12 }} />
            <YAxis stroke={THEME.text} tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                borderRadius: 10,
                padding: 10,
                backgroundColor: THEME.card,
                border: `1px solid ${THEME.barColors[0]}`,
                color: THEME.text,
                fontSize: '0.875rem',
              }}
            />
            <Legend wrapperStyle={{ color: THEME.text, fontSize: 12 }} />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {chartData.map((_, index) => (
                <Cell key={index} fill={THEME.barColors[index % THEME.barColors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Histogram
