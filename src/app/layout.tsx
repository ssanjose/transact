import type { Metadata } from "next";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import "./globals.css";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/navigation/AppSidebar";
import ThemeProvider from "@/components/theming/ThemeProvider";
import Header from "./header";
import { siteConfig } from "@/config/site";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: siteConfig.author,
      url: siteConfig.url.author
    },
  ],
  creator: siteConfig.author,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <SidebarInset className="pt-2">
              <div className="flex justify-left items-center">
                <SidebarTrigger className="mx-4" />
              </div>
              {children}
              <footer className="z-50 p-2 border-t flex justify-between items-center bg-background">
                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facere, tempora! Quisquam voluptatibus repellendus reiciendis eaque aliquam reprehenderit, animi, eos non laborum maxime sed eum necessitatibus. Enim perspiciatis dignissimos ducimus modi?</p>
              </footer>
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html >
  );
}
