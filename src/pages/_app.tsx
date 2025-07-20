import React from 'react';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import OnboardingGate from '@/components/OnboardingGate';
import Layout from '@/components/Layout';
import '@/styles/globals.css'; // We'll create this file for global styles

const queryClient = new QueryClient();

// Combined protection wrapper for authenticated pages
export const withAuth = (Component: React.ComponentType) => {
  return function ProtectedPage(props: any) {
    const { isAuthenticated, user, isLoading } = useAuth();
    const router = useRouter();
    
    // Show loading state if session is still loading
    if (isLoading) {
      return <div>Loading...</div>;
    }
    
    // Redirect if not authenticated
    if (!isAuthenticated) {
      router.push('/login');
      return null;
    }
    
    // Show onboarding if Colab URL is not configured
    if (!user?.colabUrl) {
      return <OnboardingGate />;
    }
    
    // If both checks pass, render the component within the layout
    return (
      <Layout>
        <Component {...props} />
      </Layout>
    );
  };
};

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <OnboardingProvider>
              <SettingsProvider>
                <Component {...pageProps} />
              </SettingsProvider>
            </OnboardingProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default MyApp; 