
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSession, signIn, signOut, SessionContextValue } from 'next-auth/react';
import { User } from '../types';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  updateColabUrl: (url: string) => Promise<boolean>;
  selectedAccount: string | null;
  setSelectedAccount: (email: string | null) => void;
  secondaryAccounts: { email: string }[];
  refreshSession: () => Promise<void>;
  sessionData: SessionContextValue;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const sessionData = useSession();
  const { data: session, status, update } = sessionData;
  const [user, setUser] = useState<User | null>(null);
  const [secondaryAccounts, setSecondaryAccounts] = useState<{ email: string }[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const { toast } = useToast();
  const isLoading = status === 'loading';

  // Function to refresh the session data
  const refreshSession = useCallback(async () => {
    try {
      await update();
    } catch (error) {
      console.error('Failed to refresh session:', error);
      toast({
        title: "Session Update Failed",
        description: "Could not refresh your session data. Please try again.",
        variant: "destructive",
      });
    }
  }, [update, toast]);

  // Load user data from session
  useEffect(() => {
    // Don't do anything while loading
    if (status === 'loading') return;
    
    if (session?.user) {
      const userData: User = {
        id: session.user.email || '',
        name: session.user.name || '',
        email: session.user.email || '',
        image: session.user.image || '',
        colabUrl: session.user.colab_url || '' // From custom session property
      };
      
      setUser(userData);
      
      // If there's a colab_url in the session, select the main account by default
      if (session.user.email && !selectedAccount) {
        setSelectedAccount(session.user.email);
      }
      
      // Get secondary accounts from session if available
      if (session.user.secondary_accounts && session.user.secondary_accounts.length > 0) {
        setSecondaryAccounts(session.user.secondary_accounts);
      } else {
        // Fallback: fetch secondary accounts if not in session
        fetchSecondaryAccounts();
      }
    } else if (status === 'unauthenticated') {
      // Clear user data when unauthenticated
      setUser(null);
      setSelectedAccount(null);
      setSecondaryAccounts([]);
    }
  }, [session, status, selectedAccount]);

  const fetchSecondaryAccounts = useCallback(async () => {
    if (!session?.user?.email || status !== 'authenticated') return;
    
    try {
      const response = await fetch('/api/auth/get-accounts');
      if (!response.ok) {
        throw new Error(`Failed to fetch accounts: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        setSecondaryAccounts(data.accounts || []);
      } else {
        throw new Error(data.error || 'Unknown error fetching accounts');
      }
    } catch (error) {
      console.error('Error fetching secondary accounts:', error);
      toast({
        title: "Error",
        description: "Could not fetch your connected accounts",
        variant: "destructive",
      });
    }
  }, [session?.user?.email, status, toast]);

  const login = useCallback(() => {
    signIn('google', { callbackUrl: '/' });
  }, []);

  const logout = useCallback(() => {
    signOut({ callbackUrl: '/' });
  }, []);

  const updateColabUrl = useCallback(async (url: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/update-colab-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ colab_url: url }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update Colab URL');
      }
      
      // Force refresh the session to get updated data
      await update();
      
      return true;
    } catch (error) {
      console.error('Error updating Colab URL:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Could not update your engine URL",
        variant: "destructive",
      });
      return false;
    }
  }, [update, toast]);

  const contextValue = {
    user,
    login,
    logout,
    isAuthenticated: status === 'authenticated',
    isLoading,
    updateColabUrl,
    selectedAccount,
    setSelectedAccount,
    secondaryAccounts,
    refreshSession,
    sessionData
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
