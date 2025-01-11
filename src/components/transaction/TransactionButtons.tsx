'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { DrawerDialog } from '@/components/shared/ResponsiveDrawerDialog';
import { useDialog } from '@/hooks/use-dialog';
import TransactionForm from './TransactionForm';
import { TransactionService } from '@/services/transaction.service';
import { Sleep } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';

interface TransactionButtonProps {
  button?: React.ReactNode;
  dialogProps?: typeof useDialog;
  title?: string;
  description?: string;
}

interface OpenTransactionButtonProps extends TransactionButtonProps {
  accountId: number;
}

interface DeleteTransactionButtonProps extends TransactionButtonProps {
  id: number;
  name?: string;
  visible?: boolean;
}

/**
 * Opens a dialog to create a new transaction
 * @param {React.ReactNode} button - The button to render
 * @param {number} accountId - The account id
 */
const OpenTransactionButton = ({ button, accountId, dialogProps }: OpenTransactionButtonProps) => {
  const openTransactionDialog = dialogProps ? dialogProps() : useDialog();
  const buttonChildren = button || (
    <Button size="icon" className="px-2 py-0 w-min text-xs leading-tight h-7 sm:p-2 sm:text-sm sm:leading-3 sm:h-8">
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

const DeleteTransactionButton = ({ id, button, title, description, name, dialogProps, visible }: DeleteTransactionButtonProps) => {
  const deleteTransactionDialog = dialogProps ? dialogProps() : useDialog();
  const buttonChildren = button || (
    <Button variant="link" size="icon" className="p-none w-min">
      <span>Delete Transaction</span>
    </Button>
  );

  const handleDelete = async (id?: number) => {
    const deleteTransaction = async () => {
      if (id === -1)
        return;

      if (id!)
        await TransactionService.deleteTransaction(id);
      await Sleep(500);
    }

    deleteTransaction();
    deleteTransactionDialog.dismiss();
  }

  return (
    <AlertDialog {...deleteTransactionDialog.dialogProps}>
      <AlertDialogTrigger asChild
        className={visible ? "block" : "hidden"}
      >{buttonChildren}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold">
            {title ? title : "Are you sure you want to delete this transaction?"}
            {name ? `: ${name}` : ""}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {description ? description : "This action cannot be undone. This will permanently delete the transaction and all associated data such other transactions related to this transaction by frequency."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDelete(id)}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
};

export { OpenTransactionButton, DeleteTransactionButton };