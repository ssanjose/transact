import FinanceTrackerDatabase, { AppliedTransaction, Transaction } from '@/lib/db/db.model';

/**
 * Creates an AppliedTransaction based on the given AppliedTransaction object.
 *
 * @param {AppliedTransaction} appliedTransaction - The AppliedTransaction object.
 * @returns {Promise<number>} - A promise that resolves to the ID of the created AppliedTransaction.
 */
function createAppliedTransaction(appliedTransaction: AppliedTransaction): Promise<number> {
  return FinanceTrackerDatabase.transaction('rw', FinanceTrackerDatabase.appliedTransactions, async () => {
    const id = await FinanceTrackerDatabase.appliedTransactions.add(appliedTransaction);
    if (id === undefined) {
      throw new Error('Failed to create AppliedTransaction');
    }
    return id;
  });
}

/**
 * Updates an AppliedTransaction based on the given transaction.
 *
 * @param {Transaction} transaction - The transaction object.
 * @returns {Promise<number>} - A promise that resolves to the number of updated AppliedTransactions.
 */
function updateAppliedTransaction(transaction: Transaction): Promise<number> {
  return FinanceTrackerDatabase.transaction('rw', FinanceTrackerDatabase.appliedTransactions, async () => {
    return await FinanceTrackerDatabase.appliedTransactions.where({ transactionId: transaction.id }).modify({
      amount: transaction.amount,
      date: transaction.date,
      type: transaction.type,
    });
  });
}

/**
 * Creates an AppliedTransaction object based on the transaction and date.
 *
 * @param {Transaction} transaction - The transaction object.
 * @param {Date} date - The date for the AppliedTransaction.
 * @returns {AppliedTransaction} - The AppliedTransaction object.
 */
function createAppliedTransactionObject(transaction: Transaction, date: Date): AppliedTransaction {
  return {
    transactionId: transaction.id!,
    amount: transaction.amount,
    date: date,
    type: transaction.type,
  };
}

export const AppliedTransactionController = {
  createAppliedTransaction,
  updateAppliedTransaction,
  createAppliedTransactionObject,
};