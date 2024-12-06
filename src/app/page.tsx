'use client';

import React, { Suspense } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AccountForm from '@/components/account/AccountForm';
import { Button } from '@/components/ui/button';
import { CirclePlus } from 'lucide-react';
import AccountTable from '@/components/overview/AccountTable';
import { DrawerDialog } from '@/components/shared/ResponsiveDrawerDialog';

const Home = () => {
  return (
    <div className="items-center justify-items-center min-h-screen p-8 gap-16 sm:p-10 sm:pt-2 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col gap-8 items-center sm:items-start">
        <div className="flex flex-col gap-2">
          <h1 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">Finance Tracker</h1>
          <p>Welcome to the Finance Tracker app! This app will help you keep track of your finances.</p>
        </div>
        <AccountList />
      </div>
    </div>
  );
}

const AccountList = () => {
  return (
    <Accordion type="single" collapsible className="flex flex-col w-full gap-2 max-w-xl border rounded p-4" defaultValue="item-1">
      <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger className="border-b">Accounts</AccordionTrigger>
        <AccordionContent>
          <AccountTable />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" className="w-fit border-none">
        <DrawerDialog
          mobileContent={<AccountForm className="px-4" />}
          triggerButton={
            <Button variant="link" size="icon" className="p-none w-min">
              <span>Open account</span>
              <CirclePlus />
            </Button>
          }
          title="Account"
          description="Create a new account"
        >
          <AccountForm />
        </DrawerDialog>
      </AccordionItem>
    </Accordion>
  )
}

export default Home;