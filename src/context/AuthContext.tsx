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
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Fetch user profile from your users table
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profile) {
            setUser({
              id: profile.id,
              username: profile.username || session.user.email?.split('@')[0] || 'User',
              role: profile.role || ROLES.CLIENT,
              avatarUrl: profile.avatar_url,
              associatedItemIds: profile.associated_item_ids
            });
          }
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Fetch user profile
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setUser({
            id: profile.id,
            username: profile.username || session.user.email?.split('@')[0] || 'User',
            role: profile.role || ROLES.CLIENT,
            avatarUrl: profile.avatar_url,
            associatedItemIds: profile.associated_item_ids
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
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
            username,
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
      // Generate a unique guest email to avoid conflicts
      const guestEmail = `guest_${Date.now()}@example.com`;
      const guestPassword = 'guestpassword'; // A dummy password

      // Attempt to sign up the guest user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: guestEmail,
        password: guestPassword,
      });

      if (signUpError) {
        // If the user already exists, try to sign them in
        if (signUpError.message.includes('already registered')) {
          return login(guestEmail, guestPassword);
        }
        console.error('Guest sign-up error:', signUpError);
        return { error: signUpError };
      }

      if (data.user) {
        // Manually set the user in the state as the auth listener might not be fast enough
        const guestUser: User = {
          id: data.user.id,
          username: 'Guest',
          role: ROLES.GUEST,
          avatarUrl: null,
          associatedItemIds: [],
        };
        setUser(guestUser);

        // Also insert into the public 'users' table
        await supabase.from('users').insert({
          id: data.user.id,
          email: guestEmail,
          username: 'Guest',
          role: ROLES.GUEST,
        });

        return { error: null };
      }

      return { error: new Error('Guest sign-up did not return a user.') };
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
    loginAsGuest, // Added this line
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
