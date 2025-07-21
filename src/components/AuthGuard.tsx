import React from 'react';
import { useSession } from 'next-auth/react';
import LoginPage from './LoginPage';
import OnboardingGate from './OnboardingGate';
import Layout from './Layout';

// Simple full-page loader (replace with FullPageLoader if available)
const FullPageLoader = () => (
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/80 z-50">
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

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <FullPageLoader />;
  }

  if (status === 'unauthenticated' || !session) {
    return <LoginPage />;
  }

  if (status === 'authenticated' && !session.user?.colab_url) {
    return <OnboardingGate />;
  }

  if (status === 'authenticated' && session.user?.colab_url) {
    return <Layout>{children}</Layout>;
  }

  // Fallback (should never happen)
  return <FullPageLoader />;
};

export default AuthGuard;