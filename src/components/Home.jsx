import { useContext, useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  LuActivity,
  LuChartPie,
  LuFlaskConical,
  LuGem,
  LuHeartPulse,
  LuLayoutDashboard,
  LuPill,
  LuShieldAlert,
  LuSigma,
  LuStethoscope,
  LuUserRound,
  LuUsers,
} from 'react-icons/lu'
import Loader from './LoadingSpinner'
import DashboardNavbar from './Navbar'
import { DataContext } from './useContext'

export const navItems = [
  { path: '', label: 'Overview', title: 'Overview', icon: LuLayoutDashboard },
  { path: 'Patients', label: 'Patients', title: 'Patient Records', icon: LuUsers },
  { path: 'PatientDemographics', label: 'Cohort', title: 'Patient Demographics', icon: LuUserRound },
  { path: 'StoneCharacteristics', label: 'Stones', title: 'Stone Characteristics', icon: LuGem },
  { path: 'IncidencePrevalence', label: 'Prevalence', title: 'Incidence & Prevalence', icon: LuActivity },
  { path: 'SymptomsClinicalData', label: 'Clinical', title: 'Symptoms & Clinical Data', icon: LuStethoscope },
  { path: 'TreatmentData', label: 'Treatment', title: 'Treatment Data', icon: LuPill },
  { path: 'LaboratoryResults', label: 'Labs', title: 'Laboratory Results', icon: LuFlaskConical },
  { path: 'RiskFactors', label: 'Risk', title: 'Risk Factors', icon: LuShieldAlert },
  { path: 'Visualizations', label: 'Charts', title: 'Visualizations', icon: LuChartPie },
  { path: 'SummaryMetrics', label: 'Summary', title: 'Summary Metrics', icon: LuSigma },
]

const Home = () => {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const mainRef = useRef(null)

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0)
  }, [location.pathname])
  const { loading, error, refresh, data } = useContext(DataContext)

  const current = navItems.find((item) => `/${item.path}` === location.pathname) || navItems[0]

  let content = <Outlet />
  if (error) {
    content = (
      <div className="error-box">
        <h2 className="mb-2 text-lg font-semibold text-white">Unable to load patient data</h2>
        <p className="mb-4 text-sm text-slate-300">{error}</p>
        <button type="button" className="btn" onClick={refresh}>
          Try again
        </button>
      </div>
    )
  } else if (loading && data.length === 0) {
    content = <Loader />
  }

  return (
    <div className="app-shell">
      {open && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="rail-backdrop md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside className={`rail ${open ? 'is-open' : ''}`}>
        <div className="rail-logo" aria-hidden="true">
          <LuHeartPulse size={24} />
        </div>
        <nav className="flex flex-col gap-1" aria-label="Main navigation">
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path || 'overview'}
              to={`/${path}`}
              end
              onClick={() => setOpen(false)}
              className={({ isActive }) => `rail-link ${isActive ? 'is-active' : ''}`}
            >
              <Icon aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="shell-main min-w-0">
        <DashboardNavbar
          title={current.title}
          sidebarOpen={open}
          toggleSidebar={() => setOpen((value) => !value)}
        />
        <main ref={mainRef} className="min-w-0 flex-1 overflow-auto">{content}</main>
      </div>
    </div>
  )
}

export default Home
