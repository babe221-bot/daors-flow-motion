import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { pingSupabase, checkSupabaseHealth, HealthCheckResult } from '@/lib/supabase-health';
import { supabase } from '@/lib/supabaseClient';
import { config } from '@/lib/config';

interface DiagnosticResult {
  test: string;
  status: 'pending' | 'success' | 'error' | 'warning';
  message: string;
  duration?: number;
  details?: any;
}

export function AuthDiagnostics() {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (result: DiagnosticResult) => {
    setResults(prev => [...prev, result]);
  };

  const clearResults = () => {
    setResults([]);
  };

  const runDiagnostics = async () => {
    setIsRunning(true);
    clearResults();

    // Test 1: Configuration Check
    addResult({
      test: 'Configuration Check',
      status: 'pending',
      message: 'Checking environment variables...'
    });

    try {
      const hasUrl = !!config.supabase.url;
      const hasKey = !!config.supabase.anonKey;
      const urlFormat = config.supabase.url.includes('.supabase.co') || config.supabase.url.includes('localhost');
      
      addResult({
        test: 'Configuration Check',
        status: hasUrl && hasKey && urlFormat ? 'success' : 'error',
        message: hasUrl && hasKey && urlFormat 
          ? 'Configuration looks good' 
          : 'Configuration issues detected',
        details: {
          hasUrl,
          hasKey,
          urlFormat,
          url: config.supabase.url.substring(0, 30) + '...'
        }
      });
    } catch (error) {
      addResult({
        test: 'Configuration Check',
        status: 'error',
        message: `Configuration error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }

    // Test 2: Network Connectivity
    addResult({
      test: 'Network Connectivity',
      status: 'pending',
      message: 'Testing network connection...'
    });

    const startTime = Date.now();
    try {
      const isReachable = await pingSupabase();
      const duration = Date.now() - startTime;
      
      addResult({
        test: 'Network Connectivity',
        status: isReachable ? 'success' : 'error',
        message: isReachable 
          ? `Supabase is reachable (${duration}ms)` 
          : 'Supabase is not reachable',
        duration
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      addResult({
        test: 'Network Connectivity',
        status: 'error',
        message: `Network test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration
      });
    }

    // Test 3: Health Check
    addResult({
      test: 'Health Check',
      status: 'pending',
      message: 'Running health check...'
    });

    try {
      const health = await checkSupabaseHealth();
      
      addResult({
        test: 'Health Check',
        status: health.isHealthy ? 'success' : 'error',
        message: health.isHealthy 
          ? `Health check passed (${health.latency}ms)` 
          : `Health check failed: ${health.error}`,
        duration: health.latency,
        details: health
      });
    } catch (error) {
      addResult({
        test: 'Health Check',
        status: 'error',
        message: `Health check error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }

    // Test 4: Auth Session Test
    addResult({
      test: 'Auth Session Test',
      status: 'pending',
      message: 'Testing session fetch...'
    });

    const sessionStartTime = Date.now();
    try {
      const { data, error } = await Promise.race([
        supabase.auth.getSession(),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Session fetch timeout')), 10000)
        )
      ]);
      
      const sessionDuration = Date.now() - sessionStartTime;
      
      if (error) {
        addResult({
          test: 'Auth Session Test',
          status: 'error',
          message: `Session fetch failed: ${error.message}`,
          duration: sessionDuration
        });
      } else {
        addResult({
          test: 'Auth Session Test',
          status: 'success',
          message: `Session fetch successful (${sessionDuration}ms)`,
          duration: sessionDuration,
          details: { hasSession: !!data.session }
        });
      }
    } catch (error) {
      const sessionDuration = Date.now() - sessionStartTime;
      addResult({
        test: 'Auth Session Test',
        status: 'error',
        message: `Session test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: sessionDuration
      });
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'pending':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: DiagnosticResult['status']) => {
    const variants = {
      pending: 'secondary',
      success: 'default',
      error: 'destructive',
      warning: 'secondary'
    } as const;

    return (
      <Badge variant={variants[status]}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Authentication Diagnostics
        </CardTitle>
        <CardDescription>
          Run diagnostics to identify authentication and connection issues
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={runDiagnostics} 
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            {isRunning ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {isRunning ? 'Running...' : 'Run Diagnostics'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={clearResults}
            disabled={isRunning || results.length === 0}
          >
            Clear Results
          </Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold">Diagnostic Results:</h3>
            {results.map((result, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="flex-shrink-0 mt-0.5">
                  {getStatusIcon(result.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{result.test}</span>
                    {getStatusBadge(result.status)}
                    {result.duration && (
                      <span className="text-xs text-muted-foreground">
                        {result.duration}ms
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{result.message}</p>
                  {result.details && (
                    <details className="mt-2">
                      <summary className="text-xs cursor-pointer text-muted-foreground hover:text-foreground">
                        Show details
                      </summary>
                      <pre className="text-xs mt-1 p-2 bg-muted rounded overflow-auto">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default AuthDiagnostics;