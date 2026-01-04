// LipidsLine.jsx
import { useMemo, useState } from 'react'
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

// ================= THEME =================
const THEME = {
  bg: '#0f172a', // page background
  card: '#1e293b', // card background
  text: '#e5e7eb', // main text
  muted: '#94a3b8', // axis / border
  lineColors: ['#38bdf8', '#00a3e0', '#0056b3', '#f97316'], // TC, LDL, HDL, Triglyceride
}

// ================= FILTER OPTIONS =================
const AGE_OPTIONS = ['All', '0-20', '21-40', '41-60', '61-80', '81-100']
const GENDER_OPTIONS = ['All', 'Male', 'Female']
const COMORBIDITY_OPTIONS = ['All', 'Yes', 'No']
const GALLSTONE_OPTIONS = ['All', 'Yes', 'No']
const LIPID_OPTIONS = ['All', 'Normal', 'Over', 'High']

// ================= LIPID RANGES =================
const LIPID_RANGES = {
  TC: { Normal: [0, 200], Over: [201, 239], High: [240, 400] },
  LDL: { Normal: [0, 129], Over: [130, 159], High: [160, 300] },
  HDL: { Normal: [40, 60], Over: [61, 100], High: [101, 150] },
  Triglyceride: { Normal: [0, 149], Over: [150, 199], High: [200, 300] },
}

