import { format } from "date-fns";
import FinanceTrackerDatabase from "@/lib/db/db.init";
import { Transaction, TransactionType } from "@/lib/db/db.model";
import { TransactionNumberProps, IncomeAndExpenseTransactionNumberProps, TransactionAmountProps, IncomeAndExpenseTransactionAmountProps } from "@/services/analytics/props/analytics.props";
import { SelectedDateRange } from "@/services/analytics/props/date-range.props";
import { TransactionService } from "@/services/transaction.service";
import { generateDateRange } from "@/lib/analysis/generateDateRange";
import { DateRange } from "react-day-picker";

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
function getIncomeAndExpenseTransactionAmountByDateRange({
  transactions,
  dateRange
}: { transactions: Transaction[], dateRange: DateRange }): IncomeAndExpenseTransactionAmountProps[] {
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
 * Get transactions by date range
 * @param {SelectedDateRange} selectedDateRange - The selected date range
 * @returns {Promise<Transaction[]>} - The transactions within the date range
 */
function getTransactionsBySelectedDateRange({ selectedDateRange }: { selectedDateRange: SelectedDateRange }) {
  return FinanceTrackerDatabase.transaction("r", FinanceTrackerDatabase.transactions, async () => {
    const currentDate = new Date();

    let lowerBound: Date;
    let upperBound: Date;

    switch (selectedDateRange) {
      case SelectedDateRange.DAY:
        lowerBound = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0);
        upperBound = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59);
        break;
      case SelectedDateRange.WEEK:
        lowerBound = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
        upperBound = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + 6);
        break;
      case SelectedDateRange.MONTH:
        lowerBound = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        upperBound = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        break;
      default:
        lowerBound = new Date(currentDate.getFullYear(), 0, 1);
        upperBound = new Date(currentDate.getFullYear(), 11, 31);
        break;
    }

    return TransactionService.getTransactionsByDate({ lowerBound: lowerBound, upperBound: upperBound, sorted: true });
  });
}

/**
 * Gets the number transactions by date
 * @param selectedDateRange
 * @returns TransactionsByDateProps[]
 */
function getNumberOfTransactionsByDate({ selectedDateRange }: { selectedDateRange?: SelectedDateRange }) {
  return FinanceTrackerDatabase.transaction('r', FinanceTrackerDatabase.transactions, async () => {
    if (selectedDateRange === undefined || selectedDateRange === SelectedDateRange.DAY || selectedDateRange === SelectedDateRange.WEEK)
      throw new Error('Invalid date range for this method');

    const transactions = await getTransactionsBySelectedDateRange({ selectedDateRange: selectedDateRange });

    const transactionsByDate: TransactionNumberProps[] = [];
    transactions.forEach((transaction) => {
      const date = selectedDateRange === SelectedDateRange.YEAR ?
        transaction.date.toLocaleString('default', { month: 'long' }) :
        format(transaction.date, 'yyyy-MM-dd');
      const index = selectedDateRange === SelectedDateRange.YEAR ?
        transactionsByDate.findIndex((transactions) => transactions.month === date) :
        transactionsByDate.findIndex((transactions) => transactions.date === date);

      if (index === -1) {
        if (selectedDateRange === SelectedDateRange.YEAR)
          transactionsByDate.push({
            month: date,
            transactions: 1,
          });
        else
          transactionsByDate.push({
            date: date,
            transactions: 1,
          });
        return;
      }
      transactionsByDate[index].transactions++;
    });

    return transactionsByDate;
  });
}

/**
 * Gets the number of income and expense transactions separated by date
 * @param selectedDateRange
 * @returns IncomeAndExpenseTransactionsByDateProps[]
 */
function getNumberOfIncomeAndExpenseTransactionsByDate({ selectedDateRange }: { selectedDateRange?: SelectedDateRange }) {
  return FinanceTrackerDatabase.transaction('r', FinanceTrackerDatabase.transactions, async () => {
    if (selectedDateRange === undefined || selectedDateRange === SelectedDateRange.DAY || selectedDateRange === SelectedDateRange.WEEK)
      throw new Error('Invalid date range for this method');

    const transactions = await getTransactionsBySelectedDateRange({ selectedDateRange: selectedDateRange });

    const incomeAndExpenseTransactionsByDate: IncomeAndExpenseTransactionNumberProps[] = [];
    transactions.forEach((transaction) => {
      const date = selectedDateRange === SelectedDateRange.YEAR ?
        transaction.date.toLocaleString('default', { month: 'long' }) :
        format(transaction.date, 'yyyy-MM-dd');
      const index = selectedDateRange === SelectedDateRange.YEAR ?
        incomeAndExpenseTransactionsByDate.findIndex((transactions) => transactions.month === date) :
        incomeAndExpenseTransactionsByDate.findIndex((transactions) => transactions.date === date);

      if (index === -1) {
        if (selectedDateRange === SelectedDateRange.YEAR)
          incomeAndExpenseTransactionsByDate.push({
            month: date,
            incomeTransactions: transaction.type === TransactionType.Income ? 1 : 0,
            expenseTransactions: transaction.type === TransactionType.Expense ? 1 : 0,
          });
        else
          incomeAndExpenseTransactionsByDate.push({
            date: date,
            incomeTransactions: transaction.type === TransactionType.Income ? 1 : 0,
            expenseTransactions: transaction.type === TransactionType.Expense ? 1 : 0,
          });
        return;
      }
      if (transaction.type === TransactionType.Income)
        incomeAndExpenseTransactionsByDate[index].incomeTransactions++;
      else
        incomeAndExpenseTransactionsByDate[index].expenseTransactions++;
    });

    return incomeAndExpenseTransactionsByDate;
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
  getIncomeAndExpenseTransactionAmountByDateRange,
  getTransactionsBySelectedDateRange,
  getNumberOfTransactionsByDate,
  getNumberOfIncomeAndExpenseTransactionsByDate,
  findUpcomingTransactions,
  findRecentTransactions,
};