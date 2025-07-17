
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Sparkles } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();

  const handleGoogleLogin = () => {
    // Simulate Google login
    const mockUser = {
      id: '1',
      name: 'Sandeep Gaddam',
      email: 'sandeep@example.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    };
    login(mockUser);
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
            >
              <LogIn className="mr-2 h-5 w-5" />
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
