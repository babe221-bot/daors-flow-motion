/**
 * React DevTools Hook Fix
 * 
 * This script helps prevent React DevTools from interfering with critical operations
 * by temporarily disabling its console patching during authentication operations.
 */

// Store original console methods
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;

// Flag to track if we're in a protected operation
let isProtectedOperation = false;

// Create safe versions of console methods that bypass React DevTools patching
const safeConsoleError = Function.prototype.bind.call(
  originalConsoleError,
  console
);

const safeConsoleWarn = Function.prototype.bind.call(
  originalConsoleWarn,
  console
);

const safeConsoleLog = Function.prototype.bind.call(
  originalConsoleLog,
  console
);

// Function to start protected operation (e.g., authentication)
export function startProtectedOperation() {
  if (isProtectedOperation) return;
  
  isProtectedOperation = true;
  
  // Check if React DevTools is present
  const hasReactDevTools = typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined';
  
  if (hasReactDevTools) {
    // Temporarily replace console methods with direct versions
    // that bypass React DevTools patching
    console.error = function(...args) {
      safeConsoleError.apply(console, args);
    };
    
    console.warn = function(...args) {
      safeConsoleWarn.apply(console, args);
    };
    
    console.log = function(...args) {
      safeConsoleLog.apply(console, args);
    };
    
    safeConsoleLog('Protected operation started - React DevTools console patching temporarily disabled');
  }
}

// Function to end protected operation
export function endProtectedOperation() {
  if (!isProtectedOperation) return;
  
  // Restore original console methods
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
  console.log = originalConsoleLog;
  
  isProtectedOperation = false;
  console.log('Protected operation ended - Console methods restored');
}

// Create a wrapper for async functions that need protection
export function withProtection(asyncFn) {
  return async function(...args) {
    startProtectedOperation();
    try {
      return await asyncFn(...args);
    } finally {
      endProtectedOperation();
    }
  };
}

// Initialize
