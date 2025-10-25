const API_BASE_URL = 'http://localhost:5001/api';

export interface Complaint {
  id: number;
  title: string;
  description: string;
  timestamp: string;
  // Add other fields as needed
}

export const getComplaints = async (): Promise<Complaint[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/complaints`);
    const data = await response.json();
    if (data.success) {
      return data.data;
    }
    throw new Error(data.error || 'Failed to fetch complaints');
  } catch (error) {
    console.error('Error fetching complaints:', error);
    throw error;
  }
};

export const createComplaint = async (complaintData: Omit<Complaint, 'id' | 'timestamp'>): Promise<Complaint> => {
  try {
    const response = await fetch(`${API_BASE_URL}/complaints`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(complaintData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create complaint');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error creating complaint:', error);
    throw error;
  }
};
