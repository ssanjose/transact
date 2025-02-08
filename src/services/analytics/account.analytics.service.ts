import FinanceTrackerDatabase from "@/lib/db/db.init";
import { Account, Transaction, TransactionType } from "@/lib/db/db.model";
import { AccountTotalAmountProps } from "@/services/analytics/props/analytics.props"
import { generateDateRange } from "@/lib/analysis/generateDateRange";
import { format } from "date-fns";

/**
 * Gets the total amount for each account on each date
 * @param accounts Accounts to calculate
 * @param transactions Transactions to calculate
 * @returns AccountTotalAmountProps[]
 * @example
 * ```typescript
 * const accounts = await FinanceTrackerDatabase.accounts.toArray();
 * const transactions = await FinanceTrackerDatabase.transactions.toArray();
 * const accountTrend = getAccountTrend(accounts, transactions);
 * ```
 */
function getAccountTrend(accounts: Account[], transactions: Transaction[]): AccountTotalAmountProps[] {
  const dates = transactions.map(t => t.date);
  const dateRange = {
    from: new Date(Math.min(...dates.map(d => d.getTime()))),
    to: new Date(Math.max(...dates.map(d => d.getTime())))
  };
  const paddedDates = generateDateRange(dateRange.from, dateRange.to);

  const transactionsByDate = new Map<string, Transaction[]>();
  transactions.forEach(transaction => {
    const date = format(transaction.date, 'yyyy-MM-dd');
    if (!transactionsByDate.has(date)) {
      transactionsByDate.set(date, []);
    }
    transactionsByDate.get(date)!.push(transaction);
  });

  // Initialize total with starting balances
  const runningTotals = new Map<number, number>();
  accounts.forEach(account => {
    runningTotals.set(account.id!, account.startingBalance!);
  });

  // Calculate cumulative totals for each date - O(n^2) -> O(n)
  return paddedDates.map(date => {
    const dayTransactions = transactionsByDate.get(date) || [];

    dayTransactions.forEach(tx => {
      const currentTotal = runningTotals.get(tx.accountId)!;
      const amount = tx.type === TransactionType.Income ? tx.amount : -tx.amount;
      runningTotals.set(tx.accountId, currentTotal + amount);
    });

    return {
      date,
      accountAmount: Array.from(runningTotals.values())
        .reduce((sum, amount) => sum + amount, 0)
    };
  });
}

/**
 * Gets the account with the highest balance
 * @returns Account with highest balance
 */
function getHighestValuedAccount(): Promise<Account> {
  return FinanceTrackerDatabase.transaction('r', FinanceTrackerDatabase.accounts, async () => {
    const accounts = await FinanceTrackerDatabase.accounts.toArray();
    return accounts.reduce((prev, current) =>
      (prev.balance > current.balance) ? prev : current
    );
  });
}

/**
 * Gets the account with the most transactions
 * @returns Account with most transactions
 */
function getMostUsedAccount(): Promise<Account> {
  return FinanceTrackerDatabase.transaction('r',
    [FinanceTrackerDatabase.accounts, FinanceTrackerDatabase.transactions],
    async () => {
      const transactions = await FinanceTrackerDatabase.transactions.toArray();
      const accountTransactionCount = new Map<number, number>();

      transactions.forEach(transaction => {
        const count = accountTransactionCount.get(transaction.accountId) || 0;
        accountTransactionCount.set(transaction.accountId, count + 1);
      });

      const mostUsedAccountId = Array.from(accountTransactionCount.entries())
        .reduce((a, b) => a[1] > b[1] ? a : b)[0];

      return FinanceTrackerDatabase.accounts.get(mostUsedAccountId) as Promise<Account>;
    });
}

/**
 * Gets the account with the highest growth rate
 * @param ignoreZeroStartingBalance Whether to ignore accounts with zero starting balance, default true
 * @returns Account with highest growth rate (current balance - starting balance) / |starting balance|
 */
function getBiggestGrowthAccount(ignoreZeroStartingBalance = true): Promise<Account | undefined> {
  return FinanceTrackerDatabase.transaction('r', FinanceTrackerDatabase.accounts, async () => {
    let accounts = await FinanceTrackerDatabase.accounts.toArray();

    if (ignoreZeroStartingBalance)
      accounts = accounts.filter(account => (account.startingBalance || 0) !== 0);

    if (accounts.length === 0) return undefined;

    return accounts.reduce((prev, current) => {
      const prevGrowth = calculateGrowthRate(prev);
      const currentGrowth = calculateGrowthRate(current);
      return prevGrowth > currentGrowth ? prev : current;
    });
  });
}

/**
 * Gets the account with the lowest growth rate
 * @param ignoreZeroStartingBalance Whether to ignore accounts with zero starting balance, default true
 * @returns Account with lowest growth rate (current balance - starting balance) / |starting balance|
 */
function getSmallestGrowthAccount(ignoreZeroStartingBalance = true): Promise<Account | undefined> {
  return FinanceTrackerDatabase.transaction('r', FinanceTrackerDatabase.accounts, async () => {
    let accounts = await FinanceTrackerDatabase.accounts.toArray();

    if (ignoreZeroStartingBalance)
      accounts = accounts.filter(account => (account.startingBalance || 0) !== 0);

    if (accounts.length === 0) return undefined;

    return accounts.reduce((prev, current) => {
      const prevGrowth = calculateGrowthRate(prev);
      const currentGrowth = calculateGrowthRate(current);
      return prevGrowth < currentGrowth ? prev : current;
    });
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

export const AccountAnalyticsService = {
  getAccountTrend,
  getHighestValuedAccount,
  getMostUsedAccount,
  getBiggestGrowthAccount,
  getSmallestGrowthAccount,
};