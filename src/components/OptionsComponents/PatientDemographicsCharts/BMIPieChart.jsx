// BMIPieChart.jsx
import { useContext, useEffect, useState } from 'react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { DataContext } from '../../useContext'

// ================= THEME =================
const THEME = {
  bg: '#0f172a', // main background
  card: '#1e293b', // card background
  text: '#e5e7eb', // main text
  muted: '#94a3b8', // axis / border muted
  pieColors: ['#38bdf8', '#22c55e', '#f97316', '#a855f7'], // pie slices
}

const BMIPieChart = () => {
  const [minAge, setMinAge] = useState(0)
  const [maxAge, setMaxAge] = useState(100)
  const [gender, setGender] = useState('all')
  const [filteredData, setFilteredData] = useState([])
  const { data } = useContext(DataContext)

  // ================= FILTER DATA =================
  useEffect(() => {
    let tempData = data.filter((d) => Number(d.Age) >= minAge && Number(d.Age) <= maxAge)
    if (gender !== 'all') {
      tempData = tempData.filter((d) => Number(d.Gender) === Number(gender))
    }
    setFilteredData(tempData)
  }, [minAge, maxAge, gender, data])

  // ================= BMI CATEGORIES =================
  const bmiBins = { Underweight: 0, Normal: 0, Overweight: 0, Obese: 0 }
  filteredData.forEach((item) => {
    const bmi = Number(item['Body Mass Index (BMI)'])
    if (!isNaN(bmi)) {
      if (bmi < 18.5) bmiBins.Underweight++
      else if (bmi < 25) bmiBins.Normal++
      else if (bmi < 30) bmiBins.Overweight++
      else bmiBins.Obese++
    }
  })
  const chartData = Object.entries(bmiBins).map(([name, value]) => ({ name, value }))

  // ================= STYLES =================
  const cardStyle = {
    background: THEME.card,
    borderRadius: 16,
    padding: 20,
    color: THEME.text,
    boxShadow: '0 8px 20px rgba(56,189,248,0.15)',
  }

  const inputStyle = {
    padding: '8px 12px',
    borderRadius: 8,
    background: THEME.bg,
    color: THEME.text,
    border: `1px solid ${THEME.muted}`,
    outline: 'none',
    width: '100%',
  }

  const filterContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 20,
    justifyContent: 'center',
  }

  const filterItemStyle = { display: 'flex', flexDirection: 'column', width: 150 }

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
            onChange={(e) => setMinAge(Number(e.target.value))}
            style={inputStyle}
          />
        </div>

        <div style={filterItemStyle}>
          <label style={{ marginBottom: 5 }}>Max Age</label>
          <input
            type="number"
            value={maxAge}
            onChange={(e) => setMaxAge(Number(e.target.value))}
            style={inputStyle}
          />
        </div>

        <div style={filterItemStyle}>
          <label style={{ marginBottom: 5 }}>Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} style={inputStyle}>
            <option value="all">All</option>
            <option value="0">Male</option>
            <option value="1">Female</option>
          </select>
        </div>
      </div>

      {/* ================= PIE CHART ================= */}
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius="80%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={THEME.pieColors[index % THEME.pieColors.length]}
                  stroke={THEME.bg}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: 10,
                border: `1px solid ${THEME.accent1}`,
                backgroundColor: THEME.card,
                color: THEME.text,
                fontSize: '0.875rem',
              }}
            />
            <Legend wrapperStyle={{ color: THEME.text, fontSize: '0.875rem' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default BMIPieChart
