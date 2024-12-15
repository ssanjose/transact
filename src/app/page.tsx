'use client';

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AccountForm } from '@/components/account/AccountForm';
import { Button } from '@/components/ui/button';
import { CirclePlus } from 'lucide-react';
import AccountTable from '@/components/overview/AccountTable';
import { DrawerDialog } from '@/components/shared/ResponsiveDrawerDialog';
import { cn } from '@/lib/utils';
import { SectionTitle } from '@/components/shared/Headers';
import ExpenseIncomeRadioChart from '../components/overview/ExpenseIncomeRadioChart';
import { Card } from '@/components/ui/card';
import { useDialog } from '@/hooks/use-dialog';
import UpcomingTransactions from '@/components/shared/UpcomingTransactions';

const Home = () => {
  return (
    <div className="items-center justify-items-center min-h-screen p-4 sm:p-10 sm:pt-2 font-[family-name:var(--font-geist-sans)]">
      <Header className="flex flex-col mb-2" />
      <div className="flex flex-col md:flex-row md:flex-start mb-6 md:mb-12 gap-4">
        <div className="flex flex-col items-center w-full md:w-1/2 md:items-start">
          <AccountList className="w-full gap-2 max-w-2xl min-w-md border rounded p-4" />
        </div>
        <div className="flex min-h-72 max-h-80 w-full md:w-1/2">
          <UpcomingTransactions className="w-full caption-top" />
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
    <div className={cn("flex flex-col h-80 min-h-96 justify-center w-full", className)}>
      <SectionTitle className="text-secondary-foreground sr-only">Overview</SectionTitle>
      <div className="h-full w-full md:w-4/5 self-center">
        <div className="w-full h-full flex gap-6">
          <div className="w-full flex flex-col md:flex-row gap-6">
            <Card className="flex items-center justify-content-center h-fit sm:h-1/2 w-full p-0 rounded-none border-none shadow-none bg-emerald-50">
              <ExpenseIncomeRadioChart />
            </Card>
            <Card className="flex p-2 items-center justify-content-center h-1/2 w-full border-none shadow-none bg-cyan-50"></Card>
            <Card className="flex p-2 items-center justify-content-center h-1/2 w-full border-none shadow-none bg-green-50"></Card>
          </div>
        </div>
      </div>
    </div>
  )
}

const TransactionSummary = ({ className }: { className?: string }) => {
  return (
    <div></div>
  )
}

const AccountList = ({ className }: { className?: string }) => {
  const createAccountDialog = useDialog();

  return (
    <Accordion type="single" collapsible className={cn("", className)} defaultValue="item-1">
      <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger className="border-b">Accounts</AccordionTrigger>
        <AccordionContent>
          <AccountTable />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" className="w-fit border-none">
        <DrawerDialog
          mobileContent={<AccountForm onSave={createAccountDialog.dismiss} />}
          triggerButton={
            <Button variant="link" size="icon" className="p-none w-min">
              <span>Open account</span>
              <CirclePlus />
            </Button>
          }
          title="Create a new Account"
          description=""
          dialog={createAccountDialog}
        >
          <AccountForm onSave={createAccountDialog.dismiss} />
        </DrawerDialog>
      </AccordionItem>
    </Accordion >
  )
}

export default Home;