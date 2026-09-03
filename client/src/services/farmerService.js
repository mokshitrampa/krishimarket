import api from './api';

export const farmerService = {
  getFarmers: (params) => api.get('/farmers', { params }),
  getFarmerById: (id) => api.get(`/farmers/${id}`),
  getFarmerProducts: (id) => api.get(`/farmers/${id}/products`),
  compareFarmers: (ids) => api.get('/farmers/compare', { params: { ids: ids.join(',') } }),
  updateProfile: (data) => api.put('/farmers/profile', data),
  getAnalytics: () => api.get('/farmers/analytics')
};