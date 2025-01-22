import { SiteConfig } from "@/lib/types/site";


export const siteConfig: SiteConfig = {
  name: "Transact",
  author: "Kurt San Jose",
  description: "A simple finance tracking app",
  keywords: [
    "Next.js",
    "React",
    "TailwindCSS",
    "shadcn/ui",
    "Dexie.js",
    "Next15",
    "Personal Finance",
    "Track",
    "Monitor",
    "Activity",
    "Visualization",
    "Analytics",
  ],
  url: {
    base: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    author: "https://kurtsanjose.dev",
  },
  links: {
    github: "https://github.com/ssanjose/transact",
  },
  navLinks: [
    { href: "/", text: "Home" },
    { href: "/#features", text: "Features" },
    { href: "/#about", text: "About" },
    { href: "/overview", text: "Overview" },
  ]
}