'use client';

import React from 'react';
import ContentContainer from '@/components/common/ContentContainer';
import { Card } from '@/components/ui/card';
import { AccountList } from '@/components/overview/AccountTable';
import UpcomingTransactions from '@/components/shared/UpcomingTransactions';
import RecentTransactions from '@/components/analytics/RecentTransactions';

const Page = () => {
  return (
    <ContentContainer className="flex flex-col gap-2 min-h-screen">
      <br />
      <div className="flex flex-col md:grid md:grid-cols-2 pb-0 px-2 sm:px-2 gap-2">
        <Card className="cols-span-1 items-center h-fit md:items-start shadow-none px-4 pb-4 pt-0">
          <AccountList className="w-full min-w-md" />
        </Card>
        <div className="cols-span-1 space-y-2">
          <UpcomingTransactions className="p-4 pb-1 border rounded-xl bg-card-overview" limit={3} />
          <RecentTransactions className="p-4 pb-1 border rounded-xl bg-card-overview" limit={3} />
        </div>
      </div>
    </ContentContainer>
  )
};

export default Page;