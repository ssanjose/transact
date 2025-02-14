'use client';

import { useState, useEffect } from 'react';
import { AppSettings } from '@/lib/types/settings';
import { SettingsStorage } from '@/services/app.storage';

const useSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(SettingsStorage.getSettings());

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'app_settings') {
        setSettings(SettingsStorage.getSettings());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = SettingsStorage.updateSettings(newSettings);
    setSettings(updated);
  };

  const resetSettings = () => {
    SettingsStorage.resetSettings();
    setSettings(() => SettingsStorage.getSettings());
  }

  return {
    settings,
    updateSettings,
    resetSettings,
  };
}

export default useSettings;