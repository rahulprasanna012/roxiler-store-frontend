import api from './api';

const RatingService = {
 
    submitRating: async (userId,storeId, ratingData) => {

        console.log('Rating Data:', ratingData); // Log the rating data to check its structure
        console.log('User ID:', userId); // Log the user ID
        console.log('Store ID:', storeId); // Log the store ID
        try {
          const token = localStorage.getItem('token'); 
          const response = await api.post('/ratings', {
            storeId,
            userId,
            rating: ratingData
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          return response.data;
        } catch (error) {
          const errorMessage = error.response?.data?.message || 
                              error.response?.data?.error ||
                              'Failed to submit rating';
          throw new Error(errorMessage);
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