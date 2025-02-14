"use client"

import { ColumnDef, RowData } from "@tanstack/react-table"
import { FrequencyOptions, Transaction } from "@/lib/db/db.model"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { DataTableColumnHeader } from "@/components/data-table/ColumnHeader";
import { AppSettings } from "@/lib/types/settings";
import { formatDate } from "@/lib/format/formatTime";
import { formatCurrency } from "@/lib/format/formatCurrency"

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
export const columns = (settings: AppSettings): ColumnDef<Transaction>[] => [
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
          {formatDate(date, `${settings.dateFormat} h:mm a`)}
        </div>
      )
    }
  },
  {
    accessorKey: "frequency",
    header: "Frequency",
    cell: ({ row }) => {
      return (
        <div className="text-right text-md">
          {FrequencyOptions[row.original.frequency]}
        </div>
      )
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      // make badge type of element and check whether is it 'PROCESSED' or 'PROJECTED'
      return (
        <div className={`w-fit text-xs border py-1 px-3 uppercase rounded-3xl text-center opacity-60 ${row.original.status === 'processed' ? "text-number-positive border-number-positive" : "text-number-negative border-number-negative"}`}>
          {row.original.status}
        </div>
      )
    }
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
      const amount = formatCurrency(row.getValue("amount"), settings.currencyFormat);

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
