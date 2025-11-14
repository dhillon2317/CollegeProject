import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layouts
import App from '../App';

// Components
import LoginPage from '../components/LoginPage';
import SignUpPage from '../components/SignUpPage';
import { ComplaintForm } from '../components/ComplaintForm';
import LandingPage from '../components/LandingPage';
import NotFoundPage from '../components/NotFoundPage';
import Profile from '../components/Profile';


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
    return <Navigate to="/app/dashboard" replace />;
  }

  return <>{children}</>;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
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
        element: <Navigate to="/app/dashboard" replace />,
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
            element: <ProtectedRoute><Outlet /></ProtectedRoute>,
        children: [
          {
          },
          {
            path: 'profile',
            element: <Profile />,
          },
          {
            path: 'complaints',
            element: (
              <div>
                <ComplaintForm 
                  onSubmit={async (data: any) => {
                    console.log('Complaint:', data);
                    return Promise.resolve();
                  }} 
                />
              </div>
            ),
          },
        ],
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