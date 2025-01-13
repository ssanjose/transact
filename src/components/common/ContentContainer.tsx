'use client';

import React from 'react';
import { cn } from '@/lib/utils';

const ContentContainer = ({ children, className }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn(`w-full p-0 px-2 sm:pb-10 sm:px-4 relative font-[family-name:var(--font-geist-sans)]`, className)}>
      {children}
    </div>
  );
}

export default ContentContainer;