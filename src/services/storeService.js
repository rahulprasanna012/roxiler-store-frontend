import api from './api';

const StoreService = {
    getAllStores: async (filters = {}) => {
        try {
          const params = new URLSearchParams();
          
          if (filters.name) params.append('name', filters.name);
          if (filters.address) params.append('address', filters.address);
          if (filters.sortBy) params.append('sortBy', filters.sortBy);
          if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
      
          const response = await api.get(`/stores?${params.toString()}`);
          return response.data;
        } catch (error) {
          console.error('Error fetching stores:', error);
          if (error.response) {
            // The request was made and the server responded with a status code
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            console.error('Request:', error.request);
          } else {
            // Something happened in setting up the request
            console.error('Error message:', error.message);
          }
          throw error;
        }
      },

  getStoreById: async (id) => {
    try {
      const response = await api.get(`/stores/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching store with ID ${id}:`, error);
      throw error;
    }
  },

  createStore: async (storeData) => {
    try {
      const response = await api.post('/stores', storeData);
      return response.data;
    } catch (error) {
      console.error('Error creating store:', error);
      throw error;
    }
  },

  getOwnerStores: async (ownerId) => {
    try {
      const response = await api.get(`/stores/owner/${ownerId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching stores for owner ${ownerId}:`, error);
      throw error;
    }
  },

  getOwnerDashboard: async () => {
    try {
      const response = await api.get('/stores/owner/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching owner dashboard:', error);
      throw error;
    }
  },

  countStores: async () => {
    try {
      const response = await api.get('/stores/count');
      return response.data.count;
    } catch (error) {
      console.error('Error counting stores:', error);
      throw error;
    }
  }
};

export default StoreService;