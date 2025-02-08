'use client';

import React, { useEffect } from 'react';
import ContentContainer from '@/components/common/ContentContainer';
import UpcomingTransactions from '@/components/analytics/UpcomingTransactions';
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
import useSettings from '@/hooks/use-settings';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ScrollAreaScrollbar } from '@radix-ui/react-scroll-area';

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
            <TransactionCarousel />
          </div>
        </ContentContainer>
      </TransactionContext.Provider>
    </CategoryContext.Provider>
  );
}

const TransactionCarousel = () => {
  const { settings } = useSettings();

  return (
    <ScrollArea className="relative w-96 sm:w-full">
      <div className="flex w-max space-x-4">
        <UpcomingTransactions className="p-3 md:p-4 w-[80%] h-fit pb-1 border rounded-xl bg-card-overview shrink-0" limit={settings.upcomingTransactionLimit} />
        <RecentTransactions className="p-3 md:p-4 w-[80%] h-fit pb-1 border rounded-xl bg-card-overview shrink-0" limit={settings.recentTransactionLimit} />
      </div>
      <ScrollAreaScrollbar orientation="horizontal" />
    </ScrollArea>
  )
}

export default Page;