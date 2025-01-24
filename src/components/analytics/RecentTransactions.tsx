'use client';

import React, { useEffect } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/format/formatCurrency';
import { separateByDateFormat, SeparatedTransaction } from '@/lib/analysis/separateByDateFormat';
import { Card } from '@/components/ui/card';
import { useLiveQuery } from 'dexie-react-hooks';
import HeaderText from '@/components/common/HeaderText';
import { cn } from '@/lib/utils';
import { TransactionAnalyticsService } from '@/services/analytics/transaction.analytics.service';

import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ["latin"] });

/**
 * Display a list of recent transactions for an account(s) in a table, with the ability to filter by account
 * and limit the number of transactions displayed
 * @param className The class name to apply to the table
 * @param accountId The account to display transactions for
 * @param limit The maximum number of transactions to display
 * @returns A table of recent transactions
 * @example
 * <RecentTransactions className="w-full" accountId={account} limit={5} />
 * <RecentTransactions className="w-full" accountId={account} />
 * <RecentTransactions className="w-full" />
 * <RecentTransactions />
 */
const RecentTransactions = ({ className, accountId, limit = 3 }: {
  className?: string,
  accountId?: number | undefined,
  limit?: number,
}) => {
  const transactions = useLiveQuery(() => TransactionAnalyticsService.findRecentTransactions(accountId, limit));
  const [formattedTransactions, setFormattedTransactions] = React.useState<SeparatedTransaction[] | undefined>(undefined);

  useEffect(() => {
    if (!transactions) return;
    let isMounted = true;

    (async () => {
      let fTxs = await separateByDateFormat(transactions);
      if (isMounted) setFormattedTransactions(fTxs);
    })();

    return () => { isMounted = false };
  }, [transactions]);

  return (
    <Table className="w-full caption-top" containerClassName={cn("no-scrollbar p-2", className, inter.className)}>
      <TableCaption className="mt-0 mb-2">
        <HeaderText mainHeading="Recent" subHeading="Transactions" className="uppercase" />
      </TableCaption>
      <TableBody>
        {
          formattedTransactions?.map((tx, index) => (
            <RecentTransactionTableRow key={index} tx={tx} />
          ))
        }
        {
          (!formattedTransactions || formattedTransactions.length === 0) && (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4">
                No recent transactions
              </TableCell>
            </TableRow>
          )
        }
      </TableBody>
    </Table>
  )
}

const RecentTransactionTableRow = ({ tx }: { tx: SeparatedTransaction }) => {
  return (tx ?
    <TableRow className={`h-fit hover:bg-transaparent border-0`}>
      <TableCell className="flex flex-col gap-1 rounded mb-4 p-0">
        <div className="flex justify-between items-center">
          <h3 className="text-muted-foreground text-xs font-semibold tracking-tight">{tx.key}</h3>
          <p className={`text-lg tracking-tight ${tx.total < 0 ? 'text-number-negative' : 'text-number-positive'}`}>{formatCurrency(tx.total)}</p>
        </div>
        {tx.transactions.map((transaction, index) => (
          <Card className="bg-background rounded p-2" key={index}>
            <div className="flex justify-between items-center">
              <h4 className="text-accent-foreground text-sm font-semibold tracking-tight">{transaction.name}</h4>
              <p>{transaction.type === 0 ? '-' : null}{formatCurrency(transaction.amount)}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground text-xs">{transaction.account?.name}</p>
              <p className="text-muted-foreground text-xs">{transaction.category?.name}</p>
            </div>
          </Card>
        ))}
      </TableCell>
    </TableRow>
    :
    null
  )
}

export default RecentTransactions;