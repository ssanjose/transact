// landing page inspired by https://github.com/redpangilinan/iotawise
'use client';

import React from 'react';

import ContentContainer from '@/components/common/ContentContainer';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Snapshot from '@/components/landing/Snapshot';
import OpenSource from '@/components/landing/StarCount';

const inter = Inter({ subsets: ["latin"] });

const Home = () => {
  return (
    <main>
      <ContentContainer className={cn(`items-center justify-items-center h-full w-full p-0 m-0 sm:p-0 sm:m-0`, inter.className, "w-[98%] lg:w-full relative top-0 flex flex-col gap-24")}>
        <Hero className="w-full mt-[5rem] md:mt-[8rem]" />
        <Features className="px-[4rem] py-[3rem] md:px-[8rem] md:py-[6rem]" />
        <Snapshot className="mx-[2rem] md:mx-[3.5rem]" />
        <OpenSource />
      </ContentContainer>
    </main>
  );
}

export default Home;