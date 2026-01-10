// BMIPieChart.jsx
import { useContext, useEffect, useState } from 'react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { DataContext } from '../../useContext'

// ================= THEME =================
const THEME = {
  bg: '#0f172a',
  card: '#1e293b',
  text: '#e5e7eb',
  muted: '#94a3b8',
  pieColors: ['#38bdf8', '#22c55e', '#f97316', '#a855f7'],
}

const BMIPieChart = () => {
  const { data } = useContext(DataContext)

  const [minAge, setMinAge] = useState(0)
  const [maxAge, setMaxAge] = useState(100)
  const [gender, setGender] = useState('all')
  const [stoneFilter, setStoneFilter] = useState('all')
  const [filteredData, setFilteredData] = useState([])

  // ================= FILTER DATA =================
  useEffect(() => {
    const temp = data.filter((person) => {
      const age = Number(person.Age)
      if (isNaN(age)) return false
      if (age < minAge || age > maxAge) return false

      if (gender !== 'all' && Number(person.Gender) !== Number(gender)) {
        return false
      }

      if (stoneFilter === 'yes') return Number(person['Gallstone Status']) === 1
      if (stoneFilter === 'no') return Number(person['Gallstone Status']) === 0

      return true
    })

    setFilteredData(temp)
  }, [minAge, maxAge, gender, stoneFilter, data])

  // ================= BMI CATEGORIES =================
  const bmiBins = {
    Underweight: 0,
    Normal: 0,
    Overweight: 0,
    Obese: 0,
  }

  filteredData.forEach((item) => {
    const bmi = Number(item.BMI || item['Body Mass Index (BMI)'])
    if (!isNaN(bmi)) {
      if (bmi < 18.5) bmiBins.Underweight++
      else if (bmi < 25) bmiBins.Normal++
      else if (bmi < 30) bmiBins.Overweight++
      else bmiBins.Obese++
    }
  })

  const chartData = Object.entries(bmiBins).map(([name, value]) => ({
    name,
    value,
  }))

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

  const filterItemStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: 150,
  }

  return (
    <div style={cardStyle}>
      {/* ================= FILTERS ================= */}
      <div style={filterContainerStyle}>
        <div style={filterItemStyle}>
          <label>Min Age</label>
          <input
            type="number"
            value={minAge}
            onChange={(e) => setMinAge(Number(e.target.value))}
            style={inputStyle}
          />
        </div>

        <div style={filterItemStyle}>
          <label>Max Age</label>
          <input
            type="number"
            value={maxAge}
            onChange={(e) => setMaxAge(Number(e.target.value))}
            style={inputStyle}
          />
        </div>

        <div style={filterItemStyle}>
          <label>Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} style={inputStyle}>
            <option value="all">All</option>
            <option value="0">Male</option>
            <option value="1">Female</option>
          </select>
        </div>

        <div style={filterItemStyle}>
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

      {/* ================= PIE CHART ================= */}
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius="80%"
              label={({ name, percent }) =>
                percent > 0 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''
              }
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={THEME.pieColors[index % THEME.pieColors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default BMIPieChart
