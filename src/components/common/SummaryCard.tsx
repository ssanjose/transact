'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const SummaryCard = ({
  title,
  subHeading,
  description,
  subDescription,
  svg,
  className }: { title: string, subHeading: string, description: string, subDescription?: string, svg: React.ReactNode, className: string }) => {
  return (
    <Card className={cn("flex flex-col gap-2", className)}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 p-4 pb-0 lg:p-6 lg:pb-0">
        <div>
          <CardTitle className="leading-none tracking-tight text-md">{title}</CardTitle>
          <CardDescription className="text-xs tracking-tight text-muted-foreground">{subHeading}</CardDescription>
        </div>
        {svg}
      </CardHeader>
      <CardContent className="flex flex-col items-start p-4 pt-0 lg:p-6 lg:pt-0">
        <span className="text-base md:text-lg font-bold">
          {description}
        </span>
        {subDescription && <p className="text-xs text-muted-foreground">{subDescription}</p>}
      </CardContent>
    </Card>
  )
};
SummaryCard.displayName = 'SummaryCard';

export default SummaryCard;