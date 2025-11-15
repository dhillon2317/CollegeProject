import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layouts
import Layout from '../components/Layout';
import App from '../../App';

// Components
import LoginPage from '../components/LoginPage';
import SignUpPage from '../components/SignUpPage';
import LandingPage from '../components/LandingPage';
import NotFoundPage from '../components/NotFoundPage';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public Route Component (only for non-authenticated users)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (currentUser) {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      // Public Routes
      {
        path: '/',
        element: <LandingPage />,
        index: true,
      },
      // Auth Routes
      {
        path: 'login',
        element: <PublicRoute><LoginPage /></PublicRoute>,
      },
      {
        path: 'register',
        element: <PublicRoute><SignUpPage /></PublicRoute>,
      },
      {
        path: 'signup',
        element: <Navigate to="/register" replace />,
      },
      // Redirect old routes to new /app routes
      {
        path: 'dashboard',
        element: <Navigate to="/app" replace />,
      },
      {
        path: 'profile',
        element: <Navigate to="/app/profile" replace />,
      },
      {
        path: 'complaints',
        element: <Navigate to="/app/complaints" replace />,
      },
      // App routes (protected)
      {
        path: 'app',
        element: <ProtectedRoute><App /></ProtectedRoute>,
      },
      // 404 Route - Keep this at the bottom
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

// Export the router instance for use in the application
export default router;
