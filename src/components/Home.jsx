import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useState } from 'react'
import DashboardNavbar from './Navbar'

const navItems = [
  { path: 'PatientDemographics', label: 'Patient Demographics' },
  { path: 'StoneCharacteristics', label: 'Stone Characteristics' },
  { path: 'IncidencePrevalence', label: 'Incidence & Prevalence' },
  { path: 'SymptomsClinicalData', label: 'Symptoms & Clinical Data' },
  { path: 'TreatmentData', label: 'Treatment Data' },
  { path: 'LaboratoryResults', label: 'Laboratory Results' },
  { path: 'RiskFactors', label: 'Risk Factors' },
  { path: 'Visualizations', label: 'Visualizations' },
  { path: 'SummaryMetrics', label: 'Summary Metrics' },
]

const Home = () => {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  const isActivePath = (path) => {
    const current = location.pathname
    if (path === 'PatientDemographics') {
      return current === '/' || current === '/PatientDemographics'
    }
    return current === `/${path}`
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      {open && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 flex w-64 max-w-[85vw] flex-col bg-gradient-to-b from-[#000046] to-[#0e7490] text-white shadow-xl transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex shrink-0 flex-col items-center px-5 pb-4 pt-6">
          <img
            src={`${process.env.PUBLIC_URL}/NU_logo.svg`}
            alt="Dashboard logo"
            className="mb-3 h-16 w-16 rounded-full border border-white/30 bg-white/10 object-cover"
          />
          <h1 className="px-1 text-center text-base font-bold leading-snug">
            Data Analysis Dashboard
          </h1>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-6">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={`/${item.path}`}
              onClick={() => setOpen(false)}
              className={`sidebar-link block rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
                isActivePath(item.path)
                  ? 'border-white bg-white/20 text-white'
                  : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/15'
              }`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <DashboardNavbar sidebarOpen={open} toggleSidebar={() => setOpen((value) => !value)} />
        <main className="min-w-0 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Home
