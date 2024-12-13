'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { EllipsisVerticalIcon } from 'lucide-react';
import { DrawerDialog } from '@/components/shared/ResponsiveDrawerDialog';
import { AccountForm } from './AccountForm';
import { Account } from '@/lib/db/db.model';
import AccountDeleteDialog from './AccountDeleteDialog';

const AccountMenu = ({ account }: { account?: Account }) => {
  const [accountForm, setAccountForm] = React.useState(false);

  const handleAccount = () => {
    setAccountForm(!accountForm);
  }

  // Menu items.
  const existingAccountMenu = [
    {
      title: "Edit an Account",
      content:
        <DrawerDialog
          mobileContent={< AccountForm onSave={handleAccount} existingAccount={account} />}
          triggerButton={
            <Button variant="ghost" size="icon" className="px-2 w-full flex justify-start" >
              <span>Edit an Account</span>
            </Button>
          }
          title="Edit an Account"
          description=""
          open={accountForm}
          onOpenChange={setAccountForm}
        >
          <AccountForm onSave={handleAccount} existingAccount={account} />
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
          mobileContent={< AccountForm onSave={handleAccount} />}
          triggerButton={
            <Button variant="ghost" size="icon" className="px-2 w-full flex justify-start" >
              <span>Create Account</span>
            </Button>
          }
          title="Create an Account"
          description=""
          open={accountForm}
          onOpenChange={setAccountForm}
        >
          <AccountForm onSave={handleAccount} />
        </DrawerDialog>
    },
  ]

  return (
    <DropdownMenu>
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