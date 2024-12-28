'use client';

import FinanceTrackerDatabase from "../lib/db/db.init";
import { Transaction } from "../lib/db/db.model";

enum SelectedDateRange {
  DAY,
  WEEK,
  MONTH,
  YEAR
}
const SelectedDateRangeOptions = Object.values(SelectedDateRange).filter((value) => typeof value === "string");
/**
 * Get transactions by date range
 * @param {SelectedDateRange} dateRange - The selected date range
 * @returns {Promise<Transaction[]>} - The transactions within the date range
 */
function getTransactionsByDateRange({ dateRange }: { dateRange: SelectedDateRange }) {
  return FinanceTrackerDatabase.transaction("r", FinanceTrackerDatabase.transactions, async () => {
    let currentDate = new Date();
    let transactions: Transaction[] = await FinanceTrackerDatabase.transactions.toArray();

    switch (dateRange) {
      case SelectedDateRange.DAY:
        transactions = transactions.filter((transaction) => {
          return transaction.date.getDate() === currentDate.getDate();
        });
      case SelectedDateRange.WEEK:
        transactions = transactions.filter((transaction) => {
          return transaction.date.getDate() >= currentDate.getDate() - 7 &&
            transaction.date.getDate() <= currentDate.getDate();
        });
      case SelectedDateRange.MONTH:
        transactions = transactions.filter((transaction) => {
          return transaction.date.getMonth() === currentDate.getMonth();
        });
      default:
        transactions = transactions.filter((transaction) => {
          return transaction.date.getFullYear() === currentDate.getFullYear();
        });
    }
    return transactions;
  });
}



/**
 * Helper service for analytics
 * - Provides methods for transaction summaries and insights
 * 
 * 
 */
export const AnalyticsService = {
  getTransactionsByDateRange,
};
export { SelectedDateRange, SelectedDateRangeOptions };