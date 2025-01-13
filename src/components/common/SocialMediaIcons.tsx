'use client';

import { buttonVariants } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";
import { siteConfig } from "@/config/site";
import Link from "next/link";

export const GitHubButton = () => {
  return (
    <Link className={`${buttonVariants({ variant: "outline", size: "icon" })} shadow-none relative top-0 right-0 size-8 mr-2 w-fit h-fit p-2`}
      href={`${siteConfig.links.github}`}>
      <FaGithub />
      <span className="sr-only">GitHub</span>
    </Link>
  )
}