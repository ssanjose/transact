"use client"

import React, { useEffect } from "react"
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Category } from "@/lib/db/db.model"
import DataTable from "@/components/data-table/DataTable"
import { useTransactionContext } from "@/hooks/use-transaction-context"

import { DeleteCategoryButton, EditCategoryButton } from "@/components/category/CategoryButtons"
import { CategoryService } from "@/services/category.service"
import { useDialog } from "@/hooks/use-dialog"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface CategoryTableProps {
  categories: Category[];
  className?: string;
}

const CategoryTable = ({ className, categories }: CategoryTableProps) => {
  const transactions = useTransactionContext();
  const [selectedRowForAction, setSelectedRowForAction] = React.useState<number | undefined>()
  const [rowData, setRowData] = React.useState<Category>({} as Category)

  const deleteDialog = useDialog()
  const editDialog = useDialog()

  useEffect(() => {
    if (selectedRowForAction === -1 || !selectedRowForAction) return;
    let isMounted = true;
    (async () => {
      const data = await CategoryService.getCategory(selectedRowForAction);
      if (isMounted) setRowData(data as Category);
    })();

    return () => { isMounted = false };
  }, [selectedRowForAction])

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
    {
      id: "actions",
      cell: ({ row, table }) => {
        const category = row.original

        return (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="size-8 p-0"
                onClick={() => table.options.meta?.setId(category.id ?? -1)}
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <ul role="menu">
                <li role="menuitem">
                  <DropdownMenuItem
                    onClick={() => {
                      table.options.meta?.editDialogTrigger()
                      table.options.meta?.removeId()
                    }}
                  >
                    Edit Category
                  </DropdownMenuItem>
                </li>
                <li role="menuitem">
                  <DropdownMenuItem
                    onClick={() => {
                      table.options.meta?.deleteDialogTrigger()
                    }}
                  >
                    Delete Category
                  </DropdownMenuItem>
                </li>
              </ul>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: categories,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      setId: (id: number) => setSelectedRowForAction(id),
      removeId: () => setSelectedRowForAction(undefined),
      deleteDialogTrigger: () => deleteDialog.trigger(),
      editDialogTrigger: () => editDialog.trigger(),
    }
  })

  return (
    <>
      <DataTable
        columns={columns}
        table={table}
        className={className}
      />
      <EditCategoryButton
        existingCategory={rowData}
        dialogProps={() => editDialog}
        visible={false}
        title={`Edit ${rowData?.name}`}
      />
      <DeleteCategoryButton
        id={rowData?.id || -1}
        dialogProps={() => deleteDialog}
        visible={false}
      />
    </>
  )
}

export default CategoryTable