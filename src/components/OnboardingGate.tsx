import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useOnboarding, ConnectionStatus } from '@/contexts/OnboardingContext';
import { Sparkles, AlertCircle, CheckCircle2, Loader2, Globe, ArrowRight } from 'lucide-react';

const OnboardingGate: React.FC = () => {
  const { connectionStatus, connectionError, setApiEndpoint } = useOnboarding();
  const [url, setUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConnect = async () => {
    if (!url) return;
    
    setIsSubmitting(true);
    try {
      await setApiEndpoint(url);
      // The connection status will be updated in the context
    } catch (error) {
      console.error('Error during connection setup:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to render different status messages
  const renderStatusMessage = () => {
    if (connectionStatus === 'validating') {
      return (
        <Alert className="bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <AlertTitle>Connecting...</AlertTitle>
          <AlertDescription>
            Testing connection to the UnQCreator Engine. This may take a moment.
          </AlertDescription>
        </Alert>
      );
    }

    if (connectionStatus === 'connected') {
      return (
        <Alert className="bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400">
          <CheckCircle2 className="h-4 w-4 mr-2" />
          <AlertTitle>Connection Successful!</AlertTitle>
          <AlertDescription>
            Successfully connected to the UnQCreator Engine.
          </AlertDescription>
        </Alert>
      );
    }

    if (connectionError) {
      return (
        <Alert className="bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>
            {connectionError.message}
          </AlertDescription>
        </Alert>
      );
    }

    return null;
  };

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
            disabled={!url || isSubmitting || connectionStatus === 'validating'}
          >
            {isSubmitting || connectionStatus === 'validating' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
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