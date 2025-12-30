import { useContext, useMemo, useState } from 'react'
import { DataContext } from '../useContext'

// Blue theme colors
const colors = {
  dark: '#000046', // main background
  medium: '#0b3d91', // card background
  light: '#1cb5e0', // highlights / borders
  veryLight: '#e0f7ff', // text
  danger: '#ff595e', // high risk
}

const cardStyle = {
  background: colors.medium,
  padding: 25,
  borderRadius: 16,
  boxShadow: `0 6px 20px ${colors.light}55`,
  color: colors.veryLight,
  minWidth: 200,
  textAlign: 'center',
  margin: 10,
}

const SummaryMetrics = () => {
  const [minAge, setMinAge] = useState(20)
  const [maxAge, setMaxAge] = useState(80)
  const [gender, setGender] = useState('all')

  const { data } = useContext(DataContext)

  // Filtered data based on age and gender
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const age = Number(item['Age'] || 0)
      const ageMatch = age >= minAge && age <= maxAge

      let genderValue = item['Gender']
      if (genderValue === '0' || genderValue?.toLowerCase() === 'male') genderValue = '0'
      if (genderValue === '1' || genderValue?.toLowerCase() === 'female') genderValue = '1'

      const genderMatch = gender === 'all' || genderValue === gender
      return ageMatch && genderMatch
    })
  }, [data, minAge, maxAge, gender])

  // Metrics calculation
  const metrics = useMemo(() => {
    if (filteredData.length === 0) return {}

    const totalPatients = filteredData.length

    const avg = (key) =>
      (filteredData.reduce((acc, i) => acc + Number(i[key] || 0), 0) / totalPatients).toFixed(2)

    const highRiskCount = filteredData.filter(
      (i) =>
        Number(i['Body Mass Index (BMI)'] || 0) > 30 ||
        Number(i['Glucose'] || 0) > 125 ||
        Number(i['Total Cholesterol (TC)'] || 0) > 200
    ).length

    return {
      totalPatients,
      avgBMI: avg('Body Mass Index (BMI)'),
      avgGlucose: avg('Glucose'),
      avgCholesterol: avg('Total Cholesterol (TC)'),
      avgFat: avg('Total Fat Content (TFC)'),
      avgLeanMass: avg('Lean Mass (LM) (%)'),
      highRiskCount,
    }
  }, [filteredData])

  return (
    <div
      style={{
        padding: 30,
        background: `linear-gradient(to bottom, ${colors.dark}, ${colors.light})`,
        minHeight: '100vh',
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: '25px 30px',
          background: colors.medium,
          borderRadius: 16,
          boxShadow: `0 4px 20px ${colors.light}55`,
          marginBottom: 25,
          border: `1px solid ${colors.light}33`,
        }}
      >
        <h1 style={{ fontSize: 32, color: colors.veryLight }}>Summary Metrics</h1>
        <p style={{ opacity: 0.85 }}>
          Get an overview of patient health indicators in the selected age and gender group.
        </p>
      </div>

      {/* FILTERS */}
      <div
        style={{
          display: 'flex',
          gap: 30,
          flexWrap: 'wrap',
          marginBottom: 30,
        }}
      >
        <div>
          <label style={{ fontWeight: 'bold', color: colors.veryLight }}>Min Age</label>
          <input
            type="number"
            value={minAge}
            onChange={(e) => setMinAge(Number(e.target.value))}
            style={{
              marginLeft: 10,
              padding: 8,
              borderRadius: 8,
              border: `1px solid ${colors.light}`,
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
              borderRadius: 8,
              border: `1px solid ${colors.light}`,
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
            }}
          >
            <option value="all">All</option>
            <option value="0">Male</option>
            <option value="1">Female</option>
          </select>
        </div>
      </div>

      {/* METRICS CARDS */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        <div style={cardStyle}>
          <h2>Total Patients</h2>
          <p style={{ fontSize: 28 }}>{metrics.totalPatients || 0}</p>
        </div>
        <div style={cardStyle}>
          <h2>Average BMI</h2>
          <p style={{ fontSize: 28 }}>{metrics.avgBMI || 0}</p>
        </div>
        <div style={cardStyle}>
          <h2>Average Glucose</h2>
          <p style={{ fontSize: 28 }}>{metrics.avgGlucose || 0}</p>
        </div>
        <div style={cardStyle}>
          <h2>Average Cholesterol</h2>
          <p style={{ fontSize: 28 }}>{metrics.avgCholesterol || 0}</p>
        </div>
        <div style={cardStyle}>
          <h2>Average Fat %</h2>
          <p style={{ fontSize: 28 }}>{metrics.avgFat || 0}</p>
        </div>
        <div style={cardStyle}>
          <h2>Average Lean Mass %</h2>
          <p style={{ fontSize: 28 }}>{metrics.avgLeanMass || 0}</p>
        </div>
        <div style={{ ...cardStyle, background: colors.dark, color: colors.danger }}>
          <h2>High Risk Patients</h2>
          <p style={{ fontSize: 28 }}>{metrics.highRiskCount || 0}</p>
        </div>
      </div>
    </div>
  )
}

export default SummaryMetrics
