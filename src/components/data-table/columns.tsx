"use client"

import { ColumnDef, RowData } from "@tanstack/react-table"
import { formatCurrency } from "@/lib/format/formatCurrency"
import { FrequencyOptions, Transaction } from "@/lib/db/db.model"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { DataTableColumnHeader } from "@/components/data-table/ColumnHeader";

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    setId: (id: number) => void,
    removeId: () => void,
    deleteDialogTrigger: () => void,
    editDialogTrigger: () => void,
  }
}

/**
 * The columns for the transaction table
 * @param {Transaction} row - The transaction row
 */
export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "id",
    header: () => <div className="text-left">ID</div>,
    cell: ({ row }) => {
      return (
        <div className="text-md text-nowrap text-left">
          {row.original.id}
        </div>
      )
    }
  },
  {
    accessorKey: "name",
    header: () => <div className="text-left w-[200px]">Name</div>,
    cell: ({ row }) => {
      return (
        <div className="text-md truncate w-[200px]">
          {row.original.name}
        </div>
      )
    }
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="justify-start"
        column={column}
        title="Date" />
    ),
    cell: ({ row }) => {
      const date = row.original.date;
      return (
        <div className="text-left text-md text-nowrap">
          {format(date, "MMMM dd, yyyy hh:mm a")}
        </div>
      )
    }
  },
  {
    header: "Frequency",
    accessorFn: row => FrequencyOptions[row.frequency],
  },
  {
    accessorKey: "categoryId",
    header: () => <div className="text-left">Category</div>,
    cell: ({ row }) => {
      return (
        <div className="text-md text-nowrap">
          {row.original.categoryId}
        </div>
      )
    }
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="justify-end"
        column={column}
        title="Amount" />
    ),
    cell: ({ row }) => {
      const type = row.original.type;
      const amount = formatCurrency(row.getValue("amount"));

      return (
        <div className={`text-right text-md ${type === 0 ? "text-number-negative" : "text-number-positive"}`}>
          {type === 0 ? "-" : ""}
          {amount}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const transaction = row.original;

      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-8 p-0 text-right self-end"
              onClick={() => table.options.meta?.setId(transaction.id ?? -1)}
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                table.options.meta?.editDialogTrigger();
                table.options.meta?.removeId();
              }}
            >
              Edit Transaction
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                table.options.meta?.deleteDialogTrigger();
              }}
            >
              Delete Transaction
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
