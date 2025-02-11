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

const getAnalyzedData = (accounts: Account[], transactions: Transaction[], dateRange: DateRange) => {
  const accountTrend = AccountAnalyticsService.getAccountTrend(accounts, transactions);
  const transactionTrend = AccountAnalyticsService.squeezeTimeSeriesData(
    TransactionAnalyticsService.getTransactionAmount({ transactions, dateRange }),
    12
  );

  const incomeExpense = TransactionAnalyticsService.getIncomeExpenseTransactionAmount({ transactions, dateRange });
  const highestValuedAccount = AccountAnalyticsService.getHighestValuedAccount(accounts);
  const mostUsedAccount = AccountAnalyticsService.getMostUsedAccount(accounts, transactions);
  const biggestGrowthAccount = AccountAnalyticsService.getBiggestGrowthAccount(accounts);

  const squeezedAccountTrend = AccountAnalyticsService.squeezeTimeSeriesData(accountTrend, 12);

  const accountTrendGrowthRate = TransactionAnalyticsService.calculateGrowthRate(
    squeezedAccountTrend[0]?.accountAmount,
    squeezedAccountTrend[squeezedAccountTrend.length - 1]?.accountAmount
  )

  return {
    accountTrend,
    transactionTrend,
    incomeExpense,
    highestValuedAccount,
    mostUsedAccount,
    biggestGrowthAccount,
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
        <ContentContainer className="flex flex-col gap-2 min-h-screen">
          <DateRangePicker className="w-fit self-end"
            date={date!}
            setDate={setDate}
          />
          <div className="block lg:grid lg:grid-cols-3 pb-0 px-0 gap-4 w-full">
            <div className="w-full flex flex-col gap-4 lg:col-span-2 relative">
              <div className="w-full block lg:grid lg:grid-cols-3 gap-4">
                {analyzedData && <AccountDataCards data={analyzedData} />}
              </div>
              {analyzedData &&
                <TransactionAmountTrend
                  data={analyzedData.transactionTrend || []}
                />
              }
            </div>
            <div className="w-full lg:col-span-1">
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

const AccountDataCards = ({ data }: { data: ReturnType<typeof getAnalyzedData> }) => {

  if (!data) return null;

  return (
    <>
      <SummaryCard
        title="Highest Valued Account"
        subHeading="By balance"
        description={data?.highestValuedAccount?.name || "No Account"}
        className="grid"
      />
      <SummaryCard
        title="Most Used Account"
        subHeading="By number of transactions"
        description={data?.mostUsedAccount?.name || "No Account"}
        className="grid"
      />
      <SummaryCard
        title="Highest Growth Account"
        subHeading="By monthly starting balance"
        description={data?.biggestGrowthAccount?.name || "No Account"}
        className="grid"
      />
    </>
  )
};

export default Page;