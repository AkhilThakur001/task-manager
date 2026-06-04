import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api/tasks';

export const getTasks = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await axios.post(BASE_URL, taskData);
  return response.data;
};

export const updateTask = async (id, updates) => {
  const response = await axios.patch(`${BASE_URL}/${id}`, updates);
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return response.data;
};