import { Frequency, Transaction } from '@/lib/db/db.model';
import FinanceTrackerDatabase from '@/lib/db/db.init';
import { checkIfExists } from '@/lib/utils';
import { AccountService } from '@/services/account.service';

/**
 * Creates a transaction and its corresponding child Transactions based on frequency and datetime.
 *
 * @param {Transaction} transaction - The transaction object to create and apply.
 * @returns {Promise<void>} - A promise that resolves when the transaction and child Transactions are created.
 */
function createTransaction(transaction: Transaction): Promise<void> {
  return FinanceTrackerDatabase.transaction('rw', FinanceTrackerDatabase.accounts, FinanceTrackerDatabase.transactions, async () => {
    let txId = await FinanceTrackerDatabase.transactions.add(transaction);
    let childTransactions: Transaction[] = [];

    let persistedTransaction = checkIfExists(await FinanceTrackerDatabase.transactions.get(checkIfExists(txId)));
    childTransactions = generateChildTransactions(persistedTransaction);
    await FinanceTrackerDatabase.transactions.bulkAdd(childTransactions);
    await AccountService.applyTransactionsToAccount(persistedTransaction.accountId);
  })
}

/**
 * Gets a transaction by ID.
 *
 * @param {number} id - The ID of the transaction to retrieve.
 * @returns {PromiseExtended<Transaction | undefined>} - A promise that resolves to the transaction object or undefined if not found.
 */
function getTransaction(id: number) {
  return FinanceTrackerDatabase.transaction('r', FinanceTrackerDatabase.transactions, async () => {
    let transaction = await FinanceTrackerDatabase.transactions.get(id)

    checkIfExists(transaction);
    return transaction;
  })
}

/**
 * Updates a transaction and its corresponding child Transactions based on frequency and datetime.
 * - If the transaction is a one-time transaction, no child Transactions are generated.
 * - If the transaction is a child transaction, no child Transactions are generated.
 * - If the transaction is a parent transaction, the child Transactions are updated.
 * - If the transaction is a parent transaction and the frequency or datetime has changed, 
 *    - the child Transactions are regenerated, 
 *    - the out-of-bound child Transactions are deleted, 
 *    - the new child Transactions are created, 
 *    - the existing child Transactions are updated, 
 *    - the remaining unmatched existing child Transactions are deleted, 
 *    - the out-of-bound child Transactions are deleted, 
 *    - the child Transactions are updated.
 * @param {Transaction} transaction - The updated transaction object.
 * @returns {Promise<void>} - A promise that resolves when the transaction and child Transactions are updated.
 * @throws {Error} - An error is thrown if the transaction is not found.
 */
function updateTransaction(transaction: Transaction): Promise<void> {
  return FinanceTrackerDatabase.transaction('rw', FinanceTrackerDatabase.transactions, async () => {
    const existingTransaction = checkIfExists(await FinanceTrackerDatabase.transactions.get(transaction.id));

    // Update the parent transaction
    await FinanceTrackerDatabase.transactions.update(transaction.id, {
      ...transaction,
      // Make child transactions independent if updated by itself by removing the transactionId, and setting the frequency to one-time
      frequency: transaction.transactionId ? Frequency.OneTime : transaction.frequency,
      // Ensure that the transactionId is undefined for parent transactions and child transactions
      transactionId: undefined,
    });

    const updatedTransaction = (checkIfExists(await FinanceTrackerDatabase.transactions.get(transaction.id)));
    // stop if the transaction is a child transaction
    if (updatedTransaction.transactionId) return;

    // If datetime or frequency has changed, regenerate child Transactions
    const existingChildTransactions = await FinanceTrackerDatabase.transactions.where({ transactionId: transaction.id }).toArray();
    if (existingTransaction.date.toISOString() !== transaction.date.toISOString() || existingTransaction.frequency !== transaction.frequency) {
      const newChildTransactions = generateChildTransactions(transaction);
      await updateChildTransactions(transaction, existingChildTransactions, newChildTransactions);
    } else {
      let changes = await convertToUpdateChanges(existingChildTransactions, updatedTransaction);
      await FinanceTrackerDatabase.transactions.bulkUpdate(changes);
    }
  });
}

/**
 * Deletes a transaction and its corresponding child Transactions.
 *
 * @param {number} transactionId - The ID of the transaction to delete.
 * @returns {Promise<void>} - A promise that resolves when the transaction and child Transactions are deleted.
 */
function deleteTransaction(transactionId: number): Promise<void> {
  return FinanceTrackerDatabase.transaction('rw', FinanceTrackerDatabase.transactions, async () => {
    let transaction = await FinanceTrackerDatabase.transactions.get(transactionId);
    if (!transaction)
      throw new Error(`Transaction with ID ${transactionId} not found`);

    if (transaction.transactionId === undefined)
      await FinanceTrackerDatabase.transactions.where({ transactionId: transactionId }).delete();
    await FinanceTrackerDatabase.transactions.delete(transactionId);
  });
}

