import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useState } from 'react';
import authAPI from '../_api/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        // Check if user is stored in localStorage first
        const storedUser = localStorage.getItem('user');
        const accessToken = localStorage.getItem('access_token');

        if (storedUser && accessToken) {
          // If we have stored user and token, set user immediately
          setUser(JSON.parse(storedUser));
          setLoading(false);

          // Then try to validate token with backend
          try {
            const response = await authAPI.getProfile();
            if (response.data?.user) {
              setUser(response.data.user);
              localStorage.setItem('user', JSON.stringify(response.data.user));
            }
          } catch (error) {
            console.error('Token validation failed:', error);
            // If token is invalid, clear everything
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            setUser(null);
          }
        } else {
          // No stored user, check if authenticated via API
          if (authAPI.isAuthenticated()) {
            const response = await authAPI.getProfile();
            if (response.data?.user) {
              setUser(response.data.user);
              localStorage.setItem('user', JSON.stringify(response.data.user));
            }
          }
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await authAPI.login(credentials);
      if (response.data?.data?.user) {
        setUser(response.data.data.user);
        return { success: true, data: response.data.data };
      }
      return { success: false, error: 'Login failed' };
    } catch (error) {
      const errorMessage = error.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await authAPI.register(userData);
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setError(null);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    updateUser,
    clearError,
    isAuthenticated: !!user || authAPI.isAuthenticated()
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};
