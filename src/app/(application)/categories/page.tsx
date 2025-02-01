'use client';

import React, { useEffect, useMemo } from "react";
import ContentContainer from "@/components/common/ContentContainer";
import { DateRange } from "react-day-picker";
import { addMonths } from "date-fns";
import { Category, Transaction } from "@/lib/db/db.model";
import { TransactionService } from "@/services/transaction.service";
import { CategoryService } from "@/services/category.service";
import { TransactionContext } from "@/hooks/use-transaction-context";
import { useLiveQuery } from "dexie-react-hooks";
import DateRangePicker from "@/components/analytics/DateRangePicker";
import CategoryTable from "@/components/category/CategoryTable";
import { ChartDataPoint, PieChart, PieChartConfig } from "@/components/charts/PieChart"
import { cn } from "@/lib/utils";
import MostUsedCategory from "@/components/category/MostUsedCategory"
import HighestValueCategory from "@/components/category/HighestValueCategory";
import { OpenCategoryButton } from "@/components/category/CategoryButtons";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function CategoryPage() {
  const [date, setDate] = React.useState<DateRange>({
    from: addMonths(new Date(), -1),
    to: new Date(),
  });
  const [transactions, setTransactions] = React.useState<Transaction[] | null | undefined>(null);
  const categories = useLiveQuery(() => CategoryService.getAllCategories());

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const data = await TransactionService.getTransactionsByDate({
        lowerBound: new Date(date.from!.getFullYear(), date.from!.getMonth(), date.from!.getDate(), 0, 0, 0, 0),
        upperBound:
          date.to ?
            new Date(date.to!.getFullYear(), date.to!.getMonth(), date.to!.getDate(), 23, 59, 59, 999) :
            new Date(date.from!.getFullYear(), date.from!.getMonth(), date.from!.getDate(), 23, 59, 59, 999),
        sorted: true
      });
      if (isMounted) setTransactions(data);
    })();

    return () => { isMounted = false; }
  }, [date]);

  return (
    <TransactionContext.Provider value={transactions}>
      <ContentContainer className="flex flex-col gap-2 min-h-screen pt-4">
        <div className="w-full relative flex justify-between items-center">
          <DateRangePicker
            className="w-fit inline-block"
            date={date!}
            setDate={setDate}
          />
          <OpenCategoryButton
            button={
              <Button size="icon" className="p-none rounded-lg w-fit px-3 h-9">
                <span className="hidden md:block">Add Category</span>
                <Plus />
              </Button>
            }
          />
        </div>
        <div className="w-full block lg:flex gap-2">
          <div className="w-full lg:w-3/4 h-fit space-y-2">
            <div className="block md:grid grid-cols-2 space-y-2 md:space-y-0 gap-2 justify-between">
              <MostUsedCategory
                categories={categories || []}
                className=""
              />
              <HighestValueCategory
                categories={categories || []}
                className=""
              />
            </div>
            <CategoryAnalytics
              categories={categories || []}
              transactions={transactions}
            />
          </div>
          <div className="w-full lg:w-1/4">
            <CategoryTable categories={categories || []} />
          </div>
        </div>

      </ContentContainer>
    </TransactionContext.Provider>
  );
}

interface CategoryAnalyticsProps {
  categories: Category[]
  transactions: Transaction[] | null | undefined
  className?: string
}

export const CategoryAnalytics = ({
  categories,
  transactions,
  className
}: CategoryAnalyticsProps) => {
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
        [category.id]: {
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
        showLegend={false}
        title="Transactions by Category"
        description="Distribution of transactions (income & expenses) across categories"
      />
    </div>
  )
}