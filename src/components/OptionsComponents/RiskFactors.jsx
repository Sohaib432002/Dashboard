import { useContext, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { DataContext } from '../useContext'

const THEME = {
  card: '#020617',
  grid: '#1e293b',
  text: '#e5e7eb',
  muted: '#94a3b8',
  accent1: '#38bdf8',
  accent2: '#22c55e',
  accent3: '#f97316',
  accent4: '#a855f7',
}

const RiskFactors = () => {
  const [minAge, setMinAge] = useState(20)
  const [maxAge, setMaxAge] = useState(80)
  const [gender, setGender] = useState('all')
  const [gallstone, setGallstone] = useState('all')
  const { data } = useContext(DataContext)

  const filteredData = useMemo(
    () =>
      data.filter((item) => {
        const age = Number(item['Age'] || 0)

        let genderValue = String(item['Gender'] ?? '')
        if (genderValue === '0' || genderValue.toLowerCase() === 'male') genderValue = '0'
        if (genderValue === '1' || genderValue.toLowerCase() === 'female') genderValue = '1'

        let gallstoneValue = String(item['Gallstone'] || item['Gallstone Status'] || '0')
        if (gallstoneValue === 'Yes') gallstoneValue = '1'
        if (gallstoneValue === 'No') gallstoneValue = '0'

        const ageOk = age >= minAge && age <= maxAge
        const genderOk = gender === 'all' || genderValue === gender
        const gallstoneOk =
          gallstone === 'all' ||
          (gallstone === 'yes' && gallstoneValue === '1') ||
          (gallstone === 'no' && gallstoneValue === '0')

        return ageOk && genderOk && gallstoneOk
      }),
    [data, minAge, maxAge, gender, gallstone]
  )

  const makeChartData = (key) =>
    filteredData.map((item, index) => ({
      id: index + 1,
      value: Number(item[key] || 0),
    }))

  const bmiData = makeChartData('Body Mass Index (BMI)')
  const cholesterolData = makeChartData('Total Cholesterol (TC)')
  const glucoseData = makeChartData('Glucose')
  const chartMinWidth = Math.max(280, filteredData.length * 8)
  const palette = [THEME.accent1, THEME.accent2, THEME.accent3, THEME.accent4]

  return (
    <div className="page">
      <div className="card mb-6">
        <h1 className="page-title mb-0">Risk Factors Analysis</h1>
        <p className="page-subtitle">
          Visual breakdown of BMI, Cholesterol, and Glucose levels to identify health-related risk
          factors among patients.
        </p>
      </div>

      <div className="card mb-6">
        <h2 className="mb-3 text-lg font-semibold">Filters</h2>
        <div className="filter-row">
          <div className="filter-item">
            <label htmlFor="rf-min-age">Min Age</label>
            <input
              id="rf-min-age"
              type="number"
              value={minAge}
              onChange={(e) => setMinAge(Number(e.target.value))}
              className="filter-control"
            />
          </div>
          <div className="filter-item">
            <label htmlFor="rf-max-age">Max Age</label>
            <input
              id="rf-max-age"
              type="number"
              value={maxAge}
              onChange={(e) => setMaxAge(Number(e.target.value))}
              className="filter-control"
            />
          </div>
          <div className="filter-item">
            <label htmlFor="rf-gender">Gender</label>
            <select
              id="rf-gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="filter-control"
            >
              <option value="all">All</option>
              <option value="0">Male</option>
              <option value="1">Female</option>
            </select>
          </div>
          <div className="filter-item">
            <label htmlFor="rf-gallstone">Gallstone</label>
            <select
              id="rf-gallstone"
              value={gallstone}
              onChange={(e) => setGallstone(e.target.value)}
              className="filter-control"
            >
              <option value="all">All</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="mb-3 font-semibold text-sky-400">BMI (Body Mass Index)</h2>
        <div className="chart-scroll">
          <div className="chart-wrap" style={{ minWidth: chartMinWidth }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bmiData}>
                <CartesianGrid stroke={THEME.grid} strokeDasharray="3 3" />
                <XAxis dataKey="id" stroke={THEME.muted} />
                <YAxis stroke={THEME.muted} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: THEME.card,
                    border: `1px solid ${THEME.accent1}`,
                    color: THEME.text,
                  }}
                />
                <Bar dataKey="value">
                  {bmiData.map((_, i) => (
                    <Cell key={i} fill={palette[i % 4]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="mb-3 font-semibold text-green-400">Total Cholesterol</h2>
        <div className="chart-scroll">
          <div className="chart-wrap" style={{ minWidth: chartMinWidth }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cholesterolData}>
                <CartesianGrid stroke={THEME.grid} strokeDasharray="3 3" />
                <XAxis dataKey="id" stroke={THEME.muted} />
                <YAxis stroke={THEME.muted} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: THEME.card,
                    border: `1px solid ${THEME.accent2}`,
                    color: THEME.text,
                  }}
                />
                <Line type="monotone" dataKey="value" stroke={THEME.accent2} strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="mb-3 font-semibold text-orange-400">Glucose Levels</h2>
        <div className="chart-scroll">
          <div className="chart-wrap" style={{ minWidth: chartMinWidth }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={glucoseData}>
                <CartesianGrid stroke={THEME.grid} strokeDasharray="3 3" />
                <XAxis dataKey="id" stroke={THEME.muted} />
                <YAxis stroke={THEME.muted} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: THEME.card,
                    border: `1px solid ${THEME.accent3}`,
                    color: THEME.text,
                  }}
                />
                <Line type="monotone" dataKey="value" stroke={THEME.accent3} strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RiskFactors
