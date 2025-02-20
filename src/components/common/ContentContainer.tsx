'use client';

import React from 'react';
import { cn } from '@/lib/utils';

const ContentContainer = ({ children, className }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div id="top" className={cn(`w-full p-0 px-2 pt-2 sm:pb-10 sm:px-4 sm:pt-4 relative`, className)}>
      {children}
    </div>
  );
}

export default ContentContainer;