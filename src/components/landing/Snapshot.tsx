'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import LandingPageHeading from '@/components/landing/Heading';
import ImageFrame from '@/components/common/ImageFrame';

const images = [
  {
    src: "/transact_overview.jpg",
    alt: "Transact Overview",
    width: 1000,
    height: 800,
    className: "",
  },
  {
    src: "/transact_categories.jpg",
    alt: "Transact Landing",
    width: 1000,
    height: 800,
    className: "",
  },
  {
    src: "/transact_account_form.jpg",
    alt: "Account Form",
    width: 1000,
    height: 800,
    className: "",
  },
  {
    src: "/transact_transaction_form.jpg",
    alt: "Transact Landing",
    width: 1000,
    height: 800,
    className: "",
  },
  {
    src: "/transact_account_view.jpg",
    alt: "Transact Landing",
    width: 1000,
    height: 800,
    className: "",
  },
  {
    src: "/transact_specific_account_view.jpg",
    alt: "Transact Landing",
    width: 1000,
    height: 800,
    className: "",
  },
]

const Images = () => {
  return (
    <div className={cn(`grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8`)}>
      {images.map((image, i) => (
        <ImageFrame key={i}
          src={image.src}
          width={image.width}
          height={image.height}
          alt={image.alt}
          className={image.className}
          containerClassName="mt-[2rem] mx-0 border-2 border-secondary"
        />
      ))}
    </div>
  )
}

const Snapshot = ({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <section id="about" className={cn(`text-center flex flex-col`, className)}>
      <LandingPageHeading
        className="pb-4 min-h-[5rem]"
        mainHeading="Want more?"
        subHeading="Take a peek of what's to come"
      />
      <Images />
    </section>
  )
}

export default Snapshot;