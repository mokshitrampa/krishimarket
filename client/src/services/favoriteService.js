import api from './api';

export const favoriteService = {
  getFavorites: () => api.get('/favorites/farmers'),
  addFavorite: (farmerId) => api.post(`/favorites/farmers/${farmerId}`),
  removeFavorite: (farmerId) => api.delete(`/favorites/farmers/${farmerId}`)
};