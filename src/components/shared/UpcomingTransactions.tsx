'use client';

import React from 'react';
import { AppliedTransaction } from '@/lib/db/db.model';
import { Table, TableBody, TableCaption, TableCell, TableRow } from '@/components/ui/table';
import { AppliedTransactionController } from '@/hooks/appliedTransaction.controller';
import { useLiveQuery } from 'dexie-react-hooks';

interface UpcomingTransactionsProps {
  className?: string;
  accountId?: number | undefined;
  limit?: number;
}

/**
 * Display a list of upcoming transactions for an account(s) in a table, with the ability to filter by account
 * and limit the number of transactions displayed
 * @param className The class name to apply to the table
 * @param accountId The account to display transactions for
 * @param limit The maximum number of transactions to display
 * @returns A table of upcoming transactions
 * @example
 * <UpcomingTransactions className="w-full" accountId={account} limit={5} />
 * <UpcomingTransactions className="w-full" accountId={account} />
 * <UpcomingTransactions className="w-full" />
 * <UpcomingTransactions />
 */
const UpcomingTransactions = ({ className, accountId, limit = 3 }: UpcomingTransactionsProps) => {
  const transactions = useLiveQuery(() => AppliedTransactionController.findUpcomingTransactions(accountId, limit));

  return (
    <Table className={className}>
      <TableCaption className="mt-0 mb-4 text-accent-foreground text-semibold text-lg">Upcoming Transactions</TableCaption>
      <TableBody>
        {transactions?.map((transaction: AppliedTransaction, index) => (
          <TableRow className={`even:bg-white odd:bg-cyan-50 h-[60px] hover:bg-emerald-100 border-0`} key={index}>
            <TableCell>{transaction.date.toLocaleString().replace(/:\d{2}\s/, ' ')}</TableCell>
            <TableCell>{transaction.amount}</TableCell>
            <TableCell>{transaction.type}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default UpcomingTransactions;