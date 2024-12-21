import { Frequency, Transaction } from '@/lib/db/db.model';
import { PromptCallback } from '../hooks/prompt-callback-tempfile';
import FinanceTrackerDatabase from '@/lib/db/db.init';

/**
 * Creates a transaction and its corresponding child Transactions based on frequency and datetime.
 *
 * @param {Transaction} transaction - The transaction object to create and apply.
 * @returns {Promise<void>} - A promise that resolves when the transaction and child Transactions are created.
 */
function createAndApplyTransaction(transaction: Transaction): Promise<void> {
  return FinanceTrackerDatabase.transaction('rw', FinanceTrackerDatabase.transactions, async () => {
    let txId = await FinanceTrackerDatabase.transactions.add(transaction);
    let childTransactions: Transaction[] = [];

    if (txId!)
      childTransactions = generateChildTransactions((await FinanceTrackerDatabase.transactions.get(txId))!);
    else throw new Error("Transaction not created");

    FinanceTrackerDatabase.transactions.bulkAdd(childTransactions);
  })
}

/**
 * Gets a transaction by ID.
 *
 * @param {number} id - The ID of the transaction to retrieve.
 * @returns {Promise<Transaction | undefined>} - A promise that resolves to the transaction object or undefined if not found.
 */
function getTransactionById(id: number) {
  return FinanceTrackerDatabase.transaction('r', FinanceTrackerDatabase.transactions, async () => {
    return await FinanceTrackerDatabase.transactions.get(id);
  })
    .catch((error) => {
      console.error('Failed to get transaction by ID:', error);
      throw error;
    });
}

/**
 * Updates a transaction and its corresponding child Transactions.
 *
 * @param {Transaction} transaction - The transaction object to update.
 * @returns {Promise<void>} - A promise that resolves when the transaction and child Transactions are updated.
 */
