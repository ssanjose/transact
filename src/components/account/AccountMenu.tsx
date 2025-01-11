'use client';

import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { EllipsisVerticalIcon } from 'lucide-react';
import { Account } from '@/lib/db/db.model';
import { OpenAccountButton, DeleteAccountButton, EditAccountButton } from '@/components/account/AccountButtons';

const AccountMenu = ({ account }: { account?: Account }) => {
  // Menu items.
  const existingAccountMenu = [
    {
      content: <EditAccountButton
        title="Edit an Account"
        existingAccount={account}
      />
    },
    {
      content: <DeleteAccountButton id={account?.id} />
    }
  ]

  const newAccountMenu = [
    {
      content:
        <OpenAccountButton
          button={
            <Button variant="ghost" size="icon" className="px-2 w-full flex justify-start" >
              <span>Create an Account</span>
            </Button>
          }
          title="Create a new Account"
          description=""
        />
    },
  ]

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="size-8"><EllipsisVerticalIcon /></Button>
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