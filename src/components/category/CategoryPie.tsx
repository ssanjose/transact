'use client';

import React, { useMemo } from "react";
import { useTransactionContext } from "@/hooks/use-transaction-context";
import { ChartDataPoint, PieChart, PieChartConfig } from "@/components/charts/PieChart"
import { cn } from "@/lib/utils";
import { useCategoryContext } from "@/hooks/use-category-context";

const CategoryPieChart = ({
  className
}: React.HTMLAttributes<HTMLDivElement>) => {
  const transactions = useTransactionContext();
  const categories = useCategoryContext();

  const chartData = useMemo((): ChartDataPoint[] => {
    if (!transactions || !categories) return [];

    const categoryMap = new Map(categories.map(cat => [cat.id, cat]));
    const transactionsByCategory = new Map<number, number>();

    transactions.forEach(tx => {
      if (!tx.categoryId) return;
      const current = transactionsByCategory.get(tx.categoryId) || 0;
      transactionsByCategory.set(tx.categoryId, current + Math.abs(tx.amount));
    });

    return Array.from(transactionsByCategory.entries())
      .map(([categoryId, total]) => {
        const category = categoryMap.get(categoryId);
        if (!category) return null;
        return {
          label: category.name,
          value: total,
          fill: category.color || '#000000'
        } as ChartDataPoint;
      })
      .filter((item): item is ChartDataPoint => item !== null);
  }, [transactions, categories]);

  const chartConfig = useMemo((): PieChartConfig => {
    if (!categories) return {};

    return categories.reduce((config, category) => {
      if (!category.id) return config;
      return {
        ...config,
        [category.name]: {
          label: category.name,
          color: category.color || '#000000'
        }
      };
    }, {});
  }, [categories]);

  return (
    <div className={cn("grid", className)}>
      <PieChart
        data={chartData}
        config={chartConfig}
        title="Transactions by Category"
        description="Distribution of transactions (income & expenses) across categories"
      />
    </div>
  )
}

export default CategoryPieChart;