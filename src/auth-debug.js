// Auth Debug Helper
// This script helps debug authentication issues by providing more detailed logging

// Override console methods to add more context
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;

// Add timestamp and auth context to console messages
console.error = function(...args) {
  const timestamp = new Date().toISOString();
  originalConsoleError.apply(console, [`[${timestamp}] [AUTH-DEBUG-ERROR]`, ...args]);
};

console.warn = function(...args) {
  const timestamp = new Date().toISOString();
  originalConsoleWarn.apply(console, [`[${timestamp}] [AUTH-DEBUG-WARN]`, ...args]);
};

console.log = function(...args) {
  const timestamp = new Date().toISOString();
  originalConsoleLog.apply(console, [`[${timestamp}] [AUTH-DEBUG-LOG]`, ...args]);
};

// Add this to window for debugging
window.debugAuth = {
  // Check session state
  checkSession: async () => {
    try {
      const { supabase } = await import('./lib/supabaseClient');
      const { data, error } = await supabase.auth.getSession();
      console.log('Current session:', data?.session ? 'Active' : 'None', error ? `(Error: ${error.message})` : '');
      return { data, error };
    } catch (e) {
      console.error('Failed to check session:', e);
      return { error: e };
    }
  },
  
  // Check if we can reach Supabase
  pingSupabase: async () => {
    try {
      const { pingSupabase } = await import('./lib/supabase-health');
      const result = await pingSupabase();
      console.log('Supabase reachable:', result);
      return result;
    } catch (e) {
      console.error('Failed to ping Supabase:', e);
      return false;
    }
  },
  
  // Clear any stored auth data
  clearAuthData: () => {
    try {
      localStorage.removeItem('daorsforge-auth-storage');
      localStorage.removeItem('df_guest_session');
      localStorage.removeItem('df_offline_session');
      console.log('Auth storage cleared');
      return true;
    } catch (e) {
      console.error('Failed to clear auth data:', e);
      return false;
    }
  }
};

// Log when this script loads
console.log('Auth debug helpers loaded. Use window.debugAuth to access debugging tools.');

// Export a function to check if React DevTools hooks are active (disabled)
export function checkReactDevToolsHooks() {
  return {
    hasReactDevTools: false,
    isConsolePatchedByDevTools: false
  };
}

// Disable auto-check on load