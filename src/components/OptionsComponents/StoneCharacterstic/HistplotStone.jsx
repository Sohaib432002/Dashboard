import { useContext, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart as RePieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { DataContext } from '../../useContext'

// ================= THEME COLORS (from Visualizations.jsx) =================
const THEME = {
  bg: '#0f172a', // main background
  card: '#1e293b', // card background
  text: '#e5e7eb', // text color
  muted: '#94a3b8', // grid lines / borders
  barColors: ['#f43f5e', '#f97316', '#6366f1', '#14b8a6', '#facc15'],
  pieColors: ['#22c55e', '#eab308', '#3b82f6', '#f97316', '#8b5cf6'],
}

// ================= STONE STATUS PIE =================
const StoneStatusPie = ({ data }) => {
  const chartData = useMemo(() => {
    const counts = { Yes: 0, No: 0 }
    data.forEach((item) => {
      const status = String(item['Gallstone Status']).toLowerCase()
      if (status === '1' || status === 'yes') counts.Yes++
      else counts.No++
    })
    return [
      { name: 'Yes', value: counts.Yes },
      { name: 'No', value: counts.No },
    ]
  }, [data])

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RePieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius="70%"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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
              padding: 10,
              backgroundColor: THEME.card,
              border: `1px solid ${THEME.barColors[0]}`,
              color: THEME.text,
            }}
          />
          <Legend wrapperStyle={{ color: THEME.text }} verticalAlign="bottom" />
        </RePieChart>
      </ResponsiveContainer>
    </div>
  )
}

// ================= HISTOGRAM + PIE COMBO =================
const HistplotStone = () => {
  const [minAge, setMinAge] = useState(0)
  const [maxAge, setMaxAge] = useState(100)
  const { data } = useContext(DataContext)

  const filtered = useMemo(() => {
    if (!data || data.length === 0) return []
    return data.filter((item) => {
      const age = Number(item.Age)
      return !isNaN(age) && age >= minAge && age <= maxAge
    })
  }, [data, minAge, maxAge])

  const chartData = useMemo(() => {
    let yesCount = 0
    let noCount = 0
    filtered.forEach((item) => {
      const status = String(item['Gallstone Status']).toLowerCase()
      if (status === '1' || status === 'yes') yesCount++
      else noCount++
    })
    return [
      { status: 'Yes', count: yesCount },
      { status: 'No', count: noCount },
    ]
  }, [filtered])

  const cardStyle = {
    background: THEME.card,
    borderRadius: 16,
    padding: 20,
    color: THEME.text,
    boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  }

  const filterContainerStyle = {
    display: 'flex',
    gap: 15,
    flexWrap: 'wrap',
    justifyContent: 'center',
  }
  const filterItemStyle = { display: 'flex', flexDirection: 'column', width: 150 }
  const inputStyle = {
    padding: '8px 12px',
    borderRadius: 8,
    background: `${THEME.bg}80`,
    color: THEME.text,
    border: `1px solid ${THEME.muted}`,
    outline: 'none',
  }
  const titleStyle = { textAlign: 'center', fontSize: 18, fontWeight: 600 }

  return (
    <div style={cardStyle}>
      <div style={titleStyle}>Gallstone Status Distribution by Age</div>

      {/* Filters */}
      <div style={filterContainerStyle}>
        <div style={filterItemStyle}>
          <label>Min Age</label>
          <input
            type="number"
            value={minAge}
            onChange={(e) => setMinAge(Number(e.target.value) || 0)}
            style={inputStyle}
            min={0}
          />
        </div>
        <div style={filterItemStyle}>
          <label>Max Age</label>
          <input
            type="number"
            value={maxAge}
            onChange={(e) => setMaxAge(Number(e.target.value) || 100)}
            style={inputStyle}
            min={0}
          />
        </div>
      </div>

      {/* Bar Chart */}
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="status" stroke={THEME.text} />
            <YAxis stroke={THEME.text} />
            <Tooltip
              contentStyle={{
                borderRadius: 10,
                padding: 10,
                backgroundColor: THEME.card,
                border: `1px solid ${THEME.barColors[0]}`,
                color: THEME.text,
              }}
            />
            <Legend wrapperStyle={{ color: THEME.text }} />
            <Bar dataKey="count" radius={[8, 8, 0, 0]} stroke={THEME.text}>
              {chartData.map((entry, index) => (
                <Cell fill={THEME.barColors[index % THEME.barColors.length]} key={index} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <StoneStatusPie data={filtered} />
    </div>
  )
}

export default HistplotStone
