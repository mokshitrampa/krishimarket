import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [farmerProfile, setFarmerProfile] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('krishi_token'));
  const [loading, setLoading] = useState(true);

  // Initialize and verify user on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('krishi_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res.success) {
            setUser(res.user);
            setFarmerProfile(res.farmerProfile || null);
          }
        } catch (err) {
          console.warn('Initial session check failed:', err.message);
          localStorage.removeItem('krishi_token');
          localStorage.removeItem('krishi_user');
          setUser(null);
          setFarmerProfile(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.success) {
      localStorage.setItem('krishi_token', res.token);
      localStorage.setItem('krishi_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
      setFarmerProfile(res.farmerProfile || null);
      return res;
    }
    throw new Error(res.message || 'Login failed.');
  };

  const registerCustomer = async (data) => {
    const res = await authService.registerCustomer(data);
    if (res.success) {
      localStorage.setItem('krishi_token', res.token);
      localStorage.setItem('krishi_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
      setFarmerProfile(null);
      return res;
    }
    throw new Error(res.message || 'Customer registration failed.');
  };

  const registerFarmer = async (data) => {
    const res = await authService.registerFarmer(data);
    if (res.success) {
      localStorage.setItem('krishi_token', res.token);
      localStorage.setItem('krishi_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
      setFarmerProfile(res.farmerProfile || null);
      return res;
    }
    throw new Error(res.message || 'Farmer registration failed.');
  };

  const logout = () => {
    localStorage.removeItem('krishi_token');
    localStorage.removeItem('krishi_user');
    setUser(null);
    setFarmerProfile(null);
    setToken(null);
  };

  const updateProfileData = async (data) => {
    const res = await authService.updateProfile(data);
    if (res.success) {
      setUser(res.user);
      localStorage.setItem('krishi_user', JSON.stringify(res.user));
      return res.user;
    }
  };

  const value = {
    user,
    farmerProfile,
    setFarmerProfile,
    token,
    loading,
    isAuthenticated: !!user,
    role: user?.role || null,
    isCustomer: user?.role === 'customer',
    isFarmer: user?.role === 'farmer',
    isAdmin: user?.role === 'admin',
    login,
    registerCustomer,
    registerFarmer,
    logout,
    updateProfileData
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};