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
  username?: string;
  email: string;
  password: string;
  name?: string;
  role?: string;
}

// Use the environment variable if it exists, otherwise use direct connection
// IMPORTANT: Use full URL (http://localhost:5001) to bypass Vite proxy and avoid /api/api doubling
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

console.log('API Base URL:', API_BASE_URL);
console.log('Environment variables:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  MODE: import.meta.env.MODE,
  DEV: import.meta.env.DEV
});

// Create axios instance with default config
// Ensure baseURL doesn't include /api to avoid doubling
const cleanBaseURL = API_BASE_URL ? API_BASE_URL.replace(/\/api\/?$/, '').replace(/\/$/, '') : '';
const api: AxiosInstance = axios.create({
  baseURL: cleanBaseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false, // Set to false to avoid CORS issues
  timeout: 30000, // 30 second timeout (increased for AI processing)
});

console.log('Axios baseURL configured as:', cleanBaseURL);

// Single request interceptor for logging and auth
api.interceptors.request.use(
  (config) => {
    // Build full URL for logging
    const base = config.baseURL || '';
    const url = config.url || '';
    const fullUrl = base ? `${base}${url}` : url;
    console.log(`[${config.method?.toUpperCase()}] ${fullUrl}`);
    console.log('Base URL:', base);
    console.log('Full URL:', fullUrl);
    if (config.data) {
      console.log('Request data:', JSON.stringify(config.data, null, 2));
    }

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Single response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`[${response.status}] ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    // Enhanced error logging
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('Response error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        url: error.config?.url,
        data: error.response.data
      });

      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } else if (error.request) {
      // The request was made but no response was received
      const fullUrl = error.config?.baseURL && error.config?.url 
        ? `${error.config.baseURL}${error.config.url}`
        : error.config?.url || 'unknown';
      
      console.error('No response received - Network Error:', {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        fullUrl: fullUrl,
        message: error.message,
        code: error.code,
        request: error.request
      });
      
      // Create a more helpful error message
      const backendUrl = fullUrl || error.config?.baseURL || 'http://localhost:5001';
      const networkError = new Error(
        `Network Error: Unable to connect to the backend server.\n\n` +
        `Attempted URL: ${fullUrl}\n\n` +
        `Please ensure:\n` +
        `1. Backend is running: cd backend && python app.py\n` +
        `2. Backend is accessible at: http://localhost:5001/api/health\n` +
        `3. Check browser console for CORS errors\n` +
        `4. Try opening http://localhost:5001/api/health in your browser`
      );
      (networkError as any).isNetworkError = true;
      (networkError as any).code = error.code;
      (networkError as any).fullUrl = fullUrl;
      return Promise.reject(networkError);
    } else {
      // Something happened in setting up the request
      console.error('Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const complaintService = {
  // Get all complaints
  getComplaints: async (): Promise<Complaint[] | { success: boolean; data: Complaint[] }> => {
    try {
      console.log('Fetching complaints from /api/complaints...');
      const response = await api.get<{ success: boolean; data: Complaint[] } | Complaint[]>('/api/complaints');
      console.log('Complaints response:', response.data);
      // Backend returns { success: true, data: [...] } format
      return response.data;
    } catch (error) {
      console.error('Error fetching complaints:', error);
      throw error;
    }
  },

  // Create a new complaint
  createComplaint: async (complaintData: ComplaintData): Promise<Complaint> => {
    try {
      const url = API_BASE_URL ? `${API_BASE_URL}/api/complaints` : '/api/complaints';
      console.log('Sending complaint to:', url);
      console.log('Using proxy:', !API_BASE_URL ? 'Yes (Vite dev server)' : 'No (direct connection)');
      const response = await api.post<Complaint>('/api/complaints', complaintData);
      console.log('Complaint created successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating complaint:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        request: error.request
      });
      // Re-throw with more context
      if (error.isNetworkError || error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        const errorMsg = !API_BASE_URL 
          ? 'Network Error: Unable to connect via proxy. Please ensure:\n1. Backend is running on http://localhost:5001\n2. Frontend dev server has been restarted after adding proxy config'
          : 'Network Error: Unable to connect to the backend server. Please ensure the backend is running on http://localhost:5001';
        throw new Error(errorMsg);
      }
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

// Health check function to test backend connectivity
export const checkBackendHealth = async (): Promise<boolean> => {
  // Use direct absolute URL to bypass Vite proxy and avoid /api/api doubling
  // Always use http://localhost:5001/api/health directly
  const healthUrl = 'http://localhost:5001/api/health';
  
  console.log('Checking backend health at:', healthUrl);
  console.log('Using direct connection (bypassing Vite proxy)');
  
  try {
    // Create an AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    console.log('Making fetch request to:', healthUrl);
    console.log('Request mode: cors, credentials: omit');
    
    // Use fetch directly for health check to avoid axios configuration issues
    // Use mode: 'cors' explicitly and don't send credentials
    const response = await fetch(healthUrl, {
      method: 'GET',
      mode: 'cors', // Explicitly set CORS mode
      credentials: 'omit', // Don't send credentials
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    console.log('Response received:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Backend health check successful:', data);
      return true;
    } else {
      const errorText = await response.text();
      console.error('Backend health check failed with status:', response.status);
      console.error('Response body:', errorText);
      return false;
    }
  } catch (error: any) {
    console.error('Backend health check failed with exception:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    
    // Provide specific error messages based on error type
    if (error.name === 'AbortError') {
      console.error('Request timed out after 5 seconds');
    } else if (error.name === 'TypeError' && error.message?.includes('Failed to fetch')) {
      console.error('Network error - Possible causes:');
      console.error('  1. Backend is not running');
      console.error('  2. CORS is blocking the request');
      console.error('  3. Firewall is blocking the connection');
      console.error('  4. Mixed content (HTTPS page accessing HTTP)');
    } else if (error.message?.includes('fetch')) {
      console.error('Fetch error - backend may not be accessible');
    }
    
    console.error(`Tried to connect to: ${healthUrl}`);
    console.error('Try opening this URL directly in your browser to test:', healthUrl);
    
    return false;
  }
};

export const authService = {
  // Login user
  login: async (credentials: LoginCredentials) => {
    try {
      const response = await api.post('/api/auth/login', {
        email: credentials.username,
        password: credentials.password
      });
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
      console.log('Registering user with data:', { email: userData.email, name: userData.name });
      const url = '/api/auth/register';
      console.log('Registration URL:', url);
      console.log('Full URL will be:', `${API_BASE_URL}${url}`);
      
      const response = await api.post(url, {
        email: userData.email,
        password: userData.password,
        name: userData.name || userData.username,
        role: userData.role || 'student'
      });
      console.log('Registration successful:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Registration error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        request: error.request,
        config: error.config
      });
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
      const response = await api.get('/api/auth/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },
};

export default api;
