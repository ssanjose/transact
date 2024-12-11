import Dexie, { EntityTable } from "dexie";

export enum Frequency {
  OneTime,
  Daily,
  Weekly,
  Monthly,
} // 0 = one-time, 1 = daily, 2 = weekly, 3 = monthly
export enum TransactionType {
  Expense,
  Income,
} // 0 = expense, 1 = income

/**
 * Represents an account in the finance tracker.
 */
interface Account {
  id?: number;
  name: string;
  balance?: number;
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
}

/**
 * Represents a category in the finance tracker.
 */
interface Category {
  id?: number;
  name: string;
}

/**
 * Represents an applied transaction in the finance tracker.
 */
interface AppliedTransaction {
  id?: number;
  date: Date;
  amount: number; // amount changed
  type: TransactionType; // 0 = expense, 1 = income
  transactionId: number; // foreign key
  isManuallyUpdated: boolean; // New flag to indicate manual updates
}

const FinanceTrackerDatabase = new Dexie("FinanceTrackerApp") as Dexie & {
  accounts: EntityTable<Account, 'id'>;
  transactions: EntityTable<Transaction, 'id'>;
  categories: EntityTable<Category, 'id'>;
  appliedTransactions: EntityTable<AppliedTransaction, 'id'>;
};

FinanceTrackerDatabase.version(1).stores({
  accounts: "++id, name, balance",
  transactions: "++id, name, amount, date, type, frequency, accountId, categoryId",
  categories: "++id, name",
  appliedTransactions: "++id, date, amount, type, transactionId, isManuallyUpdated",
});

export type { Account, Transaction, Category, AppliedTransaction };
export default FinanceTrackerDatabase;