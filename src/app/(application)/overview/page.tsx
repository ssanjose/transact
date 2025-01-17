'use client';

import React from 'react';
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
import TransactionChartSummary from '@/components/overview/TransactionChartSummary';
import { OpenAccountButton } from '@/components/account/AccountButtons';
import { SelectedDateRangeContext } from '@/hooks/use-selecteddaterange-context';
import SelectDateRange from '@/components/overview/SelectDateRange';
import { SelectedDateRange } from '@/services/analytics/props/date-range.props';
import ContentContainer from '@/components/common/ContentContainer';

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
        <div className="flex h-fit min-h-56 w-full md:w-1/2">
          <UpcomingTransactions className="p-4 pb-1 border rounded-xl bg-card-overview" limit={4} />
        </div>
      </div>
      <TransactionsOverview className="h-fit min-h-72" />
      <div>
        <SectionTitle>Trends</SectionTitle>
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
    </ContentContainer>
  );
}

const TransactionsOverview = ({ className }: { className?: string }) => {
  const [selectedDateRange, setSelectedDateRange] = React.useState<SelectedDateRange>(SelectedDateRange.DAY);

  return (
    <SelectedDateRangeContext.Provider value={selectedDateRange}>
      <div className={cn("flex flex-col mx-4 gap-2", className)}>
        <SectionTitle className="text-secondary-foreground sr-only">Overview</SectionTitle>
        <SelectDateRange selectedDateRange={selectedDateRange} setSelectedDateRange={setSelectedDateRange}
          className="self-start"
        />
        <TransactionChartSummary className="w-full h-full" />
      </div>
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