import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider, useSession } from "next-auth/react";
import { AuthProvider } from '@/contexts/AuthContext';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import OnboardingGate from '@/components/OnboardingGate';
import LoginPage from '@/components/LoginPage';
import '@/styles/globals.css';

// Create a client with retry settings that improve resilience
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

// Loading component with spinner and logo for better UX
const LoadingScreen = () => (
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/80">
    <div className="flex flex-col items-center">
      <div className="mb-4 text-primary">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
        </svg>
      </div>
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      <p className="mt-4 text-lg font-medium">Loading UnQCreator...</p>
      <p className="text-sm text-muted-foreground mt-2">Setting up your experience</p>
    </div>
  </div>
);

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();
  
  // Check if current route is public
  const isPublicRoute = router.pathname === '/' || router.pathname === '/login';
  
  return (
    <SessionProvider session={session} refetchInterval={60} refetchOnWindowFocus={true}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <OnboardingProvider>
              <SettingsProvider>
                {isPublicRoute ? (
                  <PublicPageWrapper>
                    <Component {...pageProps} />
                  </PublicPageWrapper>
                ) : (
                  <ProtectedPageWrapper>
                    <Component {...pageProps} />
                  </ProtectedPageWrapper>
                )}
              </SettingsProvider>
            </OnboardingProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}

// Wrapper for public pages that redirects authenticated users to dashboard
const PublicPageWrapper = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Use an effect for redirecting to avoid race conditions
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.colab_url) {
      router.replace('/dashboard');
    }
  }, [session, status, router]);
  
  // Handle session loading
  if (status === 'loading') {
    return <LoadingScreen />;
  }
  
  // Redirect authenticated users with a colab_url to dashboard
  if (status === 'authenticated' && session?.user?.colab_url) {
    return <LoadingScreen />;
  }
  
  // Redirect authenticated users without colab_url to onboarding
  if (status === 'authenticated' && !session?.user?.colab_url) {
    return <OnboardingGate />;
  }
  
  // Show login page for unauthenticated users
  if (status === 'unauthenticated') {
    return <LoginPage />;
  }
  
  // Fallback case (should never happen)
  return <>{children}</>;
};

// Wrapper for protected pages
const ProtectedPageWrapper = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Use an effect for redirecting to avoid race conditions
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/');
    }
  }, [status, router]);
  
  // Handle session loading
  if (status === 'loading') {
    return <LoadingScreen />;
  }
  
  // Redirect unauthenticated users to login
  if (status === 'unauthenticated') {
    return <LoadingScreen />;
  }
  
  // Show onboarding for authenticated users without colab_url
  if (status === 'authenticated' && !session?.user?.colab_url) {
    return <OnboardingGate />;
  }
  
  // Render the protected page for authenticated and onboarded users
  return <>{children}</>;
};

export default MyApp; 