
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SessionProvider } from "next-auth/react";
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { OnboardingProvider } from './contexts/OnboardingContext';
import { SettingsProvider } from './contexts/SettingsContext';
import LoginPage from './components/LoginPage';
import OnboardingGate from './components/OnboardingGate';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ContentStudio from './pages/ContentStudio';
import Analytics from './pages/Analytics';
import Channels from './pages/Channels';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

// Combined protection for both authentication and onboarding
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  // Show loading state if session is still loading
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  // First check authentication
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Then check if Colab URL is configured
  if (!user?.colabUrl) {
    return <OnboardingGate />;
  }
  
  // If both checks pass, render the children
  return <>{children}</>;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} 
      />
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/content-studio"
        element={
          <ProtectedRoute>
            <Layout>
              <ContentStudio />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Layout>
              <Analytics />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/channels"
        element={
          <ProtectedRoute>
            <Layout>
              <Channels />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Layout>
              <Settings />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <SessionProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <OnboardingProvider>
            <SettingsProvider>
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </SettingsProvider>
          </OnboardingProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </SessionProvider>
);

export default App;
