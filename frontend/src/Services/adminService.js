import api from './api.js';

export const getProblems = async () => {
  const response = await api.get('/api/admin-api/problems');
  return response.data;
};

export const createProblem = async (problemData) => {
  const response = await api.post('/api/admin-api/problems', problemData);
  return response.data;
};

export const updateProblem = async (id, problemData) => {
  const response = await api.put(`/api/admin-api/problems/${id}`, problemData);
  return response.data;
};

export const deleteProblem = async (id) => {
  const response = await api.delete(`/api/admin-api/problems/${id}`);
  return response.data;
};

export const blockUser = async (id) => {
  const response = await api.put(`/api/admin-api/block-user/${id}`);
  return response.data;
};

export const unblockUser = async (id) => {
  const response = await api.put(`/api/admin-api/unblock-user/${id}`);
  return response.data;
};

export const getLeaderboard = async () => {
  const response = await api.get('/api/admin-api/leaderboard');
  return response.data;
};

export default {
  getProblems,
  createProblem,
  updateProblem,
  deleteProblem,
  blockUser,
  unblockUser,
  getLeaderboard,
};
