'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { DrawerDialog } from '@/components/shared/ResponsiveDrawerDialog';
import { useDialog } from '@/hooks/use-dialog';
import TransactionForm from './TransactionForm';

interface TransactionButtonProps {
  button?: React.ReactNode;
  accountId: number;
  dialogProps?: typeof useDialog;
}

/**
 * Opens a dialog to create a new transaction
 * @param {React.ReactNode} button - The button to render
 * @param {number} accountId - The account id
 */
const OpenTransactionButton = ({ button, accountId, dialogProps }: TransactionButtonProps) => {
  const openTransactionDialog = dialogProps ? dialogProps() : useDialog();
  const buttonChildren = button || (
    <Button size="icon" className="px-2 py-0 w-min text-xs leading-tight h-7 sm:p-2 sm:text-sm sm:leading-3 sm:h-9">
      <span>Add Transaction</span>
    </Button>
  );

  return (
    <DrawerDialog
      triggerButton={buttonChildren}
      title="Transaction"
      description="Add a new transaction"
      dialog={openTransactionDialog}
    >
      <TransactionForm onSave={openTransactionDialog.dismiss} accountId={accountId} />
    </DrawerDialog>
  )
};

export { OpenTransactionButton };