/**
 * Retrieves all transactions for a specific account.
 *
 * @param {number} accountId - The ID of the account.
 * @returns {Promise<Transaction[]>} - A promise that resolves to an array of transactions for the account.
 */
function getTransactionsByAccount(accountId?: number): Promise<Transaction[]> {
  return FinanceTrackerDatabase.transaction('r', FinanceTrackerDatabase.transactions, async () => {
    return FinanceTrackerDatabase.transactions.where({ accountId }).toArray();
  });
}

/**
 * Converts update transactions to structure used by Dexie.js for batch update operations.
 * @example [{transaction1}] => [{key: transaction1.id, changes: {"keyPath1": newValue1, "keyPath2": newValue2}}]
 */
async function convertToUpdateChanges(transactions: Transaction[], parentTransaction: Transaction): Promise<{ key: number, changes: Partial<Transaction> }[]> {
  function findChanges(oldTransaction: Transaction, newTransaction: Transaction): Partial<Transaction> {
    let changes = {
      name: newTransaction.name !== oldTransaction.name ? newTransaction.name : null,
      amount: newTransaction.amount !== oldTransaction.amount ? newTransaction.amount : null,
      type: newTransaction.type !== oldTransaction.type ? newTransaction.type : null,
      accountId: newTransaction.accountId !== oldTransaction.accountId ? newTransaction.accountId : null,
      categoryId: newTransaction.categoryId !== oldTransaction.categoryId ? newTransaction.categoryId : null,
    }
    return Object.fromEntries(Object.entries(changes).filter(([_, v]) => v !== null));
  }

  return transactions.map((transaction) => {
    let id = checkIfExists(transaction.id);
    let oldTransaction = transactions.find((change) => change?.id === id);
    oldTransaction = checkIfExists(oldTransaction);

    return {
      key: id,
      changes: findChanges(oldTransaction, parentTransaction),
    };
  });
}

/**
 * Updates a transaction's corresponding child Transactions.
 *
 * @param {Transaction} transaction - The updated transaction object.
 * @param {Transaction[]} existingChildTransactions - The existing child Transactions.
 * @param {Transaction[]} newChildTransactions - The new child Transactions.
 * @returns {Promise<void>} - A promise that resolves when the transaction and child Transactions are updated.
 */
async function updateChildTransactions(transaction: Transaction, existingChildTransactions: Transaction[], newChildTransactions: Transaction[]): Promise<void> {
  // Create a Map for faster lookup
  const existingChildTransactionsMap = new Map(existingChildTransactions.map(ct => [ct.date.toDateString(), ct]));

  // Prepare batch operations
  const updateOperations = [];
  const createOperations = [];

  for (const newChildTransaction of newChildTransactions) {
    const match = existingChildTransactionsMap.get(newChildTransaction.date.toDateString());
    if (match) {
      // Only update if there are changes
      if (match.date.getTime() !== newChildTransaction.date.getTime() || match.amount !== newChildTransaction.amount) {
        updateOperations.push(FinanceTrackerDatabase.transactions.update(match.id, {
          ...match,
          date: newChildTransaction.date,
          amount: newChildTransaction.amount,
        }));
      }
      existingChildTransactionsMap.delete(newChildTransaction.date.toDateString());
    } else {
      createOperations.push(FinanceTrackerDatabase.transactions.add(newChildTransaction));
    }
  }

  // Delete remaining unmdatched existing child Transactions
  deleteOutOfBoundTransactions(Array.from(existingChildTransactionsMap.values()));

  // Execute batch operations in parallel
  await Promise.all([...updateOperations, ...createOperations]);
}

/**
 * Deletes out-of-bound Transactions.
 *
 * @param {Transaction[]} transactions - The array of out-of-bound  Transactions to delete.
 * @returns {Promise<void>} - A promise that resolves when the child Transactions are deleted.
 */
function deleteOutOfBoundTransactions(transactions: Transaction[]): Promise<void> {
  return FinanceTrackerDatabase.transaction('rw', FinanceTrackerDatabase.transactions, async () => {
    await FinanceTrackerDatabase.transactions.bulkDelete(transactions.map(ct => ct.id!));
  });
}

/**
 * Finds the upcoming transactions for the given account ID and limit.
 *
 * @param {number} accountId - The ID of an account. If not provided, all transactions are considered.
 * @param {number} limit - The maximum number of transactions to return.
 * @returns {Promise<Transaction[]>} - A promise that resolves to an array of Transactions.
 */
