import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layouts
import App from '../App';

// Components
import LoginPage from '../components/LoginPage';
import { Dashboard } from '../components/Dashboard';
import { ComplaintForm } from '../components/ComplaintForm';
import LandingPage from '../components/LandingPage';
import NotFoundPage from '../components/NotFoundPage';
import Profile from '../components/Profile';

// Create a simple AuthForm component since it's missing
const AuthForm = ({ type, onSubmit }: { type: 'login' | 'register', onSubmit: (data: any) => Promise<void> }) => (
  <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-6">{type === 'login' ? 'Sign In' : 'Create Account'}</h2>
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData);
      onSubmit(data);
    }}>
      {type === 'register' && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input name="name" type="text" required className="w-full p-2 border rounded" />
        </div>
      )}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Email</label>
        <input name="email" type="email" required className="w-full p-2 border rounded" />
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Password</label>
        <input name="password" type="password" required className="w-full p-2 border rounded" />
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
        {type === 'login' ? 'Sign In' : 'Sign Up'}
      </button>
    </form>
  </div>
);


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
        element: <PublicRoute><AuthForm type="register" onSubmit={async (data) => console.log('Register:', data)} /></PublicRoute>,
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
            index: true,
            element: <Navigate to="/app/dashboard" replace />,
          },
          {
            path: 'dashboard',
            element: <Dashboard 
              complaints={[]} 
              isLoading={false} 
              isRefreshing={false} 
              onRefresh={() => Promise.resolve()} 
              API_URL=""
            />,
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