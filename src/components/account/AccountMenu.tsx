'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { EllipsisVerticalIcon } from 'lucide-react';
import { DrawerDialog } from '@/components/shared/ResponsiveDrawerDialog';
import { AccountForm } from './AccountForm';
import { Account } from '@/lib/db/db.model';

const AccountMenu = ({ account }: { account?: Account }) => {
  const [accountForm, setAccountForm] = React.useState(false);

  const handleEditAccount = () => {
    setAccountForm(!accountForm);
  }

  // Menu items.
  const existingAccountMenu = [
    {
      title: "Edit Account",
      content:
        <DrawerDialog
          mobileContent={< AccountForm onSave={handleEditAccount} />}
          triggerButton={
            <Button variant="ghost" size="icon" className="px-2 w-full flex justify-start" >
              <span>Edit Account</span>
            </Button>
          }
          title="Edit Account"
          description=""
          open={accountForm}
          onOpenChange={setAccountForm}
        >
          <AccountForm onSave={handleEditAccount} existingAccount={account} />
        </DrawerDialog>
      ,
    },
  ]

  const newAccountMenu = [
    {
      title: "Create Account",
    },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost"><EllipsisVerticalIcon /></Button>
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
            <DropdownMenuItem key={index}>{item.title}</DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default AccountMenu;