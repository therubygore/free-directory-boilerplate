import { SidebarNavItem } from "@/types";

const enFooterConfig: SidebarNavItem[] = [
    {
        title: "Company",
        items: [
            { title: "About Site", href: "/about" },
            { title: "Privacy Policy", href: "/privacy" },
            { title: "Terms of Service", href: "/terms" },
        ],
    },
    {
        title: "Features",
        items: [
            { title: "Products", href: "/group/new" },
            { title: "Applications", href: "/apptype/new" },
            // { title: "Search", external: true, href: "https://link.indiehackers.site/saas101" },
        ],
    },
    {
        title: "Links",
        items: [
            // { title: "Sponsors", external: true, href: "https://buymeacoffee.com/javayhu" },
        ],
    },
];

const zhFooterConfig: SidebarNavItem[] = [
    {
        title: "公司",
        items: [
            { title: "关于本站", href: "/about-zh" },
            { title: "隐私政策", href: "/privacy" },
            { title: "服务条款", href: "/terms" },
        ],
    },
    {
        title: "功能",
        items: [
            { title: "产品工具", href: "/group/new" },
            { title: "独立应用", href: "/apptype/new" },
            // { title: "搜索工具", external: true, href: "https://link.indiehackers.site/saas101" },
        ],
    },
    {
        title: "资源",
        items: [
            // { title: "赞助支持", external: true, href: "https://buymeacoffee.com/javayhu" },
            // { title: "产品规划", external: true, href: "https://indiehackers.canny.io/" },
            // { title: "问题反馈", external: true, href: "https://indiehackers.canny.io/feedback" },
            // { title: "更新日志", external: true, href: "https://indiehackers.canny.io/changelog" },
            { title: "Mkdirs", external: true, href: "https://mkdirs.com?ref=opensource" },
            { title: "IndieHub", external: true, href: "https://indiehub.best?ref=opensource" },
            { title: "Free OG Generator", external: true, href: "https://og.indiehub.best?ref=opensource" },
        ],
    },
];

export const AllFooterConfigs:{[key: string]: SidebarNavItem[]} = {
    en: enFooterConfig,
    zh: zhFooterConfig,
}