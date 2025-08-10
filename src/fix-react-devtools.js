/**
 * React DevTools Hook Fix
 * 
 * This script helps prevent React DevTools from interfering with critical operations
 * by disabling its console patching functionality.
 * 
 * To use this script, include it before any other React code in your application.
 */

(function() {
  // Check if React DevTools hook exists
  if (typeof window !== 'undefined' && window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    console.log('React DevTools detected, applying fix...');
    
    try {
      // Store the original hook
      const originalHook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
      
      // Create a modified version of the hook that doesn't patch console
      const modifiedHook = Object.assign({}, originalHook);
      
      // Disable console patching by providing no-op implementations
      if (modifiedHook.helpers && modifiedHook.helpers.hookConsoleLogging) {
        modifiedHook.helpers.hookConsoleLogging = function() {
          // No-op implementation that doesn't patch console
          return function() {}; // Return a no-op cleanup function
        };
      }
      
      // Replace the global hook with our modified version
      window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = modifiedHook;
      
      console.log('React DevTools hook modified to prevent console patching');
    } catch (error) {
      console.warn('Failed to apply React DevTools fix:', error);
    }
  }
})();

// Export a function to check if the fix was applied
export function checkReactDevToolsFix() {
  if (typeof window === 'undefined') return { applied: false, reason: 'Not in browser environment' };
  
  const hasReactDevTools = typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined';
  if (!hasReactDevTools) {
    return { applied: false, reason: 'React DevTools not detected' };
  }
  
  // Check if console methods are patched
  const isConsolePatchingActive = 
    console.error.toString().includes('__REACT_DEVTOOLS_GLOBAL_HOOK__') ||
    console.warn.toString().includes('__REACT_DEVTOOLS_GLOBAL_HOOK__');
  
  return {
    applied: !isConsolePatchingActive,
    reason: isConsolePatchingActive 
      ? 'Fix not applied - console patching still active' 
      : 'Fix applied successfully'
  };
}

// Check if the fix was applied
console.log('React DevTools fix status:', checkReactDevToolsFix());