"use client"

import { Pie, PieChart as RechartsComponent } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

export interface ChartDataPoint {
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
  showLegend?: boolean;
}

export const PieChart = ({
  className,
  data,
  config,
  title,
  description,
  loading = false,
  showLegend = false,
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
          <RechartsComponent>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                />
              }
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={"40%"}
              outerRadius={"80%"}
              paddingAngle={2}
              label={{
                fill: 'var(--foreground)',
                fontSize: 10,
              }}
              labelLine={true}
            />
            {
              showLegend && (
                <ChartLegend
                  content={
                    <ChartLegendContent nameKey="label" />
                  }
                  className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                />
              )
            }
          </RechartsComponent>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}