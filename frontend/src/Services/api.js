import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
