'use client';

import React, { useState } from 'react';
import { useParams } from "next/navigation";
import TransactionTable from '@/components/transaction/TransactionTable';
import TransactionDetails from '@/components/transaction/TransactionDetails';
import TransactionForm from '@/components/transaction/TransactionForm';
import { DrawerDialog } from '@/components/shared/ResponsiveDrawerDialog';
import { Button } from '@/components/ui/button';

const Page = () => {
  const [transactionId, setTransactionId] = useState<number>(-1);
  const accountId = parseInt(useParams<{ id: string }>().id);
  const [transactionForm, setTransactionForm] = useState<boolean>(false);

  const handleCreateTransaction = () => {
    setTransactionForm(!transactionForm);
  }

  return (
    <div className="min-h-screen p-4 gap-16 sm:p-10 sm:pt-2 font-[family-name:var(--font-geist-sans)]">
      <div className="flex relative top-0">
        <div className="md:w-3/4 w-full p-2 sm:p-4">
          <div className="flex flex-start justify-between min-w-sm mb-2">
            <h1>Transaction for Account ID: {accountId}</h1>
            <DrawerDialog
              mobileContent={<TransactionForm onSave={handleCreateTransaction} className="px-4" accountId={accountId} />}
              triggerButton={<Button size="icon" className="p-2 w-min">
                <span>Add Transaction</span>
              </Button>}
              title="Transaction"
              description="Add a new transaction"
              open={transactionForm}
              onOpenChange={setTransactionForm}
            >
              <TransactionForm onSave={handleCreateTransaction} accountId={accountId} />
            </DrawerDialog>
          </div>
          <TransactionTable id={accountId} setTransactionId={setTransactionId} />
          <div className="sticky min-h-24 bottom-0 margin-2 bg-white">
            test
          </div>
        </div>
        <div className="hidden md:block w-1/4 h-fit sticky pt-2 sm:pt-4 top-0">
          <TransactionDetails id={transactionId} className="p-2 sm:p-4 min-h-80 border rounded" />
        </div>
      </div>
    </div>
  );
}

export default Page;
