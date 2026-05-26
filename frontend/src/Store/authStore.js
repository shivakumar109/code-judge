import { create } from 'zustand';
import authService from '../Services/authService.js';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  setLoading: (isLoading) => set({ loading: isLoading }),
  setError: (err) => set({ error: err }),

  login: async (emailOrUsername, password) => {
    set({ loading: true, error: null });
    try {
      const data = await authService.loginUser(emailOrUsername, password);
      set({
        user: data.user,
        isAuthenticated: true,
        loading: false,
      });
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      set({ error: message, loading: false, isAuthenticated: false });
      throw new Error(message);
    }
  },

  register: async (firstName, lastName, username, email, password) => {
    set({ loading: true, error: null });
    try {
      const data = await authService.registerUser(firstName, lastName, username, email, password);
      set({ loading: false });
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      set({ error: message, loading: false });
      throw new Error(message);
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await authService.logoutUser();
    } catch (err) {
      console.error('Logout error:', err.message);
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });
    }
  },

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const data = await authService.getProfile();
      set({
        user: data.profile,
        isAuthenticated: true,
        loading: false,
      });
      return data.profile;
    } catch (err) {
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  },
}));

export default useAuthStore;
