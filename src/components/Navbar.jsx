import { useEffect, useRef, useState } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'

const DashboardNavbar = ({ sidebarOpen, toggleSidebar }) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <nav className="sticky top-0 z-30 w-full border-b border-cyan-300/30 bg-gradient-to-r from-[#000046] to-[#1cb5e0] shadow-md">
      <div className="flex min-h-[64px] items-center gap-3 px-3 py-3 sm:px-5">
        <button
          type="button"
          className="shrink-0 rounded-lg p-2 text-white hover:bg-white/10 md:hidden"
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
        >
          {sidebarOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="text-sm font-semibold leading-snug tracking-wide text-white sm:text-base md:text-xl">
            <span className="sm:hidden">Gallstone Risk Dashboard</span>
            <span className="hidden sm:inline">
              Identifying High-Risk Patients for Gallstones and Related Metabolic Disorders
            </span>
          </h1>
        </div>

        <div className="relative shrink-0" ref={dropdownRef}>
          <button
            type="button"
            className="flex items-center gap-2 rounded-full p-1 pr-2 hover:bg-white/10"
            onClick={() => setShowDropdown((value) => !value)}
            aria-haspopup="menu"
            aria-expanded={showDropdown}
          >
            <img
              src={`${process.env.PUBLIC_URL}/profile.svg`}
              alt="Sohaib"
              className="h-9 w-9 rounded-full border-2 border-white object-cover shadow-sm"
            />
            <span className="hidden font-semibold text-white sm:block">Sohaib</span>
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-12 z-50 flex w-40 flex-col rounded-lg border border-[#1cb5e0] bg-white p-2 text-[#000046] shadow-lg">
              <button type="button" className="rounded px-3 py-2 text-left hover:bg-sky-50">
                Profile
              </button>
              <button type="button" className="rounded px-3 py-2 text-left hover:bg-sky-50">
                Settings
              </button>
              <button type="button" className="rounded px-3 py-2 text-left text-red-600 hover:bg-red-50">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default DashboardNavbar
