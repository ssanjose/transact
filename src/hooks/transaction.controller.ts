import FinanceTrackerDatabase, { Transaction, AppliedTransaction } from '@/lib/db/db.model';
import { AppliedTransactionController } from './appliedTransaction.controller';

type PromptCallback = (outOfBoundAppliedTransactions: AppliedTransaction[]) => Promise<'preserve' | 'delete'>;

/**
 * Creates a transaction and its corresponding AppliedTransactions based on frequency and datetime.
 *
 * @param {Transaction} transaction - The transaction object to create and apply.
 * @returns {Promise<void>} - A promise that resolves when the transaction and AppliedTransactions are created.
 */
function createAndApplyTransaction(transaction: Transaction): Promise<void> {
  return FinanceTrackerDatabase.transaction('rw', FinanceTrackerDatabase.transactions, FinanceTrackerDatabase.appliedTransactions, async () => {
    const transactionId = await FinanceTrackerDatabase.transactions.add(transaction);
    transaction.id = transactionId;

    const appliedTransactions = generateAppliedTransactions(transaction);
    for (const appliedTransaction of appliedTransactions) {
      await AppliedTransactionController.createAppliedTransaction(appliedTransaction);
    }
  })
    .catch((error) => {
      console.error('Failed to create and apply transaction:', error);
      throw error;
    });
}

/**
 * Generates AppliedTransactions based on the transaction's frequency and datetime.
 *
 * @param {Transaction} transaction - The transaction object.
 * @returns {AppliedTransaction[]} - An array of AppliedTransactions.
 */
