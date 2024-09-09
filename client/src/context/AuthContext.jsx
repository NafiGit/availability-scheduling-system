// src/context/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

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

  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true, // This is important for sending cookies with requests
  });

  useEffect(() => {
    // Check if the user is already authenticated
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await api.get('/auth/check');
      setUser(response.data.user);
    } catch (error) {
      console.error('Error checking authentication:', error);
      setUser(null);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      setUser(response.data.user);
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  const register = async (email, password) => {
    try {
      await api.post('/auth/register', { email, password });
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};