
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { User } from '../types';

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
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [secondaryAccounts, setSecondaryAccounts] = useState<{ email: string }[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const isLoading = status === 'loading';

  // Load user data from session
  useEffect(() => {
    if (session && session.user) {
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
      
      // Fetch secondary accounts
      fetchSecondaryAccounts();
    } else {
      setUser(null);
      setSelectedAccount(null);
      setSecondaryAccounts([]);
    }
  }, [session]);

  const fetchSecondaryAccounts = async () => {
    try {
      const response = await fetch('/api/auth/get-accounts');
      const data = await response.json();
      if (data.success) {
        setSecondaryAccounts(data.accounts || []);
      }
    } catch (error) {
      console.error('Error fetching secondary accounts:', error);
    }
  };

  const login = () => {
    signIn('google');
  };

  const logout = () => {
    signOut();
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
      
      // Update the local user state with the new URL
      if (user) {
        setUser({
          ...user,
          colabUrl: url
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error updating Colab URL:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user,
      isLoading,
      updateColabUrl,
      selectedAccount,
      setSelectedAccount,
      secondaryAccounts
    }}>
      {children}
    </AuthContext.Provider>
  );
};
