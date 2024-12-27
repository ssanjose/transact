'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
} from "@/components/ui/table"
import { AccountService } from '../../services/account.service';
import { Account } from '../../lib/db/db.model';
import { Skeleton } from '../ui/skeleton';
import { formatCurrency } from '../../lib/format/formatCurrency';
import { useLiveQuery } from 'dexie-react-hooks';
import { buttonVariants } from '../ui/button';
import Link from 'next/link';
import { SquarePen } from 'lucide-react';

const AccountTable = () => {
  const accounts = useLiveQuery(() => AccountService.getAllAccounts());
  if (!accounts || accounts === undefined) {
    return <AccountTableSkeleton />
  }

  return (
    <Table>
      <TableBody>
        {accounts?.map((account: Account) => (
          <TableRow
            key={account.id}
            className="cursor-pointer hover:bg-accent"
            onClick={() => window.location.href = `/transaction/${account.id}`}
          >
            <TableCell>{account.name}</TableCell>
            <TableCell className="text-right">{formatCurrency(account.balance ?? 0.00)}</TableCell>
            <TableCell className="w-1/6 text-right">
              <Link className={buttonVariants({ variant: "link" })} href={`/transaction/${account.id}`} onClick={(e) => e.stopPropagation()}>
                <SquarePen />
              </Link>
            </TableCell>
          </TableRow>
        ))}
        {accounts?.length === 0 && (
          <TableRow>
            <TableCell colSpan={2} className="text-center">No accounts found</TableCell>
          </TableRow>
        )}
      </TableBody>
      <TableFooter>
        {accounts?.length === 0 ?
          null :
          <TableRow>
            <TableCell>
              Total:
            </TableCell>
            <TableCell className="text-right"> {formatCurrency(accounts?.reduce((acc, account) => acc + (account.balance ?? 0), 0) ?? 0)} </TableCell>
            <TableCell />
          </TableRow>
        }
      </TableFooter>
    </Table>
  )
}

export const AccountTableSkeleton = () => {
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
  );
}

export default AccountTable;
