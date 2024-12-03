import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_NATIVE_APP_BACKEND_URL?.endsWith('/')
    ? process.env.REACT_NATIVE_APP_BACKEND_URL.slice(0, -1)
    : process.env.REACT_NATIVE_APP_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

axiosInstance.interceptors.request.use(config => {
  if (!config.url.endsWith('/')) {
    config.url = `${config.url}/`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error('Response Error:', error.response.data);
      console.error('Status Code:', error.response.status);
    } else if (error.request) {
      console.error('Request Error:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;