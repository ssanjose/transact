'use client';

import React, { useMemo } from 'react';
import StackedGradientAreaChart, { AreaChartConfig } from '@/components/charts/StackedGradientAreaChart';
import { useTransactionContext } from '@/hooks/use-transaction-context';

const chartConfig: AreaChartConfig = {
  income: {
    label: 'Income',
    color: 'hsl(var(--number-positive)',
    gradient: {
      startOpacity: 0.8,
      endOpacity: 0.1,
    },
  },
  expense: {
    label: 'Expense',
    color: 'hsl(var(--number-negative)',
    gradient: {
      startOpacity: 0.8,
      endOpacity: 0.1,
    },
  },
}

const TransactionTrend = ({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  const transactions = useTransactionContext();

  const data = useMemo(() => {
    if (!transactions) return [];

    const dailyTotals = transactions.reduce((acc, tx) => {
      const date = tx.date.toISOString().split('T')[0];
      const amount = Math.abs(tx.amount);

      if (tx.type === 1)
        acc[date] = { ...acc[date], income: (acc[date]?.income || 0) + amount };
      else
        acc[date] = { ...acc[date], expense: (acc[date]?.expense || 0) + amount };

      return acc;
    }, {} as Record<string, { income?: number; expense?: number }>);

    return Object.entries(dailyTotals).map(([date, { income = 0, expense = 0 }]) => ({
      date,
      income,
      expense,
    }));
  }, [transactions]);

  return (
    <StackedGradientAreaChart
      data={data}
      config={chartConfig}
      className={className}
      title="Transaction Trend"
      description="Daily income and expenses"
    />
  )
}

export default TransactionTrend;