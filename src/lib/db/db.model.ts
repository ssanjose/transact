export enum Frequency {
  OneTime = 0,
  Daily = 1,
  Weekly = 2,
  Monthly = 3,
} // 0 = one-time, 1 = daily, 2 = weekly, 3 = monthly

export const FrequencyOptions = Object.values(Frequency).filter((value) => typeof value === "string");

export enum TransactionType {
  Expense = 0,
  Income = 1,
} // 0 = expense, 1 = income

export const TransactionTypeOptions = Object.values(TransactionType);

/**
 * Represents an account in the finance tracker.
 */
interface Account {
  id?: number;
  name: string;
  balance: number;
  startingBalance?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Represents a transaction in the finance tracker.
 */
interface Transaction {
  id?: number;
  name: string;
  amount: number; // decimal
  date: Date;
  type: TransactionType; // 0 = expense, 1 = income
  frequency: Frequency; // 0 = one-time, 1 = daily, 2 = weekly, 3 = monthly
  accountId: number; // foreign key
  categoryId?: number; // foreign key
  transactionId?: number; // foreign key to parent transaction
}

/**
 * Represents a category in the finance tracker.
 */
interface Category {
  id?: number;
  name: string;
  color: string;
}

export type { Account, Transaction, Category };