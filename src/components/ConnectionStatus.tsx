import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Loader2, Wifi, WifiOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { pingSupabase } from '@/lib/supabase-health';

interface ConnectionStatusProps {
  className?: string;
}

export function ConnectionStatus({ className }: ConnectionStatusProps) {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      const connected = await pingSupabase();
      setIsConnected(connected);
      setLastCheck(new Date());
    } catch (error) {
      console.error('Connection check failed:', error);
      setIsConnected(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
    
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (isConnected === null && !isChecking) {
    return null; // Don't show anything initially
  }

  if (isConnected === true) {
    return null; // Don't show when connected
  }

  return (
    <div className={className}>
      <Alert variant={isConnected === false ? "destructive" : "default"}>
        <div className="flex items-center gap-2">
          {isChecking ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isConnected === false ? (
            <WifiOff className="h-4 w-4" />
          ) : (
            <Wifi className="h-4 w-4" />
          )}
          
          <AlertDescription>
            {isChecking ? (
              "Checking connection..."
            ) : isConnected === false ? (
              <>
                Connection to server lost. Some features may not work properly.
                {lastCheck && (
                  <span className="text-xs block mt-1">
                    Last checked: {lastCheck.toLocaleTimeString()}
                  </span>
                )}
              </>
            ) : (
              "Connection restored"
            )}
          </AlertDescription>
        </div>
        
        {isConnected === false && (
          <button
            onClick={checkConnection}
            disabled={isChecking}
            className="mt-2 px-3 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-800 rounded border border-red-300 disabled:opacity-50"
          >
            {isChecking ? "Checking..." : "Retry Connection"}
          </button>
        )}
      </Alert>
    </div>
  );
}

export default ConnectionStatus;