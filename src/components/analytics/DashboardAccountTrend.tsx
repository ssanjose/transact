'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';
import { Line, LineChart } from 'recharts';
import { AccountTotalAmountProps } from '@/services/analytics/props/analytics.props';
import { formatCurrency } from '@/lib/format/formatCurrency';
import { formatDate } from '@/lib/format/formatTime';

const chartConfig = {
  accountAmount: {
    label: 'Amount',
    color: 'hsl(var(--primary))',
    gradient: {
      startOpacity: 0.8,
      endOpacity: 0.1,
    },
  },
}

const DashboardAccountTrend = ({ data, gR }: { data: AccountTotalAmountProps[], gR: number }) => {
  const title = formatCurrency(data[data.length - 1]?.accountAmount || 0);
  const gRPercent = `${(gR * 100).toFixed(2)}% increase from ${formatDate(new Date(data[0]?.date || 0))}`;

  return (
    <Card>
      <CardContent className="px-2 pt-4 sm:px-4">
        <div className="text-2xl font-bold">{title}</div>
        <p className="text-xs text-muted-foreground">
          {gRPercent}
        </p>
        <ChartContainer config={chartConfig} className="mt-2 h-[150px] w-full">
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
            <Line
              type="monotone"
              strokeWidth={2}
              dataKey="accountAmount"
              stroke="var(--color-accountAmount)"
              activeDot={{
                r: 6,
              }}
            />
            <ChartTooltip
              content={<ChartTooltipContent hideLabel indicator="line" />}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
};
DashboardAccountTrend.displayName = 'DashboardAccountTrend';

export default DashboardAccountTrend;