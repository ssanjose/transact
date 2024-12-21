'use client';

import React from 'react';
import { useLiveQuery } from "dexie-react-hooks";
import { TransactionService } from "@/services/transaction.service";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/format/formatCurrency";

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
          >
            <TableCell className="scroll-m-20 text-md font-medium tracking-tight">{transaction.name}</TableCell>
            <TableCell>{
              (() => {
                switch (transaction.frequency) {
                  case 0: return "one-time";
                  case 1: return "daily";
                  case 2: return "weekly";
                  case 3: return "monthly";
                  default: return "unknown";
                }
              })()}
            </TableCell>
            <TableCell>{transaction.date.toLocaleString().replace(/:\d{2}\s/, ' ')}</TableCell>
            <TableCell className="text-right w-fit">{transaction.type === 0 ? "-" : ""}{formatCurrency(transaction.amount ?? 0.00)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default TransactionTable;