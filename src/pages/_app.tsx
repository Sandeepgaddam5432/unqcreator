import React from 'react';
import { AppProps } from 'next/app';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from '@/contexts/AuthContext';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import AuthGuard from '@/components/AuthGuard';
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

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session} refetchInterval={60} refetchOnWindowFocus={true}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <OnboardingProvider>
              <SettingsProvider>
                <AuthGuard>
                  <Component {...pageProps} />
                </AuthGuard>
              </SettingsProvider>
            </OnboardingProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default MyApp; 