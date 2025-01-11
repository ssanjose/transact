"use client";

import React from "react"
import { ThemeModeToggle } from "@/components/theming/ThemeModeToggle";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 py-2 px-4 border-b flex justify-between items-center bg-background">
      <span className="text-foreground">
        Finance Tracker App
      </span>
      <ThemeModeToggle />
    </header>
  )
}

export default Header;