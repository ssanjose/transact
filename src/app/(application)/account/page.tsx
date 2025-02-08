'use client';

import React from 'react';
import ContentContainer from '@/components/common/ContentContainer';
import { Card } from '@/components/ui/card';
import { AccountList } from '@/components/overview/AccountTable';
import UpcomingTransactions from '@/components/analytics/UpcomingTransactions';
import RecentTransactions from '@/components/analytics/RecentTransactions';
import useSettings from '@/hooks/use-settings';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ScrollAreaScrollbar } from '@radix-ui/react-scroll-area';

const Page = () => {

  return (
    <ContentContainer className="flex flex-col gap-2 min-h-screen">
      <br />
      <div className="block md:grid md:grid-cols-2 pb-0 px-0 sm:px-2 space-y-4 md:space-y-0 md:space-x-4 w-full">
        <Card className="cols-span-1 items-center h-fit md:items-start shadow-none px-4 pb-4 pt-0">
          <AccountList className="w-full" />
        </Card>
        <div className="cols-span-1">
          <TransactionCarousel />
        </div>
      </div>
    </ContentContainer>
  )
};

const TransactionCarousel = () => {
  const { settings } = useSettings();

  return (
    <ScrollArea className="relative w-96 sm:w-full">
      <div className="flex w-max space-x-4">
        <UpcomingTransactions className="p-3 md:p-4 w-[80%] h-fit sm:w-full border rounded-xl bg-card-overview shrink-0" limit={settings.upcomingTransactionLimit} />
        <RecentTransactions className="p-3 md:p-4 w-[80%] h-fit sm:w-full border rounded-xl bg-card-overview shrink-0" limit={settings.recentTransactionLimit} />
      </div>
      <ScrollAreaScrollbar orientation="horizontal" />
    </ScrollArea>
  )
}

export default Page;