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

const TreatmentData = () => {
  const [minAge, setMinAge] = useState(0)
  const [maxAge, setMaxAge] = useState(100)
  const [gallstoneFilter, setGallstoneFilter] = useState('All')
  const { data } = useContext(DataContext)

  const filtered = useMemo(
    () =>
      data.filter((item) => {
        const age = Number(item.Age || 0)
        const ageMatch = age >= minAge && age <= maxAge

        let gallstoneMatch = true
        if (gallstoneFilter === 'Yes') gallstoneMatch = item['Gallstone Status'] === '1'
        if (gallstoneFilter === 'No') gallstoneMatch = item['Gallstone Status'] === '0'

        return ageMatch && gallstoneMatch
      }),
    [data, minAge, maxAge, gallstoneFilter]
  )

  const pieData = useMemo(() => {
    const counts = { Yes: 0, No: 0 }
    filtered.forEach((item) => {
      const status = Number(item['Gallstone Status'] || 0)
      status === 1 ? counts.Yes++ : counts.No++
    })
    return [
      { name: 'Yes', value: counts.Yes },
      { name: 'No', value: counts.No },
    ]
  }, [filtered])

  const clinicalData = useMemo(
    () =>
      filtered.map((item, idx) => ({
        name: `P${idx + 1}`,
        BMI: Number(item['Body Mass Index (BMI)'] || 0),
        TBW: Number(item['Total Body Water (TBW)'] || 0),
      })),
    [filtered]
  )

  const fatData = useMemo(() => {
    const counts = { Visceral: 0, Total: 0 }
    filtered.forEach((item) => {
      counts.Visceral += Number(item['Visceral Fat Rating (VFR)'] || 0)
      counts.Total += Number(item['Total Fat Content (TFC)'] || 0)
    })
    return [
      { name: 'Visceral Fat', value: counts.Visceral },
      { name: 'Total Fat', value: counts.Total },
    ]
  }, [filtered])

  if (data.length === 0) return <Loader />

  const chartMinWidth = Math.max(280, clinicalData.length * 16)
  const palette = [THEME.accent1, THEME.accent2, THEME.accent3, THEME.accent4]

  return (
    <div className="page">
      <h2 className="page-title">Treatment Data</h2>

      <div className="card filter-row mb-6">
        <div className="filter-item">
          <label htmlFor="td-min-age">Min Age</label>
          <input
            id="td-min-age"
            type="number"
            value={minAge}
            onChange={(e) => setMinAge(Number(e.target.value))}
            className="filter-control"
          />
        </div>
        <div className="filter-item">
          <label htmlFor="td-max-age">Max Age</label>
          <input
            id="td-max-age"
            type="number"
            value={maxAge}
            onChange={(e) => setMaxAge(Number(e.target.value))}
            className="filter-control"
          />
        </div>
        <div className="filter-item">
          <label htmlFor="td-gallstone">Gallstone</label>
          <select
            id="td-gallstone"
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

      <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="card">
          <h3 className="mb-2 text-center font-semibold text-sky-400">Gallstone Status</h3>
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
                  label
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={palette[index % 4]} />
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
          <h3 className="mb-2 text-center font-semibold text-green-400">BMI & TBW</h3>
          <div className="chart-scroll">
            <div className="h-[260px] sm:h-[300px]" style={{ minWidth: chartMinWidth }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clinicalData}>
                  <XAxis dataKey="name" stroke={THEME.muted} />
                  <YAxis stroke={THEME.muted} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: THEME.card,
                      border: `1px solid ${THEME.accent2}`,
                      color: THEME.text,
                    }}
                  />
                  <Legend wrapperStyle={{ color: THEME.text }} />
                  <Bar dataKey="BMI" radius={[5, 5, 0, 0]}>
                    {clinicalData.map((_, index) => (
                      <Cell key={index} fill={palette[index % 4]} />
                    ))}
                  </Bar>
                  <Bar dataKey="TBW" radius={[5, 5, 0, 0]}>
                    {clinicalData.map((_, index) => (
                      <Cell key={`tbw-${index}`} fill={palette[(index + 1) % 4]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="mb-2 text-center font-semibold text-orange-400">Fat Distribution</h3>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={fatData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius="70%"
                  label
                >
                  {fatData.map((_, index) => (
                    <Cell key={index} fill={palette[(index + 2) % 4]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: THEME.card,
                    border: `1px solid ${THEME.accent3}`,
                    color: THEME.text,
                  }}
                />
                <Legend verticalAlign="bottom" wrapperStyle={{ color: THEME.text }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="card">
          <h4 className="mb-2 font-semibold text-sky-400">Gallstone Status Analysis</h4>
          <p>
            Shows how many patients have gallstones vs no gallstones in the selected age range and
            filter.
          </p>
        </div>
        <div className="card">
          <h4 className="mb-2 font-semibold text-green-400">BMI & TBW Insights</h4>
          <p>
            Compare BMI and Total Body Water for each patient. Helps assess hydration and body
            composition.
          </p>
        </div>
        <div className="card">
          <h4 className="mb-2 font-semibold text-orange-400">Fat Distribution Insights</h4>
          <p>
            Shows distribution of visceral fat and total fat among patients. Helps understand
            obesity and risk factors.
          </p>
        </div>
      </div>
    </div>
  )
}

export default TreatmentData
