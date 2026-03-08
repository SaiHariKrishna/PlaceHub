import axios from 'axios';

// Axios instance with base URL and credentials for cookie auth
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://place-hub-woxsen.vercel.app/',
  withCredentials: true,
});

export default api;
