import {
  apiAuthPrefix,
  publicRoutes,
  restrictedRoutes
} from "@/routes";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import NextAuth, { Session } from "next-auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { i18n } from "./i18n-config";

import { env } from "@/env.mjs";
import authConfig from "./auth.config";

function getLocale(request: NextRequest): string | undefined {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales;

  // Use negotiator and intl-localematcher to get best locale
  let languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales,
  );

  const locale = matchLocale(languages, locales, i18n.defaultLocale);
  return locale;
}

const { auth: middleware } = NextAuth(authConfig);

export default middleware((request: NextRequest & { auth: Session | null }): Response | void => {
  console.log('middleware, request url:', request.url);
  console.log('middleware, next url:', request.nextUrl.href);
  const pathname = request.nextUrl.pathname;
  console.log('middleware, pathname:', pathname);

  // // `/_next/` and `/api/` are ignored by the watcher, but we need to ignore files in `public` manually.
  if (
    [
      '/og.png',
      '/logo.png',
      '/favicon.ico',
      '/favicon-16x16.png',
      '/favicon-32x32.png',
      '/apple-touch-icon.png',
      '/android-chrome-192x192.png',
      '/android-chrome-512x512.png',
      '/site.webmanifest',
      '/google04f08bcda3b90dec.html',
      '/robots.txt',
      '/sitemap.xml',
      
      // '/images/home-office.png',
      // '/images/remote-work.png',
      // '/images/idea-launch.png',
      // '/images/work-from-home.png',
      // '/images/blog/blog-post-1.jpg',
      // '/images/blog/blog-post-2.jpg',
      // '/images/blog/blog-post-3.jpg',
      // '/images/blog/blog-post-4.jpg',
      // '/images/avatars/javayhux.png',
      // '/images/avatars/javayhu.png',
      // '/images/avatars/shadcn.png',

      // Your other files in `public`
    ].includes(pathname)
  ) {
    console.log('middleware, return public file:', pathname);
    return;
  }

  if (pathname && pathname.startsWith('/images/')) {
    console.log('middleware, return public image file:', pathname);
    return;
  }

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );
  console.log('middleware, pathnameIsMissingLocale:', pathnameIsMissingLocale);

  // Redirect if there is no locale
  const locale = getLocale(request);
  console.log('middleware, locale:', locale);
  if (pathnameIsMissingLocale) {
    let redirectUrl = `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`;
    console.log('middleware, redirectUrl:', redirectUrl);

    // append search params from the incoming request to the redirect url
    if (request.nextUrl.search) {
      redirectUrl += request.nextUrl.search;
      console.log('middleware, redirectUrl with search:', redirectUrl);
    }

    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(
      new URL(redirectUrl, request.url,),
    );
  }

  // url has locale, continue validating auth
  const { nextUrl } = request;
  const isLoggedIn = !!request.auth;
  console.log('middleware, nextUrl:', nextUrl.href, 'isLoggedIn:', isLoggedIn);
  console.log('middleware, env.MODE:', env.MODE, 'env.NODE_ENV:', env.NODE_ENV);

  // remove all possible locales when comparing pathname
  let nextUrlPathname = nextUrl.pathname;  
  i18n.locales.map((locale) => {
    nextUrlPathname = nextUrlPathname.replace(
      new RegExp(`^/${locale}`),
      "",
    );
  });
  const nextUrlPathNameWithoutLocale = nextUrlPathname === "" ? "/" : nextUrlPathname;
  console.log('middleware, nextUrlPathNameWithoutLocale:', nextUrlPathNameWithoutLocale);

  // if restricted routes
  const isRestrictedRoute = restrictedRoutes.some((route) => {
    return nextUrlPathNameWithoutLocale.startsWith(route);
  });
  console.log('middleware, isRestrictedRoute:', isRestrictedRoute);  
  // env.MODE: undefined env.NODE_ENV: undefined
  if (/* env.MODE === "development" &&  */isRestrictedRoute) {
    console.log('middleware, redirect to index');
    return Response.redirect(
      new URL(`/${locale}`, nextUrl),
    );
  }

  // if api auth routes, just return
  const isApiAuthRoute = nextUrlPathNameWithoutLocale.startsWith(apiAuthPrefix);
  console.log('middleware, isApiAuthRoute:', isApiAuthRoute);
  // if api auth route, just return
  if (isApiAuthRoute) {
    console.log('middleware, isApiAuthRoute, return auth');
    return;
  }

  // if public routes
  const isPublicRoute = publicRoutes.some((route) => {
    // console.log('middleware, route:', route, 'nextUrl:', nextUrlPathNameWithoutLocale);
    if (route === "/") {
      return nextUrlPathNameWithoutLocale === route;
    } else {
      return nextUrlPathNameWithoutLocale.startsWith(route);
    }
  });
  console.log('middleware, isPublicRoute:', isPublicRoute);

  // if logged in and going to auth route, redirect to dashboard
  // if (isAuthRoute) {
  //   if (isLoggedIn) {
  //     // use DEFAULT_REDIRECT_HOME_URL and nextUrl to create the redirect URL
  //     console.log('middleware, isAuthRoute & loggedIn, return dashboard');
  //     return Response.redirect(new URL(`/${locale}${DEFAULT_REDIRECT_HOME_URL}`, nextUrl));
  //   }
  //   return;
  // }

  // if not logged in and not on public route, redirect to login => index page
  if (!isLoggedIn && !isPublicRoute) {
    // let callbackUrl = nextUrl.pathname;
    // if (nextUrl.search) {
    //   callbackUrl += nextUrl.search;
    // }

    // if we have login page, redirect to it, but now we disabled it
    // const encodedCallbackUrl = encodeURICompo  nent(callbackUrl);
    // return Response.redirect(
    //   new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl),
    // );

    console.log('middleware, redirect to index:', `/${locale}`);
    return Response.redirect(
      new URL(`/${locale}`, nextUrl),
    );
  }

  console.log('middleware, final goto nextUrl:', nextUrl.href);
  return;
},
);

// Optionally, don't invoke Middleware on some paths
// Note: This crazy looking regex basically matches every single request made to the server, 
// meaning that every request has to go through the middleware checks. 
// You can however define only private routes here, but the former gives you more control and is strongly advisable.
export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/"],
  // matcher: ["/((?!.+\\.[\\w]+$|_next|api).*)", "/"],
};
