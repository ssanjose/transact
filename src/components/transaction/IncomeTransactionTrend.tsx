'use client';

import React, { useMemo } from 'react';
import StackedGradientAreaChart, { AreaChartConfig } from '@/components/charts/StackedGradientAreaChart';
import { useTransactionContext } from '@/hooks/use-transaction-context';
import { useCategoryContext } from '@/hooks/use-category-context';

/**
 * IncomeTransactionTrend component
 * @param className className for the component
 * @returns JSX.Element
 */
const IncomeTransactionTrend = ({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  const transactions = useTransactionContext();
  const categories = useCategoryContext();

  const chartConfig: AreaChartConfig = useMemo(() => {
    if (!categories) return {};

    const config = categories.reduce((acc, category) => {
      acc[category.name] = {
        label: category.name,
        color: category.color || 'hsl(var(--muted))',
        gradient: {
          startOpacity: 0.8,
          endOpacity: 0.1,
        },
      };
      return acc;
    }, {} as AreaChartConfig);

    // Add uncategorized config
    config['Uncategorized'] = {
      label: 'Uncategorized',
      color: 'hsl(var(--muted-foreground))',
      gradient: {
        startOpacity: 0.8,
        endOpacity: 0.1,
      },
    };

    return config;
  }, [categories]);

  const data = useMemo(() => {
    if (!transactions || !categories) return [];

    const categoryMap = new Map(categories.map(cat => [cat.id, cat.name]));

    const dailyTotals = transactions
      .filter(tx => tx.type === 1) // Income only
      .reduce((acc, tx) => {
        const date = tx.date.toISOString().split('T')[0];
        const amount = Math.abs(tx.amount);
        const categoryName = tx.categoryId ? categoryMap.get(tx.categoryId) : 'Uncategorized';

        if (!acc[date]) acc[date] = {};
        acc[date][categoryName || 'Uncategorized'] = (acc[date][categoryName || 'Uncategorized'] || 0) + amount;

        return acc;
      }, {} as Record<string, Record<string, number>>);

    return Object.entries(dailyTotals)
      .map(([date, amounts]) => ({
        date,
        ...amounts,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [transactions, categories]);

  return (
    <StackedGradientAreaChart
      data={data}
      config={chartConfig}
      className={className}
      title="Income Trend"
      description="Income by category"
    />
  );
};

IncomeTransactionTrend.displayName = 'IncomeTransactionTrend';

export default IncomeTransactionTrend;