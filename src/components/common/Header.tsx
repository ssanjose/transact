"use client";

import React from "react"
import { ThemeModeToggle } from "@/components/theming/ThemeModeToggle";
import { GitHubButton } from "@/components/common/SocialMediaIcons";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 py-2 px-4 border-b flex justify-between items-center bg-background">
      <span className="text-foreground text-xl md:text-2xl">
        Finance Tracker App
      </span>
      <div>
        <GitHubButton />
        <ThemeModeToggle />
      </div>
    </header>
  )
}

export default Header;