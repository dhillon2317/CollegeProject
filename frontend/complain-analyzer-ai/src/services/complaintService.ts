import { complaintService as api } from './api';

export interface Complaint {
  _id?: string;
  title: string;
  description: string;
  category?: string;
  priority?: string;
  department?: string;
  status?: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  createdAt?: string;
  updatedAt?: string;
  aiAnalysis?: {
    categoryConfidence?: number;
    priorityConfidence?: number;
    departmentConfidence?: number;
    sentiment?: 'positive' | 'neutral' | 'negative';
    sentimentScore?: number;
    keywords?: string[];
  };
}

export const getComplaints = async (): Promise<Complaint[]> => {
  try {
    const response = await api.getComplaints();
    return response.data || [];
  } catch (error) {
    console.error('Error fetching complaints:', error);
    throw error;
  }
};

export const analyzeComplaint = async (description: string): Promise<Partial<Complaint>> => {
  try {
    const response = await api.analyzeComplaint(description);
    const data = response.data || {};
    
    return {
      category: data.category,
      priority: data.priority,
      department: data.department,
      aiAnalysis: {
        categoryConfidence: data.confidence?.category,
        priorityConfidence: data.confidence?.priority,
        departmentConfidence: data.confidence?.department,
        sentiment: data.sentiment,
        sentimentScore: data.sentiment_score,
        keywords: data.keywords || [],
      },
    };
  } catch (error) {
    console.error('Error analyzing complaint:', error);
    throw error;
  }
};

export const createComplaint = async (complaintData: Omit<Complaint, '_id' | 'createdAt' | 'updatedAt' | 'aiAnalysis' | 'status'>): Promise<Complaint> => {
  try {
    // First analyze the complaint
    let aiAnalysis: any = {};
    
    try {
      const analysis = await analyzeComplaint(complaintData.description);
      aiAnalysis = analysis.aiAnalysis || {};
      
      // Update complaint data with AI analysis
      if (analysis.category) complaintData.category = analysis.category;
      if (analysis.priority) complaintData.priority = analysis.priority;
      if (analysis.department) complaintData.department = analysis.department;
      if ((analysis as any).type) (complaintData as any).type = (analysis as any).type;
    } catch (error) {
      console.warn('AI analysis failed, proceeding without it', error);
    }

    // Create the complaint with AI analysis
    const response = await api.createComplaint({
      ...complaintData,
      status: 'pending',
      aiAnalysis,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Check for error in response
    if (response && response.error) {
      throw new Error(response.error);
    }

    return response;
  } catch (error) {
    console.error('Error creating complaint:', error);
    throw error;
  }
};
