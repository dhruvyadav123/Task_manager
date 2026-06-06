import axios from 'axios';

const apiBaseUrl =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? 'http://localhost:5000/api'
    : 'https://task-manager-mnl3.onrender.com/api');

export const http = axios.create({
  baseURL: apiBaseUrl,
  timeout: 15000,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('taskflow_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('taskflow_token');
      localStorage.removeItem('taskflow_user');
    }
    return Promise.reject(error);
  }
);

export const getApiError = (error, fallback = 'Something went wrong') =>
  error.response?.data?.message || error.message || fallback;
