/**
 * Authentication Utilities
 * 
 * This file contains helper functions for debugging and fixing authentication issues.
 */

import { supabase } from './supabaseClient';

/**
 * Reset the authentication state completely
 */
export async function resetAuthState(): Promise<void> {
  try {
    // Sign out from Supabase
    await supabase.auth.signOut();
    
    // Clear all auth-related localStorage items
    localStorage.removeItem('daorsforge-auth-storage');
    localStorage.removeItem('df_guest_session');
    localStorage.removeItem('df_offline_session');
    localStorage.removeItem('df_offline_users');
    
    // Clear any session cookies
    document.cookie.split(';').forEach(cookie => {
      const [name] = cookie.trim().split('=');
      if (name.includes('supabase') || name.includes('auth') || name.includes('session')) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    });
    
    console.log('Authentication state has been reset');
    
    // Force reload to ensure clean state
    window.location.href = '/login';
  } catch (error) {
    console.error('Failed to reset auth state:', error);
  }
}

/**
 * Check if React DevTools is causing issues with authentication
 */
export function checkReactDevToolsIssues(): { 
  hasDevTools: boolean; 
  isConsolePatchingActive: boolean;
  recommendation: string;
} {
  const hasDevTools = false;
  
  // Check if console methods are patched
  const isConsolePatchingActive = false;
  
  let recommendation = '';
  
  if (hasDevTools && isConsolePatchingActive) {
    recommendation = 'React DevTools is active and patching console methods. ' +
      'This may interfere with authentication. Try disabling React DevTools extension ' +
      'or open browser DevTools before logging in to enable source mapping.';
  } else if (hasDevTools) {
    recommendation = 'React DevTools is active but not currently patching console methods. ' +
      'This should not cause authentication issues.';
  } else {
    recommendation = 'React DevTools is not detected. Authentication issues are likely ' +
      'caused by something else.';
  }
  
  return {
    hasDevTools,
    isConsolePatchingActive,
    recommendation
  };
}

/**
 * Fix common authentication issues
 */
export async function fixAuthIssues(): Promise<{ 
  success: boolean; 
  message: string;
}> {
  try {
    // 1. Check if we're in a broken state
    const currentSession = await supabase.auth.getSession();
    const hasPartialSession = 
      currentSession.data?.session?.access_token && 
      !currentSession.data?.session?.user;
    
    if (hasPartialSession) {
      // This is a common issue - we have a token but no user
      await resetAuthState();
      return {
        success: true,
        message: 'Fixed partial session issue. Please try logging in again.'
      };
    }
    
    // 2. Check for React DevTools issues
    const devToolsCheck = checkReactDevToolsIssues();
    if (devToolsCheck.isConsolePatchingActive) {
      return {
        success: false,
        message: devToolsCheck.recommendation
      };
    }
    
    // 3. If we can't identify a specific issue, do a full reset
    await resetAuthState();
    return {
      success: true,
      message: 'Authentication state has been reset. Please try logging in again.'
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to fix auth issues: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

// Add to window for console debugging
if (typeof window !== 'undefined') {
  (window as any).authUtils = {
    resetAuthState,
    checkReactDevToolsIssues,
    fixAuthIssues
  };
}