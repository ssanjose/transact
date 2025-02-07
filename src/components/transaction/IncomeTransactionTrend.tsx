'use client';

import React, { useMemo } from 'react';
import StackedGradientAreaChart, { AreaChartConfig } from '@/components/charts/StackedGradientAreaChart';
import { IncomeExpenseTransactionAmountProps } from '@/services/analytics/props/analytics.props';

const chartConfig: AreaChartConfig = {
  income: {
    label: 'Income',
    color: 'hsl(var(--number-positive)',
    gradient: {
      startOpacity: 0.8,
      endOpacity: 0.1,
    },
  },
}

/**
 * IncomeTransactionTrend component
 * @param className className for the component
 * @returns JSX.Element
 */
const IncomeTransactionTrend = ({
  className,
  data
}: { className?: string, data: IncomeExpenseTransactionAmountProps[] }) => {

  const incomeData = useMemo(() => {
    if (!data) return [];

    return data.map(({ date, incomeAmount }) => ({
      date,
      income: incomeAmount,
    }));
  }, [data]);

  return (
    <StackedGradientAreaChart
      data={incomeData}
      config={chartConfig}
      className={className}
      title="Income Trend"
      description="Income by category"
    />
  );
};

IncomeTransactionTrend.displayName = 'IncomeTransactionTrend';

export default IncomeTransactionTrend;