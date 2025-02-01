'use client';

import * as React from "react"
import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Category, Transaction } from "@/lib/db/db.model"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { useTransactionContext } from "@/hooks/use-transaction-context"

interface TopCategoriesProps {
  categories: Category[]
  className?: string
}

interface Metric {
  category: Category
  count: number
}

const MostUsedCategory = ({
  categories,
  className
}: TopCategoriesProps) => {
  const transactions = useTransactionContext()

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
      <div className={cn("grid gap-4", className)}>
        <Card>
          <CardHeader>
            <Skeleton className="h-4 w-[140px]" />
            <Skeleton className="h-3 w-[100px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-[120px]" />
          </CardContent>
        </Card>
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
    <Card className={cn("grid gap-4", className)}>
      <CardHeader>
        <CardTitle>Most Used Category</CardTitle>
        <CardDescription>By number of transactions</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-2">
        <div
          className="w-4 h-4 rounded"
          style={{ backgroundColor: (topByCount as Metric)?.category.color || 'transparent' }}
        />
        <span className="text-lg font-semibold">
          {(topByCount as Metric).category.name} ({(topByCount as Metric).count} transactions)
        </span>
      </CardContent>
    </Card>
  )
}

export default MostUsedCategory;