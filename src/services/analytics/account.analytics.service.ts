import FinanceTrackerDatabase from "@/lib/db/db.init";
import { Account } from "@/lib/db/db.model";

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
  getHighestValuedAccount,
  getMostUsedAccount,
  getBiggestGrowthAccount,
  getSmallestGrowthAccount,
};