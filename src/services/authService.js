import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const handleApiError = (error) => {
  if (error.response) {
    throw new Error(error.response.data.message || 'Something went wrong');
  }
  throw new Error('Network error, please try again later');
};

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const changePassword = async (userId, oldPassword, newPassword) => {
  try {
    await axios.post(`${API_URL}/auth/change-password`, { userId, oldPassword, newPassword });
  } catch (error) {
    handleApiError(error);
  }
};