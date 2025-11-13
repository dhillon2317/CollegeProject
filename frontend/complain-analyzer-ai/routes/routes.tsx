import React from 'react';
import { Route, Routes, Navigate, useNavigate, useLocation, Outlet, useOutletContext } from 'react-router-dom';
import { Toaster } from 'sonner';

// Layout and Components
import AppLayout from '../App';
import LandingPage from '../components/LandingPage';
import LoginPage from '../components/LoginPage';
import { Dashboard } from '../components/Dashboard';
import { ComplaintForm } from '../components/ComplaintForm';
import { ComplaintAnalytics } from '../components/ComplaintAnalytics';
import { DomainSelector } from '../components/DomainSelector';

// Define the DomainConfig type to match the one in App.tsx
interface DomainConfig {
  id: string;
  name: string;
  icon: React.ReactNode;
  theme?: string;
}

// Import the context type and hook from App
import type { AppLayoutContext } from '../App';

// Wrapper components to access the context
const DashboardWithContext = () => {
  const { complaints, isLoading, isRefreshing, onRefresh } = useAppLayout();
  return (
    <Dashboard 
      complaints={complaints}
      isLoading={isLoading}
      isRefreshing={isRefreshing}
      onRefresh={onRefresh}
    />
  );
};

const ComplaintFormWithContext = () => {
  const { selectedDomain } = useAppLayout();
  if (!selectedDomain) {
    return <Navigate to="/domain" replace />;
  }
  return <ComplaintForm selectedDomain={selectedDomain} />;
};

const ComplaintAnalyticsWithContext = () => {
  const { complaints } = useAppLayout();
  return <ComplaintAnalytics complaints={complaints} />;
};

// Create a custom hook to use the app layout context
export const useAppLayout = () => {
  return useOutletContext<AppLayoutContext>();
};

export default function AppRouter() {
  console.log('AppRouter rendered');
  const navigate = useNavigate();
  const location = useLocation();

  console.log('Current path:', location.pathname);

  // Handle domain selection
  const handleDomainSelected = (domain: DomainConfig) => {
    console.log('Domain selected:', domain);
    navigate('/app/dashboard');
  };

  console.log('Rendering routes for path:', location.pathname);
  return (
    <>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Domain selection */}
        <Route 
          path="/domain" 
          element={
            <DomainSelector 
              onDomainSelected={handleDomainSelected}
            />
          } 
        />
        
        {/* Protected routes with AppLayout */}
        <Route 
          path="/app" 
          element={
            <AppLayout>
              <Outlet />
            </AppLayout>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route 
            path="dashboard" 
            element={<DashboardWithContext />}
          />
          <Route 
            path="submit" 
            element={<ComplaintFormWithContext />}
          />
          <Route 
            path="analytics" 
            element={<ComplaintAnalyticsWithContext />}
          />
        </Route>
        
        {/* Redirect all other routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}