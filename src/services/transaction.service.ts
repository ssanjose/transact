import { Frequency, Transaction } from '../lib/db/db.model';
import FinanceTrackerDatabase from '../lib/db/db.init';
import { checkIfExists } from '../lib/utils';
import { AccountService } from './account.service';

/**
 * Creates a transaction and its corresponding child Transactions based on frequency and datetime.
 *
 * @param {Transaction} transaction - The transaction object to create and apply.
 * @returns {Promise<void>} - A promise that resolves when the transaction and child Transactions are created.
 */
function createTransaction(transaction: Transaction): Promise<void> {
  return FinanceTrackerDatabase.transaction('rw', FinanceTrackerDatabase.accounts, FinanceTrackerDatabase.transactions, async () => {
    const txId = await FinanceTrackerDatabase.transactions.add(transaction);
    let childTransactions: Transaction[] = [];

    const persistedTransaction = checkIfExists(await FinanceTrackerDatabase.transactions.get(checkIfExists(txId)));
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
    const transaction = await FinanceTrackerDatabase.transactions.get(id)
    checkIfExists(transaction);
    return transaction;
  })
}


/**
 * Transaction object to withdraw money from an account and transfer it to another account.
 *
 * @returns {Promise<void>} - A promise that resolves when the transaction and child Transactions are created.
 */
