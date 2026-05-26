import api from './api.js';

export const submitCode = async (problemId, code, language) => {
  const response = await api.post('/api/user-api/submit', {
    problemId,
    code,
    language,
  });
  return response.data;
};

export const runCode = async (problemId, code, language, customInput) => {
  const response = await api.post('/api/user-api/run', {
    problemId,
    code,
    language,
    customInput,
  });
  return response.data;
};

export const getSubmissionDetails = async (submissionId) => {
  const response = await api.get(`/api/user-api/submissions/${submissionId}`);
  return response.data;
};

export const getMySubmissions = async () => {
  const response = await api.get('/api/user-api/submissions');
  return response.data;
};

export const getLeaderboard = async () => {
  const response = await api.get('/api/user-api/leaderboard');
  return response.data;
};

export const getAdminLeaderboard = async () => {
  const response = await api.get('/api/admin-api/leaderboard');
  return response.data;
};

export const blockUser = async (userId) => {
  const response = await api.put(`/api/admin-api/block-user/${userId}`);
  return response.data;
};

export const unblockUser = async (userId) => {
  const response = await api.put(`/api/admin-api/unblock-user/${userId}`);
  return response.data;
};

export default {
  submitCode,
  runCode,
  getSubmissionDetails,
  getMySubmissions,
  getLeaderboard,
  getAdminLeaderboard,
  blockUser,
  unblockUser,
};
