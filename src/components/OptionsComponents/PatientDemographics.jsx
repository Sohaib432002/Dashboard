// PatientDemographics.jsx
import { useContext, useEffect, useState } from 'react'
import Loader from '../LoadingSpinner'
import { DataContext } from '../useContext'
import BMIPieChart from './PatientDemographicsCharts/BMIPieChart'
import ComorbidityBar from './PatientDemographicsCharts/ComorbidityBar'
import HistplotStone from './PatientDemographicsCharts/histplot'
import LipidsLine from './PatientDemographicsCharts/LipidsLine'

// ================= THEME =================
const THEME = {
  bg: '#0f172a', // main background
  card: '#020617', // card background
  grid: '#1e293b', // for chart grids
  text: '#e5e7eb', // main text
  muted: '#94a3b8', // muted / axis
  accent1: '#38bdf8', // chart accent 1
  accent2: '#22c55e', // chart accent 2
  accent3: '#f97316', // chart accent 3
  accent4: '#a855f7', // chart accent 4
}

// ================= STYLES =================
const cardStyle = {
  background: THEME.card,
  borderRadius: 16,
  padding: 25,
  boxShadow: '0 10px 25px rgba(56,189,248,0.15)',
  color: THEME.text,
}

const titleStyle = {
  fontSize: 18,
  fontWeight: 600,
  background: THEME.accent1,
  padding: '8px 12px',
  borderRadius: 12,
  color: THEME.text,
  textAlign: 'center',
  marginBottom: 15,
}

const PatientDemographics = () => {
  const [ageGroups, setAgeGroups] = useState({})
  const { data } = useContext(DataContext)

  // Categorize age groups whenever data changes
  useEffect(() => {
    if (data.length > 0) categorizeAges(data)
  }, [data])

  const categorizeAges = (patients) => {
    const ageGroupCounts = {
      '0-10': 0,
      '11-20': 0,
      '21-30': 0,
      '31-40': 0,
      '41-50': 0,
      '51-60': 0,
      '60+': 0,
    }
    patients.forEach((patient) => {
      const age = Number(patient.Age)
      if (!isNaN(age)) {
        if (age >= 0 && age <= 10) ageGroupCounts['0-10']++
        else if (age >= 11 && age <= 20) ageGroupCounts['11-20']++
        else if (age >= 21 && age <= 30) ageGroupCounts['21-30']++
        else if (age >= 31 && age <= 40) ageGroupCounts['31-40']++
        else if (age >= 41 && age <= 50) ageGroupCounts['41-50']++
        else if (age >= 51 && age <= 60) ageGroupCounts['51-60']++
        else if (age > 60) ageGroupCounts['60+']++
      }
    })
    setAgeGroups(ageGroupCounts)
  }

  return (
    <div
      style={{
        background: `linear-gradient(to bottom, ${THEME.bg}, ${THEME.card})`,
        minHeight: '100vh',
        padding: 25,
      }}
    >
      <div
        style={{
          display: 'grid',
          gap: 20,
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        }}
      >
        {/* AGE HISTOGRAM */}
        <div style={cardStyle}>
          <div style={{ ...titleStyle, background: THEME.accent1 }}>Patient Age Distribution</div>
          {Object.keys(ageGroups).length !== 0 ? <HistplotStone data={ageGroups} /> : <Loader />}
        </div>

        {/* BMI PIE CHART */}
        <div style={cardStyle}>
          <div style={{ ...titleStyle, background: THEME.accent2 }}>
            BMI Distribution of Patients
          </div>
          {data.length !== 0 ? <BMIPieChart data={data} /> : <Loader />}
        </div>

        {/* COMORBIDITY BAR */}
        <div style={cardStyle}>
          <div style={{ ...titleStyle, background: THEME.accent3 }}>Comorbidity Bar Chart</div>
          {data.length !== 0 ? <ComorbidityBar data={data} /> : <Loader />}
        </div>

        {/* LIPID LINE FULL WIDTH */}
        <div style={{ ...cardStyle, gridColumn: '1 / -1' }}>
          <div style={{ ...titleStyle, background: THEME.accent4 }}>Lipid Line Chart</div>
          {data.length !== 0 ? <LipidsLine data={data} /> : <Loader />}
        </div>
      </div>
    </div>
  )
}

export default PatientDemographics
