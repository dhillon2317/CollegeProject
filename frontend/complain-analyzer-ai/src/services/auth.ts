import axios from 'axios';
import { API_BASE_URL } from '../config';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

const api = axios.create({
  baseURL: API_BASE_URL || undefined, // undefined means relative URLs (via Vite proxy)
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
  timeout: 30000,
});

// Add a request interceptor to include the token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post('/api/login', { email, password });
  return response.data;
};

export const register = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post('/api/auth/register', { name, email, password });
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get('/api/me');
  return response.data.user;
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

export const logout = (): void => {
  localStorage.removeItem('token');
  // Redirect to login page
  window.location.href = '/login';
};
