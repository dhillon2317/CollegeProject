import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Dashboard } from '../components/Dashboard';
import { ComplaintForm } from '../components/ComplaintForm';
import { ComplaintAnalytics } from '../components/ComplaintAnalytics';
import { DomainSelector } from '../components/DomainSelector';
import LoginPage from '../components/LoginPage';
import LandingPage from '../components/LandingPage';
import { Toaster } from 'sonner';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';

// Create a context to share state between components
interface AppContextType {
  complaints: any[];
  isLoading: boolean;
  isRefreshing: boolean;
  selectedDomain: any;
  onRefresh: () => Promise<void>;
  onDomainSelected: (domain: any) => void;
}

const AppContext = React.createContext<AppContextType | undefined>(undefined);

// Custom hook to use the app context
export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Wrapper components to consume the context
const DashboardWrapper = () => {
  const { complaints, isLoading, isRefreshing, onRefresh } = useAppContext();
  return (
    <Dashboard 
      complaints={complaints}
      isLoading={isLoading}
      isRefreshing={isRefreshing}
      onRefresh={onRefresh}
    />
  );
};

const ComplaintFormWrapper = () => {
  return <ComplaintForm />;
};

const ComplaintAnalyticsWrapper = () => {
  const { complaints } = useAppContext();
  return <ComplaintAnalytics complaints={complaints} />;
};

const DomainSelectorWrapper = () => {
  const { onDomainSelected } = useAppContext();
  return <DomainSelector onDomainSelected={onDomainSelected} />;
};

// Layout component that wraps all routes
const AppLayout = () => {
  const [complaints, setComplaints] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [selectedDomain, setSelectedDomain] = React.useState<any>(null);

  const fetchComplaints = React.useCallback(async () => {
    try {
      setIsRefreshing(true);
      // Use relative URL via Vite proxy
      const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '' : 'http://localhost:5001');
      const url = API_URL ? `${API_URL}/api/complaints` : '/api/complaints';
      const response = await fetch(url);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to fetch complaints');
      }
      
      const result = await response.json();
      console.log('Fetched complaints response:', result); // Debug log
      
      // Handle both formats: { success: true, data: [...] } or direct array
      let complaintsArray: any[] = [];
      if (result.success && Array.isArray(result.data)) {
        complaintsArray = result.data;
      } else if (Array.isArray(result)) {
        complaintsArray = result;
      } else if (Array.isArray(result.data)) {
        complaintsArray = result.data;
      }
      
      if (complaintsArray.length > 0 || result.success !== false) {
        // Transform the data to match the expected format
        const formattedComplaints = complaintsArray.map((complaint: any) => ({
          ...complaint,
          // Ensure all required fields have default values if missing
          id: complaint.id || complaint._id,
          status: complaint.status || 'pending',
          priority: complaint.priority || 'medium',
          department: complaint.department || 'General',
          category: complaint.category || 'Other',
          type: complaint.type || 'General',
          createdAt: complaint.createdAt || complaint.timestamp || new Date().toISOString(),
          contactInfo: complaint.contactInfo || 'N/A',
          userType: complaint.userType || 'Student'
        }));
        console.log(`Loaded ${formattedComplaints.length} complaints`);
        setComplaints(formattedComplaints);
      } else {
        console.warn('No complaints found or invalid response format:', result);
        setComplaints([]);
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
      setComplaints([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const handleDomainSelected = React.useCallback((domain: any) => {
    setSelectedDomain(domain);
    // You might want to store the selected domain in localStorage or context
  }, []);

  const contextValue = React.useMemo(() => ({
    complaints,
    isLoading,
    isRefreshing,
    selectedDomain,
    onRefresh: fetchComplaints,
    onDomainSelected: handleDomainSelected
  }), [complaints, isLoading, isRefreshing, selectedDomain, fetchComplaints, handleDomainSelected]);

  return (
    <AppContext.Provider value={contextValue}>
      <Toaster position="top-right" />
      <VercelAnalytics />
      <Outlet />
    </AppContext.Provider>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "",
        element: <LandingPage />,
        index: true
      },
      {
        path: "login",
        element: <LoginPage />
      },
      {
        path: "dashboard",
        element: <DashboardWrapper />
      },
      {
        path: "new-complaint",
        element: <ComplaintFormWrapper />
      },
      {
        path: "analytics",
        element: <ComplaintAnalyticsWrapper />
      },
      {
        path: "domain-selector",
        element: <DomainSelectorWrapper />
      }
    ]
  }
]);

export const AppRouter = () => {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
};

export default AppRouter;
