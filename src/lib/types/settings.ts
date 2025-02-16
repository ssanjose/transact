import { Currencies } from "@/config/currency";

export const NUMBER_INPUT_MIN = 1;
export const NUMBER_INPUT_MAX = 6;

export interface AppSettings {
  appUpdates: boolean;
  transactionUpdates: boolean;

  recentTransactionLimit: number;
  upcomingTransactionLimit: number;

  recurringTransactions: boolean;

  currencyFormat: typeof Currencies[number];
  dateFormat: string;
}

export const DEFAULT_SETTINGS: AppSettings = {
  appUpdates: true,
  transactionUpdates: false,

  recentTransactionLimit: 3,
  upcomingTransactionLimit: 3,

  recurringTransactions: false,

  // Default currency format - USD
  currencyFormat: Currencies[0],
  dateFormat: 'MMMM d, yyyy'
};