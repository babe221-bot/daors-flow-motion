import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MinimalApp from './MinimalApp.tsx';
import './index.css';
// import './i18n'; // Temporarily disabled
import { AuthProvider } from './context/AuthContext';

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
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <AuthProvider>
        <MinimalApp />
      </AuthProvider>
    </React.StrictMode>
  );
} else {
  console.error("Root element with ID 'root' was not found in the document. Make sure it exists in your index.html file.");
}
