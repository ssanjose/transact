import type { Metadata } from "next";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import "../globals.css";
import ThemeProvider from "@/components/theming/ThemeProvider";
import { siteConfig } from "@/config/site";
import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';

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

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header className="w-11/12 sm:w-4/5 max-w-[1300px] mx-auto mt-2" />
          {children}
          <Footer className="w-11/12 sm:w-4/5 max-w-[1300px] mx-auto mb-10" />
        </ThemeProvider>
      </body>
    </html >
  );
}
