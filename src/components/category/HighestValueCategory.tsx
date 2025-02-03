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
  amount: number
}

const HighestValueCategory = ({
  className
}: React.HTMLAttributes<HTMLDivElement>) => {
  const transactions = useTransactionContext()
  const categories = useCategoryContext()

  const topByAmount = useMemo(() => {
    if (!transactions || !categories) return []

    const categoryMap = new Map(categories.map(cat => [cat.id, cat]))
    const metrics = new Map<number, Metric>()

    transactions.forEach(tx => {
      if (!tx.categoryId) return
      const category = categoryMap.get(tx.categoryId)
      if (!category) return

      const current = metrics.get(tx.categoryId) || {
        category,
        amount: 0.
      }

      metrics.set(tx.categoryId, {
        ...current,
        amount: current.amount + Math.abs(tx.amount)
      })
    })

    return Array.from(metrics.values()).sort((a, b) => b.amount - a.amount)[0]
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
        <CardTitle>Highest Valued Category</CardTitle>
        <CardDescription>By total amount</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-2 p-4 pt-2 lg:p-6 lg:pt-2">
        <div
          className="w-4 h-4 rounded"
          style={{ backgroundColor: (topByAmount as Metric)?.category.color }}
        />
        <span className="text-lg font-semibold">
          {topByAmount ?
            <>
              {(topByAmount as Metric).category.name} (
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format((topByAmount as Metric).amount || 0)}
              )
            </> :
            "No transactions"
          }
        </span>
      </CardContent>
    </Card>
  )
}

export default HighestValueCategory;