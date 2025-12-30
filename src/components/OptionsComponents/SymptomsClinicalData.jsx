// SymptomsClinicalData.jsx
import { useContext, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Loader from '../LoadingSpinner'
import { DataContext } from '../useContext'

// Blue theme colors
const colors = {
  dark: '#000046', // background
  medium: '#0b3d91', // card background
  light: '#1cb5e0', // highlights / labels
  veryLight: '#e0f7ff', // text
  danger: '#ff595e', // warnings / high risk
}

const COLORS = [colors.light, colors.medium, colors.veryLight, '#48a9e6']

const SymptomsClinicalData = () => {
  const [minAge, setMinAge] = useState(0)
  const [maxAge, setMaxAge] = useState(100)

  const { data } = useContext(DataContext)

  const filtered = useMemo(
    () => data.filter((item) => item.Age >= minAge && item.Age <= maxAge),
    [data, minAge, maxAge]
  )

  const symptomsData = useMemo(() => {
    const counts = { Comorbidity: 0, DM: 0, CAD: 0, Hyperlipidemia: 0 }
    filtered.forEach((item) => {
      if (item.Comorbidity) counts.Comorbidity++
      if (item['Diabetes Mellitus (DM)']) counts.DM++
      if (item['Coronary Artery Disease (CAD)']) counts.CAD++
      if (item.Hyperlipidemia) counts.Hyperlipidemia++
    })
    return Object.keys(counts).map((key) => ({ name: key, value: counts[key] }))
  }, [filtered])

  const clinicalData = useMemo(
    () =>
      filtered.map((item, idx) => ({
        name: `P${idx + 1}`,
        BMI: item['Body Mass Index (BMI)'],
        TBW: item['Total Body Water (TBW)'],
        VFR: item['Visceral Fat Rating (VFR)'],
      })),
    [filtered]
  )

  if (data.length === 0) return <Loader />

  const cardStyle = {
    background: colors.medium,
    borderRadius: 16,
    padding: 20,
    color: colors.veryLight,
    boxShadow: `0 6px 20px ${colors.light}55`,
  }

  const inputStyle = {
    padding: '8px 12px',
    borderRadius: 8,
    marginRight: 15,
    background: colors.dark,
    color: colors.veryLight,
    border: `1px solid ${colors.light}`,
  }

  return (
    <div
      style={{
        padding: 25,
        background: `linear-gradient(to bottom, ${colors.dark}, ${colors.light})`,
        minHeight: '100vh',
      }}
    >
      <h2 style={{ color: colors.veryLight, fontSize: 28, marginBottom: 20 }}>
        Symptoms & Clinical Data
      </h2>

      {/* Filters */}
      <div
        style={{
          ...cardStyle,
          display: 'flex',
          gap: 20,
          flexWrap: 'wrap',
          marginBottom: 30,
        }}
      >
        <div>
          <label>Min Age:</label>
          <input
            type="number"
            value={minAge}
            onChange={(e) => setMinAge(Number(e.target.value))}
            style={inputStyle}
          />
        </div>
        <div>
          <label>Max Age:</label>
          <input
            type="number"
            value={maxAge}
            onChange={(e) => setMaxAge(Number(e.target.value))}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Charts */}
      <div className="flex flex-col md:flex-row gap-5 mb-5">
        {/* Symptoms Pie */}
        <div style={{ ...cardStyle, flex: 1 }}>
          <h3 style={{ textAlign: 'center', color: colors.light }}>Symptoms Prevalence</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={symptomsData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {symptomsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: colors.dark, color: colors.veryLight }} />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Clinical Measures Bar */}
        <div style={{ ...cardStyle, flex: 1 }}>
          <h3 style={{ textAlign: 'center', color: colors.light }}>Clinical Measures</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={clinicalData}>
              <XAxis dataKey="name" stroke={colors.veryLight} />
              <YAxis stroke={colors.veryLight} />
              <Tooltip contentStyle={{ backgroundColor: colors.dark, color: colors.veryLight }} />
              <Legend wrapperStyle={{ color: colors.veryLight }} />
              <Bar dataKey="BMI" fill={colors.light} radius={[5, 5, 0, 0]} />
              <Bar dataKey="TBW" fill={colors.veryLight} radius={[5, 5, 0, 0]} />
              <Bar dataKey="VFR" fill={colors.medium} radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Analysis */}
      <div style={{ ...cardStyle }}>
        <h3 style={{ color: colors.light, marginBottom: 10 }}>Analysis & Summary</h3>
        <p style={{ color: colors.veryLight, marginBottom: 5 }}>
          Total patients in selected age range: <strong>{filtered.length}</strong>
        </p>
        <p style={{ color: colors.veryLight, marginBottom: 5 }}>
          Most common symptoms among patients are shown in the pie chart above.
        </p>
        <p style={{ color: colors.veryLight, marginBottom: 5 }}>
          Bar chart shows BMI, Total Body Water (TBW), and Visceral Fat Rating (VFR) for each
          patient.
        </p>
        <p style={{ color: colors.veryLight, marginBottom: 5 }}>
          Charts and data update dynamically based on the age filters.
        </p>
        <p style={{ color: colors.veryLight, fontSize: 12, marginTop: 10 }}>
          *Note: Symptom and clinical measure prevalence may indicate risk factors and overall
          patient health trends.
        </p>
      </div>
    </div>
  )
}

export default SymptomsClinicalData
