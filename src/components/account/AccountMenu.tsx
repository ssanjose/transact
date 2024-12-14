'use client';

import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { EllipsisVerticalIcon } from 'lucide-react';
import { DrawerDialog } from '@/components/shared/ResponsiveDrawerDialog';
import { AccountForm } from '@/components/account/AccountForm';
import { Account } from '@/lib/db/db.model';
import AccountDeleteDialog from '@/components/account/AccountDeleteDialog';
import { useDialog } from '@/hooks/use-dialog';

const AccountMenu = ({ account }: { account?: Account }) => {
  const editAccountDialog = useDialog();
  const createAccountDialog = useDialog();

  // Menu items.
  const existingAccountMenu = [
    {
      title: "Edit an Account",
      content:
        <DrawerDialog
          mobileContent={<AccountForm onSave={editAccountDialog.dismiss} existingAccount={account} />}
          triggerButton={
            <Button variant="ghost" size="icon" className="px-2 w-full flex justify-start" >
              <span>Edit an Account</span>
            </Button>
          }
          title="Edit an Account"
          description=""
          dialog={editAccountDialog}
        >
          <AccountForm onSave={editAccountDialog.dismiss} existingAccount={account} />
        </DrawerDialog>
      ,
    },
    {
      title: "Delete an Account",
      content:
        <AccountDeleteDialog id={account?.id} />
    }
  ]

  const newAccountMenu = [
    {
      title: "Create Account",
      content:
        <DrawerDialog
          mobileContent={<AccountForm onSave={createAccountDialog.dismiss} />}
          triggerButton={
            <Button variant="ghost" size="icon" className="px-2 w-full flex justify-start" >
              <span>Create an Account</span>
            </Button>
          }
          title="Create an Account"
          description=""
          dialog={createAccountDialog}
        >
          <AccountForm onSave={createAccountDialog.dismiss} />
        </DrawerDialog>
    },
  ]

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost"><EllipsisVerticalIcon className="h-9 w-9" /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[200px]">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {existingAccountMenu.map((item, index) => (
            <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()} key={index}>{item.content}</DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {newAccountMenu.map((item, index) => (
            <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()} key={index}>{item.content}</DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default AccountMenu;