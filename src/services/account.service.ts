import { Account } from '@/lib/db/db.model';
import FinanceTrackerDatabase from '@/lib/db/db.init';
import { TransactionService } from '@/services/transaction.service';

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
 * @returns {Promise<Account | undefined>} - A promise that resolves to the account object or undefined if not found.
 */
function getAccount(id: number) {
  return FinanceTrackerDatabase.transaction('r', FinanceTrackerDatabase.accounts, async () => {
    return await FinanceTrackerDatabase.accounts.get(id);
  });
}

/**
 * Gets all accounts.
 *
 * @returns {Promise<Account[]>} - A promise that resolves to an array of all account objects.
 */
function getAllAccounts() {
  return FinanceTrackerDatabase.transaction('r', FinanceTrackerDatabase.accounts, async () => {
    let accounts = await FinanceTrackerDatabase.accounts.toArray();
    if (!accounts) {
      accounts = [];
    }
    return accounts;
  });
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
 * Deletes an account by ID, including all related transactions and child transactions.
 *
 * @param {number} id - The ID of the account to delete.
 * @returns {Promise<void>} - A promise that resolves when the account and related records are deleted.
 */
function deleteAccount(id: number): Promise<void> {
  return FinanceTrackerDatabase.transaction('rw', FinanceTrackerDatabase.accounts, FinanceTrackerDatabase.transactions, async () => {
    await FinanceTrackerDatabase.accounts.delete(id);
  })
}

/**
 * Rebalances an account by updating the account balance if the account has transactions and transactions has passed the current date, meaning the transaction should be committed to the account balance. If the account id is not given, the function will update all accounts.
 * If the transaction is commitable, the transaction amount will be added to the account balance based on its type: income(1) or expense(0).
 * 
 * @param {number} [id] - The ID of the account to rebalance.
 * @returns {Promise<void>} - A promise that resolves when the account balance is updated.
 * @note This function is used to update the account balance based on the transactions that have passed the current date and will be used by the scheduler to update the account balance.
 */
function applyTransactionsToAccount(id?: number): Promise<void> {
  return FinanceTrackerDatabase.transaction('rw', FinanceTrackerDatabase.accounts, FinanceTrackerDatabase.transactions, async () => {
    let accounts: Account[] = [];

    if (id)
      accounts = await FinanceTrackerDatabase.accounts.where('id').equals(id).toArray();
    else
      accounts = await FinanceTrackerDatabase.accounts.toArray();

    for (const account of accounts) {
      let sum = 0;
      const transactions = await FinanceTrackerDatabase.transactions.where('accountId').equals(account.id!).toArray();
      let balance = account.balance;
      const transactionsToCommit: number[] = [];

      for (const transaction of transactions) {
        if (transaction.status === 'pending' && transaction.date <= new Date()) {
          if (transaction.type === 0)
            sum -= transaction.amount;
          else
            sum += transaction.amount;
          transactionsToCommit.push(transaction.id!);
        }
      }

      balance += sum;
      await FinanceTrackerDatabase.accounts.update(account.id, { balance });
      await TransactionService.commitTransactions(transactionsToCommit);
    }
  });
}

/**
 * Rolls back specific transactions from an account
 * @param accountId The account to roll back transactions from
 * @param transactionIds The IDs of transactions to roll back
 * @returns A promise that resolves when the transactions are rolled back
 */
function rollbackTransactionsFromAccount(accountId: number, transactionIds: number[]): Promise<void> {
  return FinanceTrackerDatabase.transaction('rw', FinanceTrackerDatabase.accounts, FinanceTrackerDatabase.transactions, async () => {
    const account = await FinanceTrackerDatabase.accounts.get(accountId);
    if (!account) throw new Error(`Account ${accountId} not found`);

    const transactions = await FinanceTrackerDatabase.transactions
      .where('id')
      .anyOf(transactionIds)
      .and(tx => tx.accountId === accountId && tx.status === 'processed')
      .toArray();

    let balance = account.balance;

    // Calculate balance adjustment
    const balanceAdjustment = transactions.reduce((sum, tx) => {
      // Reverse the transaction effect
      return sum + (tx.type === 0 ? tx.amount : -tx.amount);
    }, 0);

    // Update balance and uncommit transactions
    if (transactions.length > 0) {
      balance += balanceAdjustment;
      await FinanceTrackerDatabase.accounts.update(accountId, { balance });
      await TransactionService.unCommitTransactions(transactions.map(tx => tx.id!));
    }
  });
}

export const AccountService = {
  createAccount,
  getAccount,
  getAllAccounts,
  updateAccount,
  deleteAccount,
  applyTransactionsToAccount,
  rollbackTransactionsFromAccount,
};