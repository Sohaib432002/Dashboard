import { useContext, useMemo, useState } from 'react'
import { DataContext } from '../useContext'

// Professional Dashboard Theme (Graph Friendly)
const colors = {
  dark: '#0a1128', // main background (deep navy)
  medium: '#1c2541', // card background
  light: '#3a86ff', // accent / borders / graph primary
  veryLight: '#eaf4ff', // text
  danger: '#ff4d6d', // high risk
}

const cardStyle = {
  background: colors.medium,
  padding: 25,
  borderRadius: 16,
  boxShadow: '0 8px 25px rgba(58,134,255,0.25)',
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
        minHeight: '100vh',
        background: `linear-gradient(180deg, ${colors.dark}, #14213d)`,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: '25px 30px',
          background: colors.medium,
          borderRadius: 16,
          boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
          marginBottom: 25,
          border: `1px solid ${colors.light}33`,
        }}
      >
        <h1 style={{ fontSize: 32, color: colors.veryLight }}>Summary Metrics</h1>
        <p style={{ opacity: 0.85, color: colors.veryLight }}>
          Overview of patient health indicators
        </p>
      </div>

      {/* FILTERS */}
      <div style={{ display: 'flex', gap: 30, flexWrap: 'wrap', marginBottom: 30 }}>
        {['Min Age', 'Max Age'].map((label, idx) => (
          <div key={label}>
            <label style={{ fontWeight: 'bold', color: colors.veryLight }}>{label}</label>
            <input
              type="number"
              value={idx === 0 ? minAge : maxAge}
              onChange={(e) =>
                idx === 0 ? setMinAge(Number(e.target.value)) : setMaxAge(Number(e.target.value))
              }
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
        ))}

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

      {/* METRICS */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        {[
          ['Total Patients', metrics.totalPatients],
          ['Average BMI', metrics.avgBMI],
          ['Average Glucose', metrics.avgGlucose],
          ['Average Cholesterol', metrics.avgCholesterol],
          ['Average Fat %', metrics.avgFat],
          ['Average Lean Mass %', metrics.avgLeanMass],
        ].map(([title, value]) => (
          <div key={title} style={cardStyle}>
            <h2>{title}</h2>
            <p style={{ fontSize: 28 }}>{value || 0}</p>
          </div>
        ))}

        <div
          style={{
            ...cardStyle,
            background: '#0b132b',
            color: colors.danger,
          }}
        >
          <h2>High Risk Patients</h2>
          <p style={{ fontSize: 28 }}>{metrics.highRiskCount || 0}</p>
        </div>
      </div>
    </div>
  )
}

export default SummaryMetrics
