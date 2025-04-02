// Dashboard.js
import React from 'react';

import { Route, Routes } from 'react-router-dom';
import Navbar from '../admin/Navbar';
import DefaultSidebar from '../admin/Sidebar';
import StoreList from './StoreList';
import ChangePassword from './ChangePassword';

const Dashboard = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar at the top */}
      <Navbar />
      
      
      
       
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <Routes>
            <Route index element={<StoreList />} />  
            <Route path="dashboard" element={<StoreList />} /> 
            <Route path='change-password' element={<ChangePassword />} />
            
           
           
          </Routes>
        </main>
      </div>
    
  );
};

export default Dashboard;