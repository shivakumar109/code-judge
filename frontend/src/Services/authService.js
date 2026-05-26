import api from './api.js';

export const registerUser = async (firstName, lastName, username, email, password) => {
  const response = await api.post('/api/common-api/register', {
    firstName,
    lastName,
    username,
    email,
    password,
  });
  return response.data;
};

export const loginUser = async (emailOrUsername, password) => {
  const payload = { password };
  if (emailOrUsername.includes('@')) {
    payload.email = emailOrUsername.trim();
  } else {
    payload.username = emailOrUsername.trim();
  }
  const response = await api.post('/api/common-api/login', payload);
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.get('/api/common-api/logout');
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/api/user-api/profile');
  return response.data;
};

export default {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
};
