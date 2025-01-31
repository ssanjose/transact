"use client"

import React from "react"
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Category } from "@/lib/db/db.model"
import DataTable from "../data-table/DataTable"
import { useTransactionContext } from "@/hooks/use-transaction-context"

interface CategoryTableProps {
  categories: Category[]
}

const CategoryTable = ({ categories }: CategoryTableProps) => {
  const transactions = useTransactionContext();

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        return (
          <div className="flex items-center">
            <div
              className="w-4 h-4 rounded mr-2"
              style={{ backgroundColor: row.original.color }}
            />
            {row.original.name}
          </div>
        )
      }
    },
    {
      accessorKey: "usage",
      header: "Usage",
      cell: ({ row }) => {
        const count = transactions?.filter(tx => tx.categoryId === row.original.id).length || 0
        return count
      }
    },
  ]

  const table = useReactTable({
    data: categories,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <DataTable
      columns={columns}
      table={table}
    />
  )
}

export default CategoryTable