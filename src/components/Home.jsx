import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import DashboardNavbar from './Navbar'

const btnsList = [
  'PatientDemographics',
  'StoneCharacteristics',
  'IncidencePrevalence',
  'SymptomsClinicalData',
  'TreatmentData',
  'LaboratoryResults',
  'RiskFactors',
  'Visualizations',
  'SummaryMetrics',
]

const Home = () => {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#000046] to-[#1cb5e0]">
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-5 left-4 z-[60] bg-gradient-to-br from-[#000046] to-[#1cb5e0] text-white p-2 rounded-lg shadow"
        onClick={() => setOpen(!open)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar Overlay (Mobile) */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-60 md:hidden"
          onClick={() => setOpen(!open)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:static top-0 left-0 h-full w-64 bg-gradient-to-br from-[#000046] to-[#1cb5e0] text-white z-[60]
          transform transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Close Button for Mobile */}
        <button
          className="md:hidden absolute top-4 right-4 text-white"
          onClick={() => setOpen(false)}
        >
          <X size={26} />
        </button>

        {/* Profile Section */}
        <div className="flex flex-col items-center p-6 mt-6 md:mt-0">
          <img
            src={`${process.env.PUBLIC_URL}/NU_logo.png`}
            alt="Logo"
            className="w-20 h-20 rounded-full mb-3"
          />
          <h1 className="text-lg font-bold text-center">Data Analysis Dashboard</h1>
        </div>

        {/* Menu Links */}
        <div className="flex-1 mt-6 px-4 space-y-3 overflow-y-auto pb-10">
          {btnsList.map((item) => (
            <Link key={item} to={`/${item}`} onClick={() => setOpen(false)}>
              <div className="bg-gradient-to-br from-[#000046] to-[#1cb5e0] my-2 border border-white hover:brightness-125 transition-colors rounded-lg cursor-pointer">
                <button className="w-full text-left px-4 py-3 font-medium hover:text-white">
                  {item}
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <DashboardNavbar />
        <Outlet />
      </div>
    </div>
  )
}

export default Home
