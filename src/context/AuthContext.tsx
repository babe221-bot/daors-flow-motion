import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ROLES, Role, User as AppUser } from '@/lib/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { pingSupabase, waitForSupabase } from '../lib/supabase-health';

// Define proper types for auth responses
interface AuthError {
  message: string;
}

interface AuthContextType {
  // Session & user state
  session: Session | null;
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

function mapSupabaseUserToAppUser(supaUser: SupabaseUser | null): (AppUser & { email?: string }) | null {
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
    avatarUrl: supaUser.user_metadata?.avatar_url as string | undefined,
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
  const [session, setSession] = useState<Session | null>(null);
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
    }, 15000); // Increased to 15 seconds to accommodate retries
    
    const initializeAuth = async () => {
      try {
        // Check if we're already in a guest session
        const guest = localStorage.getItem('df_guest_session');
        if (guest === 'true') {
          setUser({ id: 'guest', username: 'guest', role: ROLES.GUEST });
          setLoading(false);
          return;
        }

        // First, check if Supabase is reachable
        console.log('Checking Supabase connectivity...');
        const isSupabaseReachable = await pingSupabase();
        
        if (!isSupabaseReachable) {
          console.warn('Supabase is not reachable, waiting for connection...');
          const connectionEstablished = await waitForSupabase(10000); // Wait up to 10 seconds
          
          if (!connectionEstablished) {
            console.warn('Could not establish connection to Supabase, proceeding as guest');
            setUser({ id: 'offline-guest', username: 'Guest User (Offline)', role: ROLES.GUEST });
            setLoading(false);
            return;
          }
        }

        // Try to get session with increased timeout and retry logic
        let sessionData = null;
        let retryCount = 0;
        const maxRetries = 3;
        const timeoutMs = 10000; // Increased to 10 seconds
        
        while (retryCount < maxRetries && !sessionData) {
          try {
            const { data } = await Promise.race([
              supabase.auth.getSession(),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Session fetch timeout')), timeoutMs)
              )
            ]);
            sessionData = data?.session;
            break; // Success, exit retry loop
          } catch (sessionError) {
            retryCount++;
            const errorMessage = sessionError instanceof Error ? sessionError.message : 'Unknown error';
            console.warn(`Session fetch attempt ${retryCount} failed: ${errorMessage}`);
            
            // Log specific timeout errors for debugging
            if (errorMessage.includes('timeout')) {
              console.warn(`⏱️ Timeout occurred on attempt ${retryCount}. This may indicate network issues or Supabase service problems.`);
            }
            
            if (retryCount < maxRetries) {
              // Wait before retrying (exponential backoff)
              const delay = 1000 * retryCount;
              console.log(`🔄 Retrying in ${delay}ms...`);
              await new Promise(resolve => setTimeout(resolve, delay));
            } else {
              console.warn(`❌ All ${maxRetries} session fetch attempts failed. Proceeding with guest mode.`);
            }
          }
        }
        
        if (!isMounted) return;
        
        setSession(sessionData);
        
        // Only try to get user if we have a session
        if (sessionData) {
          let userData = null;
          let userRetryCount = 0;
          
          while (userRetryCount < maxRetries && !userData) {
            try {
              const { data } = await Promise.race([
                supabase.auth.getUser(),
                new Promise((_, reject) => 
                  setTimeout(() => reject(new Error('User fetch timeout')), timeoutMs)
                )
              ]);
              userData = data?.user;
              break; // Success, exit retry loop
            } catch (userError) {
              userRetryCount++;
              const errorMessage = userError instanceof Error ? userError.message : 'Unknown error';
              console.warn(`User fetch attempt ${userRetryCount} failed: ${errorMessage}`);
              
              if (errorMessage.includes('timeout')) {
                console.warn(`⏱️ User fetch timeout on attempt ${userRetryCount}`);
              }
              
              if (userRetryCount < maxRetries) {
                // Wait before retrying (exponential backoff)
                const delay = 1000 * userRetryCount;
                console.log(`🔄 Retrying user fetch in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
              } else {
                console.warn(`❌ All ${maxRetries} user fetch attempts failed.`);
              }
            }
          }
          
          if (!isMounted) return;
          
          setUser(mapSupabaseUserToAppUser(userData));
        } else {
          // No session, check if we should proceed as guest
          setUser({ id: 'no-session-guest', username: 'Guest User', role: ROLES.GUEST });
        }
      } catch (e) {
        console.warn('Auth initialization error:', e);
        // Non-fatal; fallback to guest/local state
        setUser({ id: 'error-guest', username: 'Guest User', role: ROLES.GUEST });
      } finally {
        if (isMounted) {
          setLoading(false);
          clearTimeout(initTimeout);
        }
      }
    };
    
    initializeAuth();
    
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
      // Start protected operation to prevent React DevTools interference
      startProtectedOperation();
      
      // Try direct Supabase auth call first
      try {
        console.log('Attempting direct Supabase authentication...');
        
        // Direct call to Supabase auth to bypass potential React DevTools interference
        const { data, error: loginError } = await supabase.auth.signInWithPassword({ 
          email, 
          password 
        });
        
        if (loginError) {
          console.warn('Login error:', loginError.message);
          return { error: { message: loginError.message } };
        }
        
        // Manually update the user state
        if (data?.user) {
          console.log('Authentication successful, updating user state...');
          const userData = await supabase.auth.getUser();
          setUser(mapSupabaseUserToAppUser(userData?.data?.user ?? null));
          setSession(data.session);
          localStorage.removeItem('df_guest_session');
          
          // Invalidate queries to refresh data
          await queryClient.invalidateQueries();
          
          console.log('User authenticated successfully:', data.user.email);
        }
        
        return { };
      } catch (directError) {
        console.warn('Direct auth attempt failed, falling back to mutation:', directError);
        
        // Fall back to the original mutation approach
        await loginMutation.mutateAsync({ email, password });
        return { };
      }
    } catch (err) {
      const error = err as { message?: string };
      return { error: { message: error?.message || 'Login failed' } };
    } finally {
      // End of login
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
    } catch (err) {
      const error = err as { message?: string };
      return { error: { message: error?.message || 'Signup failed' } };
    }
  };

  const loginAsGuest = async () => {
    try {
      // Client-side ephemeral guest session
      localStorage.setItem('df_guest_session', 'true');
      setUser({ id: 'guest', username: 'guest', role: ROLES.GUEST });
      setSession(null);
      return {};
    } catch (err) {
      const error = err as { message?: string };
      return { error: { message: error?.message || 'Guest login failed' } };
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
