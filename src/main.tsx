import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';
import './index.css';
import './i18n';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './components/ui/theme-provider';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const container = document.getElementById('root');

if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <App />
              </ThemeProvider>
            </AuthProvider>
          </QueryClientProvider>
        </ErrorBoundary>
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Failed to render React app:', error);
    // Fallback rendering
    container.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: system-ui;">
        <div style="text-align: center; padding: 2rem;">
          <h1 style="color: #ef4444; margin-bottom: 1rem;">Application Error</h1>
          <p style="color: #6b7280; margin-bottom: 1rem;">Failed to load the application. Please refresh the page.</p>
          <button onclick="window.location.reload()" style="background: #3b82f6; color: white; padding: 0.5rem 1rem; border: none; border-radius: 0.375rem; cursor: pointer;">
            Refresh Page
          </button>
        </div>
      </div>
    `;
  }
} else {
  console.error("Root element with ID 'root' was not found in the document. Make sure it exists in your index.html file.");
  document.body.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: system-ui;">
      <div style="text-align: center; padding: 2rem;">
        <h1 style="color: #ef4444; margin-bottom: 1rem;">Configuration Error</h1>
        <p style="color: #6b7280;">Root element not found. Please check the HTML configuration.</p>
      </div>
    </div>
  `;
}