export default function LipidsLine({ data }) {
  // ================= FILTER STATES =================
  const [ageRange, setAgeRange] = useState('All')
  const [gender, setGender] = useState('All')
  const [comorbidity, setComorbidity] = useState('All')
  const [gallstone, setGallstone] = useState('All')
  const [tcStatus, setTcStatus] = useState('All')
  const [ldlStatus, setLdlStatus] = useState('All')
  const [hdlStatus, setHdlStatus] = useState('All')
  const [triStatus, setTriStatus] = useState('All')

  // ================= FILTER DATA =================
  const filteredData = useMemo(() => {
    return data
      .map((row) => ({
        ...row,
        TC: Number(row['Total Cholesterol (TC)'] || 0),
        LDL: Number(row['Low Density Lipoprotein (LDL)'] || 0),
        HDL: Number(row['High Density Lipoprotein (HDL)'] || 0),
        Triglyceride: Number(row['Triglyceride'] || 0),
        GallstoneStatus: Number(row['Gallstone Status'] || 0), // 1 = Yes, 0 = No
        Comorbidity: Number(row.Comorbidity || 0), // 1 = Yes, 0 = No
        Gender: Number(row.Gender || 0), // 0 = Male, 1 = Female
      }))
      .filter((row) => {
        let ageOk = true
        let genderOk = true
        let comorbOk = true
        let gallstoneOk = true
        let tcOk = true
        let ldlOk = true
        let hdlOk = true
        let triOk = true

        // Age filter
        if (ageRange !== 'All') {
          const [min, max] = ageRange.split('-').map(Number)
          ageOk = Number(row.Age) >= min && Number(row.Age) <= max
        }

        // Gender filter
        if (gender !== 'All') {
          genderOk = gender === 'Male' ? row.Gender === 0 : row.Gender === 1
        }

        // Comorbidity filter
        if (comorbidity !== 'All') {
          comorbOk = comorbidity === 'Yes' ? row.Comorbidity === 1 : row.Comorbidity === 0
        }

        // Gallstone filter
        if (gallstone !== 'All') {
          gallstoneOk = gallstone === 'Yes' ? row.GallstoneStatus === 1 : row.GallstoneStatus === 0
        }

        // Lipid filters
        const checkLipid = (value, status, type) => {
          if (status === 'All') return true
          const [min, max] = LIPID_RANGES[type][status]
          return value >= min && value <= max
        }

        tcOk = checkLipid(row.TC, tcStatus, 'TC')
        ldlOk = checkLipid(row.LDL, ldlStatus, 'LDL')
        hdlOk = checkLipid(row.HDL, hdlStatus, 'HDL')
        triOk = checkLipid(row.Triglyceride, triStatus, 'Triglyceride')

        return ageOk && genderOk && comorbOk && gallstoneOk && tcOk && ldlOk && hdlOk && triOk
      })
  }, [data, ageRange, gender, comorbidity, gallstone, tcStatus, ldlStatus, hdlStatus, triStatus])

  const chartData = filteredData.map((row, index) => ({
    index: index + 1,
    TC: row.TC,
    LDL: row.LDL,
    HDL: row.HDL,
    Triglyceride: row.Triglyceride,
  }))

  // ================= STYLES =================
  const cardStyle = {
    background: THEME.card,
    borderRadius: 16,
    padding: 20,
    color: THEME.text,
    boxShadow: '0 8px 20px rgba(56,189,248,0.15)',
  }

  const filterContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 20,
    justifyContent: 'center',
  }

  const filterItemStyle = { display: 'flex', flexDirection: 'column', width: 150 }

  const inputStyle = {
    padding: '8px 12px',
    borderRadius: 8,
    background: THEME.bg,
    color: THEME.text,
    border: `1px solid ${THEME.muted}`,
    outline: 'none',
    width: '100%',
  }

  const titleStyle = {
    textAlign: 'center',
    marginBottom: 5,
    fontWeight: 600,
    color: THEME.text,
    fontSize: 16,
  }

  // ================= PATIENT COUNT =================
  const patientCount = filteredData.length

  return (
    <div style={cardStyle}>
      {/* Title */}
      <div style={titleStyle}>Lipid Profile Trends</div>
      <div style={{ textAlign: 'center', marginBottom: 15, color: THEME.text }}>
        Showing <strong>{patientCount}</strong> patients
      </div>

      {/* Filters */}
      <div style={filterContainerStyle}>
        <div style={filterItemStyle}>
          <label>Age Range</label>
          <select value={ageRange} onChange={(e) => setAgeRange(e.target.value)} style={inputStyle}>
            {AGE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div style={filterItemStyle}>
          <label>Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} style={inputStyle}>
            {GENDER_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div style={filterItemStyle}>
          <label>Comorbidity</label>
          <select
            value={comorbidity}
            onChange={(e) => setComorbidity(e.target.value)}
            style={inputStyle}
          >
            {COMORBIDITY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div style={filterItemStyle}>
          <label>Gallstone Status</label>
          <select
            value={gallstone}
            onChange={(e) => setGallstone(e.target.value)}
            style={inputStyle}
          >
            {GALLSTONE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Lipid Dropdown Filters */}
        <div style={filterItemStyle}>
          <label>TC</label>
          <select value={tcStatus} onChange={(e) => setTcStatus(e.target.value)} style={inputStyle}>
            {LIPID_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div style={filterItemStyle}>
          <label>LDL</label>
          <select
            value={ldlStatus}
            onChange={(e) => setLdlStatus(e.target.value)}
            style={inputStyle}
          >
            {LIPID_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div style={filterItemStyle}>
          <label>HDL</label>
          <select
            value={hdlStatus}
            onChange={(e) => setHdlStatus(e.target.value)}
            style={inputStyle}
          >
            {LIPID_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div style={filterItemStyle}>
          <label>Triglyceride</label>
          <select
            value={triStatus}
            onChange={(e) => setTriStatus(e.target.value)}
            style={inputStyle}
          >
            {LIPID_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Line Chart */}
      <div style={{ width: '100%', height: 360 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="index" stroke={THEME.text} tick={{ fill: THEME.text, fontSize: 12 }} />
            <YAxis stroke={THEME.text} tick={{ fill: THEME.text, fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                borderRadius: 10,
                padding: 10,
                backgroundColor: THEME.card,
                border: `1px solid ${THEME.lineColors[0]}`,
                color: THEME.text,
                fontSize: '0.875rem',
              }}
            />
            <Legend wrapperStyle={{ color: THEME.text, fontWeight: 600, fontSize: 12 }} />

            <Line type="monotone" dataKey="TC" stroke={THEME.lineColors[0]} strokeWidth={2} />
            <Line type="monotone" dataKey="LDL" stroke={THEME.lineColors[1]} strokeWidth={2} />
            <Line type="monotone" dataKey="HDL" stroke={THEME.lineColors[2]} strokeWidth={2} />
            <Line
              type="monotone"
              dataKey="Triglyceride"
              stroke={THEME.lineColors[3]}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
