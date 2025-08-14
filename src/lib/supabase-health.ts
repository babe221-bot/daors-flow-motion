import { supabase } from './supabaseClient';
import { config } from './config';

export interface HealthCheckResult {
  isHealthy: boolean;
  latency?: number;
  error?: string;
  timestamp: number;
}

/**
 * Performs a health check on the Supabase connection
 */
export async function checkSupabaseHealth(): Promise<HealthCheckResult> {
  const startTime = Date.now();
  
  try {
    // Try a simple query to check connectivity
    const { error } = await supabase.from('_health_check').select('*').limit(1);
    
    const latency = Date.now() - startTime;
    
    // If we get a table not found error, that's actually good - it means we can connect
    if (error && error.message.includes('relation "_health_check" does not exist')) {
      return {
        isHealthy: true,
        latency,
        timestamp: Date.now()
      };
    }
    
    // If no error, connection is healthy
    if (!error) {
      return {
        isHealthy: true,
        latency,
        timestamp: Date.now()
      };
    }
    
    // Other errors indicate connection issues
    return {
      isHealthy: false,
      error: error.message,
      timestamp: Date.now()
    };
  } catch (err) {
    const error = err as Error;
    return {
      isHealthy: false,
      error: error.message,
      timestamp: Date.now()
    };
  }
}

/**
 * Checks if Supabase is reachable with a simple ping
 */
export async function pingSupabase(): Promise<boolean> {
  try {
    const url = config.supabase.url;
    if (!url) {
      console.warn('Supabase URL is not configured');
      return false;
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    // Prefer Auth health endpoint which doesn't require auth and has CORS enabled
    const healthEndpoint = `${url.replace(/\/$/, '')}/auth/v1/health`;
    const response = await fetch(healthEndpoint, {
      method: 'GET',
      // No custom headers to avoid CORS preflight issues
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    if (response.ok) return true; // 200 OK
    
    // Fallback: try a lightweight REST GET which should return 401/200 if service is up
    const restUrl = `${url.replace(/\/$/, '')}/rest/v1/?select=1`;
    const controller2 = new AbortController();
    const timeoutId2 = setTimeout(() => controller2.abort(), 5000);
    const res2 = await fetch(restUrl, {
      method: 'GET',
      headers: {
        'apikey': config.supabase.anonKey,
        'Authorization': `Bearer ${config.supabase.anonKey}`,
      },
      signal: controller2.signal,
    });
    clearTimeout(timeoutId2);
    return res2.status === 200 || res2.status === 401;
  } catch (error) {
    console.warn('Supabase ping failed:', error);
    return false;
  }
}

/**
 * Waits for Supabase to become available
 */
export async function waitForSupabase(maxWaitTime = 30000): Promise<boolean> {
  const startTime = Date.now();
  const checkInterval = 2000; // Check every 2 seconds
  
  while (Date.now() - startTime < maxWaitTime) {
    const isReachable = await pingSupabase();
    if (isReachable) {
      return true;
    }
    
    await new Promise(resolve => setTimeout(resolve, checkInterval));
  }
  
  return false;
}