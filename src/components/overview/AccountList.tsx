'use client';

import React, { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AccountForm from '@/components/account/AccountForm';
import { Button } from '../ui/button';
import { CirclePlus } from 'lucide-react';
import AccountTable from './AccountTable';
import { DrawerDialog } from '../shared/ResponsiveDrawerDialog';

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

export default AccountList;