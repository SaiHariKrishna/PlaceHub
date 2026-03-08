import axios from 'axios';

// Axios instance with base URL and credentials for cookie auth
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
});

export default api;
