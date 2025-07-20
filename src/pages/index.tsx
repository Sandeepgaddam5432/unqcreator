import React from 'react';
import LoginPage from '@/components/LoginPage';

export default function HomePage() {
  // The PublicPageWrapper in _app.tsx will handle all the auth logic
  return <LoginPage />;
} 