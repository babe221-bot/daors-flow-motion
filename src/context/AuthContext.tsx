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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      // User will be set via the auth state change listener
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signup = async (email: string, password: string, username: string, role: Role = ROLES.CLIENT) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            full_name: username,
            role,
            email
          });

        if (profileError) {
          return { error: profileError };
        }
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
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
      // Use a fixed guest account for demo purposes
      const { data, error } = await supabase.auth.signInAnonymously();
      
      if (error) {
        return { error };
      }
      
      if (data.user) {
        // Check if user profile exists
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (profileError || !profile) {
          // Create guest user profile
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              id: data.user.id,
              email: data.user.email,
              full_name: 'Guest User',
              role: ROLES.GUEST,
            });
          
          if (insertError) {
            console.error('Error creating guest profile:', insertError);
          }
        }
      }
      
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
