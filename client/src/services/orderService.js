import api from './api';

export const orderService = {
  placeOrder: (orderData) => api.post('/orders', orderData),
  getCustomerOrders: (params) => api.get('/orders/customer', { params }),
  getFarmerOrders: (params) => api.get('/orders/farmer', { params }),
  getOrderById: (id) => api.get(`/orders/${id}`),
  updateOrderStatus: (id, status, note) => api.patch(`/orders/${id}/status`, { status, note })
};