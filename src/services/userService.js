import api from './api'



const UserService = {
  getAllUsers: async () => {
    try {
      const response = await api.get('/users')
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch users'
    }


  },

 
    getUsersByRole: async (role) => {
      try {
        const response = await api.get(`/users/role/${role}`);
        return response.data.data; // Returns the array of users
      } catch (error) {
        console.error(`Error fetching users with role ${role}:`, error);
        throw error;
      }
    
  },




  getUserById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch user'
    }
  },

  createUser: async (userData) => {
    try {
      const response = await axios.post('/users', userData)
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Failed to create user'
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await axios.put('users', userData)
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update user'
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await axios.delete(`users/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete user'
    }
  },

  getAdminDashboard: async () => {
    try {
      const response = await axios.get(`/users/dashboard`)
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch admin dashboard'
    }
  }
}

export default UserService