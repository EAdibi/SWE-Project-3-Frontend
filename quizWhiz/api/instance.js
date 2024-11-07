import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_NATIVE_APP_BACKEND_URL?.endsWith('/') 
    ? process.env.REACT_NATIVE_APP_BACKEND_URL.slice(0, -1) 
    : process.env.REACT_NATIVE_APP_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(config => {
  if (!config.url.endsWith('/')) {
    config.url = `${config.url}/`;
  }

  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    return Promise.reject(error.response?.data || error);
  }
);

export default axiosInstance;