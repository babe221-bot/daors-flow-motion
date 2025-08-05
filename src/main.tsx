import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from "@/components/ui/theme-provider";
import './i18n';
import { Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById("root")!).render(
  <Suspense fallback="loading">
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </Suspense>
);
