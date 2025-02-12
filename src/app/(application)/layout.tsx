import type { Metadata } from "next";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import "../globals.css";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/navigation/AppSidebar";
import ThemeProvider from "@/components/theming/ThemeProvider";
import { MetadataConfig } from "@/config/site";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import Breadcrumbs from "@/components/navigation/Breadcrumb";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ["latin"] });

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = MetadataConfig;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(`${geistSans.variable} ${geistMono.variable} antialiased`, inter.className)}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <Header className="sr-only" />
            <SidebarInset className="pt-2">
              <div className="flex justify-left items-center">
                <SidebarTrigger className="mx-4" />
                <Breadcrumbs />
              </div>
              {children}
              <Footer className="w-full mx-auto my-5 md:my-10" />
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html >
  );
}
