import React, { useState, useEffect } from 'react';
import { Complaint } from '../services/api';

interface ComplaintFetcherProps {
  setComplaints: (complaints: Complaint[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsRefreshing: (isRefreshing: boolean) => void;
}

const ComplaintFetcher: React.FC<ComplaintFetcherProps> = ({
  setComplaints,
  setIsLoading,
  setIsRefreshing,
}) => {
  useEffect(() => {
    const fetchComplaints = async () => {
      setIsLoading(true);
      setIsRefreshing(true);
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
        const response = await fetch(`${API_URL}/complaints`);
        if (!response.ok) {
          throw new Error('Failed to fetch complaints');
        }
        const data = await response.json();
        setComplaints(data);
      } catch (error) {
        console.error('Error fetching complaints:', error);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    };

    fetchComplaints();
  }, [setComplaints, setIsLoading, setIsRefreshing]);

  return null; // This component doesn't render anything
};

export default ComplaintFetcher;
