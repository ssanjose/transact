'use client';

import React from 'react';
import StackedGradientAreaChart, { AreaChartConfig } from '@/components/charts/StackedGradientAreaChart';
import { IncomeExpenseTransactionAmountProps } from '@/services/analytics/props/analytics.props';

const chartConfig: AreaChartConfig = {
  incomeAmount: {
    label: 'Income',
    color: 'hsl(var(--number-positive)',
    gradient: {
      startOpacity: 0.8,
      endOpacity: 0.1,
    },
  },
  expenseAmount: {
    label: 'Expense',
    color: 'hsl(var(--number-negative)',
    gradient: {
      startOpacity: 0.8,
      endOpacity: 0.1,
    },
  },
}

/**
 * TransactionTrend component
 * @param className className for the component
 * @returns JSX.Element
 */
const TransactionTrend = ({
  className,
  data
}: { className?: string, data: IncomeExpenseTransactionAmountProps[] }) => {
  return (
    <StackedGradientAreaChart
      data={data}
      config={chartConfig}
      className={className}
      title="Transaction Trend"
      description="Income and Expenses"
    />
  )
}

export default TransactionTrend;