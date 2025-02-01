"use client"

import React from "react"
import {
  ColumnDef,
  flexRender,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

interface DataTableProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  columns: ColumnDef<TData, TValue>[]
  table: import("@tanstack/react-table").Table<TData>
  setId?: (id: number) => void
}

const DataTable = <TData, TValue>({ className, columns, table, setId }: DataTableProps<TData, TValue>) => {
  return (
    <div className={cn("", className)}>
      <div className="border rounded-md">
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
                  onMouseEnter={() => setId !== undefined ? setId(Number(row.getValue("id"))) : null}
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
    </div>
  )
}

export default DataTable;