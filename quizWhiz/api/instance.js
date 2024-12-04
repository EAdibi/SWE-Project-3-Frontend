import axios from 'axios';

// Create axios instance with custom config
const axiosInstance = axios.create({
  baseURL: process.env.REACT_NATIVE_APP_BACKEND_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default axiosInstance