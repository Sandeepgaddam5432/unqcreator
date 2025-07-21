import React from 'react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function HomePage() {
  const router = useRouter();
  
  // Redirect to dashboard - AuthGuard will handle the rest
  useEffect(() => {
    router.push('/dashboard');
  }, [router]);
  
  // Return null since this is just a redirect
  return null;
} 