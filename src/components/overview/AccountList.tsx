'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
} from "@/components/ui/table"
import { AccountService } from '@/services/account.service';
import { Account } from '@/lib/db/db.model';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/format/formatCurrency';
import { useLiveQuery } from 'dexie-react-hooks';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { SquarePen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { appLinks } from '@/config/site';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { OpenAccountButton } from '@/components/account/AccountButtons';
import { cn } from '@/lib/utils';
import useSettings from '@/hooks/use-settings';

const AccountTable = () => {
  const accounts = useLiveQuery(() => AccountService.getAllAccounts());
  const { settings } = useSettings();
  const router = useRouter();
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
            onClick={() => router.push(`${appLinks.account}/${account.id}`)}
          >
            <TableCell>{account.name}</TableCell>
            <TableCell className="text-right">{formatCurrency(account.balance ?? 0.00, settings.currencyFormat)}</TableCell>
            <TableCell className="w-1/6 text-right">
              <Link className={buttonVariants({ variant: "link" })} href={`${appLinks.account}/${account.id}`} onClick={(e) => e.stopPropagation()} aria-label={`Edit account '${account.name}'`}>
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
            <TableCell className="text-right"> {formatCurrency(accounts?.reduce((acc, account) => acc + (account.balance ?? 0), 0) ?? 0, settings.currencyFormat)} </TableCell>
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

const AccountList = ({ className }: { className?: string }) => {
  return (
    <Accordion type="single" collapsible className={cn("gap-2", className)} defaultValue="item-1">
      <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger className="border-b">Accounts</AccordionTrigger>
        <AccordionContent>
          <AccountTable />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" className="w-fit border-none">
        <OpenAccountButton />
      </AccordionItem>
    </Accordion >
  )
}

export default AccountList;
