import React, { createContext, useState, useEffect } from 'react';
import * as apiService from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is stored in local storage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const loginUser = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.login(email, password);
      if (data.success && data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        return true;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
      throw err;
    } finally {
      setLoading(false);
    }
    return false;
  };

  const registerUser = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.register(name, email, password);
      if (data.success && data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        return true;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
      throw err;
    } finally {
      setLoading(false);
    }
    return false;
  };

  const logoutUser = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        loginUser,
        registerUser,
        logoutUser,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
