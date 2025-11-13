import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Define interfaces for our data
export interface ComplaintData {
  title: string;
  description: string;
  contactInfo: string;
  userType: string;
  domain: string;
  [key: string]: any;
}

export interface AnalysisResult {
  category: string;
  priority: string;
  type: string;
  assignedDepartment: string;
  aiConfidence: number;
}

export interface Complaint extends Omit<ComplaintData, 'id'> {
  id: string;
  status: string;
  createdAt: string;
  analysis: AnalysisResult;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterUserData {
  username: string;
  email: string;
  password: string;
}

// Use the environment variable if it exists, otherwise default to localhost:5001
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

console.log('API Base URL:', API_BASE_URL); // Debug log

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
  timeout: 10000,
});

// Add a request interceptor to log requests
api.interceptors.request.use(
  (config) => {
    console.log('Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response Error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
        config: error.config
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Add request interceptor for auth token
api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config as any;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const complaintService = {
  // Get all complaints
  getComplaints: async (): Promise<Complaint[]> => {
    try {
      const response = await api.get<Complaint[]>('/api/complaints');
      return response.data;
    } catch (error) {
      console.error('Error fetching complaints:', error);
      throw error;
    }
  },

  // Create a new complaint
  createComplaint: async (complaintData: ComplaintData): Promise<Complaint> => {
    try {
      const response = await api.post<Complaint>('/api/complaints', complaintData);
      return response.data;
    } catch (error) {
      console.error('Error creating complaint:', error);
      throw error;
    }
  },

  // Update complaint status
  updateComplaintStatus: async (id: string, status: string): Promise<Complaint> => {
    try {
      const response = await api.patch<Complaint>(`/api/complaints/${id}`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating complaint status:', error);
      throw error;
    }
  },

  // Get complaint by ID
  getComplaintById: async (id: string): Promise<Complaint> => {
    try {
      const response = await api.get<Complaint>(`/api/complaints/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching complaint:', error);
      throw error;
    }
  },

  // Delete complaint
  deleteComplaint: async (id: string): Promise<void> => {
    try {
      await api.delete(`/api/complaints/${id}`);
    } catch (error) {
      console.error('Error deleting complaint:', error);
      throw error;
    }
  },

  // Analyze complaint text
  analyzeComplaint: async (text: string): Promise<AnalysisResult> => {
    try {
      const response = await api.post<AnalysisResult>('/analyze', { text });
      return response.data;
    } catch (error) {
      console.error('Error analyzing complaint:', error);
      throw error;
    }
  }
};

export const authService = {
  // Login user
  login: async (credentials: LoginCredentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Register new user
  register: async (userData: RegisterUserData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },
};

export default api;
