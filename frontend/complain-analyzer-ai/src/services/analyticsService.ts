// Use relative URLs via Vite proxy in development
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '' : 'http://localhost:5001');

export interface AnalyticsData {
  categoryDistribution: {
    [key: string]: number;
  };
  statusDistribution: {
    [key: string]: number;
  };
  trendData: Array<{
    date: string;
    count: number;
  }>;
  topComplaints: Array<{
    id: string;
    title: string;
    category: string;
    status: string;
    createdAt: string;
  }>;
  aiInsights?: {
    sentimentAnalysis: {
      positive: number;
      neutral: number;
      negative: number;
    };
    commonKeywords: Array<{
      keyword: string;
      count: number;
    }>;
  };
}

export const getAnalytics = async (): Promise<AnalyticsData> => {
  try {
    const url = API_BASE_URL ? `${API_BASE_URL}/api/analytics` : '/api/analytics';
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch analytics data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
};

export const getComplaintAnalysis = async (complaintId: string) => {
  try {
    const url = API_BASE_URL ? `${API_BASE_URL}/api/analytics/complaint/${complaintId}` : `/api/analytics/complaint/${complaintId}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch complaint analysis');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching complaint analysis:', error);
    throw error;
  }
};
