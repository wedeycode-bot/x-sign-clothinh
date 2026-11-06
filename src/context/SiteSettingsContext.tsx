'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SiteSettings, DEFAULT_SITE_SETTINGS } from '@/types/siteSettings';
import initialSettingsData from '@/data/siteSettings.json';

interface SiteSettingsContextType {
  settings: SiteSettings;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<boolean>;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>({
    ...DEFAULT_SITE_SETTINGS,
    ...(initialSettingsData as unknown as SiteSettings),
  });
  const [isLoading, setIsLoading] = useState(false);

  const refreshSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/site-settings?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
      }
    } catch (err) {
      console.warn('Failed to refresh site settings:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  const updateSettings = useCallback(async (newSettings: Partial<SiteSettings>): Promise<boolean> => {
    try {
      const res = await fetch('/api/site-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: newSettings }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.settings) {
          setSettings(data.settings);
          return true;
        }
      }
      return false;
    } catch (err) {
      console.error('Failed to update site settings:', err);
      return false;
    }
  }, []);

  return (
    <SiteSettingsContext.Provider
      value={{
        settings,
        isLoading,
        refreshSettings,
        updateSettings,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    return {
      settings: DEFAULT_SITE_SETTINGS,
      isLoading: false,
      refreshSettings: async () => {},
      updateSettings: async () => false,
    };
  }
  return context;
};
