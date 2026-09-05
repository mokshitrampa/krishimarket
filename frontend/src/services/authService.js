import api from './api';

export const authService = {
  registerCustomer: (data) => api.post('/auth/register/customer', data),
  registerFarmer: (data) => api.post('/auth/register/farmer', data),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data)
};