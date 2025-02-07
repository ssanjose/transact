'use client';

import React, { useMemo } from 'react';
import StackedGradientAreaChart, { AreaChartConfig } from '@/components/charts/StackedGradientAreaChart';
import { IncomeExpenseTransactionAmountProps } from '@/services/analytics/props/analytics.props';

const chartConfig: AreaChartConfig = {
  expense: {
    label: 'Expense',
    color: 'hsl(var(--number-negative)',
    gradient: {
      startOpacity: 0.8,
      endOpacity: 0.1,
    },
  },
}

/**
 * ExpenseTransactionTrend component
 * @param className className for the component
 * @returns JSX.Element
 */
const ExpenseTransactionTrend = ({
  className,
  data
}: { className?: string, data: IncomeExpenseTransactionAmountProps[] }) => {

  const expenseData = useMemo(() => {
    if (!data) return [];

    return data.map(({ date, expenseAmount }) => ({
      date,
      expense: expenseAmount,
    }));
  }, [data]);

  return (
    <StackedGradientAreaChart
      data={expenseData}
      config={chartConfig}
      className={className}
      title="Expense Trend"
      description="Expenses by category"
    />
  );
};

ExpenseTransactionTrend.displayName = 'ExpenseTransactionTrend';

export default ExpenseTransactionTrend;