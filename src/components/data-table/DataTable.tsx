"use client"

import React, { useEffect } from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useDialog } from "@/hooks/use-dialog"
import { DeleteTransactionButton, EditTransactionButton } from "@/components/transaction/TransactionButtons"
import { DataTablePagination } from "@/components/data-table/PaginationControls"
import { DataTableViewOptions } from "@/components/data-table/ColumnToggle"
import dataTableConfig from "@/config/data-table"
import SimpleInputFilter from "@/components/data-table/SimpleInputFilter"
import { Transaction } from "@/lib/db/db.model"
import { TransactionService } from "@/services/transaction.service"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  setTransactionId?: (id: number) => void
}

const DataTable = <TData, TValue>({ columns, data, setTransactionId }: DataTableProps<TData, TValue>) => {
  const [selectedRowForAction, setSelectedRowForAction] = React.useState<number | undefined>(undefined);
  const [rowData, setRowData] = React.useState<TData>({} as TData);
  const [sorting, setSorting] = React.useState<SortingState>(dataTableConfig.sorting)
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const deleteDialog = useDialog();
  const editDialog = useDialog();

  useEffect(() => {
    if (selectedRowForAction === -1 || !selectedRowForAction) return;
    let isMounted = true;
    (async () => {
      const data = await TransactionService.getTransaction(selectedRowForAction);
      if (isMounted) setRowData(data as TData);
    })();

    return () => { isMounted = false };
  }, [selectedRowForAction])

  const table = useReactTable({
    data,
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
    <>
      <div className="w-full p-1">
        <div className="flex justify-between items-center">
          <SimpleInputFilter table={table} />
          <DataTableViewOptions table={table} />
        </div>
        <div className="border rounded-md my-1">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-inherit">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="last:w-[40px] last:sticky last:right-0 last:bg-background">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-inherit"
                    onMouseEnter={() => setTransactionId !== undefined ? setTransactionId(Number(row.getValue("id"))) : null}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="last:w-[40px] last:sticky last:right-0 last:bg-background">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )
              }
            </TableBody>
          </Table>
        </div>
        <DataTablePagination table={table} />
      </div>

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
    </>
  )
}

export default DataTable;