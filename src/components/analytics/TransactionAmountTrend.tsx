'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import { TransactionAmountProps } from '@/services/analytics/props/analytics.props';

const chartConfig = {
  amount: {
    label: 'Amount',
    color: 'hsl(var(--primary))',
    gradient: {
      startOpacity: 0.8,
      endOpacity: 0.1,
    },
  },
}

const TransactionAmountTrend = ({ data }: { data: TransactionAmountProps[] }) => {
  console.log(data);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6">
        <ChartContainer config={chartConfig} className="mt-2 h-[25vh] lg:h-[50vh] w-full">
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: -10,
              bottom: 0,
            }}
          >
            <XAxis
              dataKey="date"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              tick={{ textAnchor: 'end' }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Bar
              dataKey="amount"
              fill="currentColor"
              radius={[4, 4, 0, 0]}
              className="fill-primary"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
};
TransactionAmountTrend.displayName = 'TransactionAmountTrend';

export default TransactionAmountTrend;