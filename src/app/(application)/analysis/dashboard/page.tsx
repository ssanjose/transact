'use client';

import React, { useEffect } from 'react';
import ContentContainer from '@/components/common/ContentContainer';
import DateRangePicker from '@/components/analytics/DateRangePicker';
import { addMonths } from 'date-fns';
import { Account, Transaction } from '@/lib/db/db.model';
import { TransactionService } from '@/services/transaction.service';
import { ExpenseTransactionChart, IncomeTransactionChart } from '@/components/overview/TransactionChartSummary';
import { DateRange } from 'react-day-picker';
import { TransactionContext } from '@/hooks/use-transaction-context';
import { useLiveQuery } from 'dexie-react-hooks';
import { CategoryService } from '@/services/category.service';
import { CategoryContext } from '@/hooks/use-category-context';
import { TransactionAnalyticsService } from '@/services/analytics/transaction.analytics.service';
import { AccountAnalyticsService } from '@/services/analytics/account.analytics.service';
import { AccountService } from '@/services/account.service';
import DashboardAccountTrend from '@/components/analytics/DashboardAccountTrend';
import SummaryCard from '@/components/common/SummaryCard';
import TransactionAmountTrend from '@/components/analytics/TransactionAmountTrend';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/format/formatCurrency';
import { cn } from '@/lib/utils';

import { Inter } from 'next/font/google';
import { formatDate } from '@/lib/format/formatTime';
import { FaMoneyBill } from 'react-icons/fa';
const inter = Inter({ subsets: ["latin"] });

const getAnalyzedData = (accounts: Account[], transactions: Transaction[], dateRange: DateRange) => {
  const accountTrend = AccountAnalyticsService.getAccountTrend(accounts, transactions);
  const squeezedAccountTrend = AccountAnalyticsService.squeezeTimeSeriesData(accountTrend, 12);
  const transactionTrend = AccountAnalyticsService.squeezeTimeSeriesData(
    TransactionAnalyticsService.getTransactionAmount({ transactions, dateRange }),
    12
  );
  const accountTrendGrowthRate = TransactionAnalyticsService.calculateGrowthRate(
    squeezedAccountTrend[0]?.accountAmount,
    squeezedAccountTrend[squeezedAccountTrend.length - 1]?.accountAmount
  )

  const incomeExpense = TransactionAnalyticsService.getIncomeExpenseTransactionAmount({ transactions, dateRange });

  const highestValuedAccount = AccountAnalyticsService.getHighestValuedAccount(accounts);
  const highestValuedAccountTrend = AccountAnalyticsService.getAccountTrend(accounts, transactions.filter(t => t.accountId === highestValuedAccount?.id));
  const highestValuedAccountGrowthRate = TransactionAnalyticsService.calculateGrowthRate(
    highestValuedAccountTrend[0]?.accountAmount,
    highestValuedAccountTrend[highestValuedAccountTrend.length - 1]?.accountAmount
  );

  const mostUsedAccount = AccountAnalyticsService.getMostUsedAccount(accounts, transactions);
  const transactionsOfMostUsedAccount = transactions.filter(t => t.accountId === mostUsedAccount?.id);
  const numberOfTransactionsOfMostUsedAccount = TransactionAnalyticsService.getNumberOfTransactions({
    transactions: transactionsOfMostUsedAccount,
    dateRange
  });
  const mostUsedAccountTransactionCount = numberOfTransactionsOfMostUsedAccount.reduce((acc, curr) => acc + curr.transactions, 0);

  const biggestGrowthAccount = AccountAnalyticsService.getBiggestGrowthAccount(accounts);
  const biggestGrowthAccountTrend = AccountAnalyticsService.getAccountTrend(accounts, transactions.filter(t => t.accountId === biggestGrowthAccount?.id));
  const biggestGrowthAccountGrowthRate = TransactionAnalyticsService.calculateGrowthRate(
    biggestGrowthAccountTrend[0]?.accountAmount,
    biggestGrowthAccountTrend[biggestGrowthAccountTrend.length - 1]?.accountAmount
  );

  const smallestGrowthAccount = AccountAnalyticsService.getSmallestGrowthAccount(accounts, false);
  const smallestGrowthAccountTrend = AccountAnalyticsService.getAccountTrend(accounts, transactions.filter(t => t.accountId === smallestGrowthAccount?.id));
  const smallestGrowthAccountGrowthRate = TransactionAnalyticsService.calculateGrowthRate(
    smallestGrowthAccountTrend[0]?.accountAmount,
    smallestGrowthAccountTrend[smallestGrowthAccountTrend.length - 1]?.accountAmount
  );

  return {
    accountTrend,
    transactionTrend,
    incomeExpense,
    highestValuedAccount,
    highestValuedAccountTrend,
    highestValuedAccountGrowthRate,
    mostUsedAccount,
    transactionsOfMostUsedAccount,
    mostUsedAccountTransactionCount,
    biggestGrowthAccount,
    biggestGrowthAccountTrend,
    biggestGrowthAccountGrowthRate,
    smallestGrowthAccount,
    smallestGrowthAccountTrend,
    smallestGrowthAccountGrowthRate,
    squeezedAccountTrend,
    accountTrendGrowthRate,
  };
}

