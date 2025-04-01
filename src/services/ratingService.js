import api from './api';

const RatingService = {
 
  submitRating: async (ratingData) => {
    try {
      const response = await api.post('/ratings', ratingData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to submit rating';
    }
  },

  
  getUserRatings: async (userId) => {
    try {
      const response = await api.get(`/ratings/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch user ratings';
    }
  }
};



export default RatingService;