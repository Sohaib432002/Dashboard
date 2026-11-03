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

const THEME = {
  card: '#1e293b',
  text: '#e5e7eb',
  muted: '#94a3b8',
  barColors: ['#f43f5e', '#f97316', '#6366f1', '#14b8a6', '#facc15'],
  lineColors: ['#38bdf8', '#f472b6', '#a855f7'],
  pieColors: ['#22c55e', '#eab308', '#3b82f6', '#f97316', '#8b5cf6'],
}

const renderPieLabel = ({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`

const Visualizations = () => {
  const [minAge, setMinAge] = useState(20)
  const [maxAge, setMaxAge] = useState(80)
  const [gender, setGender] = useState('all')
  const [gallstone, setGallstone] = useState('all')
  const { data } = useContext(DataContext)

  const filteredData = useMemo(
    () =>
      data.filter((item) => {
        const age = Number(item['Age'] || 0)

        let g = String(item['Gender'] ?? '')
        if (g === '0' || g.toLowerCase() === 'male') g = '0'
        if (g === '1' || g.toLowerCase() === 'female') g = '1'

        let gs = String(item['Gallstone Status'] ?? '')
        if (gs === '1' || gs.toLowerCase() === 'yes') gs = '1'
        if (gs === '0' || gs.toLowerCase() === 'no') gs = '0'

        return (
          age >= minAge &&
          age <= maxAge &&
          (gender === 'all' || g === gender) &&
          (gallstone === 'all' || gs === gallstone)
        )
      }),
    [data, minAge, maxAge, gender, gallstone]
  )

  const makeChartData = (key) =>
    filteredData.map((item, index) => ({
      id: index + 1,
      value: Number(item[key] || 0),
    }))

  const bmiData = makeChartData('Body Mass Index (BMI)')
  const glucoseData = makeChartData('Glucose')
  const cholesterolData = makeChartData('Total Cholesterol (TC)')
  const chartMinWidth = Math.max(280, filteredData.length * 8)

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
    <div className="page">
      <div className="card mb-6">
        <h1 className="page-title mb-0">Patient Visualizations</h1>
        <p className="page-subtitle">
          Interactive analysis of BMI, Glucose, Cholesterol, Fat & Muscle Mass
        </p>
      </div>

      <div className="card mb-6">
        <h2 className="mb-3 text-lg font-semibold">Filters</h2>
        <div className="filter-row">
          <div className="filter-item">
            <label htmlFor="viz-min-age">Min Age</label>
            <input
              id="viz-min-age"
              type="number"
              value={minAge}
              onChange={(e) => setMinAge(Number(e.target.value))}
              className="filter-control"
            />
          </div>
          <div className="filter-item">
            <label htmlFor="viz-max-age">Max Age</label>
            <input
              id="viz-max-age"
              type="number"
              value={maxAge}
              onChange={(e) => setMaxAge(Number(e.target.value))}
              className="filter-control"
            />
          </div>
          <div className="filter-item">
            <label htmlFor="viz-gender">Gender</label>
            <select
              id="viz-gender"
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
            <label htmlFor="viz-gallstone">Gallstone</label>
            <select
              id="viz-gallstone"
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
        <div className="mt-4 font-semibold">Total Patients: {filteredData.length}</div>
      </div>

      <div className="card mb-6">
        <h2 className="mb-3 text-lg font-semibold">BMI Trend</h2>
        <div className="chart-scroll">
          <div className="chart-wrap" style={{ minWidth: chartMinWidth }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bmiData}>
                <CartesianGrid strokeDasharray="3 3" stroke={THEME.muted} />
                <XAxis dataKey="id" stroke={THEME.text} />
                <YAxis stroke={THEME.text} />
                <Tooltip contentStyle={{ background: THEME.card, borderRadius: 10 }} />
                <Bar dataKey="value">
                  {bmiData.map((_, i) => (
                    <Cell key={i} fill={THEME.barColors[i % THEME.barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="mb-3 text-lg font-semibold">Glucose Levels</h2>
        <div className="chart-scroll">
          <div className="chart-wrap" style={{ minWidth: chartMinWidth }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={glucoseData}>
                <CartesianGrid strokeDasharray="3 3" stroke={THEME.muted} />
                <XAxis dataKey="id" stroke={THEME.text} />
                <YAxis stroke={THEME.text} />
                <Tooltip contentStyle={{ background: THEME.card, borderRadius: 10 }} />
                <Line type="monotone" dataKey="value" stroke={THEME.lineColors[0]} strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="mb-3 text-lg font-semibold">Total Cholesterol</h2>
        <div className="chart-scroll">
          <div className="chart-wrap" style={{ minWidth: chartMinWidth }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cholesterolData}>
                <CartesianGrid strokeDasharray="3 3" stroke={THEME.muted} />
                <XAxis dataKey="id" stroke={THEME.text} />
                <YAxis stroke={THEME.text} />
                <Tooltip contentStyle={{ background: THEME.card, borderRadius: 10 }} />
                <Line type="monotone" dataKey="value" stroke={THEME.lineColors[1]} strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="card">
          <h2 className="mb-3 text-lg font-semibold">Fat Distribution</h2>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={fatData} dataKey="value" outerRadius="70%" label={renderPieLabel}>
                  {fatData.map((_, i) => (
                    <Cell key={i} fill={THEME.pieColors[i % THEME.pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: THEME.card, borderRadius: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2 className="mb-3 text-lg font-semibold">Muscle & Lean Mass</h2>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={muscleData} dataKey="value" outerRadius="70%" label={renderPieLabel}>
                  {muscleData.map((_, i) => (
                    <Cell key={i} fill={THEME.pieColors[(i + 2) % THEME.pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: THEME.card, borderRadius: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Visualizations
