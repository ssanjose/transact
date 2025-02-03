'use client';

import React from 'react';
import { ChevronDown, Inbox, LayoutDashboard, Settings, Tag } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link";
import { FaChartLine, FaCog } from 'react-icons/fa';
import { siteConfig } from '@/config/site';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { ThemeModeToggle } from '@/components/theming/ThemeModeToggle';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const inter = Inter({ subsets: ["latin"] });

// Menu items.
const items = [
  {
    title: "Overview",
    url: "/overview",
    icon: LayoutDashboard,
  },
  {
    title: "Accounts",
    url: "/account",
    icon: Inbox,
  },
  {
    title: "Categories",
    url: "/categories",
    icon: Tag,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

const analytics = [
  {
    title: "Dashboard",
    url: "/analysis/dashboard",
    icon: FaChartLine,
  },
  {
    title: "Settings",
    url: "/analysis/settings",
    icon: FaCog,
  },
]

const AppSidebar = () => {
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar variant="sidebar" side="left" className={cn("max-w-[200px]", inter.className)}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex justify-between items-center">
            <Link href={(siteConfig.navLinks![0].href) || '/'} onClick={() => setOpenMobile(false)} className="py-0">
              <h1 className="text-lg font-semibold">{siteConfig.name}</h1>
            </Link>
            <ThemeModeToggle className="size-8 bg-inherit mr-0" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent className="gap-0">
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} onClick={() => setOpenMobile(false)}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                Analysis
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {analytics.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link href={item.url
                        } onClick={() => setOpenMobile(false)}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

export default AppSidebar;