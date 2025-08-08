import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User, Role, ROLES } from '@/lib/types';
import { loginAsGuest } from '@/lib/guestLogin';

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
        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session check timeout')), 5000)
        );
        
        const sessionPromise = supabase.auth.getSession();
        
        const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise]);
        
        if (session?.user) {
          try {
            // Fetch user profile from your users table with timeout
            const profilePromise = supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            const profileTimeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Profile fetch timeout')), 3000)
            );
            
            const { data: profile, error } = await Promise.race([profilePromise, profileTimeoutPromise]);
            
            if (error && error.message !== 'Profile fetch timeout') {
              console.warn('Error fetching user profile:', error);
            }
            
            if (profile) {
              setUser({
                id: profile.id,
                username: profile.full_name || profile.email?.split('@')[0] || 'User',
                role: (profile.role as Role) || ROLES.CLIENT,
                avatarUrl: undefined,
                associatedItemIds: []
              });
            } else {
              // Create a minimal user object if profile doesn't exist
              setUser({
                id: session.user.id,
                username: session.user.email?.split('@')[0] || 'User',
                role: ROLES.CLIENT,
                avatarUrl: undefined,
                associatedItemIds: []
              });
            }
