"use client";

import React, { HTMLAttributes } from "react"
import { ThemeModeToggle } from "@/components/theming/ThemeModeToggle";
import { cn } from "@/lib/utils";
import { Inter } from 'next/font/google';
import { siteConfig } from "@/config/site";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

const Icons = () => {
  return (
    <div className="">
      <ThemeModeToggle className="size-8 md:size-10" />
    </div>
  )
}

export const Links = ({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("m-auto flex hidden sm:block", className)} style={{ width: "100%", maxWidth: "20rem", height: "1.5rem" }}>
      <div className="flex gap-2 items-center w-fit absolute m-auto right-0 left-0 justify-center item-center">
        <ul className="flex flex-row gap-6">
          {siteConfig.navLinks?.map(({ href, text }) => (
            <li key={href}>
              <Link href={href + (href === '/' ? '#top' : "")} className="text-md text-inherit opacity-70 hover:opacity-100 hover:underline">
                {text}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const Header = ({ className }: HTMLAttributes<HTMLElement>) => {
  return (
    <header className={cn(`py-2 flex justify-between items-center bg-background`, className, inter.className)}
    >
      <Link href="/">
        <h1 className="text-foreground text-xl md:text-2xl font-bold">
          {siteConfig.name}
        </h1>
      </Link>
      <Links />
      <Icons />
    </header>
  )
}

export default Header;