function findUpcomingTransactions(accountId?: number, limit?: number): Promise<Transaction[]> {
  const today = new Date();
  const twoDaysFromNow = new Date();
  twoDaysFromNow.setDate(today.getDate() + 2);

  return FinanceTrackerDatabase.transaction('r', FinanceTrackerDatabase.transactions, async () => {
    let transactions: Transaction[] = [];
    if (accountId)
      transactions = await FinanceTrackerDatabase.transactions
        .where({ accountId: accountId })
        .and((transaction) => transaction.date >= today && transaction.date <= twoDaysFromNow)
        .sortBy('date');
    else
      transactions = await getTransactionsByDate({ lowerBound: today, upperBound: twoDaysFromNow, sorted: true, sortedDirection: 'asc' });

    transactions = transactions.slice(0, limit);

    return transactions;
  });
}

// helper functions
/**
 * Generates child Transactions based on the transaction's frequency and datetime.
 *
 * @param {Transaction} transaction - The parent transaction object.
 * @returns {Transaction[]} - An array of child Transactions.
 */
function generateChildTransactions(transaction: Transaction): Transaction[] {
  const childTransactions: Transaction[] = [];
  const startDate = new Date(transaction.date);
  const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1); // End of the month
  let currentDate = new Date(startDate);

  switch (transaction.frequency) {
    case Frequency.OneTime:
      break;
    case Frequency.Daily:
      while (currentDate <= endDate) {
        currentDate.setDate(currentDate.getDate() + 1);
        childTransactions.push({ ...transaction, transactionId: transaction.id, id: undefined, date: new Date(currentDate) });
      }
      break;
    case Frequency.Weekly:
      while (currentDate <= endDate) {
        currentDate.setDate(currentDate.getDate() + 7);
        childTransactions.push({ ...transaction, transactionId: transaction.id, id: undefined, date: new Date(currentDate) });
      }
      break;
    case Frequency.Monthly:
      currentDate.setMonth(currentDate.getMonth() + 1);
      childTransactions.push({ ...transaction, transactionId: transaction.id, id: undefined, date: new Date(currentDate) });
      break;
    default:
      throw new Error('Invalid frequency');
  }

  return childTransactions;
}

interface DateRangeProps {
  lowerBound: Date;
  upperBound: Date;
  sorted?: boolean;
  sortedDirection?: 'asc' | 'desc';
}

/**
 * Get transactions by date
 * @param {DateRangeProps} dateRange - The date range
 * @returns {Promise<Transaction[]>} - The transactions within the date range
 */
function getTransactionsByDate({ lowerBound, upperBound, sorted, sortedDirection }: DateRangeProps) {
  return FinanceTrackerDatabase.transaction("r", FinanceTrackerDatabase.transactions, async () => {
    let transactionCollection = await FinanceTrackerDatabase.transactions
      .where('date')
      .between(lowerBound, upperBound);

    let transactions: Transaction[] = [];
    if (sorted)
      if (sortedDirection === 'asc')
        transactions = await transactionCollection.sortBy('date');
      else
        transactions = await transactionCollection.reverse().sortBy('date');
    else
      transactions = await transactionCollection.toArray();

    return transactions;
  });
}

/**
 * Commits an array of transactions by updating their status from "pending" to "processed".
 * @param {Transaction[]} transactions - The transactions to commit.
 * @returns {Promise<void>} - A promise that resolves when the transactions are committed.
 */
function commitTransactions(ids: number[]): Promise<void> {
  return FinanceTrackerDatabase.transaction('rw', FinanceTrackerDatabase.transactions, async () => {
    let transactions = await FinanceTrackerDatabase.transactions.bulkGet(ids);

    let toBeCommitted = transactions.map((transaction, idx) => {
      if (!transaction || ids[idx] !== transaction.id!)
        throw new Error('One or more transactions not found');

      if (transaction.status === 'processed')
        throw new Error('One or more transactions already processed');

      return {
        key: transaction.id!,
        changes: {
          status: 'processed'
        } as Partial<Transaction>,
      };
    });

    await FinanceTrackerDatabase.transactions.bulkUpdate(toBeCommitted);
  });
}

/**
 * Uncommits an array of transactions by updating their status from "processed" to "pending".
 * @param {number[]} ids - The IDs of the transactions to uncommit.
 * @returns {Promise<void>} - A promise that resolves when the transactions are uncommitted.
 */
function unCommitTransactions(ids: number[]): Promise<void> {
  return FinanceTrackerDatabase.transaction('rw', FinanceTrackerDatabase.transactions, async () => {
    let transactions = await FinanceTrackerDatabase.transactions.bulkGet(ids);

    let toBeUncommitted = transactions.map((transaction, idx) => {
      if (!transaction || ids[idx] === transaction.id!)
        throw new Error('One or more transactions not found');

      if (transaction.status === 'pending')
        throw new Error('One or more transactions already pending');

      return {
        key: transaction.id!,
        changes: {
          status: 'pending'
        } as Partial<Transaction>,
      };
    });

    await FinanceTrackerDatabase.transactions.bulkUpdate(toBeUncommitted);
  });
}

export const TransactionService = {
  createTransaction,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionsByAccount,
  findUpcomingTransactions,
  getTransactionsByDate,
  commitTransactions,
  unCommitTransactions,
};