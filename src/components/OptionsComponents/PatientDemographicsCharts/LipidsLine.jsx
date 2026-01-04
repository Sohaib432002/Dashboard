// LipidsLine.jsx
import { useMemo, useState } from 'react'
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

// ================= THEME =================
const THEME = {
  bg: '#0f172a', // page background
  card: '#1e293b', // card background
  text: '#e5e7eb', // main text
  muted: '#94a3b8', // axis / border
  lineColors: ['#38bdf8', '#00a3e0', '#0056b3', '#000046'], // TC, LDL, HDL, Triglyceride
}

export default function LipidsLine({ data }) {
  const [ageRange, setAgeRange] = useState('All')
  const [gender, setGender] = useState('All')

  const AGE_OPTIONS = ['All', '0-20', '21-40', '41-60', '61-80', '81-100']
  const GENDER_OPTIONS = ['All', 'Male', 'Female']

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

  const chartData = filteredData.map((row, index) => ({
    index: index + 1,
    TC: row['Total Cholesterol (TC)'],
    LDL: row.LDL,
    HDL: row.HDL,
    Triglyceride: row.Triglyceride,
  }))

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
      {/* ================= HEADER ================= */}
      <div style={titleStyle}>Lipid Profile Trends</div>

      {/* ================= FILTERS ================= */}
      <div style={filterContainerStyle}>
        <div style={filterItemStyle}>
          <label style={{ marginBottom: 5 }}>Age Range</label>
          <select value={ageRange} onChange={(e) => setAgeRange(e.target.value)} style={inputStyle}>
            {AGE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div style={filterItemStyle}>
          <label style={{ marginBottom: 5 }}>Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} style={inputStyle}>
            {GENDER_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ================= LINE CHART ================= */}
      <div style={{ width: '100%', height: 360 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="index" stroke={THEME.text} tick={{ fill: THEME.text, fontSize: 12 }} />
            <YAxis stroke={THEME.text} tick={{ fill: THEME.text, fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                borderRadius: 10,
                padding: 10,
                backgroundColor: THEME.card,
                border: `1px solid ${THEME.lineColors[0]}`,
                color: THEME.text,
                fontSize: '0.875rem',
              }}
            />
            <Legend wrapperStyle={{ color: THEME.text, fontWeight: 600, fontSize: 12 }} />

            <Line type="monotone" dataKey="TC" stroke={THEME.lineColors[0]} strokeWidth={2} />
            <Line type="monotone" dataKey="LDL" stroke={THEME.lineColors[1]} strokeWidth={2} />
            <Line type="monotone" dataKey="HDL" stroke={THEME.lineColors[2]} strokeWidth={2} />
            <Line
              type="monotone"
              dataKey="Triglyceride"
              stroke={THEME.lineColors[3]}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
