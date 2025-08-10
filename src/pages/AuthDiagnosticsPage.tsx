import React from 'react';
import AuthDiagnostics from '@/components/AuthDiagnostics';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function AuthDiagnosticsPage() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Authentication Diagnostics</h1>
          <p className="text-muted-foreground mt-2">
            Use this tool to diagnose authentication and connection issues with Supabase.
          </p>
        </div>
        
        <AuthDiagnostics />
        
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h2 className="font-semibold mb-2">Common Issues and Solutions:</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <strong>Session fetch timeout:</strong> Usually indicates network connectivity issues or Supabase service problems. 
              The app will automatically retry and fall back to guest mode if needed.
            </li>
            <li>
              <strong>Configuration errors:</strong> Check that VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are properly set in your .env file.
            </li>
            <li>
              <strong>Network connectivity:</strong> Ensure you have internet access and that Supabase services are not blocked by firewall.
            </li>
            <li>
              <strong>High latency:</strong> If requests take longer than 5 seconds, consider checking your network connection or Supabase project status.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AuthDiagnosticsPage;