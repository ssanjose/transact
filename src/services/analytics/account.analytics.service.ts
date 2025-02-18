import { Account, Transaction, TransactionType } from "@/lib/db/db.model";
import { AccountTotalAmountProps, TimeSeriesData } from "@/services/analytics/props/analytics.props"
import { format } from "date-fns";

/**
 * Gets the total amount for each account on each date, including both processed and pending transactions
 * @param accounts Accounts to analyze
 * @param transactions Transactions to analyze (must be sorted by date)
 * @returns AccountTotalAmountProps[] with real and projected balances
 * @example
 * ```typescript
 * const accounts = await FinanceTrackerDatabase.accounts.toArray();
 * const transactions = await FinanceTrackerDatabase.transactions.toArray();
 * const accountTrend = getAccountTrend(accounts, transactions);
 * ```
 */
function getAccountTrend(accounts: Account[], transactions: Transaction[]): AccountTotalAmountProps[] {
  if (!transactions?.length || !accounts?.length) return [];

  // Sort transactions by date and status (processed first, then pending)
  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateComparison = a.date.getTime() - b.date.getTime();
    if (dateComparison === 0) {
      // If same date, processed comes before pending
      return a.status === 'processed' ? -1 : 1;
    }
    return dateComparison;
  });

  // Group transactions by date
  const transactionsByDate = new Map<string, Transaction[]>();
  sortedTransactions.forEach(transaction => {
    const date = format(transaction.date, 'yyyy-MM-dd');
    if (!transactionsByDate.has(date)) {
      transactionsByDate.set(date, []);
    }
    transactionsByDate.get(date)!.push(transaction);
  });

  // Track last known processed amount for each account
  const lastProcessedAmount = new Map<number, number>();
  accounts.forEach(account => {
    lastProcessedAmount.set(account.id!, account.startingBalance || 0);
  });

  // Calculate daily totals
  const daily = Array.from(transactionsByDate.entries()).map(([date, dayTransactions]) => {
    let dailyTotal = 0;

    // Process each account's transactions for this day
    accounts.forEach(account => {
      const accountTransactions = dayTransactions.filter(tx => tx.accountId === account.id);
      let currentTotal = lastProcessedAmount.get(account.id!)!;

      accountTransactions.forEach(tx => {
        if (tx.status === 'processed') {
          // Use the actual accountAmount for processed transactions
          currentTotal = tx.accountAmount!;
        } else {
          // For pending transactions, add their amount to the last known total
          currentTotal += tx.type === TransactionType.Income ? tx.amount : -tx.amount;
        }
      });

      // Update the last known amount for this account
      lastProcessedAmount.set(account.id!, currentTotal);
      dailyTotal += currentTotal;
    });

    return {
      date,
      accountAmount: dailyTotal
    };
  });
  return daily;
}

/**
 * Gets the account with the highest balance from a list of accounts
 * @param accounts Array of accounts to analyze
 * @returns Account with highest balance, or undefined if accounts array is empty
 */
function getHighestValuedAccount(accounts: Account[]): Account | undefined {
  if (!accounts?.length) return undefined;

  return accounts.reduce((prev, current) =>
    (prev.balance > current.balance) ? prev : current
  );
}

/**
 * Gets the account with the most transactions from a list of accounts and their transactions
 * @param accounts Array of accounts to analyze
 * @param transactions Array of transactions to analyze
 * @returns Account with most transactions, or undefined if no accounts/transactions exist
 */
function getMostUsedAccount(accounts: Account[], transactions: Transaction[]): Account | undefined {
  if (!accounts?.length || !transactions?.length) return undefined;

  const accountTransactionCount = new Map<number, number>();

  transactions.forEach(transaction => {
    const count = accountTransactionCount.get(transaction.accountId) || 0;
    accountTransactionCount.set(transaction.accountId, count + 1);
  });

  const mostUsedAccountId = Array.from(accountTransactionCount.entries())
    .reduce((a, b) => a[1] > b[1] ? a : b)[0];

  return accounts.find(account => account.id === mostUsedAccountId);
}

