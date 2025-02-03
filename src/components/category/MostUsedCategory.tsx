'use client';

import * as React from "react"
import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Category } from "@/lib/db/db.model"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { useTransactionContext } from "@/hooks/use-transaction-context"
import { useCategoryContext } from "@/hooks/use-category-context";

interface Metric {
  category: Category
  count: number
}

const MostUsedCategory = ({
  className
}: React.HTMLAttributes<HTMLDivElement>) => {
  const transactions = useTransactionContext()
  const categories = useCategoryContext()

  const topByCount = useMemo(() => {
    if (!transactions || !categories) return []

    const categoryMap = new Map(categories.map(cat => [cat.id, cat]))
    const metrics = new Map<number, Metric>()

    transactions.forEach(tx => {
      if (!tx.categoryId) return
      const category = categoryMap.get(tx.categoryId)
      if (!category) return

      const current = metrics.get(tx.categoryId) || {
        category,
        count: 0,
      }

      metrics.set(tx.categoryId, {
        ...current,
        count: current.count + 1,
      })
    })

    return Array.from(metrics.values()).sort((a, b) => b.count - a.count)[0]
  }, [transactions, categories])

  if (!transactions || !categories)
    return (
      <div className={cn("", className)}>
        <Card>
          <CardHeader>
            <Skeleton className="h-4 w-[140px]" />
            <Skeleton className="h-3 w-[100px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-[120px]" />
          </CardContent>
        </Card>
      </div>
    )

  return (
    <Card className={cn("grid", className)}>
      <CardHeader className="p-4 pb-0 lg:p-6 lg:pb-0">
        <CardTitle>Most Used Category</CardTitle>
        <CardDescription>By number of transactions</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-2 p-4 pt-2 lg:p-6 lg:pt-2">
        <div
          className="w-4 h-4 rounded"
          style={{ backgroundColor: (topByCount as Metric)?.category.color }}
        />
        <span className="text-lg font-semibold">
          {topByCount ?
            <>
              {(topByCount as Metric).category.name} ({(topByCount as Metric).count} transactions)
            </> :
            "No transactions"
          }
        </span>
      </CardContent>
    </Card>
  )
}

export default MostUsedCategory;