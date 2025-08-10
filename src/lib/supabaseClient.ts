import { createClient } from '@supabase/supabase-js'
import { config } from './config'

// Create a more resilient Supabase client with timeout and error handling
const supabaseInstance = createClient(
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
        // Add timeout and retry logic to fetch requests
        const [url, options] = args as [string, RequestInit];
        
        const fetchWithRetry = async (retryCount = 0): Promise<Response> => {
          const maxRetries = 3;
          const timeoutMs = 15000; // 15 second timeout
          
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
            
            const response = await fetch(url, {
              ...options,
              signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            // If response is not ok and we haven't exceeded retries, retry
            if (!response.ok && retryCount < maxRetries) {
              console.warn(`Fetch attempt ${retryCount + 1} failed with status ${response.status}, retrying...`);
              await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
              return fetchWithRetry(retryCount + 1);
            }
            
            return response;
          } catch (error) {
            if (retryCount < maxRetries) {
              console.warn(`Fetch attempt ${retryCount + 1} failed:`, error, 'retrying...');
              await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
              return fetchWithRetry(retryCount + 1);
            }
            throw error;
          }
        };
        
        return fetchWithRetry();
      }
    }
  }
);

console.log('Supabase client initialized successfully');

export const supabase = supabaseInstance;
