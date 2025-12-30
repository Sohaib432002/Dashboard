import { useContext, useMemo, useState } from 'react'
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { DataContext } from '../../useContext'

export default function ComorbidityBar() {
  const [ageRange, setAgeRange] = useState('All')
  const [gender, setGender] = useState('All')
  const { data } = useContext(DataContext)

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      let ageOk = true
      let genderOk = true

      if (ageRange !== 'All') {
        const [min, max] = ageRange.split('-').map(Number)
        ageOk = Number(row.Age) >= min && Number(row.Age) <= max
      }

      if (gender !== 'All') {
        genderOk = gender === 'Male' ? Number(row.Gender) === 0 : Number(row.Gender) === 1
      }

      return ageOk && genderOk
    })
  }, [data, ageRange, gender])

  let noCount = 0
  let yesCount = 0
  filteredData.forEach((row) => {
    if (Number(row.Comorbidity) === 0) noCount++
    else yesCount++
  })

  const chartData = [
    { label: 'No', count: noCount },
    { label: 'Yes', count: yesCount },
  ]

  return (
    <div className="bg-gradient-to-br from-[#000046] to-[#1cb5e0] shadow-lg rounded-xl p-4 sm:p-6 text-white">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap mb-6 items-center justify-center gap-4">
        {/* Age Filter */}
        <div className="flex flex-col w-full sm:w-40">
          <label className="mb-1 font-medium text-white text-sm sm:text-base">Age Range</label>
          <select
            className="w-full px-2 sm:px-3 py-2 bg-gradient-to-br from-[#000046]/70 to-[#1cb5e0]/70 border border-white rounded-lg focus:ring-2 focus:ring-[#1cb5e0] text-white text-sm sm:text-base"
            value={ageRange}
            onChange={(e) => setAgeRange(e.target.value)}
          >
            <option value="All">All</option>
            <option value="0-20">0-20</option>
            <option value="21-40">21-40</option>
            <option value="41-60">41-60</option>
            <option value="61-80">61-80</option>
            <option value="81-100">81-100</option>
          </select>
        </div>

        {/* Gender Filter */}
        <div className="flex flex-col w-full sm:w-40">
          <label className="mb-1 font-medium text-white text-sm sm:text-base">Gender</label>
          <select
            className="w-full px-2 sm:px-3 py-2 bg-gradient-to-br from-[#000046]/70 to-[#1cb5e0]/70 border border-white rounded-lg focus:ring-2 focus:ring-[#1cb5e0] text-white text-sm sm:text-base"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-[300px] sm:h-[320px] md:h-[360px] lg:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="label" stroke="#ffffff" />
            <YAxis stroke="#ffffff" />
            <Tooltip
              contentStyle={{
                borderRadius: '10px',
                border: '1px solid #1cb5e0',
                backgroundColor: '#000046',
                color: '#ffffff',
                fontSize: '0.875rem',
              }}
            />
            <Legend wrapperStyle={{ color: '#ffffff', fontSize: '0.875rem' }} />
            <Bar dataKey="count" fill="url(#barGradient)" radius={[4, 4, 0, 0]}>
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
