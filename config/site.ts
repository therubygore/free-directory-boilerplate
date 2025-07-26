import { env } from "@/env.mjs";
import { SiteConfig } from "types";

const site_url = env.NEXT_PUBLIC_APP_URL;

export const enSiteConfig: SiteConfig = {
  name: "INDIE HACKERS",
  title: "Indie Hackers - Discover Top Products for Efficient Indie Hacking",
  description:
    "Indie Hackers - Explore the best products to help you ship next application faster and better",
  url: site_url,
  ogImage: `${site_url}/og.png`,
  links: {
    twitter: "https://x.com/javay_hu",
    github: "https://github.com/javayhu/free-directory-boilerplate",
    coffee: "https://buymeacoffee.com/javayhu",
  },
  mailSupport: "support@mkdirs.com",
  creator: "javayhu",
  subtitle: "Indie Hackers Tools - Explore the best products to help you ship next application faster and better",
};

const zhSiteConfig: SiteConfig = {
  name: "INDIE HACKERS TOOLS",
  title: "独立开发者导航站，发掘最优秀的工具，助力你快速发布下一个应用",
  description:
    "独立开发者导航站，发掘最优秀的工具，助力你快速发布下一个应用",
  url: site_url,
  ogImage: `${site_url}/og.png`,
  links: {
    twitter: "https://x.com/javay_hu",
    github: "https://github.com/javayhu/free-directory-boilerplate",
    coffee: "https://buymeacoffee.com/javayhu",
  },
  mailSupport: "support@mkdirs.com",
  creator: "javayhu",
  subtitle: "独立开发者导航站，发掘最优秀的工具，助力你快速发布下一个应用",
};

export const AllSiteConfigs: {[key: string]: SiteConfig} = {
  en: enSiteConfig,
  zh: zhSiteConfig,
}

export function getAllSiteConfigs() {
  return AllSiteConfigs;
}