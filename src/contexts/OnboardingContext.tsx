import React, { createContext, useContext, useState, useEffect } from 'react';
import { ApiService, ApiError, ApiErrorType, getApiService, resetApiService } from '@/services/ApiService';
import { useAuth } from './AuthContext';
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
  const { sessionData } = useAuth();
  const { data: session } = sessionData;
  const [apiEndpoint, setApiEndpointState] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('unconfigured');
  const [connectionError, setConnectionError] = useState<ConnectionError | null>(null);
  const [lastHeartbeat, setLastHeartbeat] = useState<Date | null>(null);
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  const [api, setApi] = useState<ApiService | null>(null);
  const { toast } = useToast();

  // Load API endpoint from session data
  useEffect(() => {
    if (session?.user?.colab_url) {
      setApiEndpointState(session.user.colab_url);
      setIsConfigured(true);
      setConnectionStatus('connected'); // Assume connected initially, will verify with heartbeat
      
      try {
        // Initialize the API service with the stored endpoint
        const apiService = getApiService(session.user.colab_url);
        setApi(apiService);
        
        // Perform an initial connection check
        validateConnection(session.user.colab_url)
          .catch((error) => {
            // Silent fail on initial load - we'll show appropriate UI later
            console.warn('Initial connection check failed', error);
          });
      } catch (error) {
        console.error('Failed to initialize API service:', error);
      }
    } else {
      setApiEndpointState(null);
      setIsConfigured(false);
      setConnectionStatus('unconfigured');
    }
  }, [session?.user?.colab_url]);

  // Set up a periodic heartbeat check when connected
  useEffect(() => {
    if (connectionStatus === 'connected' && apiEndpoint) {
      const heartbeatInterval = setInterval(() => {
        checkConnection().catch((error) => {
          // Silent fail during heartbeat - UI will update based on connectionStatus
          console.warn('Heartbeat check failed', error);
        });
      }, 60000); // Check every minute
      
      return () => clearInterval(heartbeatInterval);
    }
  }, [connectionStatus, apiEndpoint]);

  // Validate a connection to the API endpoint
  const validateConnection = async (url: string): Promise<boolean> => {
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
      const apiService = api || new ApiService(url);
      
      // Check system stats to validate connection
      await apiService.checkSystemStats();
      
      // Connection successful
      setConnectionStatus('connected');
      setLastHeartbeat(new Date());
      toast({
        title: "Connection Successful",
        description: "Successfully connected to the UnQCreator Engine.",
        variant: "success",
      });
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
  };

  // Reset the configuration
  const resetConfiguration = () => {
    setApiEndpointState(null);
    setIsConfigured(false);
    setConnectionStatus('unconfigured');
    setConnectionError(null);
    setLastHeartbeat(null);
    resetApiService();
    setApi(null);
  };

  // Check the current connection (for heartbeats)
  const checkConnection = async (): Promise<boolean> => {
    if (!apiEndpoint) return false;
    const isConnected = await validateConnection(apiEndpoint);
    return isConnected;
  };

  return (
    <OnboardingContext.Provider value={{
      isConfigured,
      connectionStatus,
      apiEndpoint,
      connectionError,
      lastHeartbeat,
      validateConnection,
      resetConfiguration,
      checkConnection,
      api
    }}>
      {children}
    </OnboardingContext.Provider>
  );
}; 