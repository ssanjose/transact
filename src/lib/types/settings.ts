export interface AppSettings {
  recentTransactionLimit: number;
  upcomingTransactionLimit: number;
  defaultCurrency: string;
  dateFormat: string;
}

export const DEFAULT_SETTINGS: AppSettings = {
  recentTransactionLimit: 3,
  upcomingTransactionLimit: 3,
  defaultCurrency: 'USD',
  dateFormat: 'MMM dd, YYYY'
};