import React, { createContext, useContext, useState, useEffect } from 'react';
import { useOnboarding } from './OnboardingContext';
import { getTtsService } from '@/services/TtsService';

interface Settings {
  googleAiApiKey: string;
  openaiApiKey: string;
  elevenLabsApiKey: string;
  googleTtsApiKey: string; // Added for Google TTS
  aiCollaboration: boolean;
  dynamicSponsorship: boolean;
  ttsVoice: string; // Added for TTS voice selection
  ttsSpeed: number; // Added for TTS speed
  ttsPitch: number; // Added for TTS pitch
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
  googleTtsApiKey: '',
  aiCollaboration: true,
  dynamicSponsorship: false,
  ttsVoice: 'en-US-Neural2-F',
  ttsSpeed: 1.0,
  ttsPitch: 0,
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

  // Update TTS service when API key changes
  useEffect(() => {
    if (settings.googleTtsApiKey) {
      const ttsService = getTtsService(settings.googleTtsApiKey);
      ttsService.setOptions({
        voice: settings.ttsVoice,
        speed: settings.ttsSpeed,
        pitch: settings.ttsPitch
      });
    }
  }, [settings.googleTtsApiKey, settings.ttsVoice, settings.ttsSpeed, settings.ttsPitch]);

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