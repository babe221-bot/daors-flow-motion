import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Role } from '../lib/types';

interface AuthContextType {
  session: any | null;
  user: any | null;
  signOut: () => void;
  hasRole: (roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  signOut: () => {},
  hasRole: () => false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const hasRole = (roles: Role[]) => {
    if (!user) return false;
    // @ts-expect-error - userrole is a custom claim
    return roles.includes(user.app_metadata.userrole);
  };

  const value = {
    session,
    user,
    signOut: () => {
      supabase.auth.signOut();
    },
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
