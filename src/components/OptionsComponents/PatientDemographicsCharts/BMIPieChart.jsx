import { useContext, useEffect, useState } from 'react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { DataContext } from '../../useContext'

const THEME = {
  pieColors: ['#38bdf8', '#22c55e', '#f97316', '#a855f7'],
}

const BMIPieChart = () => {
  const { data } = useContext(DataContext)
  const [minAge, setMinAge] = useState(0)
  const [maxAge, setMaxAge] = useState(100)
  const [gender, setGender] = useState('all')
  const [stoneFilter, setStoneFilter] = useState('all')
  const [filteredData, setFilteredData] = useState([])

  useEffect(() => {
    const temp = data.filter((person) => {
      const age = Number(person.Age)
      if (isNaN(age)) return false
      if (age < minAge || age > maxAge) return false

      if (gender !== 'all' && Number(person.Gender) !== Number(gender)) {
        return false
      }

      if (stoneFilter === 'yes') return Number(person['Gallstone Status']) === 1
      if (stoneFilter === 'no') return Number(person['Gallstone Status']) === 0

      return true
    })

    setFilteredData(temp)
  }, [minAge, maxAge, gender, stoneFilter, data])

  const bmiBins = {
    Underweight: 0,
    Normal: 0,
    Overweight: 0,
    Obese: 0,
  }

  filteredData.forEach((item) => {
    const bmi = Number(item.BMI || item['Body Mass Index (BMI)'])
    if (!isNaN(bmi)) {
      if (bmi < 18.5) bmiBins.Underweight++
      else if (bmi < 25) bmiBins.Normal++
      else if (bmi < 30) bmiBins.Overweight++
      else bmiBins.Obese++
    }
  })

  const chartData = Object.entries(bmiBins).map(([name, value]) => ({
    name,
    value,
  }))

  return (
    <div className="card">
      <div className="filter-row mb-5 justify-center">
        <div className="filter-item">
          <label htmlFor="bmi-min-age">Min Age</label>
          <input
            id="bmi-min-age"
            type="number"
            value={minAge}
            onChange={(e) => setMinAge(Number(e.target.value))}
            className="filter-control"
          />
        </div>
        <div className="filter-item">
          <label htmlFor="bmi-max-age">Max Age</label>
          <input
            id="bmi-max-age"
            type="number"
            value={maxAge}
            onChange={(e) => setMaxAge(Number(e.target.value))}
            className="filter-control"
          />
        </div>
        <div className="filter-item">
          <label htmlFor="bmi-gender">Gender</label>
          <select
            id="bmi-gender"
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
          <label htmlFor="bmi-gallstone">Gallstone</label>
          <select
            id="bmi-gallstone"
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
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius="70%"
              label={({ name, percent }) =>
                percent > 0 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''
              }
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={THEME.pieColors[index % THEME.pieColors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default BMIPieChart
