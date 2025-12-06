import { useState } from "react";
import { FiMenu } from "react-icons/fi";

const DashboardNavbar = ({ toggleSidebar }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="w-full z-50 bg-[#142c14] backdrop-blur-md shadow-md border-b border-[#8da750] sticky top-0">
      <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3">

        {/* Sidebar Toggle Button */}
        <button
          className="p-2 rounded-lg  hover:bg-[#1b3a1b] transition-colors md:hidden"
          onClick={toggleSidebar}
        >
          <FiMenu size={24} className="text-[#e4eb9c]" />
        </button>

        {/* Dashboard Title */}
        <h1 className="flex-1 text-lg sm:text-xl md:text-2xl font-bold tracking-wide text-[#e4eb9c] drop-shadow-sm text-center md:text-left">
          Gallstone Patient Analytics Dashboard
        </h1>

        {/* Right Side Icons */}
        <div className="flex items-center gap-4 sm:gap-6 mt-2 md:mt-0">

          {/* Profile */}
          <div
            className="flex items-center gap-2 cursor-pointer relative"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <img
              src={`${process.env.PUBLIC_URL}/profile pic.png`}
              alt="profile"
              className="w-10 h-10 rounded-full border-2 border-[#537b2f] shadow-sm"
            />
            <span className="hidden sm:block font-semibold text-[#e4eb9c]">
              Sohaib
            </span>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 top-12 flex flex-col bg-white shadow-lg rounded-lg w-40 p-2 text-[#142c14] border border-[#8da750]">
                <button className="text-left px-3 py-2 hover:bg-[#e4eb9c] rounded">Profile</button>
                <button className="text-left px-3 py-2 hover:bg-[#e4eb9c] rounded">Settings</button>
                <button className="text-left px-3 py-2 hover:bg-[#e4eb9c] rounded text-red-600">Logout</button>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
