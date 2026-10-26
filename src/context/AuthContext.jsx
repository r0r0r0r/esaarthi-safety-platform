import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../api/apiService';
import { MOCK_USER } from '../api/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('esaarthi_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return MOCK_USER;
      }
    }
    // Default to mock user for easy demo inspection, but token marks login status
    return MOCK_USER;
  });

  const [token, setToken] = useState(() => localStorage.getItem('esaarthi_token') || 'demo_token_esaarthi_active');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('esaarthi_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('esaarthi_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('esaarthi_token', token);
    } else {
      localStorage.removeItem('esaarthi_token');
    }
  }, [token]);

  const login = async ({ email, password, rememberMe = true }) => {
    setLoading(true);
    try {
      const data = await apiService.login({ email, password });
      setUser(data.user);
      setToken(data.token);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await apiService.register(userData);
      setUser(data.user);
      setToken(data.token);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('esaarthi_token');
    localStorage.removeItem('esaarthi_user');
  };

  const quickDemoLogin = () => {
    setUser(MOCK_USER);
    setToken('demo_token_esaarthi_active');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
        quickDemoLogin,
        setUser
      }}
    >
      {children}
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

export default AuthContext;
