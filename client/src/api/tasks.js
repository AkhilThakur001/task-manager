import axios from 'axios';

const BASE_URL = 'https://task-manager-api-t14k.onrender.com/api/tasks';

// Axios instance with timeout
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds timeout
});

// Helper to extract error message
const getErrorMessage = (err) => {
  if (err.code === 'ECONNABORTED') return 'Request timed out. Please try again.';
  if (!err.response) return 'Cannot connect to server. Please check your connection.';
  return err.response.data?.error || 'Something went wrong.';
};

export const getTasks = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
};

export const createTask = async (taskData) => {
  try {
    const response = await api.post('/', taskData);
    return response.data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
};

export const updateTask = async (id, updates) => {
  try {
    const response = await api.patch(`/${id}`, updates);
    return response.data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
};

export const deleteTask = async (id) => {
  try {
    const response = await api.delete(`/${id}`);
    return response.data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
};

export const reorderTasks = async (orderedIds) => {
  try {
    const response = await api.post('/reorder', { orderedIds });
    return response.data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
};