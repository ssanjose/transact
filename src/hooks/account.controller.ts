import FinanceTrackerDatabase, { Account } from '@/lib/db/db.model';
import { useLiveQuery } from 'dexie-react-hooks';

// Create a new account
function createAccount(account: Account): Promise<number> {
  return FinanceTrackerDatabase.transaction('rw', FinanceTrackerDatabase.accounts, async () => {
    return await FinanceTrackerDatabase.accounts.add(account) as number;
  });
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
function updateAccount(id: number, updatedAccount: Partial<Account>): Promise<number> {
  return FinanceTrackerDatabase.transaction('rw', FinanceTrackerDatabase.accounts, async () => {
    return await FinanceTrackerDatabase.accounts.update(id, updatedAccount);
  });
}

/**
 * Deletes an account by ID, including all related transactions and applied transactions.
 *
 * @param {number} id - The ID of the account to delete.
 * @returns {Promise<void>} - A promise that resolves when the account and related records are deleted.
 */
function deleteAccount(id: number): Promise<void> {
  return FinanceTrackerDatabase.transaction('rw', FinanceTrackerDatabase.accounts, FinanceTrackerDatabase.transactions, FinanceTrackerDatabase.appliedTransactions, async () => {
    const transactions = await FinanceTrackerDatabase.transactions.where({ accountId: id }).toArray();

    for (const transaction of transactions) {
      await FinanceTrackerDatabase.appliedTransactions.where({ transactionId: transaction.id }).delete();
    }

    await FinanceTrackerDatabase.transactions.bulkDelete(transactions.map(transaction => transaction.id));
    await FinanceTrackerDatabase.accounts.delete(id);
  })
    .catch(error => {
      console.error(error);
    });
}

export const AccountController = {
  createAccount,
  getAccount,
  getAllAccounts,
  updateAccount,
  deleteAccount,
};