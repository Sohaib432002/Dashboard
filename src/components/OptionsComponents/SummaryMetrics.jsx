import { useContext, useMemo, useState } from 'react'
import { DataContext } from '../useContext'

const colors = {
  medium: '#1c2541',
  light: '#3a86ff',
  veryLight: '#eaf4ff',
  danger: '#ff4d6d',
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

      let genderValue = String(item['Gender'] ?? '')
      if (genderValue === '0' || genderValue.toLowerCase() === 'male') genderValue = '0'
      if (genderValue === '1' || genderValue.toLowerCase() === 'female') genderValue = '1'

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

  const metricCards = [
    ['Total Patients', metrics.totalPatients],
    ['Average BMI', metrics.avgBMI],
    ['Average Glucose', metrics.avgGlucose],
    ['Average Cholesterol', metrics.avgCholesterol],
    ['Average Fat %', metrics.avgFat],
    ['Average Lean Mass %', metrics.avgLeanMass],
  ]

  return (
    <div className="page">
      <div className="card mb-6">
        <h1 className="page-title mb-0">Summary Metrics</h1>
        <p className="page-subtitle">Overview of patient health indicators</p>
      </div>

      <div className="filter-row mb-6">
        <div className="filter-item">
          <label htmlFor="sm-min-age">Min Age</label>
          <input
            id="sm-min-age"
            type="number"
            value={minAge}
            onChange={(e) => setMinAge(Number(e.target.value))}
            className="filter-control"
          />
        </div>
        <div className="filter-item">
          <label htmlFor="sm-max-age">Max Age</label>
          <input
            id="sm-max-age"
            type="number"
            value={maxAge}
            onChange={(e) => setMaxAge(Number(e.target.value))}
            className="filter-control"
          />
        </div>
        <div className="filter-item">
          <label htmlFor="sm-gender">Gender</label>
          <select
            id="sm-gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="filter-control"
          >
            <option value="all">All</option>
            <option value="0">Male</option>
            <option value="1">Female</option>
          </select>
        </div>
      </div>

      <div className="metric-grid">
        {metricCards.map(([title, value]) => (
          <div
            key={title}
            className="rounded-2xl p-5 text-center shadow-lg"
            style={{
              background: colors.medium,
              color: colors.veryLight,
              boxShadow: '0 8px 25px rgba(58,134,255,0.25)',
            }}
          >
            <h2 className="text-base font-semibold sm:text-lg">{title}</h2>
            <p className="mt-2 text-2xl font-bold sm:text-3xl">{value || 0}</p>
          </div>
        ))}

        <div
          className="rounded-2xl p-5 text-center shadow-lg"
          style={{ background: '#0b132b', color: colors.danger }}
        >
          <h2 className="text-base font-semibold sm:text-lg">High Risk Patients</h2>
          <p className="mt-2 text-2xl font-bold sm:text-3xl">{metrics.highRiskCount || 0}</p>
        </div>
      </div>
    </div>
  )
}

export default SummaryMetrics
