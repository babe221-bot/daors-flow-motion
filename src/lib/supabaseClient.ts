import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { config } from './config'

// Define proper types for Supabase responses
interface Session {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user?: {
    id: string;
    email?: string;
    user_metadata?: any;
    app_metadata?: any;
  };
}

interface AuthResponse {
  data: {
    session?: Session;
    user?: any;
  };
  error: any;
}

// Create a more resilient Supabase client with timeout and error handling
let supabaseInstance: SupabaseClient;

try {
  supabaseInstance = createClient<Session, any>(
    config.supabase.url,
    config.supabase.anonKey,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storageKey: 'daorsforge-auth-storage',
        flowType: 'implicit'
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      },
      global: {
        fetch: (...args) => {
          // Add timeout to fetch requests
          const [url, options] = args;
          return fetch(url, {
            ...options,
            signal: AbortSignal.timeout(10000) // 10 second timeout
          });
        }
      }
    }
  );
  
  console.log('Supabase client initialized successfully');
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  
  // Create a fallback client with minimal configuration
  supabaseInstance = createClient<Session, any>(
    config.supabase.url,
    config.supabase.anonKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: true
      }
    }
  );
}

export const supabase = supabaseInstance;
