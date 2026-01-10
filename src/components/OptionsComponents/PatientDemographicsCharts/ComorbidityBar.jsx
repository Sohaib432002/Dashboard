// ComorbidityBar.jsx
import { useContext, useMemo, useState } from 'react'
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts'
import { DataContext } from '../../useContext'

// ================= THEME =================
const THEME = {
  bg: '#0f172a',
  card: '#1e293b',
  text: '#e5e7eb',
  muted: '#94a3b8',
  barColors: ['#38bdf8', '#22c55e'],
}

// ================= AGE RANGES =================
const AGE_RANGES = {
  All: [0, 200],
  '0-20': [0, 20],
  '21-40': [21, 40],
  '41-60': [41, 60],
  '61-80': [61, 80],
  '81-100': [81, 100],
}

export default function ComorbidityBar() {
  const { data } = useContext(DataContext)

  const [ageRange, setAgeRange] = useState('All')
  const [gender, setGender] = useState('All')
  const [gallstone, setGallstone] = useState('All') // new gallstone filter

  // ================= FILTER DATA =================
  const filteredData = useMemo(() => {
    const [minAge, maxAge] = AGE_RANGES[ageRange]

    return data.filter((row) => {
      const age = Number(row.Age)
      const genderVal = Number(row.Gender)
      const gallVal = Number(row['Gallstone Status']) // assuming column name is 'Gallstone'
      console.log(gallVal, 'hai')
      const ageOk = age >= minAge && age <= maxAge
      const genderOk =
        gender === 'All' ? true : gender === 'Male' ? genderVal === 0 : genderVal === 1

      const gallstoneOk =
        gallstone === 'All' ? true : gallstone === 'Yes' ? gallVal === 1 : gallVal === 0

      return ageOk && genderOk && gallstoneOk
    })
  }, [data, ageRange, gender, gallstone])

  // ================= CHART DATA =================
  const chartData = [
    {
      label: 'No Comorbidity',
      count: filteredData.filter((r) => Number(r.Comorbidity) === 0).length,
    },
    { label: 'Comorbidity', count: filteredData.filter((r) => Number(r.Comorbidity) === 1).length },
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
  }

  return (
    <div style={cardStyle}>
      {/* ================= FILTERS ================= */}
      <div style={filterContainerStyle}>
        {/* Age */}
        <div style={filterItemStyle}>
          <label>Age Range</label>
          <select value={ageRange} onChange={(e) => setAgeRange(e.target.value)} style={inputStyle}>
            {Object.keys(AGE_RANGES).map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Gender */}
        <div style={filterItemStyle}>
          <label>Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} style={inputStyle}>
            <option value="All">All</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Gallstone */}
        <div style={filterItemStyle}>
          <label>Gallstone</label>
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

      {/* ================= BAR CHART ================= */}
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="label" stroke={THEME.text} />
            <YAxis stroke={THEME.text} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {chartData.map((_, index) => (
                <Cell key={index} fill={THEME.barColors[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
