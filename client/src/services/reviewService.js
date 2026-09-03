import api from './api';

export const reviewService = {
  createReview: (data) => api.post('/reviews', data),
  getFarmerReviews: (farmerId) => api.get(`/reviews/farmer/${farmerId}`),
  getProductReviews: (productId) => api.get(`/reviews/product/${productId}`)
};