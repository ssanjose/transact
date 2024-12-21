'use client';

import React from 'react';
import { Table, TableBody, TableCaption, TableCell, TableRow } from '@/components/ui/table';
import { useLiveQuery } from 'dexie-react-hooks';
import { formatCurrency } from '@/lib/format/formatCurrency';
import { TransactionService } from '@/services/transaction.service';
import { Transaction } from '@/lib/db/db.model';

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
  const transactions = useLiveQuery(() => TransactionService.findUpcomingTransactions(accountId, limit));

  return (
    <Table className={className}>
      <TableCaption className="mt-0 mb-4 text-accent-foreground text-semibold text-lg sticky top-0 bg-white">Upcoming Transactions</TableCaption>
      <TableBody>
        {transactions?.map((transaction: Transaction, index) => (
          <TableRow className={`even:bg-white odd:bg-cyan-50 h-[60px] hover:bg-emerald-100 border-0`} key={index}>
            <TableCell>{transaction.name}</TableCell>
            <TableCell>{transaction.date.toLocaleString().replace(/:\d{2}\s/, ' ')}</TableCell>
            <TableCell className="text-right">{transaction.type === 0 ? '-' : null}{formatCurrency(transaction.amount)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default UpcomingTransactions;