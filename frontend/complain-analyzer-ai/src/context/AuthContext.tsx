import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/api';

export type UserRole = 'admin' | 'student';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, role: UserRole, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Real login using API
  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ username: email, password });
      
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      
      const user: User = {
        id: response.user?.id || '',
        email: response.user?.email || email,
        name: response.user?.name || email.split('@')[0],
        role: (response.user?.role === 'admin' ? 'admin' : 'student') as UserRole,
        department: response.user?.department
      };
      
      setCurrentUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.error || error.message || 'Login failed');
    }
  };

  const signup = async (email: string, password: string, role: UserRole, name: string) => {
    try {
      const response = await authService.register({
        username: email,
        email,
        password,
        name,
        role
      });
      
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      
      const user: User = {
        id: response.user?.id || '',
        email: response.user?.email || email,
        name: response.user?.name || name,
        role: (response.user?.role === 'admin' ? 'admin' : 'student') as UserRole,
        department: response.user?.department
      };
      
      setCurrentUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(error.response?.data?.error || error.message || 'Registration failed');
    }
  };

  const logout = async () => {
    // Clear user data and token
    setCurrentUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    authService.logout();
  };

  // Check for existing session and validate token
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (storedUser && token) {
        try {
          const user = JSON.parse(storedUser);
          // Optionally validate token with backend
          try {
            const currentUserData = await authService.getCurrentUser();
            if (currentUserData) {
              const updatedUser: User = {
                id: currentUserData.id || user.id,
                email: currentUserData.email || user.email,
                name: currentUserData.name || user.name,
                role: (currentUserData.role === 'admin' ? 'admin' : 'student') as UserRole,
                department: currentUserData.department
              };
              setCurrentUser(updatedUser);
              localStorage.setItem('user', JSON.stringify(updatedUser));
            }
          } catch (error) {
            // Token invalid, clear storage
            console.error('Token validation failed:', error);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Failed to parse user data', error);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const isAdmin = currentUser?.role === 'admin';

  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false;
    
    const permissions: Record<UserRole, string[]> = {
      admin: ['view_dashboard', 'manage_complaints', 'view_analytics', 'manage_users'],
      student: ['view_dashboard', 'create_complaints', 'view_own_complaints', 'view_analytics']
    };

    return permissions[currentUser.role].includes(permission);
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
    loading,
    isAdmin,
    hasPermission,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
