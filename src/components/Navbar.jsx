import { useState } from 'react'
import { FiMenu } from 'react-icons/fi'

const DashboardNavbar = ({ toggleSidebar }) => {
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <nav className="w-full z-50 bg-gradient-to-br from-[#000046] to-[#1cb5e0] backdrop-blur-md shadow-md border-b border-[#1cb5e0] sticky top-0">
      <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3">
        {/* Sidebar Toggle Button */}
        <button
          className="p-2 rounded-lg hover:brightness-110 transition-colors md:hidden"
          onClick={toggleSidebar}
        >
          <FiMenu size={24} className="text-white" />
        </button>

        {/* Dashboard Title */}
        <h1 className="flex-1 text-lg sm:text-xl md:text-2xl font-bold tracking-wide text-white drop-shadow-sm text-center md:text-left">
          Identifying high-risk patients for gallstones and related metabolic disorders
        </h1>

        {/* Right Side Icons */}
        <div className="flex items-center gap-4 sm:gap-6 mt-2 md:mt-0">
          {/* Profile */}
          <div className="flex items-center gap-2 cursor-pointer relative">
            <img
              src={`${process.env.PUBLIC_URL}/profile pic.png`}
              alt="profile"
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
            />
            <span className="hidden sm:block font-semibold text-white">Sohaib</span>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 top-12 flex flex-col bg-white shadow-lg rounded-lg w-40 p-2 text-[#000046] border border-[#1cb5e0]">
                <button className="text-left px-3 py-2 hover:bg-gradient-to-br hover:from-[#000046]/10 hover:to-[#1cb5e0]/10 rounded">
                  Profile
                </button>
                <button className="text-left px-3 py-2 hover:bg-gradient-to-br hover:from-[#000046]/10 hover:to-[#1cb5e0]/10 rounded">
                  Settings
                </button>
                <button className="text-left px-3 py-2 hover:bg-gradient-to-br hover:from-[#FF0000]/20 hover:to-[#FF4D4D]/20 rounded text-red-600">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default DashboardNavbar
