import { AppSettings, DEFAULT_SETTINGS } from '@/lib/types/settings';

const SETTINGS_STORAGE_KEY = 'app_settings';

export const SettingsStorage = {
  getSettings(): AppSettings {
    try {
      const settings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return settings ? JSON.parse(settings) : DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Error reading settings:', error);
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  },

  updateSettings(partialSettings: Partial<AppSettings>): AppSettings {
    const currentSettings = this.getSettings();
    const newSettings = {
      ...currentSettings,
      ...partialSettings
    };
    this.saveSettings(newSettings);
    return newSettings;
  },

  resetSettings(): void {
    this.saveSettings(DEFAULT_SETTINGS);
  }
};