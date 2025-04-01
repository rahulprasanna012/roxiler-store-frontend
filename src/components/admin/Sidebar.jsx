import {
    PresentationChartBarIcon,
    ShoppingBagIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    InboxIcon,
    PowerIcon,
  } from "@heroicons/react/24/solid";
import { StoreOutlined } from "@mui/icons-material";
  import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

  
  function DefaultSidebar() {
    const navigate = useNavigate();

    const {logout}=useAuth();
  
    const handleLogout = () => {
      logout();
    };
  
    return (
      <div className="h-[calc(100vh-2rem)] w-30 p-4 bg-white shadow-xl shadow-blue-gray-900/5 rounded-lg">
        <div className="mb-2 p-4">
          <h5 className="text-xl font-semibold text-gray-800">Sidebar</h5>
        </div>
        <ul className="space-y-2">
          <Link to="/admin/dashboard">
            <li className="flex items-center py-2 px-4 rounded-none hover:bg-gray-100 cursor-pointer">
              <PresentationChartBarIcon className="h-5 w-5 mr-3 text-gray-600" />
              <span className="text-gray-700">Dashboard</span>
            </li>
          </Link>
  
          <Link to="/admin/store-add">
            <li className="flex items-center py-2 px-4 rounded-none hover:bg-gray-100 cursor-pointer">
              <ShoppingBagIcon className="h-5 w-5 mr-3 text-gray-600" />
              <span className="text-gray-700">Add Store</span>
            </li>
          </Link>
  
          
  
          <Link to="/admin/user-add">
            <li className="flex items-center py-2 px-4 rounded-none hover:bg-gray-100 cursor-pointer">
              <UserCircleIcon className="h-5 w-5 mr-3 text-gray-600" />
              <span className="text-gray-700">Add User</span>
            </li>
          </Link>

          <Link to="/admin/store-list">
            <li className="flex items-center py-2 px-4 rounded-none hover:bg-gray-100 cursor-pointer">
              <StoreOutlined className="h-5 w-5 mr-3 text-gray-600" />
              <span className="text-gray-700">Store List</span>
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