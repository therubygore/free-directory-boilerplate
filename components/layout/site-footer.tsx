import Link from "next/link";
import * as React from "react";

import { ModeToggle } from "@/components/layout/mode-toggle";
import { cn } from "@/lib/utils";

import { SiteFooterInfo } from "@/components/sections/site-footer-info";
import { AllFooterConfigs } from "@/config/footer";
import { NavItem, SidebarNavItem } from "@/types";

interface SiteFooterProps extends React.HTMLAttributes<HTMLElement> {
  lang: string;
}

export function SiteFooter({ className, lang }: SiteFooterProps) {
  // console.log('SiteFooter, lang:', lang);
  const footerConfig = AllFooterConfigs[lang];

  return (
    <footer className={cn("border-t", className)}>
      <div className="container grid grid-cols-2 gap-6 space-y-4 py-14 sm:grid-cols-3 md:grid-cols-5">
        <div className="flex flex-col items-start col-span-5 md:col-span-2">
          <SiteFooterInfo lang={lang} />
        </div>

        {
          footerConfig.map((section: SidebarNavItem) => (
            <div key={section.title}>
              <span className="text-sm font-medium text-foreground">
                {section.title}
              </span>
              <ul className="mt-4 list-inside space-y-3">
                {
                  section.items?.map((link: NavItem) => (
                    <li key={link.title}>
                      <Link prefetch={false}
                        href={link.external ? link.href : `/${lang}${link.href}`}
                        target={link.external ? "_blank" : "_self"}
                        className="text-sm text-muted-foreground hover:text-primary"
                      >
                        <h4>{link.title}</h4>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))
        }
      </div>

      <div className="border-t py-8">
        <div className="container flex items-center justify-between">
          <span className="text-muted-foreground text-sm">
            Copyright &copy; 2024. All Rights Reserved.
          </span>

          <div className="flex items-center gap-2">
            <ModeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
