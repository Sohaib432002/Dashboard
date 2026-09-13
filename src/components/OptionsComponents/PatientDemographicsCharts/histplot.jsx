import { useContext, useState } from 'react'
import { Bar, BarChart, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { DataContext } from '../../useContext'

const THEME = {
  text: '#e5e7eb',
  barColors: ['#38bdf8', '#1c92f2'],
}

const Histogram = () => {
  const { data } = useContext(DataContext)
  const [minAge, setMinAge] = useState(0)
  const [maxAge, setMaxAge] = useState(100)
  const [stoneFilter, setStoneFilter] = useState('all')

  const filteredData = data.filter((person) => {
    const age = Number(person.Age)
    if (isNaN(age)) return false
    if (age < minAge || age > maxAge) return false

    if (stoneFilter === 'yes') return person['Gallstone Status'] === '1'
    if (stoneFilter === 'no') return person['Gallstone Status'] === '0'

    return true
  })

  const ageBins = Array.from({ length: 10 }, (_, i) => ({
    range: `${i * 10}-${i * 10 + 9}`,
    count: 0,
  }))

  filteredData.forEach((person) => {
    const age = Number(person.Age)
    const index = Math.floor(age / 10)
    if (ageBins[index]) ageBins[index].count++
  })

  return (
    <div className="card">
      <div className="filter-row mb-5 justify-center">
        <div className="filter-item">
          <label htmlFor="hist-min-age">Min Age</label>
          <input
            id="hist-min-age"
            type="number"
            value={minAge}
            min={0}
            onChange={(e) => setMinAge(Number(e.target.value))}
            className="filter-control"
          />
        </div>
        <div className="filter-item">
          <label htmlFor="hist-max-age">Max Age</label>
          <input
            id="hist-max-age"
            type="number"
            value={maxAge}
            min={0}
            onChange={(e) => setMaxAge(Number(e.target.value))}
            className="filter-control"
          />
        </div>
        <div className="filter-item">
          <label htmlFor="hist-gallstone">Gallstone</label>
          <select
            id="hist-gallstone"
            value={stoneFilter}
            onChange={(e) => setStoneFilter(e.target.value)}
            className="filter-control"
          >
            <option value="all">All</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
      </div>

      <div className="chart-wrap">
        <ResponsiveContainer>
          <BarChart data={ageBins}>
            <XAxis dataKey="range" stroke={THEME.text} />
            <YAxis stroke={THEME.text} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {ageBins.map((_, i) => (
                <Cell key={i} fill={THEME.barColors[i % THEME.barColors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Histogram
