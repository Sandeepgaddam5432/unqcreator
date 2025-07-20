import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useOnboarding, ConnectionStatus } from '@/contexts/OnboardingContext';
import { useAuth } from '@/contexts/AuthContext';
import { Sparkles, AlertCircle, CheckCircle2, Loader2, Globe, ArrowRight } from 'lucide-react';
import { useSession } from 'next-auth/react';

const OnboardingGate: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { connectionStatus, connectionError, validateConnection } = useOnboarding();
  const { updateColabUrl } = useAuth();
  const { data: session, update: updateSession } = useSession();
  
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'validating_connection' | 'updating_url' | 'waiting_for_session' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [savedUrl, setSavedUrl] = useState<string | null>(null);
  
  // Effect to check if session has been updated with colab_url
  useEffect(() => {
    if (status === 'waiting_for_session' && savedUrl && session?.user?.colab_url === savedUrl) {
      setStatus('success');
      
      // Show final success message
      toast({
        title: "Setup Complete!",
        description: "Successfully connected to the UnQCreator Engine",
        variant: "success",
      });
      
      // Redirect to dashboard after a short delay to show success message
      const redirectTimer = setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [session, status, savedUrl, toast, router]);
  
  // Periodic session update when waiting for changes to propagate
  useEffect(() => {
    let sessionCheckInterval: NodeJS.Timeout | null = null;
    
    if (status === 'waiting_for_session') {
      // Update the session immediately once
      updateSession();
      
      // Then set up periodic checks
      sessionCheckInterval = setInterval(() => {
        updateSession();
      }, 1000); // Check every second
      
      // Set a timeout for giving up after waiting too long
      const timeoutTimer = setTimeout(() => {
        if (status === 'waiting_for_session') {
          setStatus('error');
          setErrorMessage('Session update timeout. Please try refreshing the page.');
          toast({
            title: "Session Update Timeout",
            description: "Your connection was saved, but we couldn't verify the session update. Try refreshing the page.",
            variant: "destructive",
          });
        }
        
        if (sessionCheckInterval) {
          clearInterval(sessionCheckInterval);
        }
      }, 10000); // Give up after 10 seconds
      
      return () => {
        if (sessionCheckInterval) clearInterval(sessionCheckInterval);
        clearTimeout(timeoutTimer);
      };
    }
    
    return () => {
      if (sessionCheckInterval) clearInterval(sessionCheckInterval);
    };
  }, [status, updateSession, toast]);

  const handleConnect = async () => {
    if (!url) return;
    
    try {
      // Step 1: Validate the connection
      setStatus('validating_connection');
      const isValid = await validateConnection(url);
      
      if (!isValid) {
        setStatus('error');
        setErrorMessage('Failed to connect to the engine. Please check the URL and try again.');
        return;
      }
      
      // Step 2: Update the user's Colab URL in the database
      setStatus('updating_url');
      const success = await updateColabUrl(url);
      
      if (!success) {
        setStatus('error');
        setErrorMessage('Failed to update Colab URL. Please try again.');
        return;
      }
      
      // Step 3: Store the URL we just saved and wait for the session to update
      setSavedUrl(url);
      setStatus('waiting_for_session');
      
      toast({
        title: "Connection saved!",
        description: "Finalizing setup...",
        variant: "default",
      });
      
    } catch (error) {
      console.error('Error during connection setup:', error);
      setStatus('error');
      setErrorMessage('An unexpected error occurred. Please try again.');
      
      toast({
        title: "Connection error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Helper to render different status messages
  const renderStatusMessage = () => {
    if (['submitting', 'validating_connection', 'updating_url', 'waiting_for_session'].includes(status) || 
        connectionStatus === 'validating') {
      return (
        <Alert className="bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <AlertTitle>
            {status === 'validating_connection' ? 'Validating Connection...' : 
             status === 'updating_url' ? 'Saving Connection...' : 
             status === 'waiting_for_session' ? 'Finalizing Setup...' : 
             'Connecting...'}
          </AlertTitle>
          <AlertDescription>
            {status === 'validating_connection' ? 'Testing connection to the UnQCreator Engine...' : 
             status === 'updating_url' ? 'Saving your connection settings...' : 
             status === 'waiting_for_session' ? 'Completing your setup...' : 
             'Setting up your connection...'}
          </AlertDescription>
        </Alert>
      );
    }

    if (status === 'success' || connectionStatus === 'connected') {
      return (
        <Alert className="bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400">
          <CheckCircle2 className="h-4 w-4 mr-2" />
          <AlertTitle>Connection Successful!</AlertTitle>
          <AlertDescription>
            Successfully connected to the UnQCreator Engine. Redirecting to dashboard...
          </AlertDescription>
        </Alert>
      );
    }

    if (status === 'error' || connectionError) {
      return (
        <Alert className="bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>
            {errorMessage || (connectionError ? connectionError.message : 'Failed to connect to the engine.')}
          </AlertDescription>
        </Alert>
      );
    }

    return null;
  };
  
  // Determine if the form should be disabled
  const isFormDisabled = ['submitting', 'validating_connection', 'updating_url', 'waiting_for_session', 'success'].includes(status) || 
                        connectionStatus === 'validating';

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background to-muted/50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-md w-full glass-card shadow-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-10 w-10 text-primary mr-2" />
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              UnQCreator
            </CardTitle>
          </div>
          <CardDescription className="text-lg">
            Connect to your UnQCreator Engine
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="api-url">Engine URL</Label>
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <Input
                id="api-url"
                placeholder="https://your-engine-url.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
                disabled={isFormDisabled}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Enter the URL of your UnQCreator Engine. This is the URL displayed in your Colab notebook.
            </p>
          </div>

          {renderStatusMessage()}

          <div className="bg-muted/30 p-4 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
              Don't have an engine yet?
            </h4>
            <p className="text-sm text-muted-foreground">
              Launch the UnQCreator Engine in Google Colab and copy the URL displayed in the notebook.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full"
            onClick={handleConnect}
            disabled={!url || isFormDisabled}
          >
            {status === 'validating_connection' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Validating Connection...
              </>
            ) : status === 'updating_url' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving Connection...
              </>
            ) : status === 'waiting_for_session' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Finalizing Setup...
              </>
            ) : status === 'success' ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Connected! Redirecting...
              </>
            ) : (
              <>
                Connect to Engine
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnboardingGate; 