'use client';

import { Table } from "@tanstack/react-table";
import React from "react"
import { Input } from "../ui/input";

interface SimpleInputFilterProps<TData> {
  table: Table<TData>
}

const SimpleInputFilter = <TData,>({ table }: SimpleInputFilterProps<TData>) => {
  const resetStates = (value: string) => {
    table.resetColumnFilters();
  };

  return (
    <div className="flex items-center">
      <Input
        placeholder="Filter names..."
        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
        onChange={(event) => {
          resetStates(event.target.value);
          table.getColumn("name")?.setFilterValue(event.target.value)
        }}
        className="h-8 max-w-sm"
      />
    </div>
  )
}

export default SimpleInputFilter;