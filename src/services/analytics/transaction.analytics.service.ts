import { format } from "date-fns";
import FinanceTrackerDatabase from "@/lib/db/db.init";
import { Transaction, TransactionType } from "@/lib/db/db.model";
import { TransactionNumberProps, IncomeExpenseTransactionNumberProps, TransactionAmountProps, IncomeExpenseTransactionAmountProps } from "@/services/analytics/props/analytics.props";
import { SelectedDateRange } from "@/services/analytics/props/date-range.props";
import { TransactionService } from "@/services/transaction.service";
import { generateDateRange } from "@/lib/analysis/generateDateRange";
import { DateRange } from "react-day-picker";
import { getDateRangeFromSelectedRange } from "@/lib/analysis/GetDateRangeFromSelectedRange";

/**
 * Gets the net amount (income - expenses) for each date within a range
 * @param transactions Transactions to calculate
 * @param dateRange Date range to calculate
 */
function getTransactionAmountByDateRange({
  transactions,
  dateRange
}: { transactions: Transaction[], dateRange: DateRange }): TransactionAmountProps[] {
  // adds padding to the dates where there are no transactions
  const dates = generateDateRange(dateRange.from!, dateRange.to!);

  const amountsByDate = new Map<string, number>();
  dates.forEach(date => amountsByDate.set(date, 0));

  transactions.forEach(transaction => {
    const date = format(transaction.date, 'yyyy-MM-dd');
    const currentAmount = amountsByDate.get(date)!;
    const transactionAmount = transaction.type === TransactionType.Income
      ? transaction.amount
      : -transaction.amount;

    amountsByDate.set(date, currentAmount + transactionAmount);
  });

  return dates.map(date => ({
    date,
    amount: amountsByDate.get(date)!
  }));
}

/**
 * Gets separated income and expense amounts for each date within a range
 * @param transactions Transactions to calculate
 * @param dateRange Date range to calculate
 * @returns IncomeAndExpenseTransactionAmountProps[]
 */
function getIncomeExpenseTransactionAmountByDateRange({
  transactions,
  dateRange
}: { transactions: Transaction[], dateRange: DateRange }): IncomeExpenseTransactionAmountProps[] {
  // adds padding to the dates where there are no transactions
  const dates = generateDateRange(dateRange.from!, dateRange.to!);

  const incomeByDate = new Map<string, number>();
  const expenseByDate = new Map<string, number>();
  dates.forEach(date => {
    incomeByDate.set(date, 0);
    expenseByDate.set(date, 0);
  });

  // calculate income and expense amounts for each date
  transactions.forEach(transaction => {
    const date = format(transaction.date, 'yyyy-MM-dd');
    if (transaction.type === TransactionType.Income) {
      incomeByDate.set(date, incomeByDate.get(date)! + transaction.amount);
    } else {
      expenseByDate.set(date, expenseByDate.get(date)! + transaction.amount);
    }
  });

  return dates.map(date => ({
    date,
    incomeAmount: incomeByDate.get(date)!,
    expenseAmount: expenseByDate.get(date)!
  }));
}

/**
 * Gets the number transactions by date
 */
function getNumberOfTransactions({
  transactions,
  dateRange
}: { transactions: Transaction[], dateRange: DateRange }): TransactionNumberProps[] {
  // adds padding to the dates where there are no transactions
  const dates = generateDateRange(dateRange.from!, dateRange.to!);

  const transactionsByDate = new Map<string, number>();
  dates.forEach(date => transactionsByDate.set(date, 0));

  transactions.forEach(transaction => {
    const date = format(transaction.date, 'yyyy-MM-dd');
    transactionsByDate.set(date, transactionsByDate.get(date)! + 1);
  });

  return dates.map(date => ({
    date,
    transactions: transactionsByDate.get(date)!
  }));
}

/**
 * Gets the number of income and expense transactions separated by date
 */
function getNumberOfIncomeExpenseTransactions({
  transactions,
  dateRange
}: { transactions: Transaction[], dateRange: DateRange }): IncomeExpenseTransactionNumberProps[] {
  // adds padding to the dates where there are no transactions
  const dates = generateDateRange(dateRange.from!, dateRange.to!);

  const incomeByDate = new Map<string, number>();
  const expenseByDate = new Map<string, number>();
  dates.forEach(date => {
    incomeByDate.set(date, 0);
    expenseByDate.set(date, 0);
  });

  transactions.forEach(transaction => {
    const date = format(transaction.date, 'yyyy-MM-dd');
    if (transaction.type === TransactionType.Income)
      incomeByDate.set(date, incomeByDate.get(date)! + 1);
    else
      expenseByDate.set(date, expenseByDate.get(date)! + 1);
  });

  return dates.map(date => ({
    date,
    incomeTransactions: incomeByDate.get(date)!,
    expenseTransactions: expenseByDate.get(date)!
  }));
}

/**
 * Get transactions by date range
 * @param {SelectedDateRange} selectedDateRange - The selected date range
 * @returns {Promise<Transaction[]>} - The transactions within the date range
 */
function getTransactionsBySelectedDateRange({ selectedDateRange }: { selectedDateRange: SelectedDateRange }) {
  return FinanceTrackerDatabase.transaction("r", FinanceTrackerDatabase.transactions, async () => {
    const dateRange = getDateRangeFromSelectedRange(selectedDateRange);
    const transactions = await TransactionService.getTransactionsByDate({
      lowerBound: dateRange.from!,
      upperBound: dateRange.to!,
      sorted: true
    });

    return transactions;
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
      transactions = await TransactionService.getTransactionsByDate({ lowerBound: today, upperBound: twoDaysFromNow, sorted: true, sortedDirection: 'asc' });

    transactions = transactions.slice(0, limit);

    return transactions;
  });
}

/**
 * Finds the recent transactions for the given account ID and limit.
 *
 * @param {number} accountId - The ID of an account. If not provided, all transactions are considered.
 * @param {number} limit - The maximum number of transactions to return.
 * @returns {Promise<Transaction[]>} - A promise that resolves to an array of Transactions.
 */
function findRecentTransactions(accountId?: number, limit?: number): Promise<Transaction[]> {
  const today = new Date();
  const twoDaysBefore = new Date();
  twoDaysBefore.setDate(today.getDate() - 2);

  return FinanceTrackerDatabase.transaction('r', FinanceTrackerDatabase.transactions, async () => {
    let transactions: Transaction[] = [];
    if (accountId)
      transactions = await FinanceTrackerDatabase.transactions
        .where({ accountId: accountId })
        .and((transaction) => transaction.date >= twoDaysBefore)
        .reverse()
        .sortBy('date');
    else
      transactions = await TransactionService.getTransactionsByDate({ lowerBound: twoDaysBefore, upperBound: today, sorted: true, sortedDirection: 'desc' });

    transactions = transactions.slice(0, limit);

    return transactions;
  });
}

export const TransactionAnalyticsService = {
  getTransactionAmountByDateRange,
  getIncomeExpenseTransactionAmountByDateRange,
  getNumberOfTransactions,
  getNumberOfIncomeExpenseTransactions,
  getTransactionsBySelectedDateRange,
  findUpcomingTransactions,
  findRecentTransactions,
};