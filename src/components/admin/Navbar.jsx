import { PowerIcon, UserCircleIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { use, useEffect, useState } from "react";
import { useAuth } from '../../context/AuthContext'; // Adjust the import path as necessary
function Navbar() {

  const { user, logout } = useAuth(); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);


 




  
  

  return (
    <nav className="bg-white shadow-sm py-3 px-6 flex justify-between items-center">
      {/* Logo and Store Name */}
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
          <span className="text-white font-bold text-sm">RS</span>
        </div>
        <h1 className="text-xl font-bold text-gray-800">Roxiler Store</h1>
      </div>

      {/* Account Section */}
      <div className="relative">
        <button 
          className="flex items-center space-x-2 focus:outline-none"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <div className="flex items-center space-x-2">
            <UserCircleIcon className="h-8 w-8 text-gray-500" />
            <div className="text-left hidden md:block">
              <p className="text-sm font-medium text-gray-700">Account</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
            <ChevronDownIcon className={`h-4 w-4 text-gray-500 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
          </div>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
            <div className="px-4 py-2 border-b">
              <p className="text-sm font-medium text-gray-700">Signed in as</p>
              <p className="text-sm text-gray-500 truncate">{user.email}</p>
            </div>
            <a 
              href="#" 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Account Settings
            </a>
            
            <div className="border-t border-gray-100"></div>
            <button
              onClick={logout} 
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              <PowerIcon className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;