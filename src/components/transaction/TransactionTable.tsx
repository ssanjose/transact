'use client';

import React from 'react';
import { useLiveQuery } from "dexie-react-hooks";
import DataTable from '@/components/data-table/DataTable';
import { columns } from '@/components/data-table/columns';
import { TransactionService } from '@/services/transaction.service';

const TransactionTable = ({ id, setTransactionId }: { id?: number, setTransactionId: (id: number) => void }) => {
  const transactions = useLiveQuery(() => TransactionService.getTransactionsByAccount(id));

  return (
    <DataTable columns={columns}
      setTransactionId={setTransactionId}
      data={transactions ? transactions : []}
    />
  )
}

export default TransactionTable;