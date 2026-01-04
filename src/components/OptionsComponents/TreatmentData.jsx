// TreatmentData.jsx
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

// ================= SAME THEME =================
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

// ================= STYLES =================
const cardStyle = {
  background: THEME.card,
  borderRadius: 16,
  padding: 25,
  color: THEME.text,
  boxShadow: '0 10px 25px rgba(56,189,248,0.15)',
  marginBottom: 30,
}

const inputStyle = {
  padding: '8px 12px',
  borderRadius: 8,
  marginRight: 15,
  background: THEME.bg,
  color: THEME.text,
  border: `1px solid ${THEME.accent1}`,
}

const TreatmentData = () => {
  const [minAge, setMinAge] = useState(0)
  const [maxAge, setMaxAge] = useState(100)
  const [gallstoneFilter, setGallstoneFilter] = useState('All') // New filter
  const { data } = useContext(DataContext)

  /* ================= FILTER DATA ================= */
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

  /* ================= PIE DATA: Gallstone Status ================= */
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

  /* ================= BAR DATA: BMI & TBW ================= */
  const clinicalData = useMemo(
    () =>
      filtered.map((item, idx) => ({
        name: `P${idx + 1}`,
        BMI: Number(item['Body Mass Index (BMI)'] || 0),
        TBW: Number(item['Total Body Water (TBW)'] || 0),
      })),
    [filtered]
  )

  /* ================= PIE DATA: Fat Distribution ================= */
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

  return (
    <div
      style={{
        padding: 25,
        background: `linear-gradient(to bottom, ${THEME.bg}, #020617)`,
        minHeight: '100vh',
      }}
    >
      <h2 style={{ color: THEME.text, fontSize: 28, marginBottom: 20 }}>Treatment Data</h2>

      {/* ================= FILTERS ================= */}
      <div style={{ ...cardStyle, display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 30 }}>
        <div>
          <label>Min Age:</label>
          <input
            type="number"
            value={minAge}
            onChange={(e) => setMinAge(Number(e.target.value))}
            style={inputStyle}
          />
        </div>
        <div>
          <label>Max Age:</label>
          <input
            type="number"
            value={maxAge}
            onChange={(e) => setMaxAge(Number(e.target.value))}
            style={inputStyle}
          />
        </div>
        <div>
          <label>Gallstone:</label>
          <select
            value={gallstoneFilter}
            onChange={(e) => setGallstoneFilter(e.target.value)}
            style={inputStyle}
          >
            <option value="All">All</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
      </div>

      {/* ================= CHARTS ================= */}
      <div className="flex flex-col md:flex-row gap-5 mb-5">
        {/* Gallstone Status Pie */}
        <div style={{ ...cardStyle, flex: 1 }}>
          <h3 style={{ textAlign: 'center', color: THEME.accent1 }}>Gallstone Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={[THEME.accent1, THEME.accent2, THEME.accent3, THEME.accent4][index % 4]}
                  />
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

        {/* BMI & TBW Bar */}
        <div style={{ ...cardStyle, flex: 1 }}>
          <h3 style={{ textAlign: 'center', color: THEME.accent2 }}>BMI & TBW</h3>
          <ResponsiveContainer width="100%" height={250}>
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
                  <Cell
                    key={index}
                    fill={[THEME.accent1, THEME.accent2, THEME.accent3, THEME.accent4][index % 4]}
                  />
                ))}
              </Bar>
              <Bar dataKey="TBW" radius={[5, 5, 0, 0]}>
                {clinicalData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={[THEME.accent2, THEME.accent3, THEME.accent4, THEME.accent1][index % 4]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Fat Distribution Pie */}
        <div style={{ ...cardStyle, flex: 1 }}>
          <h3 style={{ textAlign: 'center', color: THEME.accent3 }}>Fat Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={fatData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {fatData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={[THEME.accent3, THEME.accent4, THEME.accent1, THEME.accent2][index % 4]}
                  />
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

      {/* ================= INSIGHTS ================= */}
      <div className="flex flex-col md:flex-row gap-5">
        <div style={{ ...cardStyle, flex: 1 }}>
          <h4 style={{ color: THEME.accent1, marginBottom: 10 }}>Gallstone Status Analysis</h4>
          <p style={{ color: THEME.text }}>
            Shows how many patients have gallstones vs no gallstones in the selected age range and
            filter.
          </p>
        </div>
        <div style={{ ...cardStyle, flex: 1 }}>
          <h4 style={{ color: THEME.accent2, marginBottom: 10 }}>BMI & TBW Insights</h4>
          <p style={{ color: THEME.text }}>
            Compare BMI and Total Body Water for each patient. Helps assess hydration and body
            composition.
          </p>
        </div>
        <div style={{ ...cardStyle, flex: 1 }}>
          <h4 style={{ color: THEME.accent3, marginBottom: 10 }}>Fat Distribution Insights</h4>
          <p style={{ color: THEME.text }}>
            Shows distribution of visceral fat and total fat among patients. Helps understand
            obesity and risk factors.
          </p>
        </div>
      </div>
    </div>
  )
}

export default TreatmentData
