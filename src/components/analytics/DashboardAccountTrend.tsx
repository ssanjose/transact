'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart } from 'recharts';
import { AccountTotalAmountProps } from '@/services/analytics/props/analytics.props';
import { formatCurrency } from '@/lib/format/formatCurrency';
import { formatDate } from '@/lib/format/formatTime';
import useSettings from '@/hooks/use-settings';

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
  const { settings } = useSettings();
  const title = formatCurrency(data[data.length - 1]?.accountAmount || 0, settings.currencyFormat);
  const gRPercent = `${(gR * 100).toFixed(2)}% increase since ${formatDate(new Date(data[0]?.date || 0))}`;

  return (
    <Card>
      <CardHeader className="pb-0 space-y-0">
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          {gRPercent}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6">
        <ChartContainer config={chartConfig} className="mt-2 h-[20vh] lg:h-[10vh] w-full">
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