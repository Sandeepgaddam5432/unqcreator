import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider, useSession } from "next-auth/react";
import OnboardingGate from '@/components/OnboardingGate';
import LoginPage from '@/components/LoginPage';
import '@/styles/globals.css';
import AuthGuard from '@/components/AuthGuard';

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
  return (
    <SessionProvider session={session} refetchInterval={60} refetchOnWindowFocus={true}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthGuard>
            <Component {...pageProps} />
          </AuthGuard>
        </TooltipProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default MyApp; 