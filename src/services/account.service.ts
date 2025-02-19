import { Account, Transaction } from '../lib/db/db.model';
import FinanceTrackerDatabase from '../lib/db/db.init';
import { TransactionService } from './transaction.service';

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
 * Deletes all accounts, including all related transactions and child transactions.
 *
 * @returns {Promise<void>} - A promise that resolves when the account and related records are deleted.
 */
function deleteAllAccount(): Promise<void> {
  return FinanceTrackerDatabase.transaction('rw', FinanceTrackerDatabase.accounts, FinanceTrackerDatabase.transactions, async () => {

    const accountIds = (await FinanceTrackerDatabase.accounts.toArray()).map(account => account.id!);
    await FinanceTrackerDatabase.accounts.bulkDelete(accountIds);
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
      const firstPendingTransaction = (await FinanceTrackerDatabase.transactions.where('accountId').equals(account.id!)
        .and(tx => tx.status === 'pending').sortBy('date'))[0];
      const beforeFirstPendingTransaction = (await FinanceTrackerDatabase.transactions.where('accountId').equals(account.id!).and(tx => tx.date < firstPendingTransaction.date).reverse().sortBy('date'))[0];

      // transactions that are pending and have a date less than or equal to the first pending transaction
      const transactions = await FinanceTrackerDatabase.transactions.where('accountId').equals(account.id!).and(tx => tx.date >= firstPendingTransaction.date).sortBy('date');

      let balance = (beforeFirstPendingTransaction) ? beforeFirstPendingTransaction.accountAmount! : account.startingBalance!;
      const transactionsToCommit: Transaction[] = [];

      const currentDate = new Date();
      for (const transaction of transactions) {
        if (transaction.date > currentDate)
          break;

        if (transaction.type === 0)
          sum -= transaction.amount;
        else
          sum += transaction.amount;
        transaction.accountAmount = balance + sum;
        transactionsToCommit.push(transaction);
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
 * @param transaction The transaction the rollback should start from
 * @returns A promise that resolves when the transactions are rolled back
 */
function rollbackTransactionFromAccount(accountId: number, transaction: Transaction): Promise<void> {
  return FinanceTrackerDatabase.transaction('rw', FinanceTrackerDatabase.accounts, FinanceTrackerDatabase.transactions, async () => {
    const account = await FinanceTrackerDatabase.accounts.get(accountId);
    if (!account) throw new Error(`Account ${accountId} not found`);

    const beforeRolledbackTransaction = (await FinanceTrackerDatabase.transactions.where('accountId').equals(account.id!).and(tx => tx.date < transaction.date).reverse().sortBy('date'))[0];
    // get the transaction after the transaction in the parameter
    const transactions = (await FinanceTrackerDatabase.transactions.where('accountId').equals(account.id!).and(tx => tx.date >= transaction.date).sortBy('date'));
    transactions.shift();

    await FinanceTrackerDatabase.transactions.delete(transaction.id!);

    let sum = 0;
    let balance = (beforeRolledbackTransaction) ? beforeRolledbackTransaction.accountAmount! : account.startingBalance!;
    const transactionsToCommit: Transaction[] = [];

    const currentDate = new Date();
    for (const tx of transactions) {
      if (tx.date > currentDate)
        break;

      if (tx.type === 0)
        sum -= tx.amount;
      else
        sum += tx.amount;
      tx.accountAmount = balance + sum;
      transactionsToCommit.push(tx);
    }

    balance += sum;
    await FinanceTrackerDatabase.accounts.update(accountId, { balance });
    await TransactionService.commitTransactions(transactionsToCommit);
  });
}

export const AccountService = {
  createAccount,
  getAccount,
  getAllAccounts,
  updateAccount,
  deleteAccount,
  deleteAllAccount,
  applyTransactionsToAccount,
  rollbackTransactionFromAccount,
};