'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import LandingPageHeading from './Heading';
import { siteConfig } from '@/config/site';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { FaChartLine, FaListUl, FaOsi } from 'react-icons/fa';
import { LayoutTemplate } from 'lucide-react';

const cards = [
  {
    title: "Monitor Flow",
    description: "Easily add and track your frequent transactions and activities within each account, all in one place.",
    icon: FaListUl,
  },
  {
    title: "Discover Insights",
    description: "Get insights on your spending and income from different perspectives to make informed decisions.",
    icon: FaChartLine,
  },
  {
    title: "Seamless UI",
    description: "Enjoy a seamless user experience with a clean and intuitive user interface.",
    icon: LayoutTemplate,
  },
  {
    title: "Contribute",
    description: "Contribute to the open-source project by submitting your personal data for collection and analysis.",
    icon: FaOsi,
  },
]

const Cards = () => {
  return (
    <div className={cn(`grid grid-cols-1 md:grid-cols-4 gap-24 md:gap-10`)}>
      {cards.map((card, i) => (
        <Card key={i}
          className="bg-inherit flex grow flex-col gap-2 text-left border-0 shadow-none"
        >
          {<card.icon className="text-4xl size-9" />}
          <CardTitle className="text-2xl font-bold">{card.title}</CardTitle>
          <CardDescription className="text-sm">{card.description}</CardDescription>
        </Card>
      ))}
    </div>
  )
}

const Features = ({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <section id="features" className={cn(`text-center bg-secondary flex flex-col gap-10`, className)}>
      <LandingPageHeading
        mainHeading="Features"
        subHeading={`What does ${siteConfig.name} offer?`}
        className="pb-4"
      />
      <Cards />
    </section>
  );
}

export default Features;