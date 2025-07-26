import { NavBar } from "@/components/layout/navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import { AllNavConfigs } from "@/config/navbar";

interface MarketingLayoutProps {
  params: { lang: string };
  children: React.ReactNode;
}

export default async function MarketingLayout({
  params,
  children,
}: MarketingLayoutProps) {
  const { lang } = params;
  const navConfig = AllNavConfigs[lang] || AllNavConfigs['en'];

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar lang={lang} items={navConfig.mainNav} scroll={true} />
      <main className="flex-1">{children}</main>
      <SiteFooter lang={lang} />
    </div>
  )
}
