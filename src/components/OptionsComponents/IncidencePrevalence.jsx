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

const THEME = {
  bg: '#0f172a',
  card: '#020617',
  text: '#e5e7eb',
  muted: '#94a3b8',
  accent1: '#38bdf8',
  accent2: '#22c55e',
  accent3: '#f97316',
  accent4: '#a855f7',
}

const PIE_COLORS = [THEME.accent1, THEME.accent2]
const BAR_COLORS = [THEME.accent1, THEME.accent2, THEME.accent3, THEME.accent4]

const IncidencePrevalence = () => {
  const [minAge, setMinAge] = useState(0)
  const [maxAge, setMaxAge] = useState(100)
  const [gender, setGender] = useState('All')
  const [gallstoneFilter, setGallstoneFilter] = useState('All')
  const { data } = useContext(DataContext)

  const filtered = useMemo(
    () =>
      data.filter((item) => {
        const age = Number(item.Age || 0)
        const genderVal = Number(item.Gender)
        const gallstoneVal = Number(item['Gallstone Status'] || 0)
        const ageOk = age >= minAge && age <= maxAge
        const genderOk =
          gender === 'All' ? true : gender === 'Male' ? genderVal === 0 : genderVal === 1
        const gallstoneOk =
          gallstoneFilter === 'All'
            ? true
            : gallstoneFilter === 'Yes'
              ? gallstoneVal === 1
              : gallstoneFilter === 'No'
                ? gallstoneVal === 0
                : true

        return ageOk && genderOk && gallstoneOk
      }),
    [data, minAge, maxAge, gender, gallstoneFilter]
  )

  const pieData = useMemo(() => {
    const counts = { Yes: 0, No: 0 }
    filtered.forEach((item) => {
      const status = Number(item['Gallstone Status'] || 0)
      if (status === 1) counts.Yes++
      else counts.No++
    })

    return [
      { name: 'Yes', value: counts.Yes },
      { name: 'No', value: counts.No },
    ]
  }, [filtered])

  const barData = useMemo(() => {
    const bins = { '0-30': 0, '31-40': 0, '41-50': 0, '51-60': 0, '61+': 0 }
    filtered.forEach((item) => {
      const age = Number(item.Age || 0)
      if (age <= 30) bins['0-30']++
      else if (age <= 40) bins['31-40']++
      else if (age <= 50) bins['41-50']++
      else if (age <= 60) bins['51-60']++
      else bins['61+']++
    })
    return Object.keys(bins).map((key) => ({
      ageRange: key,
      count: bins[key],
    }))
  }, [filtered])

  if (data.length === 0) return <Loader />

  const totalPatients = filtered.length
  const totalGallstone = pieData.find((d) => d.name === 'Yes')?.value || 0
  const prevalencePercent =
    totalPatients > 0 ? ((totalGallstone / totalPatients) * 100).toFixed(1) : 0

  return (
    <div className="page">
      <h2 className="page-title">Gallstone Incidence & Prevalence</h2>

      <div className="card filter-row mb-6">
        <div className="filter-item">
          <label htmlFor="inc-min-age">Min Age</label>
          <input
            id="inc-min-age"
            type="number"
            value={minAge}
            onChange={(e) => setMinAge(Number(e.target.value))}
            className="filter-control"
          />
        </div>
        <div className="filter-item">
          <label htmlFor="inc-max-age">Max Age</label>
          <input
            id="inc-max-age"
            type="number"
            value={maxAge}
            onChange={(e) => setMaxAge(Number(e.target.value))}
            className="filter-control"
          />
        </div>
        <div className="filter-item">
          <label htmlFor="inc-gender">Gender</label>
          <select
            id="inc-gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="filter-control"
          >
            <option value="All">All</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div className="filter-item">
          <label htmlFor="inc-gallstone">Gallstone Status</label>
          <select
            id="inc-gallstone"
            value={gallstoneFilter}
            onChange={(e) => setGallstoneFilter(e.target.value)}
            className="filter-control"
          >
            <option value="All">All</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="card">
          <h3 className="mb-2 text-center font-semibold text-sky-400">Overall Prevalence</h3>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius="70%"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: THEME.card,
                    border: `1px solid ${THEME.accent1}`,
                    color: THEME.text,
                  }}
                />
                <Legend verticalAlign="bottom" wrapperStyle={{ color: THEME.text }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="mb-2 text-center font-semibold text-green-400">Prevalence by Age Group</h3>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="ageRange" stroke={THEME.muted} />
                <YAxis stroke={THEME.muted} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: THEME.card,
                    border: `1px solid ${THEME.accent2}`,
                    color: THEME.text,
                  }}
                />
                <Legend wrapperStyle={{ color: THEME.text }} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {barData.map((_, index) => (
                    <Cell key={index} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="mb-2 font-semibold text-orange-400">Analysis & Summary</h3>
        <p>
          Total patients in selected age range: <strong>{totalPatients}</strong>
        </p>
        <p>
          Patients with Gallstones: <strong>{totalGallstone}</strong>
        </p>
        <p>
          Overall Prevalence: <strong>{prevalencePercent}%</strong>
        </p>
        <p>The bar chart shows which age ranges have higher prevalence.</p>
        <p>Filters dynamically update charts and statistics.</p>
        <p className="mt-2 text-xs text-slate-400">
          *Incidence analysis requires time-based data. Current dataset supports prevalence only.
        </p>
      </div>
    </div>
  )
}

export default IncidencePrevalence
