import React from 'react';
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

const queryClient = new QueryClient();

// Loading component with spinner
const LoadingScreen = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-background/80">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      <p className="mt-4 text-lg">Loading...</p>
    </div>
  </div>
);

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();
  
  // Check if current route is login page
  const isPublicRoute = router.pathname === '/' || router.pathname === '/login';
  
  return (
    <SessionProvider session={session}>
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
  
  // Handle session loading
  if (status === 'loading') {
    return <LoadingScreen />;
  }
  
  // Redirect authenticated users with a colab_url to dashboard
  if (status === 'authenticated' && session?.user?.colab_url) {
    router.push('/dashboard');
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
  
  // Render children (this is a fallback and shouldn't actually happen)
  return <>{children}</>;
};

// Wrapper for protected pages
const ProtectedPageWrapper = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Handle session loading
  if (status === 'loading') {
    return <LoadingScreen />;
  }
  
  // Redirect unauthenticated users to login
  if (status === 'unauthenticated') {
    router.push('/');
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