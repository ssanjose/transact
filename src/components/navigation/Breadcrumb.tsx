'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { excludePaths } from '@/config/site';

const Breadcrumbs = ({ className }: React.HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();
  const paths = pathname.split('/').filter(Boolean);

  return (
    <Breadcrumb className={cn("text-sm text-foreground border-l-2 pl-6", className)}>
      <BreadcrumbList>
        {paths.map((path, index) => {
          if (excludePaths.includes(path))
            return (
              <span key={index} className="flex items-center gap-2">
                <BreadcrumbItem className="capitalize">
                  <BreadcrumbEllipsis />
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </span>
            )

          return (
            <span key={index} className="flex items-center gap-2">
              <BreadcrumbItem className="capitalize">
                <BreadcrumbLink href={`/${paths.slice(0, index + 1).join('/')}`}>{path}</BreadcrumbLink>
              </BreadcrumbItem>
              {index < paths.length - 1 && <BreadcrumbSeparator />}
            </span>
          )
        })}
      </BreadcrumbList >
    </Breadcrumb >
  )
};

export default Breadcrumbs;