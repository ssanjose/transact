import Dexie, { EntityTable } from "dexie";

interface Account {
  id?: number;
  name: string;
  balance?: number;
}

interface Transaction {
  id?: number;
  name: string;
  amount: number; // decimal
  date: Date;
  type: 0 | 1; // 0 = expense, 1 = income
  frequency: 0 | 1 | 2 | 3; // 0 = one-time, 1 = daily, 2 = weekly, 3 = monthly
  accountId: number; // foreign key
  categoryId?: number; // foreign key
}

interface Category {
  id?: number;
  name: string;
}

interface AppliedTransaction {
  id?: number;
  date: Date;
  amount: number; // amount changed
  type: 0 | 1; // 0 = expense, 1 = income
  transactionId: number; // foreign key
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
  appliedTransactions: "++id, date, amount, type, transactionId",
});

export type { Account, Transaction, Category, AppliedTransaction };
export default FinanceTrackerDatabase;