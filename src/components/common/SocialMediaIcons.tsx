'use client';

import { buttonVariants } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const GitHubButton = ({ className }: React.HTMLAttributes<HTMLAnchorElement>) => {
  return (
    <Link className={cn(`${buttonVariants({ variant: "outline", size: "icon" })} relative top-0 right-0 size-8 mr-2 w-fit h-fit p-2`, "shadow-none", className)}
      href={`${siteConfig.links.github}`}>
      <FaGithub />
      <span className="sr-only">GitHub</span>
    </Link>
  )
}