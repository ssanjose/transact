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

const AccountList = () => {
  const [showForm, setShowForm] = useState(false);

  const toggleFormVisibility = () => {
    setShowForm(!showForm);
  };

  const handleCreateAccount = async () => {
    setShowForm(false);
  };

  return (
    <Accordion type="single" collapsible className="flex flex-col w-full gap-2" defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger className="border-b">Accounts</AccordionTrigger>
        <AccordionContent>
          <AccountTable />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" className="w-fit border-none">
        <Button variant="link" size="icon" className="p-none w-min" onClick={toggleFormVisibility}>
          <span>{showForm ? 'Hide Form' : 'Open account'}</span>
          <CirclePlus />
        </Button>
        {showForm && <AccountForm onCreate={handleCreateAccount} />}
      </AccordionItem>
    </Accordion>
  )
}

export default AccountList;