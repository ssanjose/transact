'use client';

import React from 'react';
import { useLiveQuery } from "dexie-react-hooks";
import { TransactionController } from "@/hooks/transaction.controller";
import { Table, TableBody, TableCell, TableFooter, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/format/formatCurrency";

const TransactionTable = ({ id, setTransactionId }: { id: number, setTransactionId: (id: number) => void }) => {
  const transactions = useLiveQuery(() => TransactionController.getTransactionsByAccount(id));
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell> Name </TableCell>
          <TableCell> Amount </TableCell>
          <TableCell> Date </TableCell>
          <TableCell> Type </TableCell>
          <TableCell> Frequency </TableCell>
        </TableRow>
      </TableHeader>
      <TableBody className="relative">
        {transactions?.map((transaction) => (
          <TableRow
            key={transaction.id}
            onMouseEnter={() => setTransactionId(transaction.id ?? -1)}
            onMouseLeave={() => setTransactionId(-1)}
          >
            <TableCell className="scroll-m-20 text-md tracking-tight">{transaction.name}</TableCell>
            <TableCell>{formatCurrency(transaction.amount ?? 0.00)}</TableCell>
            <TableCell>{transaction.date.toLocaleString().replace(/:\d{2}\s/, ' ')}</TableCell>
            <TableCell>{transaction.type === 0 ? "expense" : "income"}</TableCell>
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default TransactionTable;