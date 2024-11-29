'use client';

import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
} from "@/components/ui/table"
import { AccountController } from '../../hooks/account.controller';
import { Account } from '../../lib/db/db.model';
import { Skeleton } from '../ui/skeleton';
import { formatCurrency } from '../../lib/format/formatCurrency';
import { useLiveQuery } from 'dexie-react-hooks';

const AccountTable = () => {
  const accounts = useLiveQuery(() => AccountController.getAllAccounts());

  if (!accounts || accounts === undefined) {
    return (
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">
              <Skeleton className="h-4 w-auto" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
  }

  return (
    <Table>
      <TableBody>
        {accounts?.map((account: Account) => (
          <TableRow key={account.id}>
            <TableCell>{account.name}</TableCell>
            <TableCell className="text-right">{formatCurrency(account.balance ?? 0.00)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>
            Total:
          </TableCell>
          <TableCell className="text-right"> {formatCurrency(accounts?.reduce((acc, account) => acc + (account.balance ?? 0), 0) ?? 0)} </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}

export default AccountTable;
