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
    // Backend returns { success: true, data: [...] } format
    let complaints: any[] = [];
    if (Array.isArray(response)) {
      // Direct array response
      complaints = response;
    } else if (response && (response as any).success && Array.isArray((response as any).data)) {
      // Backend format: { success: true, data: [...] }
      complaints = (response as any).data;
    } else if (response && Array.isArray((response as any).data)) {
      // Alternative format
      complaints = (response as any).data;
    }
    
    return complaints.map((complaint: any) => ({
      ...complaint,
      _id: complaint._id || complaint.id
    }));
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
      department: data.assignedDepartment || data.department,
      type: data.type,
      aiAnalysis: {
        categoryConfidence: data.aiConfidence,
        priorityConfidence: data.aiConfidence,
        departmentConfidence: data.aiConfidence,
      },
    };
  } catch (error) {
    console.error('Error analyzing complaint:', error);
    throw error;
  }
};

export const createComplaint = async (complaintData: Omit<Complaint, '_id' | 'createdAt' | 'updatedAt' | 'aiAnalysis' | 'status'>): Promise<Complaint> => {
  try {
    // Backend handles AI analysis automatically, so just send the complaint data
    const response = await api.createComplaint({
      ...complaintData,
      status: 'pending'
    });

    // Check for error in response
    if (response && response.error) {
      throw new Error(response.error);
    }

    // Backend returns complaint with 'id' field, map it to '_id' for compatibility
    if (response && (response as any).id && !response._id) {
      (response as any)._id = (response as any).id;
    }

    return response;
  } catch (error) {
    console.error('Error creating complaint:', error);
    throw error;
  }
};
