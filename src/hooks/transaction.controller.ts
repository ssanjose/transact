import FinanceTrackerDatabase, { Transaction, AppliedTransaction } from '@/lib/db/db.model';
import { AppliedTransactionController } from './appliedTransaction.controller';

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
function updateTransaction(transaction: Transaction): Promise<void> {
  return FinanceTrackerDatabase.transaction('rw', FinanceTrackerDatabase.transactions, FinanceTrackerDatabase.appliedTransactions, async () => {
    // Fetch the existing transaction
    const existingTransaction = await FinanceTrackerDatabase.transactions.get(transaction.id);

    // Update the transaction
    await FinanceTrackerDatabase.transactions.update(transaction.id, transaction);

    // If datetime or frequency has changed, update the AppliedTransactions
    if (existingTransaction?.date !== transaction.date || existingTransaction?.frequency !== transaction.frequency) {
      // Fetch existing AppliedTransactions
      const existingAppliedTransactions = await FinanceTrackerDatabase.appliedTransactions.where({ transactionId: transaction.id }).toArray();

      // Generate new AppliedTransactions
      const newAppliedTransactions = generateAppliedTransactions(transaction);

      // Delete AppliedTransactions that are not in the new list
      for (const existingAppliedTransaction of existingAppliedTransactions) {
        const match = newAppliedTransactions.find(newAppliedTransaction =>
          newAppliedTransaction.date.toDateString() === existingAppliedTransaction.date.toDateString()
        );
        if (!match) {
          await FinanceTrackerDatabase.appliedTransactions.delete(existingAppliedTransaction.id!);
        }
      }

      // Add or update AppliedTransactions
      for (const newAppliedTransaction of newAppliedTransactions) {
        const match = existingAppliedTransactions.find(existingAppliedTransaction =>
          existingAppliedTransaction.date.toDateString() === newAppliedTransaction.date.toDateString()
        );
        if (match) {
          // Update the time part of the existing AppliedTransaction
          await FinanceTrackerDatabase.appliedTransactions.update(match.id!, {
            ...match,
            date: newAppliedTransaction.date,
          });
        } else {
          await AppliedTransactionController.createAppliedTransaction(newAppliedTransaction);
        }
      }
    } else {
      // Update existing AppliedTransactions
      await AppliedTransactionController.updateAppliedTransaction(transaction);
    }
  });
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

export const TransactionController = {
  createAndApplyTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionsByAccount,
};