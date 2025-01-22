'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { buttonVariants } from '@/components/ui/button';
import { FaGithub } from 'react-icons/fa';
import ImageFrame from '@/components/common/ImageFrame';

const Hero = ({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <section className={cn(`flex flex-col items-center justify-center`, className)}>
      <div className="flex flex-col max-w-[64rem] gap-2 items-center justify-center text-center">
        <Link
          href={siteConfig.links.github}
          className="rounded-2xl bg-muted hover:bg-secondary px-4 py-1.5 text-sm font-medium"
          target="_blank"
        >
          Free and open source!
        </Link>
        <h1 className="text-4xl font-semibold sm:text-5xl md:text-6xl lg:text-7xl">
          Track your spending.
        </h1>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Monitor your income, and expenses with little effort.
          Visualize your transactions with beautiful charts!
        </p>
        <div className="flex gap-4">
          <Link
            href="/overview"
            className={cn(buttonVariants({ variant: "default" }))}
          >
            Get Started
          </Link>
          <Link
            href={siteConfig.links.github}
            target="_blank"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <FaGithub />
            <span>GitHub</span>
          </Link>
        </div>
      </div>
      <ImageFrame
        src="/transact_hero.jpg"
        width="1000"
        height="800"
        alt="Hero Image"
        className=""
        containerClassName="border-2 border-secondary"
      />
    </section>
  )
}

export default Hero;