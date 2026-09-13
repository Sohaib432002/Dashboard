import { useContext, useMemo, useState } from 'react'
import { Bar, BarChart, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { DataContext } from '../../useContext'

const THEME = {
  text: '#e5e7eb',
  barColors: ['#38bdf8', '#22c55e'],
}

const AGE_RANGES = {
  All: [0, 200],
  '0-20': [0, 20],
  '21-40': [21, 40],
  '41-60': [41, 60],
  '61-80': [61, 80],
  '81-100': [81, 100],
}

export default function ComorbidityBar() {
  const { data } = useContext(DataContext)
  const [ageRange, setAgeRange] = useState('All')
  const [gender, setGender] = useState('All')
  const [gallstone, setGallstone] = useState('All')

  const filteredData = useMemo(() => {
    const [minAge, maxAge] = AGE_RANGES[ageRange]

    return data.filter((row) => {
      const age = Number(row.Age)
      const genderVal = Number(row.Gender)
      const gallVal = Number(row['Gallstone Status'])
      const ageOk = age >= minAge && age <= maxAge
      const genderOk =
        gender === 'All' ? true : gender === 'Male' ? genderVal === 0 : genderVal === 1
      const gallstoneOk =
        gallstone === 'All' ? true : gallstone === 'Yes' ? gallVal === 1 : gallVal === 0

      return ageOk && genderOk && gallstoneOk
    })
  }, [data, ageRange, gender, gallstone])

  const chartData = [
    {
      label: 'No Comorbidity',
      count: filteredData.filter((r) => Number(r.Comorbidity) === 0).length,
    },
    { label: 'Comorbidity', count: filteredData.filter((r) => Number(r.Comorbidity) === 1).length },
  ]

  return (
    <div className="card">
      <div className="filter-row mb-5 justify-center">
        <div className="filter-item">
          <label htmlFor="com-age">Age Range</label>
          <select
            id="com-age"
            value={ageRange}
            onChange={(e) => setAgeRange(e.target.value)}
            className="filter-control"
          >
            {Object.keys(AGE_RANGES).map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-item">
          <label htmlFor="com-gender">Gender</label>
          <select
            id="com-gender"
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
          <label htmlFor="com-gallstone">Gallstone</label>
          <select
            id="com-gallstone"
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

      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="label" stroke={THEME.text} />
            <YAxis stroke={THEME.text} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {chartData.map((_, index) => (
                <Cell key={index} fill={THEME.barColors[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
