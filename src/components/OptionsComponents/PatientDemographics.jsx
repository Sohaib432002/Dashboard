import { useContext } from 'react'
import Loader from '../LoadingSpinner'
import { DataContext } from '../useContext'
import BMIPieChart from './PatientDemographicsCharts/BMIPieChart'
import ComorbidityBar from './PatientDemographicsCharts/ComorbidityBar'
import HistplotStone from './PatientDemographicsCharts/histplot'
import LipidsLine from './PatientDemographicsCharts/LipidsLine'

const PatientDemographics = () => {
  const { data } = useContext(DataContext)

  return (
    <div className="page">
      <h1 className="page-title">Patient Demographics</h1>
      <div className="grid-cards">
        <section className="min-w-0">
          <h2 className="section-title bg-sky-400">Patient Age Distribution</h2>
          {data.length !== 0 ? <HistplotStone /> : <Loader />}
        </section>

        <section className="min-w-0">
          <h2 className="section-title bg-green-500">BMI Distribution of Patients</h2>
          {data.length !== 0 ? <BMIPieChart /> : <Loader />}
        </section>

        <section className="min-w-0">
          <h2 className="section-title bg-orange-500">Comorbidity Bar Chart</h2>
          {data.length !== 0 ? <ComorbidityBar /> : <Loader />}
        </section>

        <section className="span-all min-w-0">
          <h2 className="section-title bg-purple-500 text-white">Lipid Line Chart</h2>
          {data.length !== 0 ? <LipidsLine data={data} /> : <Loader />}
        </section>
      </div>
    </div>
  )
}

export default PatientDemographics
