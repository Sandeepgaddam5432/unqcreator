
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { signIn } from 'next-auth/react';
import { LogIn, Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LoginPage = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      // Call Next-auth signIn directly to avoid any potential issues with context
      await signIn('google', { callbackUrl: '/' });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "There was an error signing in with Google. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-12 w-12 text-primary mr-2" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              UnQCreator
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Your Autonomous Content Creation Engine
          </p>
        </div>

        <Card className="glass-card">
          <CardHeader className="text-center">
            <h2 className="text-2xl font-semibold">Welcome Back</h2>
            <p className="text-muted-foreground">
              Sign in to access your AI media command center
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleGoogleLogin}
              className="w-full h-12 text-lg"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
              <LogIn className="mr-2 h-5 w-5" />
              )}
              Sign in with Google
            </Button>
            
            <div className="text-center pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                A Personal Project by <span className="text-primary font-medium">Sandeep Gaddam</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
