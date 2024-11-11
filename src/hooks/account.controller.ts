import FinanceTrackerDatabase, { Account } from '@/lib/db/db.model';
import { useLiveQuery } from 'dexie-react-hooks';

// Create a new account
async function createAccount(account: Account): Promise<number> {
  return await FinanceTrackerDatabase.accounts.add(account) as number;
}

// Get an account by ID
function getAccount(id: number) {
  return useLiveQuery(async () => await FinanceTrackerDatabase.accounts.get(id), [id]);
}

// Get all accounts using useLiveQuery
function getAllAccounts() {
  return useLiveQuery(async () => await FinanceTrackerDatabase.accounts.toArray(), []);
}

// Update an account by ID
async function updateAccount(id: number, updatedAccount: Partial<Account>): Promise<number> {
  return await FinanceTrackerDatabase.accounts.update(id, updatedAccount);
}

// Delete an account by ID
async function deleteAccount(id: number): Promise<void> {
  await FinanceTrackerDatabase.accounts.delete(id);
}

export const AccountController = {
  createAccount,
  getAccount,
  getAllAccounts,
  updateAccount,
  deleteAccount,
};