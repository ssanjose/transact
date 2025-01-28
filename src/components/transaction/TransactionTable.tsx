'use client';

import React, { useEffect } from 'react';
import { useLiveQuery } from "dexie-react-hooks";
import DataTable from '@/components/data-table/DataTable';
import { columns } from '@/components/data-table/columns';
import { TransactionService } from '@/services/transaction.service';
import { DeleteTransactionButton, EditTransactionButton } from '@/components/transaction/TransactionButtons';

import { useDialog } from "@/hooks/use-dialog"
import { Transaction } from '@/lib/db/db.model';
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable
} from '@tanstack/react-table';
import dataTableConfig from '@/config/data-table';
import SimpleInputFilter from '@/components/data-table/SimpleInputFilter';
import { DataTableViewOptions } from '@/components/data-table/ColumnToggle';

const TransactionTable = ({ id, setTransactionId }: { id?: number, setTransactionId: (id: number) => void }) => {
  const transactions = useLiveQuery<Transaction[], []>(() => TransactionService.getTransactionsByAccount(id), [id], []);

  const [selectedRowForAction, setSelectedRowForAction] = React.useState<number | undefined>(undefined);
  const [rowData, setRowData] = React.useState<Transaction>({} as Transaction);
  const [sorting, setSorting] = React.useState<SortingState>(dataTableConfig.sorting)
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const deleteDialog = useDialog();
  const editDialog = useDialog();

  useEffect(() => {
    if (selectedRowForAction === -1 || !selectedRowForAction) return;
    let isMounted = true;
    (async () => {
      const data = await TransactionService.getTransaction(selectedRowForAction);
      if (isMounted) setRowData(data as Transaction);
    })();

    return () => { isMounted = false };
  }, [selectedRowForAction])

  const table = useReactTable<Transaction>({
    data: transactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      columnVisibility: dataTableConfig.columnVisibility,
    },
    state: {
      sorting,
      columnFilters,
    },
    meta: {
      setId: (id: number) => setSelectedRowForAction(id),
      removeId: () => setSelectedRowForAction(undefined),
      deleteDialogTrigger: () => deleteDialog.trigger(),
      editDialogTrigger: () => editDialog.trigger(),
    }
  });

  return (
    <div className="w-full p-1">
      <div className="flex justify-between items-center">
        <SimpleInputFilter table={table} />
        <DataTableViewOptions table={table} />
      </div>
      <DataTable columns={columns}
        setId={setTransactionId}
        table={table}
      />
      <EditTransactionButton
        existingTransaction={rowData as Transaction}
        dialogProps={() => editDialog}
        visible={false}
        title="Edit a Transaction"
      />
      <DeleteTransactionButton
        id={selectedRowForAction ? selectedRowForAction : -1}
        dialogProps={() => deleteDialog}
        visible={false}
      />
    </div>
  )
}

export default TransactionTable;