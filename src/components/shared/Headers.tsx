'use client';

import React from 'react';
import { cn } from '@/lib/utils';

const Title = ({ className, children }: { className?: string, children?: React.ReactNode }) => {
  return (
    <h1 className={cn("text-2xl md:text-3xl font-bold", className)}>
      {children}
    </h1>
  )
}

const SectionTitle = ({ className, children }: { className?: string, children?: React.ReactNode }) => {
  return (
    <h2 className={cn("text-xl md:text-2xl font-semibold", className)}>
      {children}
    </h2>
  )
}

export { Title, SectionTitle };