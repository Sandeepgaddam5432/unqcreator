import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import OnboardingGate from '@/components/OnboardingGate';
import Layout from '@/components/Layout';

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

// Enhanced auth wrapper with better loading and state handling
export const withAuth = (Component: React.ComponentType) => {
  return function ProtectedPage(props: any) {
    const { data: session, status } = useSession();
    const router = useRouter();
    
    // Handle hard redirects for authenticated/unauthenticated states
    useEffect(() => {
      if (status === 'loading') return; // Wait until we know the session state
      
      if (status === 'unauthenticated') {
        // Redirect unauthenticated users to the login page
        router.replace('/', undefined, { shallow: false });
      } else if (status === 'authenticated' && !session?.user?.colab_url) {
        // User is missing colab_url - ensure they stay on the onboarding page
        // We handle this rendering in the component, but this is a fallback to ensure they can't bypass it
      }
    }, [status, session, router]);
    
    // Loading state
    if (status === 'loading') {
      return <LoadingScreen />;
    }
    
    // For any unauthenticated access, show the loading screen while redirecting
    if (status === 'unauthenticated') {
      return <LoadingScreen />;
    }
    
    // For authenticated users without a Colab URL, show onboarding
    if (status === 'authenticated' && session?.user && !session.user.colab_url) {
      return <OnboardingGate />;
    }
    
    // For fully authenticated users, render the protected component inside Layout
    if (status === 'authenticated' && session?.user && session.user.colab_url) {
      return (
        <Layout>
          <Component {...props} />
        </Layout>
      );
    }
    
    // Fallback (should never happen)
    return <LoadingScreen />;
  };
}; 