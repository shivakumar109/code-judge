import { create } from 'zustand';
import problemService from '../Services/problemService.js';

export const useProblemStore = create((set, get) => ({
  problems: [],
  selectedProblem: null,
  loading: false,
  error: null,
  searchQuery: '',
  difficultyFilter: '',
  tagFilter: '',

  setFilters: (filters) => set(filters),

  clearFilters: () => set({ searchQuery: '', difficultyFilter: '', tagFilter: '' }),

  fetchProblems: async () => {
    set({ loading: true, error: null });
    try {
      const data = await problemService.getAllProblems();
      set({ problems: data.problems || [], loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch problems', loading: false });
    }
  },

  fetchProblemById: async (problemId) => {
    set({ loading: true, error: null, selectedProblem: null });
    try {
      const data = await problemService.getSingleProblem(problemId);
      set({ selectedProblem: data.problem || null, loading: false });
      return data.problem;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch problem details', loading: false });
    }
  },

  createProblem: async (problemData) => {
    set({ loading: true, error: null });
    try {
      const data = await problemService.createProblem(problemData);
      set({ loading: false });
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create problem';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  updateProblem: async (problemId, problemData) => {
    set({ loading: true, error: null });
    try {
      const data = await problemService.updateProblem(problemId, problemData);
      set({ loading: false });
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update problem';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  deleteProblem: async (problemId) => {
    set({ loading: true, error: null });
    try {
      await problemService.deleteProblem(problemId);
      const updated = get().problems.filter(p => p._id !== problemId);
      set({ problems: updated, loading: false });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete problem';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },
}));

export default useProblemStore;
