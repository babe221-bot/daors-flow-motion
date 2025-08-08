import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User, Role, ROLES } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ error?: Error | null }>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, username: string, role?: Role) => Promise<{ error?: Error | null }>;
  hasRole: (allowedRoles: Role[]) => boolean;
  loginAsGuest: () => Promise<{ error?: Error | null }>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const getSession = async () => {
      try {
        setLoading(false); // Simplified for now
      } catch (error) {
        console.error('Error getting session:', error);
        setLoading(false);
      }
    };

    getSession();

    // Simplified auth state change listener
    // return () => {}; // No cleanup needed for now
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Simplified login for testing
      setUser({
        id: '1',
        username: 'Test User',
        role: ROLES.CLIENT,
        avatarUrl: null,
        associatedItemIds: []
      });
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signup = async (email: string, password: string, username: string, role: Role = ROLES.CLIENT) => {
    try {
      // Simplified signup for testing
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const logout = async () => {
    try {
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const hasRole = (allowedRoles: Role[]): boolean => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  const loginAsGuest = async () => {
    try {
      // Simplified guest login for testing
      setUser({
        id: 'guest',
        username: 'Guest User',
        role: ROLES.GUEST,
        avatarUrl: null,
        associatedItemIds: []
      });
      return { error: null };
    } catch (error) {
      console.error('Error during guest login:', error);
      return { error: error as Error };
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    signup,
    hasRole,
    loginAsGuest,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
