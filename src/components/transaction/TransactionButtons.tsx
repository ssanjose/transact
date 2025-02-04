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
import { Transaction } from '@/lib/db/db.model';
import { useToast } from '@/hooks/use-toast';

interface TransactionButtonProps {
  button?: React.ReactNode;
  dialogProps?: typeof useDialog;
  title?: string;
  description?: string;
  visible?: boolean;
}

interface OpenTransactionButtonProps extends TransactionButtonProps {
  accountId: number;
}

interface EditTransactionButtonProps extends TransactionButtonProps {
  existingTransaction: Transaction;
}

interface DeleteTransactionButtonProps extends TransactionButtonProps {
  id: number;
  name?: string;
}

/**
 * Opens a dialog to create a new transaction
 * @param {React.ReactNode} button - The button to render
 * @param {number} accountId - The account id
 */
const OpenTransactionButton = ({ button, accountId, dialogProps }: OpenTransactionButtonProps) => {
  const dialog = useDialog();
  const openTransactionDialog = dialogProps ? dialogProps() : dialog;
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
      footer={null}
      noX
    >
      <TransactionForm onSave={openTransactionDialog.dismiss} accountId={accountId} />
    </DrawerDialog>
  )
};

const EditTransactionButton = ({
  button,
  dialogProps,
  title,
  existingTransaction,
  visible,
}: EditTransactionButtonProps) => {
  const dialog = useDialog();
  const editTransactionDialog = dialogProps ? dialogProps() : dialog;
  const buttonChildren = button || (
    <Button variant="ghost" size="icon" className={`px-2 w-full flex justify-start ${visible ? "block" : "hidden"}`} >
      <span>Edit a Transaction</span>
    </Button>
  );

  const GetDescription = (transaction: Transaction) => {
    let description: string;

    if (transaction.transactionId)
      description = "This transaction will become a standalone transaction upon edit.";
    else
      description = `
        This transaction will update all other related transactions upon edit. 
        Changing the frequency might also delete some transactions.
        `;
    return description;
  }

  return (
    <DrawerDialog
      triggerButton={buttonChildren}
      title={title ? title : ""}
      description={GetDescription(existingTransaction)}
      dialog={editTransactionDialog}
      footer={null}
      noX
    >
      <TransactionForm
        onSave={editTransactionDialog.dismiss}
        accountId={existingTransaction?.accountId || -1}
        existingTransaction={existingTransaction} />
    </DrawerDialog>
  )
}

const DeleteTransactionButton = ({ id, button, title, description, name, dialogProps, visible }: DeleteTransactionButtonProps) => {
  const dialog = useDialog();
  const deleteTransactionDialog = dialogProps ? dialogProps() : dialog;
  const { toast } = useToast();
  const buttonChildren = button || (
    <Button variant="link" size="icon" className="p-none w-min">
      <span>Delete Transaction</span>
    </Button>
  );

  const handleDelete = async (id?: number) => {
    try {
      const deleteTransaction = async () => {
        if (id === -1)
          return;

        if (id!) await TransactionService.deleteTransaction(id);
        await Sleep(500);
        toast({
          variant: "destructive",
          title: "Transaction Deleted",
          description: `Transaction has been deleted successfully. Dependent transactions have also been deleted.`,
          duration: 4000,
        });
      }
      deleteTransaction();
    } catch (e) {
      let result = (e as Error).message;
      if (typeof e === "string")
        result = e;
      else if (e instanceof Error)
        result = e.message;

      toast({
        variant: "destructive",
        title: "Error",
        description: result,
        duration: 4000,
      });
    }
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

export {
  OpenTransactionButton,
  EditTransactionButton,
  DeleteTransactionButton
};