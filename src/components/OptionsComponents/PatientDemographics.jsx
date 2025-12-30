import { useContext, useEffect, useState } from 'react'
import Loader from '../LoadingSpinner'
import { DataContext } from '../useContext'
import BMIPieChart from './PatientDemographicsCharts/BMIPieChart'
import ComorbidityBar from './PatientDemographicsCharts/ComorbidityBar'
import HistplotStone from './PatientDemographicsCharts/histplot'
import LipidsLine from './PatientDemographicsCharts/LipidsLine'

const colors = {
  dark: '#000046', // gradient start
  medium: '#0b3d91', // card background
  soft: '#1cb5e0', // highlights, shadows
  light: '#6ad1f0', // titles / accents
  veryLight: '#e0f7ff', // text
}

const PatientDemographics = () => {
  const [ageGroups, setAgeGroups] = useState({})
  const { data } = useContext(DataContext)

  // Categorize age groups whenever data changes
  useEffect(() => {
    if (data.length > 0) {
      categorizeAges(data)
    }
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

  const cardStyle = {
    background: colors.medium,
    borderRadius: 16,
    padding: 20,
    boxShadow: `0 8px 20px ${colors.soft}55`,
    color: colors.veryLight,
  }

  const titleStyle = {
    fontSize: 18,
    fontWeight: 600,
    background: colors.soft,
    padding: '8px 12px',
    borderRadius: 12,
    color: colors.veryLight,
    textAlign: 'center',
    marginBottom: 15,
  }

  return (
    <div
      style={{
        background: `linear-gradient(to bottom, ${colors.dark}, ${colors.soft})`,
        minHeight: '100vh',
        padding: 20,
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
          <div style={titleStyle}>Patient Age Distribution</div>
          {Object.keys(ageGroups).length !== 0 ? <HistplotStone data={ageGroups} /> : <Loader />}
        </div>

        {/* BMI PIE CHART */}
        <div style={cardStyle}>
          <div style={titleStyle}>BMI Distribution of Patients</div>
          {data.length !== 0 ? <BMIPieChart data={data} /> : <Loader />}
        </div>

        {/* COMORBIDITY BAR */}
        <div style={cardStyle}>
          <div style={titleStyle}>Comorbidity Bar Chart</div>
          {data.length !== 0 ? <ComorbidityBar data={data} /> : <Loader />}
        </div>

        {/* LIPID LINE FULL WIDTH */}
        <div style={{ ...cardStyle, gridColumn: '1 / -1' }}>
          <div style={titleStyle}>Lipid Line Chart</div>
          {data.length !== 0 ? <LipidsLine data={data} /> : <Loader />}
        </div>
      </div>
    </div>
  )
}

export default PatientDemographics
