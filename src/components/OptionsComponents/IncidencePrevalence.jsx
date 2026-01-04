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

/* ================= THEME ================= */
const THEME = {
  bg: '#0f172a',
  card: '#020617',
  grid: '#1e293b',
  text: '#e5e7eb',
  muted: '#94a3b8',
  accent1: '#38bdf8', // Blue
  accent2: '#22c55e', // Green
  accent3: '#f97316', // Orange
  accent4: '#a855f7', // Purple
}

const PIE_COLORS = [THEME.accent1, THEME.accent2]
const BAR_COLORS = [THEME.accent1, THEME.accent2, THEME.accent3, THEME.accent4]

const IncidencePrevalence = () => {
  const [minAge, setMinAge] = useState(0)
  const [maxAge, setMaxAge] = useState(100)
  const { data } = useContext(DataContext)

  /* ================= FILTER DATA ================= */
  const filtered = useMemo(
    () =>
      data.filter((item) => {
        const age = Number(item.Age || 0)
        return age >= minAge && age <= maxAge
      }),
    [data, minAge, maxAge]
  )

  /* ================= PIE DATA ================= */
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

  /* ================= BAR DATA ================= */
  const barData = useMemo(() => {
    const bins = { '0-30': 0, '31-40': 0, '41-50': 0, '51-60': 0, '61+': 0 }
    filtered.forEach((item) => {
      const age = Number(item.Age || 0)
      if (Number(item['Gallstone Status'] || 0) === 1) {
        if (age <= 30) bins['0-30']++
        else if (age <= 40) bins['31-40']++
        else if (age <= 50) bins['41-50']++
        else if (age <= 60) bins['51-60']++
        else bins['61+']++
      }
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

  /* ================= STYLES ================= */
  const cardStyle = {
    background: THEME.card,
    borderRadius: 16,
    padding: 20,
    color: THEME.text,
    boxShadow: '0 10px 25px rgba(56,189,248,0.15)',
  }

  const inputStyle = {
    padding: '8px 12px',
    borderRadius: 8,
    marginRight: 15,
    background: THEME.bg,
    color: THEME.text,
    border: `1px solid ${THEME.accent1}`,
  }

  return (
    <div
      style={{
        padding: 25,
        background: `linear-gradient(to bottom, ${THEME.bg}, #020617)`,
        minHeight: '100vh',
      }}
    >
      <h2 style={{ color: THEME.text, fontSize: 28, marginBottom: 20 }}>
        Gallstone Incidence & Prevalence
      </h2>

      {/* ================= FILTERS ================= */}
      <div
        style={{
          ...cardStyle,
          display: 'flex',
          gap: 20,
          flexWrap: 'wrap',
          marginBottom: 30,
        }}
      >
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
      </div>

      {/* ================= CHARTS ================= */}
      <div className="flex flex-col md:flex-row gap-5 mb-5">
        {/* ===== PIE CHART ===== */}
        <div style={{ ...cardStyle, flex: 1 }}>
          <h3 style={{ textAlign: 'center', color: THEME.accent1 }}>Overall Prevalence</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
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

        {/* ===== BAR CHART ===== */}
        <div style={{ ...cardStyle, flex: 1 }}>
          <h3 style={{ textAlign: 'center', color: THEME.accent2 }}>Prevalence by Age Group</h3>
          <ResponsiveContainer width="100%" height={300}>
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

      {/* ================= ANALYSIS ================= */}
      <div style={{ ...cardStyle }}>
        <h3 style={{ color: THEME.accent3, marginBottom: 10 }}>Analysis & Summary</h3>
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
        <p style={{ fontSize: 12, color: THEME.muted, marginTop: 10 }}>
          *Incidence analysis requires time-based data. Current dataset supports prevalence only.
        </p>
      </div>
    </div>
  )
}

export default IncidencePrevalence
