'use client';

import React from 'react';
import { useLiveQuery } from "dexie-react-hooks";
import { TransactionService } from "@/services/transaction.service";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/format/formatCurrency";
import { cn } from '@/lib/utils';

const TransactionTable = ({ id, setTransactionId }: { id: number, setTransactionId: (id: number) => void }) => {
  const transactions = useLiveQuery(() => TransactionService.getTransactionsByAccount(id));
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead> Name </TableHead>
          <TableHead> Frequency </TableHead>
          <TableHead> Date </TableHead>
          <TableHead className="text-right"> Amount </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="relative">
        {transactions?.map((transaction) => (
          <TableRow
            key={transaction.id}
            onMouseEnter={() => setTransactionId(transaction.id ?? -1)}
            onMouseLeave={() => setTransactionId(-1)}
            className="even:bg-background odd:bg-muted hover:bg-accent"
          >
            <TableCell className="scroll-m-20 text-md font-medium tracking-tight">{transaction.name}</TableCell>
            <TableCell>{
              (() => {
                switch (transaction.frequency) {
                  case 0: return "one-time";
                  case 1: return "daily";
                  case 2: return "weekly";
                  default: return "monthly";
                }
              })()}
            </TableCell>
            <TableCell>{transaction.date.toLocaleString().replace(/:\d{2}\s/, ' ')}</TableCell>
            <TableCell className={cn("text-right w-fit", transaction.type === 0 ? "text-red-700" : "text-green-700")}>{transaction.type === 0 ? "-" : ""}{formatCurrency(transaction.amount ?? 0.00)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default TransactionTable;