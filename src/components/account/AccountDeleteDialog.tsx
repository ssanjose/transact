'use client';

import React from 'react';
import { Sleep } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { AccountService } from '@/services/account.service';
import { useRouter } from 'next/navigation';

interface AccountDeleteDialogProps {
  id?: number;
}

const AccountDeleteDialog = ({ id }: AccountDeleteDialogProps) => {
  const router = useRouter();

  const handleDelete = async (id?: number) => {
    const getTransaction = async () => {
      if (id!)
        await AccountService.deleteAccount(id);
      await Sleep(500);
    }
    getTransaction();
    router.push('/');
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="px-2 w-full flex justify-start" disabled={!id}>
          <span>Delete Account</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold"> Are you sure you want to delete this account?</AlertDialogTitle>
          <AlertDialogDescription className="text-sm">
            This action cannot be undone. This will permanently delete the account and all associated transactions.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDelete(id)}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AccountDeleteDialog;

