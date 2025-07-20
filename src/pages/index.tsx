import React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import LoginPage from '@/components/LoginPage';

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  
  // Redirect authenticated users to dashboard
  React.useEffect(() => {
    if (isAuthenticated && user) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);
  
  // Show login page for unauthenticated users
  return <LoginPage />;
} 