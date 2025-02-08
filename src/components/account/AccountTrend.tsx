'use client';

import React from 'react';
import StackedGradientAreaChart, { AreaChartConfig } from '@/components/charts/StackedGradientAreaChart';
import { AccountTotalAmountProps } from '@/services/analytics/props/analytics.props';

const chartConfig: AreaChartConfig = {
  accountAmount: {
    label: 'All Accounts',
    color: 'hsl(var(--chart-1)',
    gradient: {
      startOpacity: 0.8,
      endOpacity: 0.1,
    },
  },
}

const AccountTrend = ({
  className,
  data
}: { className?: string, data: AccountTotalAmountProps[] }) => {
  return (
    <StackedGradientAreaChart
      data={data}
      config={chartConfig}
      className={className}
      title="Account Trend"
      description="Total Amount for All Accounts"
    />
  )
}
AccountTrend.displayName = 'AccountTrend';

export default AccountTrend;