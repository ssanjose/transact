export type SiteConfig = {
  name: string;
  author: string;
  description: string;
  keywords: string[];
  url: {
    base: string;
    author: string;
  }
  links: {
    github: string;
    linkedin?: string;
  },
  ogImage: string;
  navLinks?: {
    href: string;
    text: string;
  }[],
}