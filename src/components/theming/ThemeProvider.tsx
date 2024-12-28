'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// dynamic import
// see https://github.com/shadcn-ui/ui/issues/5552#issuecomment-2435053678
const NextThemeProvider = dynamic(
  () => import('next-themes').then((e) => e.ThemeProvider),
  { ssr: false }
);

const ThemeProvider = ({ children, ...props }: React.ComponentProps<typeof NextThemeProvider>) => {
  return (
    <NextThemeProvider {...props}>
      {children}
    </NextThemeProvider>
  );
}

export default ThemeProvider;