'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { ThemeProvider as StaticProvider } from 'next-themes';

// dynamic import
// see https://github.com/shadcn-ui/ui/issues/5552#issuecomment-2435053678
const DynProvider = dynamic(
  () => import('next-themes').then((e) => e.ThemeProvider),
  { ssr: false }
);

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof StaticProvider>) {
  const NextThemeProvider = process.env.NEXT_PUBLIC_NODE_ENV === 'production' ? StaticProvider : DynProvider;

  return (
    <NextThemeProvider {...props}>
      {children}
    </NextThemeProvider>
  );
}

export default ThemeProvider;