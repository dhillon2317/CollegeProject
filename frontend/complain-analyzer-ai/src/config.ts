// API Configuration
export const config = {
  api: {
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:10000',
    mlBaseURL: import.meta.env.VITE_ML_API_URL || 'http://localhost:10001',
    timeout: 30000, // 30 seconds
  },
  // Add other configuration options here
} as const;
