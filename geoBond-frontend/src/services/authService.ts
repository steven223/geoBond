import api from './api';

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (email: string, password: string, username: string) => {
  try {
    const response = await api.post('/auth/register', { email, password, username });
    return response.data;
  } catch (error) {
    throw error;
  }
};
