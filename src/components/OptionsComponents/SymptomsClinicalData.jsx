import { useContext, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
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

const THEME = {
  bg: '#0f172a',
  card: '#020617',
  grid: '#1e293b',
  text: '#e5e7eb',
  muted: '#94a3b8',
  accent1: '#38bdf8',
  accent2: '#22c55e',
  accent3: '#f97316',
  accent4: '#a855f7',
}

const PIE_COLORS = [THEME.accent1, THEME.accent2, THEME.accent3, THEME.accent4]

const SymptomsClinicalData = () => {
  const [minAge, setMinAge] = useState(0)
  const [maxAge, setMaxAge] = useState(100)
  const [gallstone, setGallstone] = useState('All')
  const { data } = useContext(DataContext)

  const filtered = useMemo(() => {
    return data.filter((item) => {
      const age = Number(item.Age)
      const ageMatch = age >= minAge && age <= maxAge

      let gallstoneMatch = true
      if (gallstone === 'Yes') gallstoneMatch = item['Gallstone Status'] === '1'
      if (gallstone === 'No') gallstoneMatch = item['Gallstone Status'] === '0'

      return ageMatch && gallstoneMatch
    })
  }, [data, minAge, maxAge, gallstone])

  const symptomsData = useMemo(() => {
    const counts = {
      Comorbidity: 0,
      Diabetes: 0,
      CAD: 0,
      Hyperlipidemia: 0,
    }

    filtered.forEach((item) => {
      if (Number(item.Comorbidity) === 1) counts.Comorbidity++
      if (Number(item['Diabetes Mellitus (DM)']) === 1) counts.Diabetes++
      if (Number(item['Coronary Artery Disease (CAD)']) === 1) counts.CAD++
      if (Number(item.Hyperlipidemia) === 1) counts.Hyperlipidemia++
    })

    return Object.keys(counts)
      .map((key) => ({ name: key, value: counts[key] }))
      .filter((item) => item.value > 0)
  }, [filtered])

  const clinicalData = useMemo(() => {
    return filtered.map((item, idx) => ({
      name: `P${idx + 1}`,
      BMI: Number(item['Body Mass Index (BMI)']),
      TBW: Number(item['Total Body Water (TBW)']),
      VFR: Number(item['Visceral Fat Rating (VFR)']),
    }))
  }, [filtered])

  if (data.length === 0) return <Loader />

  const chartMinWidth = Math.max(280, clinicalData.length * 18)

  return (
    <div className="page">
      <h2 className="page-title">Symptoms & Clinical Data</h2>

      <div className="card filter-row mb-6">
        <div className="filter-item">
          <label htmlFor="sym-min-age">Min Age</label>
          <input
            id="sym-min-age"
            type="number"
            value={minAge}
            onChange={(e) => setMinAge(Number(e.target.value))}
            className="filter-control"
          />
        </div>
        <div className="filter-item">
          <label htmlFor="sym-max-age">Max Age</label>
          <input
            id="sym-max-age"
            type="number"
            value={maxAge}
            onChange={(e) => setMaxAge(Number(e.target.value))}
            className="filter-control"
          />
        </div>
        <div className="filter-item">
          <label htmlFor="sym-gallstone">Gallstone</label>
          <select
            id="sym-gallstone"
            value={gallstone}
            onChange={(e) => setGallstone(e.target.value)}
            className="filter-control"
          >
            <option value="All">All</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="card">
          <h3 className="mb-2 text-center font-semibold text-sky-400">Symptoms Prevalence</h3>
          {symptomsData.length === 0 ? (
            <p className="mt-10 text-center text-slate-400">
              No symptom data available for selected filters
            </p>
          ) : (
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={symptomsData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="28%"
                    outerRadius="70%"
                    paddingAngle={4}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {symptomsData.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: THEME.card,
                      border: `1px solid ${THEME.accent1}`,
                      color: 'whitesmoke',
                    }}
                  />
                  <Legend verticalAlign="bottom" wrapperStyle={{ color: THEME.text }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="mb-2 text-center font-semibold text-green-400">Clinical Measures</h3>
          <div className="chart-scroll">
            <div className="h-[280px] sm:h-[320px]" style={{ minWidth: chartMinWidth }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clinicalData}>
                  <CartesianGrid stroke={THEME.grid} strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke={THEME.muted} tick={{ fontSize: 12 }} />
                  <YAxis stroke={THEME.muted} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: THEME.card,
                      border: `1px solid ${THEME.accent3}`,
                      color: THEME.text,
                    }}
                  />
                  <Legend wrapperStyle={{ color: THEME.text }} />
                  <Bar dataKey="BMI" fill={THEME.accent1} radius={[8, 8, 0, 0]} />
                  <Bar dataKey="TBW" fill={THEME.accent2} radius={[8, 8, 0, 0]} />
                  <Bar dataKey="VFR" fill={THEME.accent3} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-6">
        <h3 className="mb-2 font-semibold text-orange-400">Analysis & Summary</h3>
        <p>
          Total patients selected: <b>{filtered.length}</b>
        </p>
        <p>Pie chart shows prevalence of major symptoms.</p>
        <p>Bar chart compares BMI, TBW, and VFR.</p>
        <p className="text-xs text-slate-400">*Charts update dynamically based on filters.</p>
      </div>
    </div>
  )
}

export default SymptomsClinicalData
