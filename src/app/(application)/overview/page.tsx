'use client';

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { SectionTitle } from '@/components/shared/Headers';
import { Card } from '@/components/ui/card';
import UpcomingTransactions from '@/components/shared/UpcomingTransactions';
import { ExpenseTransactionChart, IncomeTransactionChart, TotalTransactionRadioChart } from '@/components/overview/TransactionChartSummary';
import { SelectedDateRangeContext } from '@/hooks/use-selecteddaterange-context';
import SelectDateRange from '@/components/overview/SelectDateRange';
import { SelectedDateRange } from '@/services/analytics/props/date-range.props';
import ContentContainer from '@/components/common/ContentContainer';
import { Transaction } from '@/lib/db/db.model';
import { TransactionAnalyticsService } from '@/services/analytics/transaction.analytics.service';
import { TransactionContext } from '@/hooks/use-transaction-context';
import { AccountList } from '@/components/overview/AccountTable';

const Home = () => {
  // useEffect(() => {
  //   let interval: NodeJS.Timeout;
  //   if ('serviceWorker' in navigator) {
  //     navigator.serviceWorker.register('/analyticsWorker.js', {
  //       scope: '/',
  //     }).then(reg => {
  //       console.log('Service worker registered', reg)

  //       reg.active?.addEventListener('message', e => {
  //         console.log('Message from worker', e);
  //       });

  //       return () => {
  //         clearInterval(interval);
  //         reg.active?.removeEventListener('message', e => {
  //           console.log(e)
  //         });
  //       }
  //     }).catch(err => {
  //       console.error('Service worker registration failed', err)
  //     });

  //     navigator.serviceWorker.ready.then(reg => {
  //       reg.active?.postMessage('yo wassup');

  //       interval = setInterval(() => {
  //         reg.active?.postMessage("Hello, worker!");
  //         // worker?.postMessage({ bitches: 'hell no' })
  //         console.log('Sent message to worker', reg.active)
  //       }, 20000);
  //     });

  //     console.log('Service worker ready', navigator.serviceWorker.controller)
  //   }
  // }, []);

  return (
    <ContentContainer className="flex flex-col gap-2 min-h-screen">
      <div className="flex flex-start justify-between flex relative top-0 px-2 pt-2 sm:px-2">
        <div className="sm:pb-2 w-full">
          <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Overview
          </h1>
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:flex-start pb-0 px-2 sm:px-2 gap-4">
        <Card className="flex flex-col items-center h-fit w-full md:w-1/2 md:items-start shadow-none px-4 pb-4 pt-0">
          <AccountList className="w-full min-w-md" />
        </Card>
        <div className="flex w-full md:w-1/2">
          <UpcomingTransactions className="p-4 pb-1 border rounded-xl bg-card-overview" limit={3} />
        </div>
      </div>
      <TransactionsOverview className="h-fit min-h-72 mx-2 p-4 rounded-xl bg-card-overview" />
    </ContentContainer>
  );
}

const TransactionsOverview = ({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  const [selectedDateRange, setSelectedDateRange] = React.useState<SelectedDateRange>(SelectedDateRange.DAY);
  const [transactions, setTransactions] = React.useState<Transaction[] | null | undefined>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const data = await TransactionAnalyticsService.getTransactionsByDateRange({ dateRange: selectedDateRange });
      if (isMounted) setTransactions(data);
    })();

    return () => { isMounted = false; }
  }, [selectedDateRange])

  return (
    <SelectedDateRangeContext.Provider value={selectedDateRange}>
      <TransactionContext.Provider value={transactions}>
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
          <div className="flex flex-col gap-2">
            <Card className="w-full min-h-24">
              <h1>Total</h1>
            </Card>
            <Card className="w-full min-h-24">
              <h1>Income</h1>
            </Card>
            <Card className="w-full min-h-24">
              <h1>Expenses</h1>
            </Card>
          </div>
        </div>
      </TransactionContext.Provider>
    </SelectedDateRangeContext.Provider>
  )
}

export default Home;