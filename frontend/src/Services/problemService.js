import api from './api.js';

export const getAllProblems = async () => {
  const response = await api.get('/api/user-api/problems');
  return response.data;
};

export const getSingleProblem = async (problemId) => {
  const response = await api.get(`/api/user-api/problem/${problemId}`);
  return response.data;
};

export const createProblem = async (problemData) => {
  const response = await api.post('/api/admin-api/problems', problemData);
  return response.data;
};

export const updateProblem = async (problemId, problemData) => {
  const response = await api.put(`/api/admin-api/problems/${problemId}`, problemData);
  return response.data;
};

export const deleteProblem = async (problemId) => {
  const response = await api.delete(`/api/admin-api/problems/${problemId}`);
  return response.data;
};

export default {
  getAllProblems,
  getSingleProblem,
  createProblem,
  updateProblem,
  deleteProblem,
};
