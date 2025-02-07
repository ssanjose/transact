'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface HeaderTextProps extends React.HTMLAttributes<HTMLDivElement> {
  mainHeading: string;
  subHeading?: string;
}

const HeaderText = ({ className, mainHeading, subHeading }: HeaderTextProps) => {
  return (
    <div className={cn(`flex items-center justify-between`, className)}>
      <h2 className="text-base md:text-lg font-extrabold text-accent-foreground">
        {mainHeading}
      </h2>
      {subHeading && (
        <p className="text-xs font-normal md:font-semibold text-muted-foreground">
          {subHeading}
        </p>
      )}
    </div>
  )
};

export default HeaderText;