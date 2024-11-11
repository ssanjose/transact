import FinanceTrackerDatabase, { Account } from '@/lib/db/db.model';

// Create a new account
async function createAccount(account: Account): Promise<number> {
  return await FinanceTrackerDatabase.accounts.add(account) as number;
}

// Get an account by ID
async function getAccount(id: number): Promise<Account | undefined> {
  return await FinanceTrackerDatabase.accounts.get(id);
}

// Get all accounts
async function getAllAccounts(): Promise<Account[]> {
  return await FinanceTrackerDatabase.accounts.toArray();
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