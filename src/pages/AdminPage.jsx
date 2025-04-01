import React, { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from '../components/admin/Dashboard';

const AdminPage = () => {
  useEffect(() => {
    toast.success('Welcome!');
  }, []); // Empty dependency array ensures it runs only once when the component mounts

  return (
    <div>
      <Dashboard/>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default AdminPage;