function transferBalance(transactionWithdraw: Transaction, transactionTransfer: Transaction) {
  return FinanceTrackerDatabase.transaction('rw', FinanceTrackerDatabase.accounts, FinanceTrackerDatabase.transactions, async () => {
    const txId = await FinanceTrackerDatabase.transactions.add(transactionWithdraw);
    checkIfExists(await FinanceTrackerDatabase.transactions.get(checkIfExists(txId)));
    const txId2 = await FinanceTrackerDatabase.transactions.add(transactionTransfer);
    checkIfExists(await FinanceTrackerDatabase.transactions.get(checkIfExists(txId2)));
    await AccountService.applyTransactionsToAccount();
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
  return FinanceTrackerDatabase.transaction('rw',
    FinanceTrackerDatabase.accounts,
    FinanceTrackerDatabase.transactions,
    async () => {
      const existingTransaction = checkIfExists(await FinanceTrackerDatabase.transactions.get(transaction.id));
      const transactionAfterExisting = (await FinanceTrackerDatabase.transactions.where('accountId').equals(existingTransaction.accountId).and(tx => tx.date >= existingTransaction.date).sortBy('date'));
      transactionAfterExisting.shift();

      // tag the transaction after the existing transaction as pending
      // edge case: if the existing transaction is updated to be later than the next transaction, the next transaction should be tagged as pending
      const prevAfterTransaction = transactionAfterExisting.shift();
      if (prevAfterTransaction)
        await FinanceTrackerDatabase.transactions.update(prevAfterTransaction.id, { status: 'pending' });

      // Get all affected transactions (parent + existing children)
      const affectedTransactions = [existingTransaction];
      if (existingTransaction.transactionId!) {
        const childTransactions = await FinanceTrackerDatabase.transactions
          .where({ transactionId: existingTransaction.id })
          .toArray();
        affectedTransactions.push(...childTransactions);
      }

      // Update the parent transaction
      await FinanceTrackerDatabase.transactions.update(transaction.id, {
        ...transaction,
        // Make child transactions independent if updated by itself by removing the transactionId, and setting the frequency to one-time
        frequency: transaction.transactionId ? Frequency.OneTime : transaction.frequency,
        // set status and accountAmount to undefined to redo balance calculation
        status: 'pending',
        accountAmount: undefined,
        // Ensure that the transactionId is undefined for parent transactions and child transactions
        transactionId: undefined,
      });

      const updatedTransaction = (checkIfExists(await FinanceTrackerDatabase.transactions.get(transaction.id)));
      // stop if the transaction is a child transaction
      if (updatedTransaction.transactionId) {
        await AccountService.applyTransactionsToAccount(updatedTransaction.accountId);
        return;
      }

      // If datetime or frequency has changed, regenerate child Transactions
      const existingChildTransactions = await FinanceTrackerDatabase.transactions.where({ transactionId: transaction.id }).toArray();
      if (existingTransaction.date.toISOString() !== transaction.date.toISOString() || existingTransaction.frequency !== transaction.frequency) {
        const newChildTransactions = generateChildTransactions(updatedTransaction);
        await updateChildTransactions(existingChildTransactions, newChildTransactions);
      } else {
        const changes = await convertToUpdateChanges(existingChildTransactions, updatedTransaction);
        await FinanceTrackerDatabase.transactions.bulkUpdate(changes);
      }

      // call updates to account for all the transactions that need to be committed
      await AccountService.applyTransactionsToAccount(transaction.accountId);
    });
}

/**
 * Deletes a transaction and its corresponding child Transactions.
 *
 * @param {number} transactionId - The ID of the transaction to delete.
 * @returns {Promise<void>} - A promise that resolves when the transaction and child Transactions are deleted.
 */
function deleteTransaction(transactionId: number): Promise<void> {
  return FinanceTrackerDatabase.transaction('rw',
    FinanceTrackerDatabase.accounts,
    FinanceTrackerDatabase.transactions,
    async () => {
      const transaction = await FinanceTrackerDatabase.transactions.get(transactionId);
      if (!transaction)
        throw new Error(`Transaction with ID ${transactionId} not found`);

      // Get all related transactions (children)
      const transactionsToDelete = [];
      if (!transaction.transactionId) {
        const childTransactions = await FinanceTrackerDatabase.transactions
          .where({ transactionId })
          .toArray();
        transactionsToDelete.push(...childTransactions);
      }

      const ids = transactionsToDelete.map(tx => tx.id!);
      await FinanceTrackerDatabase.transactions.bulkDelete(ids);

      // make the transaction status of the transaction after the parent transaction pending then
      // recalculate the account balance with applyTransactionsToAccount
      const accountId = transaction.accountId;
      await AccountService.rollbackTransactionFromAccount(accountId, transaction);
    });
}

/**
 * Retrieves all transactions for a specific account. If no account ID is provided, all transactions are retrieved.
 *
 * @param {number} accountId - The ID of the account.
 * @returns {Promise<Transaction[]>} - A promise that resolves to an array of transactions for the account.
 */
function getTransactionsByAccount(accountId?: number): Promise<Transaction[]> {
  return FinanceTrackerDatabase.transaction('r', FinanceTrackerDatabase.transactions, async () => {
    let transactions: Transaction[];

    if (!accountId) {
      transactions = await FinanceTrackerDatabase.transactions.toArray();
      return transactions;
    }
    return FinanceTrackerDatabase.transactions.where({ accountId }).toArray();
  });
}

/**
 * Converts update transactions to structure used by Dexie.js for batch update operations.
 * @example [{transaction1}] => [{key: transaction1.id, changes: {"keyPath1": newValue1, "keyPath2": newValue2}}]
 */
async function convertToUpdateChanges(transactions: Transaction[], parentTransaction: Transaction): Promise<{ key: number, changes: Partial<Transaction> }[]> {
  function findChanges(oldTransaction: Transaction, newTransaction: Transaction): Partial<Transaction> {
    const changes = {
      name: newTransaction.name !== oldTransaction.name ? newTransaction.name : null,
      amount: newTransaction.amount !== oldTransaction.amount ? newTransaction.amount : null,
      type: newTransaction.type !== oldTransaction.type ? newTransaction.type : null,
      accountId: newTransaction.accountId !== oldTransaction.accountId ? newTransaction.accountId : null,
      categoryId: newTransaction.categoryId !== oldTransaction.categoryId ? newTransaction.categoryId : null,
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return Object.fromEntries(Object.entries(changes).filter(([_, v]) => v !== null));
  }

  return transactions.map((transaction) => {
    const id = checkIfExists(transaction.id);
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
 * @param {Transaction[]} existingChildTransactions - The existing child Transactions.
 * @param {Transaction[]} newChildTransactions - The new child Transactions.
 * @returns {Promise<void>} - A promise that resolves when the transaction and child Transactions are updated.
 */
async function updateChildTransactions(existingChildTransactions: Transaction[], newChildTransactions: Transaction[]): Promise<void> {
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
  const currentDate = new Date(startDate);

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
    const transactionCollection = await FinanceTrackerDatabase.transactions
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
 * Commits an array of transactions by updating their status from "pending" to "processed", and updating the account amount.
 * @param {Transaction[]} transactions - The transactions to commit.
 * @returns {Promise<void>} - A promise that resolves when the transactions are committed.
 */
function commitTransactions(transactions: Transaction[]): Promise<void> {
  return FinanceTrackerDatabase.transaction('rw', FinanceTrackerDatabase.transactions, async () => {
    const toBeCommitted = transactions.map((transaction) => {
      return {
        key: transaction.id!,
        changes: {
          accountAmount: transaction.accountAmount,
          status: 'processed',
        } as Partial<Transaction>,
      };
    });

    await FinanceTrackerDatabase.transactions.bulkUpdate(toBeCommitted);
  });
}

export const TransactionService = {
  createTransaction,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionsByAccount,
  getTransactionsByDate,
  commitTransactions,
  transferBalance
};