/**
 * Gets the account with the highest growth rate from a list of accounts
 * @param accounts Array of accounts to analyze
 * @param ignoreZeroStartingBalance Whether to ignore accounts with zero starting balance, default true
 * @returns Account with highest growth rate (current balance - starting balance) / |starting balance|, 
 *          or undefined if no valid accounts exist
 */
function getBiggestGrowthAccount(accounts: Account[], ignoreZeroStartingBalance = true): Account | undefined {
  if (!accounts?.length) return undefined;

  let filteredAccounts = accounts;
  if (ignoreZeroStartingBalance)
    filteredAccounts = accounts.filter(account => (account.startingBalance || 0) !== 0);

  if (filteredAccounts.length === 0) return undefined;

  return filteredAccounts.reduce((prev, current) => {
    const prevGrowth = calculateGrowthRate(prev);
    const currentGrowth = calculateGrowthRate(current);
    return prevGrowth > currentGrowth ? prev : current;
  });
}

/**
 * Gets the account with the lowest growth rate from a list of accounts
 * @param accounts Array of accounts to analyze
 * @param ignoreZeroStartingBalance Whether to ignore accounts with zero starting balance, default true
 * @returns Account with lowest growth rate (current balance - starting balance) / |starting balance|,
 *          or undefined if no valid accounts exist
 */
function getSmallestGrowthAccount(accounts: Account[], ignoreZeroStartingBalance = true): Account | undefined {
  if (!accounts?.length) return undefined;

  let filteredAccounts = accounts;
  if (ignoreZeroStartingBalance)
    filteredAccounts = accounts.filter(account => (account.startingBalance || 0) !== 0);

  if (filteredAccounts.length === 0) return undefined;

  return filteredAccounts.reduce((prev, current) => {
    const prevGrowth = calculateGrowthRate(prev);
    const currentGrowth = calculateGrowthRate(current);
    return prevGrowth < currentGrowth ? prev : current;
  });
}

/**
 * Helper function. Calculates growth rate for an account
 * For accounts with zero starting balance:
 * - Returns 100% for positive balance
 * - Returns -100% for negative balance
 * - Returns 0% for zero balance
 * For accounts with non-zero starting balance:
 * - Returns (current - starting) / |starting|
 * @param account Account to calculate growth rate for
 * @returns Growth rate as decimal
 */
function calculateGrowthRate(account: Account): number {
  const startingBalance = account.startingBalance || 0;
  if (startingBalance === 0) {
    return account.balance > 0 ? 1 : account.balance < 0 ? -1 : 0;
  }
  return (account.balance - startingBalance) / Math.abs(startingBalance);
}

/**
 * Squeezes an array of time series data into fewer points by taking the latest value
 * @param data Array of time series data points
 * @param targetPoints Desired number of data points in output
 * @returns Reduced array with latest values from each chunk
 */
function squeezeTimeSeriesData<T extends TimeSeriesData>(data: T[], targetPoints: number): T[] {
  if (!data?.length || targetPoints <= 0) return [];
  if (data.length <= targetPoints) return data;

  const chunkSize = Math.ceil(data.length / targetPoints);
  const chunks: T[][] = [];

  // Split data into chunks
  for (let i = 0; i < data.length; i += chunkSize) {
    chunks.push(data.slice(i, i + chunkSize));
  }

  // Take the last element from each chunk
  return chunks.map(chunk => {
    const latestData = chunk[chunk.length - 1];
    return { ...latestData };
  });
}

export const AccountAnalyticsService = {
  getAccountTrend,
  getHighestValuedAccount,
  getMostUsedAccount,
  getBiggestGrowthAccount,
  getSmallestGrowthAccount,
  squeezeTimeSeriesData,
};