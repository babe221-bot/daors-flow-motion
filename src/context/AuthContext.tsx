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
    const fetchUser = async (sessionUser: any) => {
      try {
        const { data: profile, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', sessionUser.id)
          .single();

        if (error) {
          console.warn('Error fetching user profile:', error);
          // Create a minimal user object if profile doesn't exist
          setUser({
            id: sessionUser.id,
            username: sessionUser.email?.split('@')[0] || 'User',
            role: ROLES.CLIENT,
            avatarUrl: undefined,
            associatedItemIds: []
          });
        } else if (profile) {
          setUser({
            id: profile.id,
            username: profile.full_name || profile.email?.split('@')[0] || 'User',
            role: (profile.role as Role) || ROLES.CLIENT,
            avatarUrl: undefined,
            associatedItemIds: []
          });
        }
      } catch (profileError) {
        console.warn('Profile fetch failed, using session data:', profileError);
        // Fallback to session data
        setUser({
          id: sessionUser.id,
          username: sessionUser.email?.split('@')[0] || 'User',
          role: ROLES.CLIENT,
          avatarUrl: undefined,
          associatedItemIds: []
        });
      } finally {
        setLoading(false);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUser(session.user);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        fetchUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error || null };
  };

  const signup = async (email: string, password: string, username: string, role: Role = ROLES.CLIENT) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: username,
          role: role,
        },
      },
    });
    return { error: error || null };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const hasRole = (allowedRoles: Role[]): boolean => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };


  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    signup,
    hasRole,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
