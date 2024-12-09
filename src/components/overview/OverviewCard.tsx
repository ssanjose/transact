'use client';

import React from 'react';
import { cn } from '@/lib/utils';

const OverviewCard = ({ className, children }: { className?: string, children?: React.ReactNode }) => {
  return (
    <div className={cn("shadow border rounded p-2 flex items-center justify-content-center", className)}>
      <div className="w-fit h-full">
        {children}
      </div>
    </div>
  )
}

export default OverviewCard;