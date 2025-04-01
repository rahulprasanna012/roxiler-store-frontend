import api from './api';

const AdminService = {
  // Dashboard Stats
  getDashboardStats: async () => {
    try {
        console.log('Fetching dashboard stats...');
      const response = await api.get('/users/dashboard');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // User Management
  createUser: async (userData) => {
    try {
      const response = await api.post('/admin/users', userData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

//   getUsers: async (filters = {}) => {
//     try {
//       const response = await api.get('/admin/users', { params: filters });
//       return response.data;
//     } catch (error) {
//       throw error.response.data;
//     }
//   },

  getUserDetails: async (userId) => {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Store Management
  createStore: async (storeData) => {
    try {
      const response = await api.post('/admin/stores', storeData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  getStores: async (filters = {}) => {
    try {
      const response = await api.get('/admin/stores', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
};

export default AdminService;