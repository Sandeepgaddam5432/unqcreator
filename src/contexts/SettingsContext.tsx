import React, { createContext, useContext, useState, useEffect } from 'react';

interface Settings {
  comfyuiApiEndpoint: string;
  googleAiApiKey: string;
  openaiApiKey: string;
  elevenLabsApiKey: string;
  aiCollaboration: boolean;
  dynamicSponsorship: boolean;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

const getDefaultApiEndpoint = (): string => {
  if (typeof window !== 'undefined') {
    // Check for environment variable from Vercel deployment
    if (process.env.NEXT_PUBLIC_ENGINE_API_ENDPOINT) {
      return process.env.NEXT_PUBLIC_ENGINE_API_ENDPOINT;
    }
  }
  // Fallback for local development
  return 'http://127.0.0.1:8188';
};

const defaultSettings: Settings = {
  comfyuiApiEndpoint: getDefaultApiEndpoint(),
  googleAiApiKey: '',
  openaiApiKey: '',
  elevenLabsApiKey: '',
  aiCollaboration: true,
  dynamicSponsorship: false,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    // Load settings from localStorage
    const storedSettings = localStorage.getItem('unqcreator_settings');
    if (storedSettings) {
      setSettings((prevSettings) => ({
        ...prevSettings,
        ...JSON.parse(storedSettings),
      }));
    }
  }, []);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prevSettings) => {
      const updatedSettings = { ...prevSettings, ...newSettings };
      localStorage.setItem('unqcreator_settings', JSON.stringify(updatedSettings));
      return updatedSettings;
    });
  };

  return (
    <SettingsContext.Provider value={{
      settings,
      updateSettings,
    }}>
      {children}
    </SettingsContext.Provider>
  );
}; 