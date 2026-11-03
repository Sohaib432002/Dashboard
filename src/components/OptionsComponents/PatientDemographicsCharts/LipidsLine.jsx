import { useMemo, useState } from 'react'
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const THEME = {
  card: '#1e293b',
  text: '#e5e7eb',
  lineColors: ['#38bdf8', '#00a3e0', '#0056b3', '#f97316'],
}

const AGE_OPTIONS = ['All', '0-20', '21-40', '41-60', '61-80', '81-100']
const GENDER_OPTIONS = ['All', 'Male', 'Female']
const COMORBIDITY_OPTIONS = ['All', 'Yes', 'No']
const GALLSTONE_OPTIONS = ['All', 'Yes', 'No']
const LIPID_OPTIONS = ['All', 'Normal', 'Over', 'High']

const LIPID_RANGES = {
  TC: { Normal: [0, 200], Over: [201, 239], High: [240, 400] },
  LDL: { Normal: [0, 129], Over: [130, 159], High: [160, 300] },
  HDL: { Normal: [40, 60], Over: [61, 100], High: [101, 150] },
  Triglyceride: { Normal: [0, 149], Over: [150, 199], High: [200, 300] },
}

export default function LipidsLine({ data }) {
  const [ageRange, setAgeRange] = useState('All')
  const [gender, setGender] = useState('All')
  const [comorbidity, setComorbidity] = useState('All')
  const [gallstone, setGallstone] = useState('All')
  const [tcStatus, setTcStatus] = useState('All')
  const [ldlStatus, setLdlStatus] = useState('All')
  const [hdlStatus, setHdlStatus] = useState('All')
  const [triStatus, setTriStatus] = useState('All')

  const filteredData = useMemo(() => {
    return data
      .map((row) => ({
        ...row,
        TC: Number(row['Total Cholesterol (TC)'] || 0),
        LDL: Number(row['Low Density Lipoprotein (LDL)'] || 0),
        HDL: Number(row['High Density Lipoprotein (HDL)'] || 0),
        Triglyceride: Number(row['Triglyceride'] || 0),
        GallstoneStatus: Number(row['Gallstone Status'] || 0),
        Comorbidity: Number(row.Comorbidity || 0),
        Gender: Number(row.Gender || 0),
      }))
      .filter((row) => {
        let ageOk = true
        let genderOk = true
        let comorbOk = true
        let gallstoneOk = true

        if (ageRange !== 'All') {
          const [min, max] = ageRange.split('-').map(Number)
          ageOk = Number(row.Age) >= min && Number(row.Age) <= max
        }

        if (gender !== 'All') {
          genderOk = gender === 'Male' ? row.Gender === 0 : row.Gender === 1
        }

        if (comorbidity !== 'All') {
          comorbOk = comorbidity === 'Yes' ? row.Comorbidity === 1 : row.Comorbidity === 0
        }

        if (gallstone !== 'All') {
          gallstoneOk = gallstone === 'Yes' ? row.GallstoneStatus === 1 : row.GallstoneStatus === 0
        }

        const checkLipid = (value, status, type) => {
          if (status === 'All') return true
          const [min, max] = LIPID_RANGES[type][status]
          return value >= min && value <= max
        }

        return (
          ageOk &&
          genderOk &&
          comorbOk &&
          gallstoneOk &&
          checkLipid(row.TC, tcStatus, 'TC') &&
          checkLipid(row.LDL, ldlStatus, 'LDL') &&
          checkLipid(row.HDL, hdlStatus, 'HDL') &&
          checkLipid(row.Triglyceride, triStatus, 'Triglyceride')
        )
      })
  }, [data, ageRange, gender, comorbidity, gallstone, tcStatus, ldlStatus, hdlStatus, triStatus])

  const chartData = filteredData.map((row, index) => ({
    index: index + 1,
    TC: row.TC,
    LDL: row.LDL,
    HDL: row.HDL,
    Triglyceride: row.Triglyceride,
  }))

  return (
    <div className="card">
      <div className="mb-1 text-center text-base font-semibold">Lipid Profile Trends</div>
      <div className="mb-4 text-center">
        Showing <strong>{filteredData.length}</strong> patients
      </div>

      <div className="filter-row mb-5 justify-center">
        <div className="filter-item">
          <label htmlFor="lip-age">Age Range</label>
          <select
            id="lip-age"
            value={ageRange}
            onChange={(e) => setAgeRange(e.target.value)}
            className="filter-control"
          >
            {AGE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-item">
          <label htmlFor="lip-gender">Gender</label>
          <select
            id="lip-gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="filter-control"
          >
            {GENDER_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-item">
          <label htmlFor="lip-comorbidity">Comorbidity</label>
          <select
            id="lip-comorbidity"
            value={comorbidity}
            onChange={(e) => setComorbidity(e.target.value)}
            className="filter-control"
          >
            {COMORBIDITY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-item">
          <label htmlFor="lip-gallstone">Gallstone Status</label>
          <select
            id="lip-gallstone"
            value={gallstone}
            onChange={(e) => setGallstone(e.target.value)}
            className="filter-control"
          >
            {GALLSTONE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-item">
          <label htmlFor="lip-tc">TC</label>
          <select
            id="lip-tc"
            value={tcStatus}
            onChange={(e) => setTcStatus(e.target.value)}
            className="filter-control"
          >
            {LIPID_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-item">
          <label htmlFor="lip-ldl">LDL</label>
          <select
            id="lip-ldl"
            value={ldlStatus}
            onChange={(e) => setLdlStatus(e.target.value)}
            className="filter-control"
          >
            {LIPID_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-item">
          <label htmlFor="lip-hdl">HDL</label>
          <select
            id="lip-hdl"
            value={hdlStatus}
            onChange={(e) => setHdlStatus(e.target.value)}
            className="filter-control"
          >
            {LIPID_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-item">
          <label htmlFor="lip-tri">Triglyceride</label>
          <select
            id="lip-tri"
            value={triStatus}
            onChange={(e) => setTriStatus(e.target.value)}
            className="filter-control"
          >
            {LIPID_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="chart-scroll">
        <div
          className="h-[300px] sm:h-[360px]"
          style={{ minWidth: Math.max(280, chartData.length * 8) }}
        >
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
    </div>
  )
}
