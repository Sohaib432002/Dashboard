import { useContext, useMemo, useState } from 'react'
import {
  CartesianGrid,
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

const LaboratoryResults = () => {
  const [minAge, setMinAge] = useState(0)
  const [maxAge, setMaxAge] = useState(100)
  const [gender, setGender] = useState('all')
  const [diabetes, setDiabetes] = useState('all')
  const [comorbidity, setComorbidity] = useState('all')
  const [gallstone, setGallstone] = useState('all')
  const { data } = useContext(DataContext)

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const age = Number(item['Age'] || 0)

      let genderValue = String(item['Gender'] ?? '')
      if (genderValue === '0' || genderValue.toLowerCase() === 'male') genderValue = '0'
      if (genderValue === '1' || genderValue.toLowerCase() === 'female') genderValue = '1'

      const diabetesValue = Number(item['Diabetes Mellitus (DM)'] || 0)
      const comorbValue = Number(item['Comorbidity'] || 0)

      let gsValue = String(item['Gallstone Status'] ?? '')
      if (gsValue === '1' || gsValue.toLowerCase() === 'yes') gsValue = '1'
      if (gsValue === '0' || gsValue.toLowerCase() === 'no') gsValue = '0'

      return (
        age >= minAge &&
        age <= maxAge &&
        (gender === 'all' || genderValue === gender) &&
        (diabetes === 'all' || diabetesValue === Number(diabetes)) &&
        (comorbidity === 'all' || comorbValue === Number(comorbidity)) &&
        (gallstone === 'all' || gsValue === gallstone)
      )
    })
  }, [data, minAge, maxAge, gender, diabetes, comorbidity, gallstone])

  const makeChartData = (key) =>
    filteredData.map((item, index) => ({
      id: index + 1,
      value: Number(item[key] || 0),
    }))

  const glucoseData = useMemo(() => makeChartData('Glucose'), [filteredData])
  const cholesterolData = useMemo(() => makeChartData('Total Cholesterol (TC)'), [filteredData])
  const ldlData = useMemo(() => makeChartData('Low Density Lipoprotein (LDL)'), [filteredData])
  const hdlData = useMemo(() => makeChartData('High Density Lipoprotein (HDL)'), [filteredData])

  const charts = [
    { title: 'Glucose Levels', data: glucoseData, color: THEME.accent1 },
    { title: 'Total Cholesterol (TC)', data: cholesterolData, color: THEME.accent2 },
    { title: 'LDL', data: ldlData, color: THEME.accent3 },
    { title: 'HDL', data: hdlData, color: THEME.accent4 },
  ]

  return (
    <div className="page">
      <h2 className="page-title">Laboratory Results</h2>

      <div className="card filter-row mb-4">
        <div className="filter-item">
          <label htmlFor="lab-min-age">Min Age</label>
          <input
            id="lab-min-age"
            type="number"
            value={minAge}
            onChange={(e) => setMinAge(Number(e.target.value))}
            className="filter-control"
          />
        </div>
        <div className="filter-item">
          <label htmlFor="lab-max-age">Max Age</label>
          <input
            id="lab-max-age"
            type="number"
            value={maxAge}
            onChange={(e) => setMaxAge(Number(e.target.value))}
            className="filter-control"
          />
        </div>
        <div className="filter-item">
          <label htmlFor="lab-gender">Gender</label>
          <select
            id="lab-gender"
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
          <label htmlFor="lab-diabetes">Diabetes (DM)</label>
          <select
            id="lab-diabetes"
            value={diabetes}
            onChange={(e) => setDiabetes(e.target.value)}
            className="filter-control"
          >
            <option value="all">All</option>
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </div>
        <div className="filter-item">
          <label htmlFor="lab-comorbidity">Comorbidity</label>
          <select
            id="lab-comorbidity"
            value={comorbidity}
            onChange={(e) => setComorbidity(e.target.value)}
            className="filter-control"
          >
            <option value="all">All</option>
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </div>
        <div className="filter-item">
          <label htmlFor="lab-gallstone">Gallstone</label>
          <select
            id="lab-gallstone"
            value={gallstone}
            onChange={(e) => setGallstone(e.target.value)}
            className="filter-control"
          >
            <option value="all">All</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>
      </div>

      <div className="mb-4 font-semibold text-slate-100">Total Patients: {filteredData.length}</div>

      {charts.map((chart) => (
        <div key={chart.title} className="card mb-6">
          <h3 className="mb-3 font-semibold" style={{ color: chart.color }}>
            {chart.title}
          </h3>
          <div className="chart-scroll">
            <div
              className="chart-wrap"
              style={{ minWidth: Math.max(280, chart.data.length * 8) }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chart.data}>
                  <CartesianGrid stroke={THEME.grid} strokeDasharray="3 3" />
                  <XAxis dataKey="id" stroke={THEME.muted} />
                  <YAxis stroke={THEME.muted} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: THEME.card,
                      border: `1px solid ${chart.color}`,
                      color: THEME.text,
                    }}
                  />
                  <Line type="monotone" dataKey="value" stroke={chart.color} strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default LaboratoryResults
