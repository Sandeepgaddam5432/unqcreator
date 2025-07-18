import React, { createContext, useContext, useState, useEffect } from 'react';
import { useOnboarding } from './OnboardingContext';

interface Settings {
  googleAiApiKey: string;
  openaiApiKey: string;
  elevenLabsApiKey: string;
  aiCollaboration: boolean;
  dynamicSponsorship: boolean;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  getApiEndpoint: () => string | null;
}

// Default settings without the API endpoint
const defaultSettings: Settings = {
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
  const { apiEndpoint } = useOnboarding();
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

  // Get the API endpoint from the OnboardingContext
  const getApiEndpoint = (): string | null => {
    return apiEndpoint;
  };

  return (
    <SettingsContext.Provider value={{
      settings,
      updateSettings,
      getApiEndpoint,
    }}>
      {children}
    </SettingsContext.Provider>
  );
}; 