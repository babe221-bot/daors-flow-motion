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
              console.warn(`🔄 Fetch attempt ${retryCount + 1} failed with status ${response.status} (${response.statusText}), retrying...`);
              await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
              return fetchWithRetry(retryCount + 1);
            }
            
            return response;
          } catch (error) {
            if (retryCount < maxRetries) {
              const errorMessage = error instanceof Error ? error.message : 'Unknown error';
              console.warn(`❌ Fetch attempt ${retryCount + 1} failed: ${errorMessage}, retrying...`);
              await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
              return fetchWithRetry(retryCount + 1);
            }
            // Add more context to the error
            const enhancedError = error instanceof Error 
              ? new Error(`Supabase fetch failed after ${maxRetries} attempts: ${error.message}`)
              : new Error(`Supabase fetch failed after ${maxRetries} attempts: ${String(error)}`);
            throw enhancedError;
          }
        };
        
        return fetchWithRetry();
      }
    }
  }
);

console.log('✅ Supabase client initialized successfully', {
  url: config.supabase.url,
  hasAnonKey: !!config.supabase.anonKey
});

export const supabase = supabaseInstance;
