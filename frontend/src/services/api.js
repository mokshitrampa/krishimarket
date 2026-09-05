import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: attach bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('krishi_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: extract response error message
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      status: error.response?.status,
      message: error.message
    });

    let message = error.response?.data?.message;
    if (!message) {
      if (error.message === 'Network Error' || !error.response) {
        message = 'Network error: Cannot reach the backend API. If deployed on Render free tier, please wait 30-50s for it to wake up, or verify VITE_API_URL in Vercel settings.';
      } else {
        message = error.message || 'An unexpected network error occurred.';
      }
    }
    
    // Auto logout on 401 if unauthorized
    if (error.response?.status === 401 && localStorage.getItem('krishi_token')) {
      // Don't auto-redirect if checking initial auth
      if (!error.config?.url?.includes('/auth/me')) {
        localStorage.removeItem('krishi_token');
        localStorage.removeItem('krishi_user');
        window.location.href = '/login?expired=true';
      }
    }

    return Promise.reject(new Error(message));
  }
);

export default api;