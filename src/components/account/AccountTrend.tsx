'use client';

import React from 'react';
import StackedGradientAreaChart, { AreaChartConfig } from '@/components/charts/StackedGradientAreaChart';
import { AccountTotalAmountProps } from '@/services/analytics/props/analytics.props';

const chartConfig: AreaChartConfig = {
  accountAmount: {
    label: 'Amount',
    color: 'hsl(var(--chart-1)',
    gradient: {
      startOpacity: 0.8,
      endOpacity: 0.1,
    },
  },
}

const AccountTrend = ({
  className,
  data,
  title,
  description
}: { className?: string, data: AccountTotalAmountProps[], title: string, description: string }) => {
  return (
    <StackedGradientAreaChart
      data={data}
      config={chartConfig}
      className={className}
      title={title}
      description={description}
      showLegend={false}
    />
  )
}
AccountTrend.displayName = 'AccountTrend';

export default AccountTrend;