import React from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import OnboardingGate from '@/components/OnboardingGate';
import Layout from '@/components/Layout';

// Loading component with spinner
const LoadingScreen = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-background/80">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      <p className="mt-4 text-lg">Loading...</p>
    </div>
  </div>
);

// Enhanced auth wrapper with better loading and state handling
export const withAuth = (Component: React.ComponentType) => {
  return function ProtectedPage(props: any) {
    const { data: session, status } = useSession();
    const router = useRouter();
    
    // Show loading screen while session is being fetched
    if (status === 'loading') {
      return <LoadingScreen />;
    }
    
    // Redirect to login page if not authenticated
    if (status === 'unauthenticated') {
      // Use push instead of Router.replace to allow back button functionality
      router.push('/');
      return <LoadingScreen />;
    }
    
    // If authenticated but no Colab URL, show onboarding
    if (status === 'authenticated' && session?.user && !session.user.colab_url) {
      return <OnboardingGate />;
    }
    
    // If authenticated with Colab URL, render the component within layout
    if (status === 'authenticated' && session?.user && session.user.colab_url) {
      return (
        <Layout>
          <Component {...props} />
        </Layout>
      );
    }
    
    // Fallback case - should not happen, but just in case
    return <LoadingScreen />;
  };
}; 