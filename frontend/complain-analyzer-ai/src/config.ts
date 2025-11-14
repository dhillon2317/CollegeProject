// API Configuration
// Use empty string for relative URLs (via Vite proxy in dev) or explicit URL for production
export const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '' : 'http://localhost:5001');

export const config = {
  api: {
    baseURL: API_BASE_URL,
    mlBaseURL: import.meta.env.VITE_ML_API_URL || 'http://localhost:10001',
    timeout: 30000, // 30 seconds
  },
  // Add other configuration options here
} as const;
