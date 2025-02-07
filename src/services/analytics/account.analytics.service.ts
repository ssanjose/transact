import { format } from "date-fns";
import FinanceTrackerDatabase from "@/lib/db/db.init";
import { AccountAmountProps, IncomeAndExpenseAccountAmountProps } from "@/services/analytics/props/analytics.props";
import { TransactionService } from "@/services/transaction.service";
import { Account, TransactionType } from "@/lib/db/db.model";

/**
 * Gets the amount of the account within a date range
 * @param lowerBound Start date
 * @param upperBound End date
 * @returns Array of {date, amount} objects
 * @example getAccountAmountByDateRange({ lowerBound: new Date('2021-01-01'), upperBound: new Date('2021-01-31') })
 * @returns [{ date: '2021-01-01', amount: 100.00 }, { date: '2021-01-02', amount: 121.21 }]
 */
function getAccountAmountByDateRange({ lowerBound, upperBound }: { lowerBound: Date; upperBound: Date }) {
  return FinanceTrackerDatabase.transaction('r', FinanceTrackerDatabase.transactions, async () => {
    const transactions = await TransactionService.getTransactionsByDate({
      lowerBound,
      upperBound,
      sorted: true,
      sortedDirection: 'asc'
    });

    const accountAmountByDate: AccountAmountProps[] = [];

    transactions.forEach((transaction) => {
      const date = format(transaction.date, 'yyyy-MM-dd');
      const accountAmountIndex = accountAmountByDate.findIndex((idx) => idx.date === date);

      if (accountAmountIndex === -1) {
        accountAmountByDate.push({
          date,
          amount: transaction.amount,
        });
      } else {
        accountAmountByDate[accountAmountIndex].amount += transaction.amount;
      }
    });

    return accountAmountByDate;
  });
}

/**
 * Gets the income and expense amounts within a date range
 * @param lowerBound Start date
 * @param upperBound End date
 * @returns Array of {date, incomeAmount, expenseAmount} objects
 */
function getIncomeAndExpenseAmountByDateRange({ lowerBound, upperBound }: { lowerBound: Date; upperBound: Date }) {
  return FinanceTrackerDatabase.transaction('r', FinanceTrackerDatabase.transactions, async () => {
    const transactions = await TransactionService.getTransactionsByDate({
      lowerBound,
      upperBound,
      sorted: true,
      sortedDirection: 'asc'
    });

    const incomeAndExpenseAmountByDate: IncomeAndExpenseAccountAmountProps[] = [];

    transactions.forEach((transaction) => {
      const date = format(transaction.date, 'yyyy-MM-dd');
      const accountAmountIndex = incomeAndExpenseAmountByDate.findIndex((idx) => idx.date === date);

      if (accountAmountIndex === -1) {
        incomeAndExpenseAmountByDate.push({
          date,
          incomeAmount: transaction.type === TransactionType.Income ? transaction.amount : 0,
          expenseAmount: transaction.type === TransactionType.Expense ? transaction.amount : 0,
        });
      } else {
        if (transaction.type === TransactionType.Income)
          incomeAndExpenseAmountByDate[accountAmountIndex].incomeAmount += transaction.amount;
        else
          incomeAndExpenseAmountByDate[accountAmountIndex].expenseAmount += transaction.amount;
      }
    });

    return incomeAndExpenseAmountByDate;
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
  getAccountAmountByDateRange,
  getIncomeAndExpenseAmountByDateRange,
  getHighestValuedAccount,
  getMostUsedAccount,
  getBiggestGrowthAccount,
  getSmallestGrowthAccount,
};