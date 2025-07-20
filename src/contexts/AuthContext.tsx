
import React, { createContext, useContext, useState, useEffect } from 'react';
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

  // Load user data from session
  useEffect(() => {
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
      if (session.user.email) {
        setSelectedAccount(session.user.email);
      }
      
      // Get secondary accounts from session if available
      if (session.user.secondary_accounts && session.user.secondary_accounts.length > 0) {
        setSecondaryAccounts(session.user.secondary_accounts);
      } else {
        // Fallback: fetch secondary accounts if not in session
        fetchSecondaryAccounts();
      }
    } else {
      setUser(null);
      setSelectedAccount(null);
      setSecondaryAccounts([]);
    }
  }, [session]);

  const fetchSecondaryAccounts = async () => {
    if (!session?.user?.email) return;
    
    try {
      const response = await fetch('/api/auth/get-accounts');
      const data = await response.json();
      if (data.success) {
        setSecondaryAccounts(data.accounts || []);
      }
    } catch (error) {
      console.error('Error fetching secondary accounts:', error);
      toast({
        title: "Error",
        description: "Could not fetch your connected accounts",
        variant: "destructive",
      });
    }
  };

  const login = () => {
    signIn('google', { callbackUrl: '/' });
  };

  const logout = () => {
    signOut({ callbackUrl: '/' });
  };

  const refreshSession = async () => {
    await update();
  };

  const updateColabUrl = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/update-colab-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ colab_url: url }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update Colab URL');
      }
      
      // Force refresh the session to get updated data
      await update();
      
      return true;
    } catch (error) {
      console.error('Error updating Colab URL:', error);
      toast({
        title: "Error",
        description: "Could not update your engine URL",
        variant: "destructive",
      });
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
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
    }}>
      {children}
    </AuthContext.Provider>
  );
};
