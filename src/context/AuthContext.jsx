import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { login as authLogin, logout as authLogout, register as authRegister } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = Cookies.get('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          // Ensure we're setting the user object correctly
          setUser({
            ...parsedUser,
            token // Include token in user object
          });
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);
  const login = async (email, password) => {
    try {
      const response = await authLogin(email, password);
      // Extract user data from response and include token
      const userData = {
        ...response.user,
        token: response.token
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      Cookies.set('token', response.token, { expires: 7 });
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authLogout();
      setUser(null);
      localStorage.removeItem('user');
      Cookies.remove('token');
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authRegister(userData);
      
      if (response && response.user) {
        // Ensure we're using the user object from response
        const userWithRole = {
          ...response.user,
          role: response.user.role || userData.role // Fallback to submitted role
        };
        
        setUser(userWithRole);
        localStorage.setItem('user', JSON.stringify(userWithRole));
        Cookies.set('token', response.token, { expires: 7 });
        return userWithRole;
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};