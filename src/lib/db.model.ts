import Dexie from "dexie";

interface Account {
  id: number;
  name: string;
  balance: number;
}

interface Transaction {
  id: number;
  name: string;
  amount: number; // decimal
  date: Date;
  type: 0 | 1; // 0 = expense, 1 = income
  frequency: 0 | 1 | 2 | 3; // 0 = one-time, 1 = daily, 2 = weekly, 3 = monthly
  categoryId: number; // foreign key
}

interface Category {
  id: number;
  name: string;
}

interface AppliedTransaction {
  id: number;
  date: Date;
  amount: number; // amount changed
  transactionId: number; // foreign key
  accountId: number; // foreign key
}