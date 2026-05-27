import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach bearer token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for generic error parsing
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we want to handle session expiry globally, we can do it here,
    // but the store handles individual component contexts gracefully.
    return Promise.reject(error);
  }
);

export default api;
