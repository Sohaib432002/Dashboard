// Visualizations.jsx
import { useContext, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { DataContext } from '../useContext'

// BLUE THEME COLORS
const colors = {
  dark: '#000046',
  medium: '#0b3d91',
  soft: '#1cb5e0',
  light: '#3dd1f3',
  veryLight: '#e0f7ff',
}

const cardStyle = {
  background: colors.medium,
  padding: 22,
  borderRadius: 16,
  boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
  marginTop: 28,
  color: colors.veryLight,
  border: '1px solid rgba(255,255,255,0.08)',
}

const Visualizations = () => {
  const [minAge, setMinAge] = useState(20)
  const [maxAge, setMaxAge] = useState(80)
  const [gender, setGender] = useState('all')

  const { data } = useContext(DataContext)

  const filteredData = useMemo(
    () =>
      data.filter((item) => {
        const age = Number(item['Age'] || 0)
        const g = item['Gender']
        return age >= minAge && age <= maxAge && (gender === 'all' || g == gender)
      }),
    [data, minAge, maxAge, gender]
  )

  const makeChartData = (key) =>
    filteredData.map((item, index) => ({ id: index + 1, value: Number(item[key] || 0) }))

  const bmiData = makeChartData('Body Mass Index (BMI)')
  const glucoseData = makeChartData('Glucose')
  const cholesterolData = makeChartData('Total Cholesterol (TC)')

  const fatData = [
    {
      name: 'Visceral Fat',
      value: filteredData.reduce((acc, i) => acc + Number(i['Visceral Fat Rating (VFR)'] || 0), 0),
    },
    {
      name: 'Total Fat',
      value: filteredData.reduce((acc, i) => acc + Number(i['Total Fat Content (TFC)'] || 0), 0),
    },
  ]

  const muscleData = [
    {
      name: 'Muscle Mass',
      value: filteredData.reduce((acc, i) => acc + Number(i['Muscle Mass (MM)'] || 0), 0),
    },
    {
      name: 'Lean Mass',
      value: filteredData.reduce((acc, i) => acc + Number(i['Lean Mass (LM) (%)'] || 0), 0),
    },
  ]

  return (
    <div
      style={{
        padding: 25,
        background: `linear-gradient(to-bottom, ${colors.dark}, ${colors.soft})`,
        minHeight: '100vh',
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: '25px 30px',
          background: colors.medium,
          color: colors.veryLight,
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <h1 style={{ fontSize: 34, fontWeight: 600 }}>Patient Visualizations</h1>
        <p style={{ fontSize: 17, opacity: 0.9, lineHeight: 1.5 }}>
          Explore interactive visual trends of BMI, Glucose, Cholesterol, Fat, and Muscle Mass.
        </p>
      </div>

      {/* FILTER CARD */}
      <div style={cardStyle}>
        <h2 style={{ color: colors.veryLight, marginBottom: 12 }}>Filters</h2>
        <div style={{ display: 'flex', gap: 50, flexWrap: 'wrap' }}>
          <div>
            <label style={{ fontWeight: 'bold', color: colors.veryLight }}>Min Age</label>
            <input
              type="number"
              value={minAge}
              onChange={(e) => setMinAge(Number(e.target.value))}
              style={{
                marginLeft: 10,
                padding: 8,
                border: `1px solid ${colors.light}`,
                borderRadius: 8,
                outline: 'none',
                background: colors.dark,
                color: colors.veryLight,
              }}
            />
          </div>
          <div>
            <label style={{ fontWeight: 'bold', color: colors.veryLight }}>Max Age</label>
            <input
              type="number"
              value={maxAge}
              onChange={(e) => setMaxAge(Number(e.target.value))}
              style={{
                marginLeft: 10,
                padding: 8,
                border: `1px solid ${colors.light}`,
                borderRadius: 8,
                outline: 'none',
                background: colors.dark,
                color: colors.veryLight,
              }}
            />
          </div>
          <div>
            <label style={{ fontWeight: 'bold', color: colors.veryLight }}>Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              style={{
                marginLeft: 10,
                padding: 8,
                borderRadius: 8,
                border: `1px solid ${colors.light}`,
                background: colors.dark,
                color: colors.veryLight,
                outline: 'none',
              }}
            >
              <option value="all">All</option>
              <option value="0">Male</option>
              <option value="1">Female</option>
            </select>
          </div>
        </div>
      </div>

      {/* BMI Chart */}
      <div style={cardStyle}>
        <h2 style={{ color: colors.veryLight }}>BMI Trend</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={bmiData}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.soft} />
            <XAxis dataKey="id" stroke={colors.veryLight} />
            <YAxis stroke={colors.veryLight} />
            <Tooltip contentStyle={{ background: colors.medium, borderRadius: 10 }} />
            <Bar dataKey="value" fill={colors.light} radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Glucose Chart */}
      <div style={cardStyle}>
        <h2 style={{ color: colors.veryLight }}>Glucose Levels</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={glucoseData}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.soft} />
            <XAxis dataKey="id" stroke={colors.veryLight} />
            <YAxis stroke={colors.veryLight} />
            <Tooltip contentStyle={{ background: colors.medium, borderRadius: 10 }} />
            <Line type="monotone" dataKey="value" stroke={colors.light} strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Cholesterol Chart */}
      <div style={cardStyle}>
        <h2 style={{ color: colors.veryLight }}>Total Cholesterol</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={cholesterolData}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.soft} />
            <XAxis dataKey="id" stroke={colors.veryLight} />
            <YAxis stroke={colors.veryLight} />
            <Tooltip contentStyle={{ background: colors.medium, borderRadius: 10 }} />
            <Line type="monotone" dataKey="value" stroke={colors.veryLight} strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Fat Distribution */}
      <div style={cardStyle}>
        <h2 style={{ color: colors.veryLight }}>Fat Distribution</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={fatData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {fatData.map((entry, index) => (
                <Cell key={index} fill={[colors.light, colors.veryLight][index]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: colors.medium, borderRadius: 10 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Muscle & Lean Mass */}
      <div style={cardStyle}>
        <h2 style={{ color: colors.veryLight }}>Muscle & Lean Mass</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={muscleData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {muscleData.map((entry, index) => (
                <Cell key={index} fill={[colors.light, colors.veryLight][index]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: colors.medium, borderRadius: 10 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Visualizations
