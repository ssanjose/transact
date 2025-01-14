// from: https://github.com/redpangilinan/iotawise/blob/main/components/pages/opensource.tsx
'use client';

import React, { useEffect } from "react"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { FaRegStar } from "react-icons/fa"
import LandingPageHeading from "@/components/landing/Heading"

function OpenSource() {
  const [stars, setStars] = React.useState(0)

  useEffect(() => {
    fetch("https://api.github.com/repos/ssanjose/transact", {
      next: { revalidate: 60 },
    })
      .then((res) => res.json())
      .then((data) => setStars(data.stargazers_count))
      .catch((e) => console.error(e))
  }, [])

  return (
    <section className="container py-12 lg:py-20">
      <div className="flex flex-col items-center gap-4">
        <LandingPageHeading
          mainHeading="Fully Open Source"
          subHeading="Feel free to view the codebase or contribute!"
          className="text-center"
        />
        <Link
          href={siteConfig.links.github}
          target="_blank"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          <FaRegStar className="h-4 w-4" />
          <span>{stars} on Github</span>
        </Link>
      </div>
    </section>
  )
}

export default OpenSource;