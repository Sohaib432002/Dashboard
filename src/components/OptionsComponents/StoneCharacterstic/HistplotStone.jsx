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

// Gradient colors
const GRADIENT_START = '#000046'
const GRADIENT_END = '#1cb5e0'
const TEXT_COLOR = '#ffffff'

// Pie chart component
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
    <div className="w-full h-[300px] sm:h-[350px] md:h-[400px] p-3 rounded-lg shadow-lg bg-gradient-to-br from-[#000046] to-[#1cb5e0]">
      <h2 className="text-center font-bold text-lg mb-2" style={{ color: TEXT_COLOR }}>
        Gallstone Status Distribution
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <RePieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius="70%"
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index === 0 ? GRADIENT_END : GRADIENT_START} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: GRADIENT_START,
              border: `1px solid ${GRADIENT_END}`,
              color: TEXT_COLOR,
              borderRadius: 8,
              padding: 8,
            }}
          />
          <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: TEXT_COLOR }} />
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

  const cardClasses =
    'space-y-8 p-6 rounded-xl shadow-lg bg-gradient-to-br from-[#000046] to-[#1cb5e0] text-white'

  const inputClasses =
    'px-3 py-2 rounded-lg border border-white bg-gradient-to-br from-[#000046]/70 to-[#1cb5e0]/70 text-white focus:outline-none focus:ring-2 focus:ring-[#1cb5e0]'

  return (
    <div className={cardClasses}>
      <h3 className="text-center text-xl font-semibold mb-4">
        Gallstone Status Distribution by Age
      </h3>

      {/* Filters */}
      <div className="flex flex-wrap gap-5 justify-center">
        <div className="flex flex-col">
          <label className="mb-1">Min Age</label>
          <input
            type="number"
            value={minAge}
            onChange={(e) => setMinAge(Number(e.target.value) || 0)}
            min={0}
            className={inputClasses}
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1">Max Age</label>
          <input
            type="number"
            value={maxAge}
            onChange={(e) => setMaxAge(Number(e.target.value) || 100)}
            min={0}
            className={inputClasses}
          />
        </div>
      </div>

      {/* Bar Chart */}
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="status" stroke={TEXT_COLOR} />
            <YAxis stroke={TEXT_COLOR} />
            <Tooltip
              contentStyle={{
                borderRadius: 10,
                padding: 10,
                backgroundColor: GRADIENT_START,
                border: `1px solid ${GRADIENT_END}`,
                color: TEXT_COLOR,
              }}
            />
            <Legend wrapperStyle={{ color: TEXT_COLOR }} />
            <Bar dataKey="count" radius={[8, 8, 0, 0]} stroke={TEXT_COLOR}>
              <Cell fill={GRADIENT_END} />
              <Cell fill={GRADIENT_START} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="w-full h-[300px]">
        <StoneStatusPie data={filtered} />
      </div>
    </div>
  )
}

export default HistplotStone
