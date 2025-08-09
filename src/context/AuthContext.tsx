import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ROLES, Role, User as AppUser } from '@/lib/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface AuthContextType {
  // Session & user state
  session: any | null;
  user: (AppUser & { email?: string }) | null;
  loading: boolean;
  isAuthenticated: boolean;

  // Actions
  login: (email: string, password: string) => Promise<{ error?: { message: string } }>;
  signup: (
    email: string,
    password: string,
    username?: string,
    role?: Role
  ) => Promise<{ error?: { message: string } }>;
  loginAsGuest: () => Promise<{ error?: { message: string } }>;
  signOut: () => Promise<void>;

  // Authz helpers
  hasRole: (roles: Role[]) => boolean;
}

function mapSupabaseUserToAppUser(supaUser: any | null): (AppUser & { email?: string }) | null {
  if (!supaUser) return null;
  const role: Role =
    (supaUser.user_metadata?.role as Role) ||
    (supaUser.app_metadata?.userrole as Role) ||
    ROLES.CLIENT;
  const username =
    supaUser.user_metadata?.username ||
    supaUser.user_metadata?.name ||
    supaUser.email?.split('@')?.[0] ||
    'user';
  return {
    id: supaUser.id,
    username,
    role,
    avatarUrl: supaUser.user_metadata?.avatar_url,
    associatedItemIds: [],
    email: supaUser.email ?? undefined,
  };
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  isAuthenticated: false,
  login: async () => ({}),
  signup: async () => ({}),
  loginAsGuest: async () => ({ }),
  signOut: async () => {},
  hasRole: () => false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<any | null>(null);
  const [user, setUser] = useState<(AppUser & { email?: string }) | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore guest session if any
  useEffect(() => {
    const guest = localStorage.getItem('df_guest_session');
    if (guest === 'true') {
      setUser({ id: 'guest', username: 'guest', role: ROLES.GUEST });
      setLoading(false);
    }
  }, []);

  // Initialize from Supabase current session with timeout
  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;
    
    // Set a timeout to prevent hanging indefinitely
    const initTimeout = setTimeout(() => {
      if (isMounted && loading) {
        console.warn('Auth initialization timed out, proceeding as guest');
        setLoading(false);
        // Optionally set as guest user to allow app to function
        setUser({ id: 'timeout-guest', username: 'Guest User', role: ROLES.GUEST });
      }
    }, 5000); // 5 second timeout
    
    (async () => {
      try {
        // Use Promise.race to add timeout to Supabase calls
        const sessionPromise = supabase.auth.getSession();
        const sessionResult = await Promise.race([
          sessionPromise,
          new Promise<null>((_, reject) => 
            setTimeout(() => reject(new Error('Session fetch timeout')), 3000)
          )
        ]);
        
        if (!isMounted) return;
        
        // If we got here, we have session data
        const { data: sessionData } = sessionResult as any;
        setSession(sessionData?.session ?? null);
        
        // Now get user data
        const userPromise = supabase.auth.getUser();
        const userResult = await Promise.race([
          userPromise,
          new Promise<null>((_, reject) => 
            setTimeout(() => reject(new Error('User fetch timeout')), 3000)
          )
        ]);
        
        if (!isMounted) return;
        
        // If we got here, we have user data
        const { data: userData } = userResult as any;
        setUser(mapSupabaseUserToAppUser(userData?.user ?? null));
      } catch (e) {
        console.warn('Auth initialization error:', e);
        // Non-fatal; fallback to guest/local state
      } finally {
        if (isMounted) {
          setLoading(false);
          clearTimeout(initTimeout);
        }
      }
    })();
    
    return () => {
      isMounted = false;
      clearTimeout(initTimeout);
    };
  }, []);

  // Listen to session changes
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      try {
        const { data: userData } = await supabase.auth.getUser();
        setUser(mapSupabaseUserToAppUser(userData?.user ?? null));
        // Clear guest flag if a real session exists
        if (newSession?.access_token) {
          localStorage.removeItem('df_guest_session');
        }
      } catch (_) {
        setUser(null);
      }
      setLoading(false);
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const isAuthenticated = useMemo(() => !!user && (user.role ? true : !!session), [user, session]);

  // React Query mutation for login (minimal wrapper)
  const loginMutation = useMutation({
    mutationKey: ['auth', 'login'],
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      const { data: userData } = await supabase.auth.getUser();
      setUser(mapSupabaseUserToAppUser(userData?.user ?? null));
      localStorage.removeItem('df_guest_session');
    },
  });

  const login = async (email: string, password: string) => {
    try {
      await loginMutation.mutateAsync({ email, password });
      return { };
    } catch (err: any) {
      return { error: { message: err?.message || 'Login failed' } };
    }
  };

  const signup = async (
    email: string,
    password: string,
    username?: string,
    role: Role = ROLES.CLIENT
  ) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username, role },
        },
      });
      if (error) return { error: { message: error.message } };
      return {};
    } catch (err: any) {
      return { error: { message: err?.message || 'Signup failed' } };
    }
  };

  const loginAsGuest = async () => {
    try {
      // Client-side ephemeral guest session
      localStorage.setItem('df_guest_session', 'true');
      setUser({ id: 'guest', username: 'guest', role: ROLES.GUEST });
      setSession(null);
      return {};
    } catch (err: any) {
      return { error: { message: err?.message || 'Guest login failed' } };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('df_guest_session');
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  };

  const hasRole = (roles: Role[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const value: AuthContextType = {
    session,
    user,
    loading,
    isAuthenticated,
    login,
    signup,
    loginAsGuest,
    signOut,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}