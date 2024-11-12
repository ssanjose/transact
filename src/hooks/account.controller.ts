import FinanceTrackerDatabase, { Account } from '@/lib/db/db.model';
import { useLiveQuery } from 'dexie-react-hooks';

/**
 * Creates a new account.
 *
 * @param {Account} account - The account object to create.
 * @returns {Promise<number>} - A promise that resolves to the ID of the created account.
 */
function createAccount(account: Account): Promise<number> {
  return FinanceTrackerDatabase.transaction('rw', FinanceTrackerDatabase.accounts, async () => {
    return await FinanceTrackerDatabase.accounts.add(account) as number;
  });
}

/**
 * Gets an account by ID.
 *
 * @param {number} id - The ID of the account to retrieve.
 * @returns {ReturnType<typeof useLiveQuery>} - The account object wrapped in a live query.
 */
function getAccount(id: number) {
  return useLiveQuery(async () => await FinanceTrackerDatabase.accounts.get(id), [id]);
}

/**
 * Gets all accounts using useLiveQuery.
 *
 * @returns {ReturnType<typeof useLiveQuery>} - An array of all account objects wrapped in a live query.
 */
function getAllAccounts() {
  return useLiveQuery(async () => await FinanceTrackerDatabase.accounts.toArray(), []);
}

/**
 * Updates an account by ID.
 *
 * @param {number} id - The ID of the account to update.
 * @param {Partial<Account>} updatedAccount - The updated account object.
 * @returns {Promise<number>} - A promise that resolves to the number of updated records.
 */
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