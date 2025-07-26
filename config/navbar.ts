import { NavConfig } from "types";

const enNavConfig: NavConfig = {
  mainNav: [
    {
      title: "Products",
      href: "/group/new",
      path: "/group/",
    },
    {
      title: "Apps",
      href: "/apptype/new",
      path: "/apptype/",
    },
    // {
    //   title: "Search",
    //   href: "https://link.indiehackers.site/saas101",
    //   path: "https://link.indiehackers.site/saas101",
    //   external: true,
    // },
    // {
    //   title: "Guides",
    //   href: "/guides",
    //   path: "/guides",
    // },
    {
      title: "About",
      href: "/about",
      path: "/about",
    },
    // {
    //   title: "Blog",
    //   href: "/blog",
    //   path: "/blog",
    // },
  ],
}

const zhNavConfig: NavConfig = {
  mainNav: [
    {
      title: "工具",
      href: "/group/new",
      path: "/group/",
    },
    {
      title: "应用",
      href: "/apptype/new",
      path: "/apptype/",
    },
    {
      title: "搜索",
      href: "https://link.indiehackers.site/saas101",
      path: "https://link.indiehackers.site/saas101",
      external: true,
    },
    // {
    //   title: "教程",
    //   href: "/guides",
    //   path: "/guides",
    // },
    {
      title: "关于",
      href: "/about-zh",
      path: "/about-zh",
    },
    // {
    //   title: "博客",
    //   href: "/blog",
    //   path: "/blog",
    // },
    {
      title: "IndieHub",
      href: "https://indiehub.best",
      path: "https://indiehub.best",
      external: true,
    },
    {
      title: "Mkdirs",
      href: "https://mkdirs.com",
      path: "https://mkdirs.com",
      external: true,
    },
  ],
}

export const AllNavConfigs:{[key: string]: NavConfig} = {
  en: enNavConfig,
  zh: zhNavConfig,
}