// Dashboard.js
import React from 'react';
import Navbar from './Navbar';
import DefaultSidebar from './Sidebar';
import Stats from './Stats';
import { Route, Routes } from 'react-router-dom';
import StoreList from './StoreList';

const Dashboard = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar at the top */}
      <Navbar />
      
      {/* Main content area with sidebar and routes */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <DefaultSidebar />
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <Routes>
            <Route index element={<Stats />} />  {/* This matches /admin */}
            <Route path="dashboard" element={<Stats />} /> 
            <Route path="store-add" element={<div>Add Store Component</div>} />
            <Route path="user-add" element={<div>Add User Component</div>} />
            <Route path="store-list" element={<StoreList/>} />
            {/* Add other admin routes here */}
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;