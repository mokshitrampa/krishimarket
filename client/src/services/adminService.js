import api from './api';

export const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),
  getFarmers: (params) => api.get('/admin/farmers', { params }),
  approveFarmer: (id, notes) => api.patch(`/admin/farmers/${id}/approve`, { notes }),
  rejectFarmer: (id, notes) => api.patch(`/admin/farmers/${id}/reject`, { notes }),
  toggleUserStatus: (userId, status) => api.patch(`/admin/users/${userId}/status`, { status }),
  getCustomers: (params) => api.get('/admin/customers', { params }),
  getProducts: (params) => api.get('/admin/products', { params }),
  toggleProductStatus: (id) => api.patch(`/admin/products/${id}/status`),
  getCategories: () => api.get('/categories'),
  createCategory: (data) => api.post('/categories', data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
  getOrders: (params) => api.get('/admin/orders', { params }),
  getReviews: (params) => api.get('/admin/reviews', { params }),
  toggleReviewStatus: (id, status) => api.patch(`/admin/reviews/${id}/status`, { status }),
  getDisputes: (params) => api.get('/admin/disputes', { params }),
  updateDispute: (id, status, adminNote) => api.patch(`/admin/disputes/${id}`, { status, adminNote }),
  getAnalytics: () => api.get('/admin/analytics'),
  resetCleanDatabase: () => api.post('/admin/system/reset-clean')
};