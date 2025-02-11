'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { cn } from '@/lib/utils';

const SummaryCard = ({
  title,
  subHeading,
  description,
  className }: { title: string, subHeading: string, description: string, className: string }) => {
  return (
    <Card className={cn("flex flex-col gap-2", className)}>
      <CardHeader className="space-y-0 p-4 pb-0 lg:p-6 lg:pb-0">
        <CardTitle className="leading-none tracking-tight text-sm">{title}</CardTitle>
        <CardDescription className="text-xs md:text-sm tracking-tight">{subHeading}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-2 p-4 pt-0 lg:p-6 lg:pt-2">
        <span className="text-base md:text-lg font-semibold">
          {description}
        </span>
      </CardContent>
    </Card>
  )
};
SummaryCard.displayName = 'SummaryCard';

export default SummaryCard;