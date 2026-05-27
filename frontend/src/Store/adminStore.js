import { create } from 'zustand';
import adminService from '../Services/adminService.js';

export const useAdminStore = create((set, get) => ({
  problems: [],
  users: [],
  loading: false,
  submitting: false,
  error: null,
  success: null,
  stats: {
    totalProblems: 0,
    activeProblems: 0,
    inactiveProblems: 0,
    totalUsers: 0,
    activeUsers: 0,
    blockedUsers: 0,
  },

  clearState: () => set({ error: null, success: null }),

  recalculateStats: () => {
    const { problems, users } = get();
    
    const totalProblems = problems.length;
    const activeProblems = problems.filter((p) => p.isProblemActive).length;
    const inactiveProblems = totalProblems - activeProblems;

    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.isActive).length;
    const blockedUsers = totalUsers - activeUsers;

    set({
      stats: {
        totalProblems,
        activeProblems,
        inactiveProblems,
        totalUsers,
        activeUsers,
        blockedUsers,
      },
    });
  },

  fetchAdminProblems: async () => {
    set({ loading: true, error: null });
    try {
      const data = await adminService.getProblems();
      set({ problems: data.problems || [], loading: false });
      get().recalculateStats();
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to load administrative problems',
        loading: false,
      });
    }
  },

  fetchAdminLeaderboard: async () => {
    set({ loading: true, error: null });
    try {
      const data = await adminService.getLeaderboard();
      set({ users: data.leaderboard || [], loading: false });
      get().recalculateStats();
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to load administrative user directory',
        loading: false,
      });
    }
  },

  createProblem: async (problemData) => {
    set({ submitting: true, error: null, success: null });
    try {
      const data = await adminService.createProblem(problemData);
      set({
        success: 'Coding challenge created and injected successfully!',
        submitting: false,
      });
      get().fetchAdminProblems();
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create coding challenge';
      set({ error: msg, submitting: false });
      throw new Error(msg);
    }
  },

  updateProblem: async (id, problemData) => {
    set({ submitting: true, error: null, success: null });
    try {
      const data = await adminService.updateProblem(id, problemData);
      set({
        success: 'Coding challenge updated successfully!',
        submitting: false,
      });
      get().fetchAdminProblems();
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update coding challenge';
      set({ error: msg, submitting: false });
      throw new Error(msg);
    }
  },

  deleteProblem: async (id) => {
    set({ loading: true, error: null });
    try {
      await adminService.deleteProblem(id);
      set({ success: 'Coding challenge soft-deleted successfully!', loading: false });
      get().fetchAdminProblems();
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to delete coding challenge',
        loading: false,
      });
    }
  },

  blockUser: async (id) => {
    set({ loading: true, error: null });
    try {
      await adminService.blockUser(id);
      set({ success: 'User account disabled successfully', loading: false });
      get().fetchAdminLeaderboard();
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to block user account',
        loading: false,
      });
    }
  },

  unblockUser: async (id) => {
    set({ loading: true, error: null });
    try {
      await adminService.unblockUser(id);
      set({ success: 'User account reactivated successfully', loading: false });
      get().fetchAdminLeaderboard();
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to unblock user account',
        loading: false,
      });
    }
  },
}));

export default useAdminStore;