function generateAppliedTransactions(transaction: Transaction): AppliedTransaction[] {
  const appliedTransactions: AppliedTransaction[] = [];
  const startDate = new Date(transaction.date);
  const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0); // End of the month
  let currentDate = new Date(startDate);

  switch (transaction.frequency) {
    case 0: // One-time
      appliedTransactions.push(AppliedTransactionController.createAppliedTransactionObject(transaction, currentDate));
      break;
    case 1: // Daily
      while (currentDate <= endDate) {
        appliedTransactions.push(AppliedTransactionController.createAppliedTransactionObject(transaction, currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      // Add one transaction for the next month
      currentDate = new Date(startDate);
      currentDate.setMonth(currentDate.getMonth() + 1);
      appliedTransactions.push(AppliedTransactionController.createAppliedTransactionObject(transaction, currentDate));
      break;
    case 2: // Bi-weekly
      while (currentDate <= endDate) {
        appliedTransactions.push(AppliedTransactionController.createAppliedTransactionObject(transaction, currentDate));
        currentDate.setDate(currentDate.getDate() + 14);
      }
      // Add one transaction for the next month
      currentDate = new Date(startDate);
      currentDate.setMonth(currentDate.getMonth() + 1);
      appliedTransactions.push(AppliedTransactionController.createAppliedTransactionObject(transaction, currentDate));
      break;
    case 3: // Monthly
      appliedTransactions.push(AppliedTransactionController.createAppliedTransactionObject(transaction, currentDate));
      // Add one transaction for the next month
      currentDate.setMonth(currentDate.getMonth() + 1);
      appliedTransactions.push(AppliedTransactionController.createAppliedTransactionObject(transaction, currentDate));
      break;
    default:
      throw new Error('Invalid frequency');
  }

  return appliedTransactions;
}

/**
 * Updates a transaction and its corresponding AppliedTransactions.
 *
 * @param {Transaction} transaction - The transaction object to update.
 * @returns {Promise<void>} - A promise that resolves when the transaction and AppliedTransactions are updated.
 */
function updateTransaction(transaction: Transaction, promptCallback: PromptCallback): Promise<void> {
  return FinanceTrackerDatabase.transaction('rw', FinanceTrackerDatabase.transactions, FinanceTrackerDatabase.appliedTransactions, async () => {
    // Fetch the existing transaction
    const existingTransaction = await FinanceTrackerDatabase.transactions.get(transaction.id);
    if (!existingTransaction) {
      throw new Error(`Transaction with ID ${transaction.id} not found`);
    }

    // If datetime or frequency has changed, identify out-of-bound AppliedTransactions
    if (existingTransaction.date !== transaction.date || existingTransaction.frequency !== transaction.frequency) {
      // Fetch existing AppliedTransactions
      const existingAppliedTransactions = await FinanceTrackerDatabase.appliedTransactions.where({ transactionId: transaction.id }).toArray();

      // Generate new AppliedTransactions
      const newAppliedTransactions = generateAppliedTransactions(transaction);

      // Identify out-of-bound AppliedTransactions
      const outOfBoundAppliedTransactions = identifyOutOfBoundAppliedTransactions(existingAppliedTransactions, newAppliedTransactions);

      // If there are out-of-bound AppliedTransactions, prompt the user
      if (outOfBoundAppliedTransactions.length > 0) {
        const userDecision = await promptCallback(outOfBoundAppliedTransactions);

        if (userDecision === 'preserve') {
          await handlePreserveDecision(outOfBoundAppliedTransactions, transaction);
        } else if (userDecision === 'delete') {
          await deleteOutOfBoundAppliedTransactions(outOfBoundAppliedTransactions);
        }
      }

      // Proceed with updating the transaction and its AppliedTransactions
      await updateTransactionAndAppliedTransactions(transaction, existingAppliedTransactions, newAppliedTransactions);
    } else {
      // Update the transaction
      await FinanceTrackerDatabase.transactions.update(transaction.id, transaction);
      // Update existing AppliedTransactions
      await AppliedTransactionController.updateAppliedTransaction(transaction);
    }
  });
}

/**
 * Updates the transaction and its corresponding AppliedTransactions.
 *
 * @param {Transaction} transaction - The updated transaction object.
 * @param {AppliedTransaction[]} existingAppliedTransactions - The existing AppliedTransactions.
 * @param {AppliedTransaction[]} newAppliedTransactions - The new AppliedTransactions.
 * @returns {Promise<void>} - A promise that resolves when the transaction and AppliedTransactions are updated.
 */
async function updateTransactionAndAppliedTransactions(transaction: Transaction, existingAppliedTransactions: AppliedTransaction[], newAppliedTransactions: AppliedTransaction[]): Promise<void> {
  // Create a Map for faster lookup
  const existingAppliedTransactionsMap = new Map(existingAppliedTransactions.map(at => [at.date.toDateString(), at]));

  // Prepare batch operations
  const deleteOperations = [];
  const updateOperations = [];
  const createOperations = [];

  for (const newAppliedTransaction of newAppliedTransactions) {
    const match = existingAppliedTransactionsMap.get(newAppliedTransaction.date.toDateString());
    if (match) {
      // Only update if there are changes and the AppliedTransaction is not manually updated
      if (!match.isManuallyUpdated && (match.date.getTime() !== newAppliedTransaction.date.getTime() || match.amount !== newAppliedTransaction.amount)) {
        updateOperations.push(FinanceTrackerDatabase.appliedTransactions.update(match.id!, {
          ...match,
          date: newAppliedTransaction.date,
          amount: newAppliedTransaction.amount,
        }));
      }
      existingAppliedTransactionsMap.delete(newAppliedTransaction.date.toDateString());
    } else {
      createOperations.push(AppliedTransactionController.createAppliedTransaction(newAppliedTransaction));
    }
  }

  // Delete remaining unmatched existing AppliedTransactions
  for (const remainingTransaction of existingAppliedTransactionsMap.values()) {
    deleteOperations.push(FinanceTrackerDatabase.appliedTransactions.delete(remainingTransaction.id!));
  }

  // Execute batch operations in parallel
  await Promise.all([...deleteOperations, ...updateOperations, ...createOperations]);
}

/**
 * Deletes a transaction and its corresponding AppliedTransactions.
 *
 * @param {number} transactionId - The ID of the transaction to delete.
 * @returns {Promise<void>} - A promise that resolves when the transaction and AppliedTransactions are deleted.
 */
function deleteTransaction(transactionId: number): Promise<void> {
  return FinanceTrackerDatabase.transaction('rw', FinanceTrackerDatabase.transactions, FinanceTrackerDatabase.appliedTransactions, async () => {
    await FinanceTrackerDatabase.appliedTransactions.where({ transactionId }).delete();
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
 * Handles the 'preserve' decision by creating new one-time transactions for out-of-bound AppliedTransactions.
 *
 * @param {AppliedTransaction[]} outOfBoundAppliedTransactions - The array of out-of-bound AppliedTransactions.
 * @param {Transaction} existingTransaction - The existing transaction object.
 * @returns {Promise<void>} - A promise that resolves when the operations are complete.
 */
async function handlePreserveDecision(outOfBoundAppliedTransactions: AppliedTransaction[], existingTransaction: Transaction): Promise<void> {
  for (const outOfBoundAppliedTransaction of outOfBoundAppliedTransactions) {
    const newTransaction: Transaction = {
      ...existingTransaction,
      id: undefined,
      frequency: 0, // One-time frequency
      date: outOfBoundAppliedTransaction.date,
    };
    const newTransactionId = await FinanceTrackerDatabase.transactions.add(newTransaction);
    if (newTransactionId !== undefined) {
      outOfBoundAppliedTransaction.transactionId = newTransactionId;
    } else {
      throw new Error('Failed to create new transaction');
    }
    await FinanceTrackerDatabase.appliedTransactions.update(outOfBoundAppliedTransaction.id!, outOfBoundAppliedTransaction);
  }
}

/**
 * Deletes out-of-bound AppliedTransactions.
 *
 * @param {AppliedTransaction[]} appliedTransactions - The array of out-of-bound AppliedTransactions to delete.
 * @returns {Promise<void>} - A promise that resolves when the AppliedTransactions are deleted.
 */
async function deleteOutOfBoundAppliedTransactions(appliedTransactions: AppliedTransaction[]): Promise<void> {
  for (const appliedTransaction of appliedTransactions) {
    await FinanceTrackerDatabase.appliedTransactions.delete(appliedTransaction.id!);
  }
}

/**
 * Identifies out-of-bound AppliedTransactions based on existing and new AppliedTransactions.
 *
 * @param {AppliedTransaction[]} existingAppliedTransactions - The existing AppliedTransactions.
 * @param {AppliedTransaction[]} newAppliedTransactions - The new AppliedTransactions.
 * @returns {AppliedTransaction[]} - An array of out-of-bound AppliedTransactions.
 */
function identifyOutOfBoundAppliedTransactions(existingAppliedTransactions: AppliedTransaction[], newAppliedTransactions: AppliedTransaction[]): AppliedTransaction[] {
  const existingAppliedTransactionsMap = new Map(existingAppliedTransactions.map(at => [at.date.toDateString(), at]));
  const outOfBoundAppliedTransactions: AppliedTransaction[] = [];

  for (const newAppliedTransaction of newAppliedTransactions) {
    const match = existingAppliedTransactionsMap.get(newAppliedTransaction.date.toDateString());
    if (match) {
      existingAppliedTransactionsMap.delete(newAppliedTransaction.date.toDateString());
    }
  }

  for (const remainingTransaction of existingAppliedTransactionsMap.values()) {
    if (remainingTransaction.isManuallyUpdated) {
      outOfBoundAppliedTransactions.push(remainingTransaction);
    }
  }

  return outOfBoundAppliedTransactions;
}

export const TransactionController = {
  createAndApplyTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionsByAccount,
};