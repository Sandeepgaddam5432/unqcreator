import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ApiService, ApiError, ApiErrorType, getApiService, resetApiService } from '@/services/ApiService';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';

// Connection states using a state machine approach
export type ConnectionStatus = 
  | 'unconfigured' // Initial state, no API endpoint set
  | 'validating'   // Currently testing the connection
  | 'connected'    // Successfully connected to the engine
  | 'error'        // Connection failed
  | 'timeout'      // Connection timed out
  | 'cors_error'   // CORS error occurred
  | 'invalid_url'; // Invalid URL format

export interface ConnectionError {
  type: Exclude<ConnectionStatus, 'unconfigured' | 'validating' | 'connected'>;
  message: string;
}

interface OnboardingContextType {
  isConfigured: boolean;
  connectionStatus: ConnectionStatus;
  apiEndpoint: string | null;
  connectionError: ConnectionError | null;
  lastHeartbeat: Date | null;
  validateConnection: (url: string) => Promise<boolean>;
  resetConfiguration: () => void;
  checkConnection: () => Promise<boolean>;
  api: ApiService | null;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session } = useSession();
  
  const [apiEndpoint, setApiEndpointState] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('unconfigured');
  const [connectionError, setConnectionError] = useState<ConnectionError | null>(null);
  const [lastHeartbeat, setLastHeartbeat] = useState<Date | null>(null);
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  const [api, setApi] = useState<ApiService | null>(null);
  const { toast } = useToast();

  // Load API endpoint from session data
  useEffect(() => {
    // Only update if colab_url has changed or was previously not set
    const colab_url = session?.user?.colab_url;
    
    if (colab_url && colab_url !== apiEndpoint) {
      console.log(`Initializing API with colab_url: ${colab_url}`);
      setApiEndpointState(colab_url);
      setIsConfigured(true);
      
      try {
        // Initialize the API service with the stored endpoint
        const apiService = getApiService(colab_url);
        setApi(apiService);
        
        // Assume connection and set status, we'll verify with a heartbeat
        setConnectionStatus('connected');
        
        // Perform an initial connection check in the background
        validateConnection(colab_url)
          .catch((error) => {
            console.warn('Initial connection check failed:', error);
          });
      } catch (error) {
        console.error('Failed to initialize API service:', error);
      }
    } else if (!colab_url && apiEndpoint !== null) {
      // User has no colab_url in their session, reset the state
      setApiEndpointState(null);
      setIsConfigured(false);
      setConnectionStatus('unconfigured');
      setApi(null);
    }
  }, [session?.user?.colab_url, apiEndpoint]);

  // Set up a periodic heartbeat check when connected
  useEffect(() => {
    if (connectionStatus === 'connected' && apiEndpoint) {
      // Initial heartbeat
      checkConnection().catch(error => {
        console.warn('Heartbeat check failed:', error);
      });
      
      const heartbeatInterval = setInterval(() => {
        checkConnection().catch((error) => {
          console.warn('Heartbeat check failed:', error);
        });
      }, 60000); // Check every minute
      
      return () => clearInterval(heartbeatInterval);
    }
  }, [connectionStatus, apiEndpoint]);

  // Validate a connection to the API endpoint
  const validateConnection = useCallback(async (url: string): Promise<boolean> => {
    // Don't do anything if we're already in the middle of validating
    if (connectionStatus === 'validating') {
      return false;
    }
    
    // Reset previous errors
    setConnectionError(null);
    
    // Basic URL validation
    try {
      new URL(url);
    } catch (e) {
      setConnectionStatus('invalid_url');
      setConnectionError({
        type: 'invalid_url',
        message: 'Please enter a valid URL (e.g., https://example.com)'
      });
      toast({
        title: "Invalid URL",
        description: "The URL format is not valid. Please check and try again.",
        variant: "destructive",
      });
      return false;
    }
    
    setConnectionStatus('validating');
    
    try {
      // Create a temporary API service for validation if we don't have one yet
      const apiService = api && apiEndpoint === url ? api : new ApiService(url);
      
      // Check system stats to validate connection
      await apiService.checkSystemStats();
      
      // Connection successful
      setConnectionStatus('connected');
      setLastHeartbeat(new Date());
      return true;
    } catch (error) {
      console.error('Connection validation error:', error);
      
      // Handle specific error types
      if (error instanceof ApiError) {
        switch (error.type) {
          case ApiErrorType.TIMEOUT:
            setConnectionStatus('timeout');
            setConnectionError({
              type: 'timeout',
              message: 'Connection timed out. Please check the URL and try again.'
            });
            toast({
              title: "Connection Timeout",
              description: "The engine is not responding. Please check the URL and try again.",
              variant: "destructive",
            });
            break;
          case ApiErrorType.CORS:
            setConnectionStatus('cors_error');
            setConnectionError({
              type: 'cors_error',
              message: 'CORS error. The engine may not be configured to accept requests from this origin.'
            });
            toast({
              title: "CORS Error",
              description: "The engine is not configured to accept requests from this origin.",
              variant: "destructive",
            });
            break;
          default:
            setConnectionStatus('error');
            setConnectionError({
              type: 'error',
              message: error.message || 'Unknown error occurred'
            });
            toast({
              title: "Connection Error",
              description: error.message || "Unknown error occurred",
              variant: "destructive",
            });
        }
      } else {
        setConnectionStatus('error');
        setConnectionError({
          type: 'error',
          message: error instanceof Error ? error.message : 'Unknown error occurred'
        });
        toast({
          title: "Connection Error",
          description: error instanceof Error ? error.message : "Unknown error occurred",
          variant: "destructive",
        });
      }
      
      return false;
    }
  }, [api, apiEndpoint, connectionStatus, toast]);

  // Reset the configuration
  const resetConfiguration = useCallback(() => {
    setApiEndpointState(null);
    setIsConfigured(false);
    setConnectionStatus('unconfigured');
    setConnectionError(null);
    setLastHeartbeat(null);
    resetApiService();
    setApi(null);
  }, []);

  // Check the current connection (for heartbeats)
  const checkConnection = useCallback(async (): Promise<boolean> => {
    if (!apiEndpoint) return false;
    
    try {
      const isConnected = await validateConnection(apiEndpoint);
      return isConnected;
    } catch (error) {
      console.error('Error checking connection:', error);
      return false;
    }
  }, [apiEndpoint, validateConnection]);

  const contextValue = {
    isConfigured,
    connectionStatus,
    apiEndpoint,
    connectionError,
    lastHeartbeat,
    validateConnection,
    resetConfiguration,
    checkConnection,
    api
  };

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
    </OnboardingContext.Provider>
  );
}; 