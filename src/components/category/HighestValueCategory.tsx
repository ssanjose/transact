'use client';

import * as React from "react"
import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Category } from "@/lib/db/db.model"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { useTransactionContext } from "@/hooks/use-transaction-context"
import { useCategoryContext } from "@/hooks/use-category-context";
import useSettings from "@/hooks/use-settings";
import SummaryCard from "@/components/common/SummaryCard";
import { formatCurrency } from "@/lib/format/formatCurrency";

interface Metric {
  category: Category
  amount: number
}

const HighestValueCategory = ({
  className
}: React.HTMLAttributes<HTMLDivElement>) => {
  const transactions = useTransactionContext()
  const categories = useCategoryContext()
  const { settings } = useSettings()

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
    <SummaryCard
      title="Highest Valued Category"
      subHeading="By total amount"
      description={topByAmount ? (topByAmount as Metric).category.name : "No transactions"}
      subDescription={topByAmount ? formatCurrency((topByAmount as Metric).amount || 0, settings.currencyFormat) : ""}
      className="grid"
      svg={
        <div
          className="size-5 rounded"
          style={{ backgroundColor: (topByAmount as Metric)?.category.color }}
        />
      }
    />
  )
}

export default HighestValueCategory;