function updateTransaction(transaction: Transaction, promptCallback: PromptCallback): Promise<void> {
  return FinanceTrackerDatabase.transaction('rw', FinanceTrackerDatabase.transactions, async () => {
    // Fetch the existing transaction
    const existingTransaction = await FinanceTrackerDatabase.transactions.get(transaction.id);
    if (!existingTransaction) {
      throw new Error(`Transaction with ID ${transaction.id} not found`);
    }

    // Update the parent transaction
    await FinanceTrackerDatabase.transactions.update(transaction.id, transaction);

    // If datetime or frequency has changed, regenerate child Transactions
    if (existingTransaction.date !== transaction.date || existingTransaction.frequency !== transaction.frequency) {
      // Fetch existing child Transactions
      const existingChildTransactions = await FinanceTrackerDatabase.transactions.where({ transactionId: transaction.id }).toArray();

      // Generate new child Transactions
      const newChildTransactions = generateChildTransactions(transaction);

      // Identify out-of-bound child Transactions
      const outOfBoundChildTransactions = identifyOutOfBoundChildTransactions(existingChildTransactions, newChildTransactions);

      // If there are out-of-bound child Transactions, prompt the user
      if (outOfBoundChildTransactions.length > 0) {
        // const userDecision = await promptCallback(outOfBoundChildTransactions);

        // if (userDecision === 'preserve') {
        //   await handlePreserveDecision(outOfBoundChildTransactions, transaction);
        // } else if (userDecision === 'delete') {
        //   await deleteOutOfBoundChildTransactions(outOfBoundChildTransactions);
        // }
        await deleteOutOfBoundChildTransactions(outOfBoundChildTransactions);
      }

      // Proceed with updating the transaction and its child Transactions
      await updateChildTransactions(transaction, existingChildTransactions, newChildTransactions);
    } else {
      // Update existing child Transactions to reflect the updated parent transaction
      const existingChildTransactions = await FinanceTrackerDatabase.transactions.where({ transactionId: transaction.id }).toArray();
      for (const childTransaction of existingChildTransactions) {
        await FinanceTrackerDatabase.transactions.update(childTransaction.id, {
          ...childTransaction,
          name: transaction.name,
          amount: transaction.amount,
          type: transaction.type,
          accountId: transaction.accountId,
          categoryId: transaction.categoryId,
        });
      }
    }
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
  const deleteOperations = [];
  const updateOperations = [];
  const createOperations = [];

  for (const newChildTransaction of newChildTransactions) {
    const match = existingChildTransactionsMap.get(newChildTransaction.date.toDateString());
    if (match) {
      // Only update if there are changes
      if (match.date.getTime() !== newChildTransaction.date.getTime() || match.amount !== newChildTransaction.amount) {
        updateOperations.push(FinanceTrackerDatabase.transactions.update(match.id!, {
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

  // Delete remaining unmatched existing child Transactions
  for (const remainingTransaction of existingChildTransactionsMap.values()) {
    deleteOperations.push(FinanceTrackerDatabase.transactions.delete(remainingTransaction.id!));
  }

  // Execute batch operations in parallel
  await Promise.all([...deleteOperations, ...updateOperations, ...createOperations]);
}

/**
 * Deletes a transaction and its corresponding child Transactions.
 *
 * @param {number} transactionId - The ID of the transaction to delete.
 * @returns {Promise<void>} - A promise that resolves when the transaction and child Transactions are deleted.
 */
function deleteTransaction(transactionId: number): Promise<void> {
  return FinanceTrackerDatabase.transaction('rw', FinanceTrackerDatabase.transactions, async () => {
    await FinanceTrackerDatabase.transactions.where({ transactionId }).delete();
    await FinanceTrackerDatabase.transactions.delete(transactionId);
  });
}

/**
 * Retrieves all transactions for a specific account.
 *
 * @param {number} accountId - The ID of the account.
 * @returns {Promise<Transaction[]>} - A promise that resolves to an array of transactions for the account.
 */
function getTransactionsByAccount(accountId: number): Promise<Transaction[]> {
  return FinanceTrackerDatabase.transactions.where({ accountId }).toArray();
}

/**
 * Deletes out-of-bound child Transactions.
 *
 * @param {Transaction[]} childTransactions - The array of out-of-bound child Transactions to delete.
 * @returns {Promise<void>} - A promise that resolves when the child Transactions are deleted.
 */
async function deleteOutOfBoundChildTransactions(childTransactions: Transaction[]): Promise<void> {
  return FinanceTrackerDatabase.transaction('rw', FinanceTrackerDatabase.transactions, async () => {
    await FinanceTrackerDatabase.transactions.bulkDelete(childTransactions.map(ct => ct.id!));
  });
}

/**
 * Finds the upcoming transactions for the given account ID and limit.
 *
 * @param {number} accountId - The account ID.
 * @param {number} limit - The maximum number of transactions to return.
 * @returns {Promise<Transaction[]>} - A promise that resolves to an array of Transactions.
 */
function findUpcomingTransactions(accountId?: number, limit?: number): Promise<Transaction[]> {
  const today = new Date();
  const twoDaysFromNow = new Date();
  twoDaysFromNow.setDate(today.getDate() + 2);

  return FinanceTrackerDatabase.transaction('r', FinanceTrackerDatabase.transactions, async () => {
    let transactions: Transaction[];
    if (accountId)
      transactions = await FinanceTrackerDatabase.transactions
        .where({ accountId: accountId })
        .and((transaction) => transaction.date >= today && transaction.date <= twoDaysFromNow)
        .sortBy('date');
    else
      transactions = await FinanceTrackerDatabase.transactions
        .where('date')
        .between(today, twoDaysFromNow)
        .sortBy('date');

    transactions = transactions.slice(0, limit);

    return transactions;
  });
}

// helper functions
/**
 * Identifies out-of-bound child Transactions based on existing and new child Transactions.
 *
 * @param {Transaction[]} existingChildTransactions - The existing child Transactions.
 * @param {Transaction[]} newChildTransactions - The new child Transactions.
 * @returns {Transaction[]} - An array of out-of-bound child Transactions.
 */
function identifyOutOfBoundChildTransactions(existingChildTransactions: Transaction[], newChildTransactions: Transaction[]): Transaction[] {
  const existingChildTransactionsMap = new Map(existingChildTransactions.map(at => [at.date.toDateString(), at]));
  const outOfBoundChildTransactions: Transaction[] = [];

  for (const newChildTransaction of newChildTransactions) {
    const match = existingChildTransactionsMap.get(newChildTransaction.date.toDateString());
    if (match) {
      existingChildTransactionsMap.delete(newChildTransaction.date.toDateString());
    }
  }

  for (const remainingTransaction of existingChildTransactionsMap.values()) {
    outOfBoundChildTransactions.push(remainingTransaction);
  }

  return outOfBoundChildTransactions;
}

/**
 * Handles the 'preserve' decision by updating the frequency of out-of-bound child Transactions to one-time.
 *
 * @param {Transaction[]} outOfBoundChildTransactions - The array of out-of-bound child Transactions.
 * @param {Transaction} existingTransaction - The existing transaction object.
 * @returns {Promise<void>} - A promise that resolves when the operations are complete.
 */
async function handlePreserveDecision(outOfBoundChildTransactions: Transaction[], existingTransaction: Transaction): Promise<void> {
  for (const outOfBoundChildTransaction of outOfBoundChildTransactions) {
    await FinanceTrackerDatabase.transactions.update(outOfBoundChildTransaction.id!, {
      ...outOfBoundChildTransaction,
      frequency: Frequency.OneTime,
      transactionId: undefined,
    });
  }
}

/**
 * Generates child Transactions based on the transaction's frequency and datetime.
 *
 * @param {Transaction} transaction - The parent transaction object.
 * @returns {Transaction[]} - An array of child Transactions.
 */
function generateChildTransactions(transaction: Transaction): Transaction[] {
  const childTransactions: Transaction[] = [];
  const startDate = new Date(transaction.date);
  const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0); // End of the month
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

export const TransactionService = {
  createAndApplyTransaction,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getTransactionsByAccount,
  findUpcomingTransactions,
};