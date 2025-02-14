export const NUMBER_INPUT_MIN = 1;
export const NUMBER_INPUT_MAX = 6;

export interface AppSettings {
  appUpdates: boolean;
  transactionUpdates: boolean;

  recentTransactionLimit: number;
  upcomingTransactionLimit: number;

  recurringTransactions: boolean;

  currencyFormat: string;
  dateFormat: string;
}

export const DEFAULT_SETTINGS: AppSettings = {
  appUpdates: true,
  transactionUpdates: true,

  recentTransactionLimit: 3,
  upcomingTransactionLimit: 3,

  recurringTransactions: false,

  currencyFormat: 'USD',
  dateFormat: 'MMMM d, yyyy'
};