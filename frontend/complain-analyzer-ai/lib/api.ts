const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const analyzeComplaint = async (text: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ complaint: text }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to analyze complaint');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error analyzing complaint:', error);
    throw error;
  }
};

export const createComplaint = async (complaintData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/complaints`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(complaintData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create complaint');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating complaint:', error);
    throw error;
  }
};

export const getComplaints = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/complaints`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch complaints');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching complaints:', error);
    throw error;
  }
};
