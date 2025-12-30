import { useContext, useState } from 'react'
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { DataContext } from '../../useContext'

const Histogram = () => {
  const [minAge, setMinAge] = useState(0)
  const [maxAge, setMaxAge] = useState(100)

  const { data } = useContext(DataContext)

  // Age bins
  const ageBins = Array.from({ length: 10 }, (_, i) => ({
    range: `${i * 10}-${i * 10 + 10}`,
    start: i * 10,
    end: i * 10 + 10,
    count: 0,
  }))

  // Count patients in each bin
  data.forEach((person) => {
    const age = parseInt(person['Age'])
    if (!isNaN(age)) {
      const binIndex = Math.floor(age / 10)
      if (ageBins[binIndex]) ageBins[binIndex].count++
    }
  })

  // Filter by min/max age
  const chartData = ageBins.filter((bin) => bin.start >= minAge && bin.end <= maxAge)

  return (
    <div className="w-full bg-gradient-to-br from-[#000046] to-[#1cb5e0] p-3 sm:p-5 rounded-lg shadow-lg text-white">
      {/* Filters */}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-4 items-center justify-center">
        {/* Min Age */}
        <div className="flex flex-col w-full sm:w-40">
          <label className="mb-1 text-white font-medium text-sm sm:text-base">Min Age</label>
          <input
            type="number"
            value={minAge}
            onChange={(e) => setMinAge(parseInt(e.target.value))}
            className="px-2 sm:px-3 py-2 bg-gradient-to-br from-[#000046]/70 to-[#1cb5e0]/70 border border-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1cb5e0] text-white text-sm sm:text-base"
            min={0}
          />
        </div>

        {/* Max Age */}
        <div className="flex flex-col w-full sm:w-40">
          <label className="mb-1 text-white font-medium text-sm sm:text-base">Max Age</label>
          <input
            type="number"
            value={maxAge}
            onChange={(e) => setMaxAge(parseInt(e.target.value))}
            className="px-2 sm:px-3 py-2 bg-gradient-to-br from-[#000046]/70 to-[#1cb5e0]/70 border border-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1cb5e0] text-white text-sm sm:text-base"
            min={0}
          />
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-[300px] sm:h-[330px] md:h-[360px] lg:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="range" stroke="#ffffff" tick={{ fontSize: 12 }} />
            <YAxis stroke="#ffffff" tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                borderRadius: '10px',
                padding: '10px',
                backgroundColor: '#000046',
                border: '1px solid #1cb5e0',
                color: '#ffffff',
                fontSize: '0.875rem',
              }}
            />
            <Legend wrapperStyle={{ color: '#ffffff', fontSize: 12 }} />
            <Bar dataKey="count" radius={[8, 8, 0, 0]} fill="url(#barGradient)" stroke="#ffffff">
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1cb5e0" />
                  <stop offset="100%" stopColor="#000046" />
                </linearGradient>
              </defs>
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Histogram
