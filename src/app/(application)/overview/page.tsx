'use client';

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { SectionTitle } from '@/components/shared/Headers';
import { Card } from '@/components/ui/card';
import UpcomingTransactions from '@/components/analytics/UpcomingTransactions';
import { IncomeTransactionChart, ExpenseTransactionChart, TotalTransactionRadioChart } from '@/components/overview/TransactionChartSummary';
import { SelectedDateRangeContext, useSelectedDateRangeContext } from '@/hooks/use-selecteddaterange-context';
import SelectDateRange from '@/components/overview/SelectDateRange';
import { SelectedDateRange } from '@/services/analytics/props/date-range.props';
import ContentContainer from '@/components/common/ContentContainer';
import { TransactionAnalyticsService } from '@/services/analytics/transaction.analytics.service';
import AccountList from '@/components/overview/AccountList';
import { useLiveQuery } from 'dexie-react-hooks';
import { CategoryService } from '@/services/category.service';
import { TransactionContext, useTransactionContext } from '@/hooks/use-transaction-context';
import { CategoryContext } from '@/hooks/use-category-context';
import TransactionTrend from '@/components/transaction/TransactionTrend';
import IncomeTransactionTrend from '@/components/transaction/IncomeTransactionTrend';
import ExpenseTransactionTrend from '@/components/transaction/ExpenseTransactionTrend';
import useSettings from '@/hooks/use-settings';
import { getDateRangeFromSelectedRange } from '@/lib/analysis/getDateRangeFromSelectedRange';
import { Transaction } from '@/lib/db/db.model';
import { AccountAnalyticsService } from '@/services/analytics/account.analytics.service';

const Home = () => {
  const { settings } = useSettings();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      }).then(reg => {
        console.log('Service worker registered', reg)
      }).catch(err => {
        console.error('Service worker registration failed', err)
      });

      navigator.serviceWorker.ready.then(reg => {
        console.log('Service worker ready', reg.active)
        reg.active?.postMessage({ action: 'COMMIT_TRANSACTIONS' });
      }).catch(err => {
        console.error('On-Ready Message failed', err)
      });
    }
  }, []);

  return (
    <ContentContainer className="flex flex-col gap-2 min-h-screen">
      <br />
      <div className="flex flex-col md:flex-row md:flex-start pb-0 px-2 sm:px-2 gap-4">
        <Card className="flex flex-col items-center w-full md:w-1/2 md:items-start shadow-none px-4 pb-4 pt-0">
          <AccountList className="w-full" />
        </Card>
        <Card className="flex w-full h-fit md:w-1/2">
          <UpcomingTransactions className="p-3 md:p-4 border-0 bg-card-overview rounded-xl" limit={settings.upcomingTransactionLimit} />
        </Card>
      </div>
      <TransactionsOverview className="h-fit min-h-72 mx-2 p-4 rounded-xl bg-card-overview" />
    </ContentContainer>
  );
}

const TransactionsOverview = ({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  const [selectedDateRange, setSelectedDateRange] = React.useState<SelectedDateRange>(SelectedDateRange.MONTH);
  const [transactions, setTransactions] = React.useState<Transaction[] | null | undefined>(null);
  const categories = useLiveQuery(() => CategoryService.getAllCategories());

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const transactions = await TransactionAnalyticsService.getTransactionsBySelectedDateRange({ selectedDateRange: selectedDateRange });
      if (isMounted) setTransactions(transactions);
    })();

    return () => { isMounted = false; }
  }, [selectedDateRange])

  return (
    <SelectedDateRangeContext.Provider value={selectedDateRange}>
      <TransactionContext.Provider value={transactions}>
        <CategoryContext.Provider value={categories || []}>
          <div className={cn("flex flex-col gap-2 mt-4 relative", className)}>
            <SectionTitle className="text-secondary-foreground sr-only">Overview</SectionTitle>
            <SelectDateRange selectedDateRange={selectedDateRange} setSelectedDateRange={setSelectedDateRange}
              className="self-start border p-1.5 px-2.5 bg-background text-foreground rounded-xl shadow-xl absolute top-[-0.5rem] left-[-0.5rem]"
            />
            <div className="w-full md:w-full h-full flex flex-col md:flex-row max-h-none md:max-h-72 gap-4 *>*:bg-background">
              <Card className="flex justify-items-center items-center w-full">
                <TotalTransactionRadioChart />
              </Card>
              <Card className="flex items-center w-full">
                <IncomeTransactionChart />
              </Card>
              <Card className="flex items-center w-full">
                <ExpenseTransactionChart />
              </Card>
            </div>
            <Trends />
          </div>
        </CategoryContext.Provider>
      </TransactionContext.Provider>
    </SelectedDateRangeContext.Provider>
  )
}

const Trends = ({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  const transactions = useTransactionContext();
  const selectedDateRange = useSelectedDateRangeContext();

  const incomeExpenseTransactionAmount = React.useMemo(() => {
    const dateRange = getDateRangeFromSelectedRange(selectedDateRange);
    const trend = TransactionAnalyticsService.getIncomeExpenseTransactionAmount({ transactions: transactions || [], dateRange });
    return AccountAnalyticsService.squeezeTimeSeriesData(trend, 20);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions]);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <TransactionTrend className="w-full min-h-24"
        data={incomeExpenseTransactionAmount}
      />
      <IncomeTransactionTrend className="w-full min-h-24"
        data={incomeExpenseTransactionAmount}
      />
      <ExpenseTransactionTrend className="w-full min-h-24"
        data={incomeExpenseTransactionAmount}
      />
    </div>
  )
};

export default Home;