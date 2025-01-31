"use client"

import { Pie, PieChart as RechartsComponent, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

export interface ChartDataPoint {
  id: string | number;
  label: string;
  value: number;
  fill: string;
}

interface ChartConfigItem {
  label: string;
  color: string;
}

export interface PieChartConfig {
  [key: string]: ChartConfigItem;
}

interface PieChartProps extends Omit<React.HTMLProps<HTMLDivElement>, 'data'> {
  data: ChartDataPoint[];
  config: PieChartConfig;
  title: string;
  description?: string;
  loading?: boolean;
}

export const PieChart = ({
  className,
  data,
  config,
  title,
  description,
  loading = false,
  ...props
}: PieChartProps) => {
  if (loading) {
    return (
      <Card className={cn("flex flex-col", className)} {...props}>
        <CardHeader className="items-center pb-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </CardHeader>
        <CardContent className="flex-1">
          <Skeleton className="h-[250px] w-full rounded-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("flex flex-col", className)} {...props}>
      <CardHeader className="items-center pb-2">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="p-2 flex-1">
        <ChartContainer
          config={config}
          className="mx-auto aspect-square max-h-[250px] [&_.recharts-pie-label-text]:fill-foreground"
        >
          <ResponsiveContainer width="100%" height="100%">
            <RechartsComponent>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value) =>
                      new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD'
                      }).format(value as number)
                    }
                  />
                }
              />
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                label={{
                  fill: 'var(--foreground)',
                  fontSize: 12
                }}
                labelLine={false}
              />
            </RechartsComponent>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}