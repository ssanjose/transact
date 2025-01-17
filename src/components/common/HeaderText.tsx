'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface HeaderTextProps extends React.HTMLAttributes<HTMLDivElement> {
  mainHeading: string;
  subHeading?: string;
}

const HeaderText = ({ className, mainHeading, subHeading }: HeaderTextProps) => {
  return (
    <div className={cn(`flex flex-col items-start text-foreground`, className)}>
      {subHeading && (
        <p className="text-xs font-semibold text-muted-foreground">
          {subHeading}
        </p>
      )}
      <h2 className="text-md font-extrabold lg:text-2xl">
        {mainHeading}
      </h2>
    </div>
  )
};

export default HeaderText;