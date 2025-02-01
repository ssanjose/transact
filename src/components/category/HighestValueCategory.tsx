'use client';

import * as React from "react"
import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Category } from "@/lib/db/db.model"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { useTransactionContext } from "@/hooks/use-transaction-context"

interface TopCategoriesProps {
  categories: Category[]
  className?: string
}

interface Metric {
  category: Category
  amount: number
}

const HighestValueCategory = ({
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
      <CardHeader className="p-4 lg:p-6">
        <CardTitle>Highest Value Category</CardTitle>
        <CardDescription>By total amount</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-2 p-4 lg:p-6">
        <div
          className="w-4 h-4 rounded"
          style={{ backgroundColor: (topByCount as Metric).category.color }}
        />
        <span className="text-lg font-semibold">
          {(topByCount as Metric).category.name} (
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
          }).format((topByCount as Metric).amount || 0)}
          )
        </span>
      </CardContent>
    </Card>
  )
}

export default HighestValueCategory;