import {
    PresentationChartBarIcon,
    ShoppingBagIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    InboxIcon,
    PowerIcon,
  } from "@heroicons/react/24/solid";
  import { Link, useNavigate } from "react-router-dom";
  
  function DefaultSidebar() {
    const navigate = useNavigate();
  
    const handleLogout = () => {
      // Add your logout logic here
      console.log("Logging out...");
      // Example: navigate('/login') after logout
    };
  
    return (
      <div className="h-[calc(100vh-2rem)] w-80 p-4 bg-white shadow-xl shadow-blue-gray-900/5 rounded-lg">
        <div className="mb-2 p-4">
          <h5 className="text-xl font-semibold text-gray-800">Sidebar</h5>
        </div>
        <ul className="space-y-2">
          <Link to="/dashboard">
            <li className="flex items-center py-2 px-4 rounded-none hover:bg-gray-100 cursor-pointer">
              <PresentationChartBarIcon className="h-5 w-5 mr-3 text-gray-600" />
              <span className="text-gray-700">Dashboard</span>
            </li>
          </Link>
  
          <Link to="/ecommerce">
            <li className="flex items-center py-2 px-4 rounded-none hover:bg-gray-100 cursor-pointer">
              <ShoppingBagIcon className="h-5 w-5 mr-3 text-gray-600" />
              <span className="text-gray-700">E-Commerce</span>
            </li>
          </Link>
  
          <Link to="/inbox">
            <li className="flex items-center justify-between py-2 px-4 rounded-none hover:bg-gray-100 cursor-pointer">
              <div className="flex items-center">
                <InboxIcon className="h-5 w-5 mr-3 text-gray-600" />
                <span className="text-gray-700">Inbox</span>
              </div>
              <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">14</span>
            </li>
          </Link>
  
          <Link to="/profile">
            <li className="flex items-center py-2 px-4 rounded-none hover:bg-gray-100 cursor-pointer">
              <UserCircleIcon className="h-5 w-5 mr-3 text-gray-600" />
              <span className="text-gray-700">Profile</span>
            </li>
          </Link>
  
          <Link to="/settings">
            <li className="flex items-center py-2 px-4 rounded-none hover:bg-gray-100 cursor-pointer">
              <Cog6ToothIcon className="h-5 w-5 mr-3 text-gray-600" />
              <span className="text-gray-700">Settings</span>
            </li>
          </Link>
  
          <li 
            className="flex items-center py-2 px-4 rounded-none hover:bg-gray-100 cursor-pointer"
            onClick={handleLogout}
          >
            <PowerIcon className="h-5 w-5 mr-3 text-gray-600" />
            <span className="text-gray-700">Log Out</span>
          </li>
        </ul>
      </div>
    );
  }
  
  export default DefaultSidebar;