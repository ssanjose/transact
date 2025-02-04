'use client';

import { Table } from "@tanstack/react-table";
import React from "react"
import { Input } from "../ui/input";

interface SimpleInputFilterProps<TData> {
  table: Table<TData>
}

const SimpleInputFilter = <TData,>({ table }: SimpleInputFilterProps<TData>) => {
  return (
    <div className="flex items-center">
      <Input
        placeholder="Filter names..."
        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
        onChange={(event) => {
          table.resetColumnFilters();
          table.getColumn("name")?.setFilterValue(event.target.value)
        }}
        className="h-8 max-w-sm"
      />
    </div>
  )
}

export default SimpleInputFilter;