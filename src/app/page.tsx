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

const Home = () => {
  return (
    <div className="items-center justify-items-center min-h-screen p-4 px-0 sm:pb-10 sm:pt-2 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col md:flex-row md:flex-start px-4 pb-2 mb-1 gap-2">
        <Card className="flex flex-col items-center h-fit w-full md:w-5/12 md:items-start shadow-none px-4 pb-4 pt-0">
          <AccountList className="w-full gap-2 min-w-md" />
        </Card>
        <div className="flex h-fit min-h-56 max-h-72 w-full md:w-7/12 p-4 pt-0">
          <UpcomingTransactions className="w-full caption-top" limit={5} />
        </div>
      </div>
      <AccountsOverview />
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
    </div>
  );
}

const Header = ({ className }: { className?: string }) => {
  return (
    <div className={cn("", className)}>
      <h1 className="scroll-m-20 border-b pb-2 mb-2 text-2xl font-semibold tracking-tight first:mt-0">Finance Tracker</h1>
      <p className="text-muted-foreground">Welcome to the Finance Tracker app! This app will help you keep track of your finances.</p>
    </div>
  )
}

const AccountsOverview = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex h-fit min-h-72 w-full items-center content-center gap-2", className)}>
      <SectionTitle className="text-secondary-foreground sr-only">Overview</SectionTitle>
      <TransactionChartSummary className="p-2 py-4 mx-4" />
    </div>
  )
}

const TransactionSummary = ({ className }: { className?: string }) => {
  return (
    <div></div>
  )
}

const AccountList = ({ className }: { className?: string }) => {
  return (
    <Accordion type="single" collapsible className={cn("", className)} defaultValue="item-1">
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