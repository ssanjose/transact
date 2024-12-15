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
    isManuallyUpdated: false,
  };
}

/**
 * Finds the upcoming transactions for the given account ID and limit.
 *
 * @param {number} accountId - The account ID.
 * @param {number} limit - The maximum number of transactions to return.
 * @returns {Promise<AppliedTransaction[]>} - A promise that resolves to an array of AppliedTransactions.
 */
function findUpcomingTransactions(accountId?: number, limit?: number): Promise<AppliedTransaction[]> {
  const today = new Date();
  const twoDaysFromNow = new Date();
  twoDaysFromNow.setDate(today.getDate() + 2);

  return FinanceTrackerDatabase.transaction('r', FinanceTrackerDatabase.appliedTransactions, async () => {
    let transactions: AppliedTransaction[];
    if (accountId)
      transactions = await FinanceTrackerDatabase.appliedTransactions
        .where({ accountId: accountId })
        .and((transaction) => transaction.date >= today && transaction.date <= twoDaysFromNow)
        .sortBy('date');
    else
      transactions = await FinanceTrackerDatabase.appliedTransactions
        .where('date')
        .between(today, twoDaysFromNow)
        .sortBy('date');

    transactions = transactions.slice(0, limit);

    return transactions;
  });
}

export const AppliedTransactionController = {
  createAppliedTransaction,
  updateAppliedTransaction,
  createAppliedTransactionObject,
  findUpcomingTransactions,
};