const Page = () => {
  const [date, setDate] = React.useState<DateRange>({
    from: addMonths(new Date(), -1),
    to: new Date(),
  });
  const [transactions, setTransactions] = React.useState<Transaction[] | null | undefined>(null);
  const accounts = useLiveQuery(() => AccountService.getAllAccounts());
  const categories = useLiveQuery(() => CategoryService.getAllCategories());
  const [analyzedData, setAnalyzedData] = React.useState<ReturnType<typeof getAnalyzedData> | null | undefined>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const data = await TransactionService.getTransactionsByDate({
        lowerBound: new Date(date.from!.getFullYear(), date.from!.getMonth(), date.from!.getDate(), 0, 0, 0, 0),
        upperBound:
          date.to ?
            new Date(date.to!.getFullYear(), date.to!.getMonth(), date.to!.getDate(), 23, 59, 59, 999) :
            new Date(date.from!.getFullYear(), date.from!.getMonth(), date.from!.getDate(), 23, 59, 59, 999),
        sorted: true
      });
      if (isMounted) setTransactions(data);
    })();

    return () => { isMounted = false; }
  }, [date])

  useEffect(() => {
    setAnalyzedData(getAnalyzedData(accounts || [], transactions || [], date));
  }, [transactions])

  return (
    <CategoryContext.Provider value={categories || []}>
      <TransactionContext.Provider value={transactions}>
        <ContentContainer className={cn("flex flex-col gap-2 lg:gap-4 min-h-screen", inter.className)}>
          <DateRangePicker className="w-fit self-end"
            date={date!}
            setDate={setDate}
          />
          <div className="w-full grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-4">
            <AccountDataCards data={analyzedData || undefined} />
          </div>
          <div className="flex flex-col lg:grid lg:grid-cols-7 pb-0 px-0 gap-2 lg:gap-4 w-full">
            <div className="w-full flex flex-col gap-2 lg:gap-4 lg:col-span-5 relative">
              {analyzedData &&
                <TransactionAmountTrend
                  data={analyzedData.transactionTrend || []}
                />
              }
            </div>
            <div className="w-full lg:col-span-2">
              {analyzedData &&
                <DashboardAccountTrend
                  data={analyzedData.squeezedAccountTrend || []}
                  gR={analyzedData.accountTrendGrowthRate || 0}
                />
              }
              <IncomeTransactionChart className="h-fit" />
              <ExpenseTransactionChart className="h-fit" />
            </div>
          </div>
        </ContentContainer>
      </TransactionContext.Provider>
    </CategoryContext.Provider>
  );
}

const AccountDataCards = ({ data }: { data?: ReturnType<typeof getAnalyzedData> }) => {

  if (!data || !data.highestValuedAccount || !data.mostUsedAccount || !data.biggestGrowthAccount || !data.smallestGrowthAccount)
    return (
      <>
        <Card>
          <CardHeader>
            <Skeleton className="h-4 w-[140px]" />
            <Skeleton className="h-3 w-[100px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-[120px]" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-4 w-[140px]" />
            <Skeleton className="h-3 w-[100px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-[120px]" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-4 w-[140px]" />
            <Skeleton className="h-3 w-[100px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-[120px]" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-4 w-[140px]" />
            <Skeleton className="h-3 w-[100px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-[120px]" />
          </CardContent>
        </Card>
      </>
    )

  return (
    <>
      <SummaryCard
        title={`${data.highestValuedAccount?.name || ""}`}
        subHeading="Highest Valued Account by balance"
        description={formatCurrency(data.highestValuedAccount?.balance!) || ""}
        subDescription={`${data.highestValuedAccountGrowthRate}% change from ${formatDate(new Date(data.highestValuedAccountTrend[0]?.date || 0))}`}
        className="grid"
        svg={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        }
      />
      <SummaryCard
        title={`${data.mostUsedAccount?.name || ""}`}
        subHeading="Most Used Account by frequency"
        description={"+" + data.mostUsedAccountTransactionCount || ""}
        subDescription={`Transactions since ${formatDate(new Date(data.transactionsOfMostUsedAccount[data.transactionsOfMostUsedAccount.length - 1]?.date || 0))}`}
        className="grid"
        svg={
          <FaMoneyBill className="h-5 w-5 text-muted-foreground" />
        }
      />
      <SummaryCard
        title={`${data.biggestGrowthAccount?.name || ""}`}
        subHeading="Highest Growth Account by monthly balance"
        description={formatCurrency(data.biggestGrowthAccount?.balance!) || ""}
        subDescription={`${data.biggestGrowthAccountGrowthRate}% change from ${formatDate(new Date(data.biggestGrowthAccountTrend[0]?.date || 0))}`}
        className="grid"
        svg={
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            xmlns="http://www.w3.org/2000/svg"
            transform="matrix(1, 0, 0, 1, 0, 0)"
            className="h-4 w-4 text-muted-foreground"
          >
            <g id="SVGRepo_bgCarrier"></g>
            <g id="SVGRepo_tracerCarrier"></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M3 16.5L9 10L13 16L21 6.5"></path>
            </g>
          </svg>
        }
      />
      <SummaryCard
        title={`${data.smallestGrowthAccount?.name || ""}`}
        subHeading="Lowest Growth Account by monthly balance"
        description={formatCurrency(data.smallestGrowthAccount?.balance!) || ""}
        subDescription={`${data.smallestGrowthAccountGrowthRate.toFixed(2)}% change from ${formatDate(new Date(data.smallestGrowthAccountTrend[0]?.date || 0))}`}
        className="grid"
        svg={
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            xmlns="http://www.w3.org/2000/svg"
            transform="matrix(-1, 0, 0, 1, 0, 0)"
            className="h-4 w-4 text-muted-foreground"
          >
            <g id="SVGRepo_bgCarrier"></g>
            <g id="SVGRepo_tracerCarrier"></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M3 16.5L9 10L13 16L21 6.5"></path>
            </g>
          </svg>
        }
      />
    </>
  )
};

export default Page;