"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import useSettings from "@/hooks/use-settings"
import { formatCurrency } from "@/lib/format/formatCurrency"

export interface AreaChartDataPoint {
  date: string;
  [key: string]: string | number;
}

interface AreaChartConfigItem {
  label: string;
  color: string;
  gradient?: {
    startOpacity?: number;
    endOpacity?: number;
  };
}

export interface AreaChartConfig {
  [key: string]: AreaChartConfigItem;
}

interface StackedGradientAreaChartProps extends Omit<React.HTMLProps<HTMLDivElement>, 'data'> {
  data: AreaChartDataPoint[];
  config: AreaChartConfig;
  title?: string;
  description?: string;
  loading?: boolean;
  showHeader?: boolean;
  showLegend?: boolean;
}

export const StackedGradientAreaChart = ({
  className,
  data,
  config,
  title,
  description,
  loading = false,
  showHeader = true,
  showLegend = true,
  ...props
}: StackedGradientAreaChartProps) => {
  const { settings } = useSettings();
  const gradientDefinitions = React.useMemo(() =>
    Object.entries(config).map(([key, value]) => (
      <linearGradient key={key} id={`fill${key}`} x1="0" y1="0" x2="0" y2="1">
        <stop
          offset="5%"
          stopColor={value.color}
          stopOpacity={value.gradient?.startOpacity ?? 0.8}
        />
        <stop
          offset="95%"
          stopColor={value.color}
          stopOpacity={value.gradient?.endOpacity ?? 0.1}
        />
      </linearGradient>
    ))
    , [config]);

  const areaComponents = React.useMemo(() =>
    Object.entries(config).map(([key, value]) => (
      <Area
        key={key}
        dataKey={key}
        type="natural"
        fill={`url(#fill${key})`}
        stroke={value.color}
        stackId="a"
      />
    ))
    , [config]);

  if (!loading) {
    return (
      <Card {...props} className={className}>
        {showHeader && (
          <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
            <div className="grid flex-1 gap-1 text-center sm:text-left">
              {title && <CardTitle>{title}</CardTitle>}
              {description && <CardDescription>{description}</CardDescription>}
            </div>
          </CardHeader>
        )}
        <CardContent className="px-2 pt-4 sm:px-4">
          <ChartContainer
            config={config}
            className="aspect-auto h-[230px] w-full"
          >
            <AreaChart data={data}
              margin={{
                left: 10,
              }}
            >
              <defs>
                {gradientDefinitions}
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatCurrency(value, settings.currencyFormat)}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }}
                    indicator="dot"
                  />
                }
              />
              {areaComponents}
              {showLegend && <ChartLegend
                className="flex flex-wrap justify-center"
                content={<ChartLegendContent />} />}
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className} {...props}>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-4">
        <ChartContainer
          config={config}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={data}>
            <defs>
              {gradientDefinitions}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            {areaComponents}
            {showLegend && <ChartLegend
              className="flex flex-wrap justify-center"
              content={<ChartLegendContent />} />}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

StackedGradientAreaChart.displayName = "StackedGradientAreaChart"

export default StackedGradientAreaChart