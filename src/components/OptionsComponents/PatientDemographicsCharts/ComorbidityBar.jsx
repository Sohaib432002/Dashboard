// ComorbidityBar.jsx
import { useContext, useMemo, useState } from 'react'
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts'
import { DataContext } from '../../useContext'

// ================= THEME =================
const THEME = {
  bg: '#0f172a', // main background
  card: '#1e293b', // card background
  text: '#e5e7eb', // main text
  muted: '#94a3b8', // axis / border muted
  barColors: ['#38bdf8', '#22c55e'], // gradient or bar colors
}

export default function ComorbidityBar() {
  const [ageRange, setAgeRange] = useState('All')
  const [gender, setGender] = useState('All')
  const { data } = useContext(DataContext)

  // ================= FILTER DATA =================
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      let ageOk = true
      let genderOk = true

      if (ageRange !== 'All') {
        const [min, max] = ageRange.split('-').map(Number)
        ageOk = Number(row.Age) >= min && Number(row.Age) <= max
      }

      if (gender !== 'All') {
        genderOk = gender === 'Male' ? Number(row.Gender) === 0 : Number(row.Gender) === 1
      }

      return ageOk && genderOk
    })
  }, [data, ageRange, gender])

  // ================= CHART DATA =================
  let noCount = 0
  let yesCount = 0
  filteredData.forEach((row) => {
    if (Number(row.Comorbidity) === 0) noCount++
    else yesCount++
  })
  const chartData = [
    { label: 'No', count: noCount },
    { label: 'Yes', count: yesCount },
  ]

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
          <label style={{ marginBottom: 5 }}>Age Range</label>
          <select value={ageRange} onChange={(e) => setAgeRange(e.target.value)} style={inputStyle}>
            <option value="All">All</option>
            <option value="0-20">0-20</option>
            <option value="21-40">21-40</option>
            <option value="41-60">41-60</option>
            <option value="61-80">61-80</option>
            <option value="81-100">81-100</option>
          </select>
        </div>

        <div style={filterItemStyle}>
          <label style={{ marginBottom: 5 }}>Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} style={inputStyle}>
            <option value="All">All</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </div>

      {/* ================= BAR CHART ================= */}
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="label" stroke={THEME.text} />
            <YAxis stroke={THEME.text} />
            <Tooltip
              contentStyle={{
                borderRadius: 10,
                border: `1px solid ${THEME.barColors[0]}`,
                backgroundColor: THEME.card,
                color: THEME.text,
                fontSize: '0.875rem',
              }}
            />
            <Legend wrapperStyle={{ color: THEME.text, fontSize: '0.875rem' }} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
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
