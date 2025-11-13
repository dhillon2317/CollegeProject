import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

  // Mock login - replace with actual API call
  const login = async (email: string, password: string) => {
    // This is a mock implementation
    // In a real app, you would make an API call to your backend
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // Mock user data - in a real app, this would come from your API
        const mockUser: User = {
          id: '1',
          email: email,
          name: email.split('@')[0],
          role: email.includes('admin') ? 'admin' : 'student',
          department: 'IT' // Example department
        };
        setCurrentUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        resolve();
      }, 500);
    });
  };

  const signup = async (email: string, password: string, role: UserRole, name: string) => {
    // Mock signup - replace with actual API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          name,
          role,
          department: 'General' // Default department
        };
        setCurrentUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        resolve();
      }, 500);
    });
  };

  const logout = async () => {
    // Clear user data
    setCurrentUser(null);
    localStorage.removeItem('user');
    // In a real app, you would also make an API call to invalidate the session
  };

  // Check for existing session
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
      } catch (error) {
        console.error('Failed to parse user data', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
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
