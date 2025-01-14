'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface LandingPageHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  mainHeading: string;
  subHeading?: string;
}

const LandingPageHeading = ({ className, mainHeading, subHeading }: LandingPageHeadingProps) => {
  return (
    <div className={cn(``, className)}>
      <h2 className="text-3xl font-bold lg:text-4xl pb-1">
        {mainHeading}
      </h2>
      {subHeading && (
        <p className="text-md font-light text-muted-foreground lg:text-lg">
          {subHeading}
        </p>
      )}
    </div>
  )
};

export default LandingPageHeading;