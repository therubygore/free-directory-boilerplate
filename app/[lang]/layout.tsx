import "@/styles/globals.css";

import { fontSourceSans, fontSourceSerif } from "@/assets/fonts";
import { Analytics } from "@/components/analytics";
import { ModalProvider } from "@/components/modal-provider";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { AllSiteConfigs, enSiteConfig } from "@/config/site";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from 'sonner';
import { i18n, type Locale } from "../../i18n-config";
import { Metadata } from "next";
import { cn } from "@/lib/utils";
// import NextTopLoader from 'nextjs-toploader';

// https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes#segment-runtime-option
// You can also define runtime on a layout level, which will make all routes under the layout run on the edge runtime.
// export const runtime = 'edge';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata({
  params,
}: { params: { lang: Locale } }): Promise<Metadata> {
  const { lang } = params;
  const siteConfig = AllSiteConfigs[lang] || AllSiteConfigs['en'];

  return {
    title: {
      default: siteConfig.title,
      template: `%s | ${siteConfig.title}`,
    },
    description: siteConfig.description,
    applicationName: siteConfig.name,
    keywords: [
      "indie hacker",
      "indie hacker tools",
      "indie hackers products",
      "best apps for indie hackers",
      "efficient application shipping tools",
    ],
    authors: [
      {
        name: siteConfig.creator,
      },
    ],
    creator: siteConfig.creator,
    publisher: siteConfig.creator,
    metadataBase: new URL(siteConfig.url),
    openGraph: {
      type: "website",
      url: siteConfig.url,
      title: siteConfig.title,
      images: [siteConfig.ogImage],
      description: siteConfig.description,
      siteName: siteConfig.name,
    },
    twitter: {
      site: siteConfig.url,
      card: "summary_large_image",
      title: siteConfig.title,
      description: siteConfig.description,
      images: [siteConfig.ogImage],
      creator: `@${siteConfig.creator}`,
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon-32x32.png",
      apple: "/apple-touch-icon.png",
    },
    manifest: `${enSiteConfig.url}/site.webmanifest`,
  }
}

// TODO(javayhu) I dont know why is lang not language???
interface RootLayoutProps {
  children: React.ReactNode;
  params: { lang: Locale };
}

// { children }: RootLayoutProps
export default function RootLayout({ children, params }: RootLayoutProps) {
  console.log('RootLayout, params:', params);
  const { lang } = params;
  // const queryParams = {...COMMON_PARAMS, lang: params.lang};
  // console.log('RootLayout, queryParams:', queryParams);

  return (
    <html lang={params.lang} suppressHydrationWarning>
      <head>
      </head>
      <body
        className={cn(
          "mx-auto min-h-screen bg-background antialiased",
          fontSourceSans.className, // default text font
          fontSourceSerif.variable, // font for headings
        )}
      >
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {/* spinner shows at top right, shadow={false} */}
            {/* https://www.npmjs.com/package/nextjs-toploader */}
            {/* NextTopLoader is missleading, page is ready but loader is still there */}
            {/* <NextTopLoader color="#7C3AED" height={1}
              initialPosition={0.1}
              shadow={false}
              showSpinner={false} /> */}

            {children}

            {/* https://sonner.emilkowal.ski/toaster */}
            <Toaster richColors position="top-right" offset={64} />
            <ModalProvider lang={lang} />
            <TailwindIndicator />

            <Analytics />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
