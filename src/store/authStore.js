import { create } from 'zustand';
import API from '../utils/axios';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Register
  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await API.post('/auth/register', userData);
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
      }
      set({ user: data.user, isAuthenticated: true, isLoading: false });
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  // Login
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await API.post('/auth/login', { email, password });
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
      }
      set({ user: data.user, isAuthenticated: true, isLoading: false });
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      await API.post('/auth/logout');
    } catch {
      // Ignore logout errors
    }
    localStorage.removeItem('accessToken');
    set({ user: null, isAuthenticated: false });
  },

  // Fetch current user
  fetchMe: async () => {
    try {
      const { data } = await API.get('/auth/me');
      set({ user: data.user, isAuthenticated: true });
      return data.user;
    } catch (error) {
      localStorage.removeItem('accessToken');
      set({ user: null, isAuthenticated: false });
      throw error;
    }
  },

  // Delete account
  deleteAccount: async () => {
    set({ isLoading: true, error: null });
    try {
      await API.delete('/auth/me');
      localStorage.removeItem('accessToken');
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete account';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  // Update user
  setUser: (user) => set({ user }),

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useAuthStore;