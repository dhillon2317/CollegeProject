const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

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
    const response = await fetch(`${API_BASE_URL}/analytics`);
    if (!response.ok) {
      throw new Error('Failed to fetch analytics data');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
};

export const getComplaintAnalysis = async (complaintId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/complaint/${complaintId}`);
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
