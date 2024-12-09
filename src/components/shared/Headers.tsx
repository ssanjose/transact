'use client';

import React from 'react';
import { cn } from '../../lib/utils';

const SectionTitle = ({ className, children }: { className?: string, children?: React.ReactNode }) => {
  return (
    <h2 className={cn("text-1xl mb-2", className)}>
      {children}
    </h2>
  )
}

export { SectionTitle };