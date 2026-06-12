import { create } from 'zustand';
import submissionService from '../Services/submissionService.js';

export const useSubmissionStore = create((set, get) => ({
  submissions: [],
  leaderboard: [],
  loading: false,
  submitting: false,
  verdict: null,
  runtime: null,
  memory: null,
  running: false,
  runResult: null,
  runError: null,

  clearResults: () => set({ verdict: null, runtime: null, memory: null, error: null, runResult: null, runError: null }),

  submitSolution: async (problemId, code, language) => {
    set({ submitting: true, error: null, verdict: null, runtime: null, memory: null, runResult: null, runError: null });
    try {
      const data = await submissionService.submitCode(problemId, code, language);
      set({
        verdict: data.evaluation?.status || data.submission?.status || 'Error',
        runtime: data.submission?.runtime || 0,
        memory: data.submission?.memory || 0,
        submitting: false,
      });
      // Refresh current submissions log
      get().fetchSubmissions();
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit solution';
      set({ error: msg, submitting: false });
      throw new Error(msg);
    }
  },

  executeCodeDraft: async (problemId, code, language, customInput) => {
    set({ running: true, runError: null, runResult: null, error: null, verdict: null, runtime: null, memory: null });
    try {
      const data = await submissionService.runCode(problemId, code, language, customInput);
      set({
        runResult: data,
        running: false,
      });
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to run code';
      set({ runError: msg, running: false });
      throw new Error(msg);
    }
  },

  fetchSubmissions: async () => {
    set({ loading: true, error: null });
    try {
      const data = await submissionService.getMySubmissions();
      set({ submissions: data.submissions || [], loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to load submissions', loading: false });
    }
  },

  fetchLeaderboard: async () => {
    set({ loading: true, error: null });
    try {
      const data = await submissionService.getLeaderboard();
      set({ leaderboard: data.leaderboard || [], loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to load leaderboard', loading: false });
    }
  },
}));

export default useSubmissionStore;
