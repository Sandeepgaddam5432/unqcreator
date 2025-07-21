import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import LoginPage from './LoginPage';
import OnboardingGate from './OnboardingGate';
import Layout from './Layout';

// Loading component with spinner and logo for better UX
const FullPageLoader = () => (
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

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard is the central component that handles authentication and routing logic.
 * It ensures that:
 * 1. Unauthenticated users only see the login page
 * 2. Authenticated users without a colab URL see the onboarding page
 * 3. Fully authenticated users with a colab URL see the main application
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Handle session loading state
  if (status === 'loading') {
    return <FullPageLoader />;
  }

  // Handle unauthenticated users - only show login page
  if (status === 'unauthenticated') {
    return <LoginPage />;
  }

  // Handle authenticated users without colab_url - show onboarding
  if (status === 'authenticated' && !session?.user?.colab_url) {
    return <OnboardingGate />;
  }

  // Fully authenticated users with colab_url - show main application
  return <Layout>{children}</Layout>;
};

export default AuthGuard; 