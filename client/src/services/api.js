import axios from 'axios';

// Get API base URL from Vite environment variables (fallback to localhost:5000/api in development)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Response interceptor to normalize error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extract structured error message from server response if available
    const customMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected network error occurred';

    // Attach user-friendly error message to the error object
    error.userMessage = customMessage;
    return Promise.reject(error);
  }
);

export default api;
