'use client';

import React, { useEffect } from 'react';
import ContentContainer from '@/components/common/ContentContainer';
import { Card } from '@/components/ui/card';
import UpcomingTransactions from '@/components/shared/UpcomingTransactions';
import RecentTransactions from '@/components/analytics/RecentTransactions';
import { cn } from '@/lib/utils';
import DateRangePicker from '@/components/analytics/DateRangePicker';
import { addMonths } from 'date-fns';
import { Transaction } from '@/lib/db/db.model';
import { TransactionService } from '@/services/transaction.service';
import { ExpenseTransactionChart, IncomeTransactionChart } from '@/components/overview/TransactionChartSummary';
import { DateRange } from 'react-day-picker';
import { TransactionContext } from '@/hooks/use-transaction-context';
import { useLiveQuery } from 'dexie-react-hooks';
import { CategoryService } from '@/services/category.service';
import { CategoryContext } from '@/hooks/use-category-context';

const Page = () => {
  const [date, setDate] = React.useState<DateRange>({
    from: addMonths(new Date(), -1),
    to: new Date(),
  });
  const [transactions, setTransactions] = React.useState<Transaction[] | null | undefined>(null);
  const categories = useLiveQuery(() => CategoryService.getAllCategories());

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

  return (
    <CategoryContext.Provider value={categories || []}>
      <TransactionContext.Provider value={transactions}>
        <ContentContainer className="flex flex-col gap-2 min-h-screen pt-4">
          <div className="block lg:grid lg:grid-cols-3 pb-0 px-2 sm:px-2 gap-4 w-full">
            <div className="w-full lg:col-span-2 relative">
              <DateRangePicker className="w-fit block lg:absolute top-0 right-0"
                date={date!}
                setDate={setDate}
              />
              <div className="w-full block lg:grid lg:grid-cols-2 gap-2 mt-10">
                <IncomeTransactionChart className="w-full" />
                <ExpenseTransactionChart className="w-full" />
              </div>
            </div>
            <TransactionsOverview className="w-full lg:col-span-1" />
          </div>
        </ContentContainer>
      </TransactionContext.Provider>
    </CategoryContext.Provider>
  );
}

const TransactionsOverview = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex flex-col gap-4 relative", className)}>
      <Card className="w-full">
        <UpcomingTransactions className="p-4 pb-0 border rounded-xl bg-card-overview" limit={3} />
      </Card>
      <Card className="w-full">
        <RecentTransactions className="p-4 pb-0 border rounded-xl bg-card-overview" limit={3} />
      </Card>
    </div>
  )
}

export default Page;