'use client';

import React, { useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AccountTable from '@/components/overview/AccountTable';
import { cn } from '@/lib/utils';
import { SectionTitle } from '@/components/shared/Headers';
import { Card } from '@/components/ui/card';
import UpcomingTransactions from '@/components/shared/UpcomingTransactions';
import { ExpenseTransactionChart, IncomeTransactionChart, TotalTransactionRadioChart } from '@/components/overview/TransactionChartSummary';
import { OpenAccountButton } from '@/components/account/AccountButtons';
import { SelectedDateRangeContext } from '@/hooks/use-selecteddaterange-context';
import SelectDateRange from '@/components/overview/SelectDateRange';
import { SelectedDateRange } from '@/services/analytics/props/date-range.props';
import ContentContainer from '@/components/common/ContentContainer';
import { Transaction } from '@/lib/db/db.model';
import { TransactionAnalyticsService } from '@/services/analytics/transaction.analytics.service';
import { TransactionContext } from '@/hooks/use-transaction-context';

const Home = () => {
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

const TransactionsOverview = ({ className }: { className?: string }) => {
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

const AccountList = ({ className }: { className?: string }) => {
  return (
    <Accordion type="single" collapsible className={cn("gap-2", className)} defaultValue="item-1">
      <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger className="border-b">Accounts</AccordionTrigger>
        <AccordionContent>
          <AccountTable />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" className="w-fit border-none">
        <OpenAccountButton />
      </AccordionItem>
    </Accordion >
  )
}

export default Home;