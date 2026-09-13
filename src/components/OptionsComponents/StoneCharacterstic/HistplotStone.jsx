import { useContext, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart as RePieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { DataContext } from '../../useContext'

const THEME = {
  bg: '#0f172a',
  card: '#1e293b',
  text: '#e5e7eb',
  barColors: ['#f43f5e', '#f97316', '#6366f1', '#14b8a6', '#facc15'],
  pieColors: ['#22c55e', '#eab308', '#3b82f6', '#f97316', '#8b5cf6'],
}

const StoneStatusPie = ({ data }) => {
  const chartData = useMemo(() => {
    const counts = { Yes: 0, No: 0 }
    data.forEach((item) => {
      const status = String(item['Gallstone Status']).toLowerCase()
      if (status === '1' || status === 'yes') counts.Yes++
      else counts.No++
    })
    return [
      { name: 'Yes', value: counts.Yes },
      { name: 'No', value: counts.No },
    ]
  }, [data])

  return (
    <div className="chart-wrap">
      <ResponsiveContainer width="100%" height="100%">
        <RePieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius="70%"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((_, index) => (
              <Cell
                key={index}
                fill={THEME.pieColors[index % THEME.pieColors.length]}
                stroke={THEME.bg}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: 10,
              padding: 10,
              backgroundColor: THEME.card,
              border: `1px solid ${THEME.barColors[0]}`,
              color: THEME.text,
            }}
          />
          <Legend wrapperStyle={{ color: THEME.text }} verticalAlign="bottom" />
        </RePieChart>
      </ResponsiveContainer>
    </div>
  )
}

const HistplotStone = () => {
  const [minAge, setMinAge] = useState(0)
  const [maxAge, setMaxAge] = useState(100)
  const { data } = useContext(DataContext)

  const filtered = useMemo(() => {
    if (!data || data.length === 0) return []
    return data.filter((item) => {
      const age = Number(item.Age)
      return !isNaN(age) && age >= minAge && age <= maxAge
    })
  }, [data, minAge, maxAge])

  const chartData = useMemo(() => {
    let yesCount = 0
    let noCount = 0
    filtered.forEach((item) => {
      const status = String(item['Gallstone Status']).toLowerCase()
      if (status === '1' || status === 'yes') yesCount++
      else noCount++
    })
    return [
      { status: 'Yes', count: yesCount },
      { status: 'No', count: noCount },
    ]
  }, [filtered])

  return (
    <div className="card flex flex-col gap-5">
      <div className="text-center text-lg font-semibold">Gallstone Status Distribution by Age</div>

      <div className="filter-row justify-center">
        <div className="filter-item">
          <label htmlFor="stone-min-age">Min Age</label>
          <input
            id="stone-min-age"
            type="number"
            value={minAge}
            onChange={(e) => setMinAge(Number(e.target.value) || 0)}
            className="filter-control"
            min={0}
          />
        </div>
        <div className="filter-item">
          <label htmlFor="stone-max-age">Max Age</label>
          <input
            id="stone-max-age"
            type="number"
            value={maxAge}
            onChange={(e) => setMaxAge(Number(e.target.value) || 100)}
            className="filter-control"
            min={0}
          />
        </div>
      </div>

      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="status" stroke={THEME.text} />
            <YAxis stroke={THEME.text} />
            <Tooltip
              contentStyle={{
                borderRadius: 10,
                padding: 10,
                backgroundColor: THEME.card,
                border: `1px solid ${THEME.barColors[0]}`,
                color: THEME.text,
              }}
            />
            <Legend wrapperStyle={{ color: THEME.text }} />
            <Bar dataKey="count" radius={[8, 8, 0, 0]} stroke={THEME.text}>
              {chartData.map((_, index) => (
                <Cell fill={THEME.barColors[index % THEME.barColors.length]} key={index} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <StoneStatusPie data={filtered} />
    </div>
  )
}

export default HistplotStone
