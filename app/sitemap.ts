import { env } from "@/env.mjs";
import { type MetadataRoute } from 'next';
import { i18n } from "../i18n-config";
import { getAirtableListings, getCategories } from "@/lib/airtable";

const site_url = env.NEXT_PUBLIC_APP_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    console.log('sitemap start');

    const sitemapList: MetadataRoute.Sitemap = []; // final result

    // Static routes
    const sitemapRoutes: MetadataRoute.Sitemap = [
        {
            url: '', // home
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: 'dashboard/submit',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: 'about',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: 'privacy',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: 'terms',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
    ];

    // Add static routes for each locale
    sitemapRoutes.forEach((route) => {
        i18n.locales.forEach((locale) => {
            const lang = `/${locale}`;
            const routeUrl = route.url === '' ? '' : `/${route.url}`;
            console.log(`sitemap, url:${site_url}${lang}${routeUrl}`);
            sitemapList.push({
                ...route,
                url: `${site_url}${lang}${routeUrl}`,
            });
        })
    })

    try {
        // Get data from Airtable
        const [listings, categories] = await Promise.all([
            getAirtableListings({ status: 'Published' }),
            getCategories(),
        ]);

        console.log('sitemap, listings size:', listings.length);
        console.log('sitemap, categories size:', categories.length);

        // Add listing pages
        listings.forEach((listing) => {
            i18n.locales.forEach((locale) => {
                const lang = `/${locale}`;
                if (listing.slug) {
                    const routeUrl = `/listing/${listing.slug}`;
                    console.log(`sitemap, url:${site_url}${lang}${routeUrl}`);
                    sitemapList.push({
                        url: `${site_url}${lang}${routeUrl}`,
                        lastModified: new Date(),
                        changeFrequency: 'weekly',
                        priority: 0.9,
                    });
                } else {
                    console.warn(`sitemap, slug invalid, id:${listing.id}`);
                }
            })
        })

        // Add category pages
        categories.forEach((category) => {
            i18n.locales.forEach((locale) => {
                const lang = `/${locale}`;
                // Create a slug from category name (replace spaces with hyphens, lowercase)
                const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
                const routeUrl = `/category/${categorySlug}`;
                console.log(`sitemap, url:${site_url}${lang}${routeUrl}`);
                sitemapList.push({
                    url: `${site_url}${lang}${routeUrl}`,
                    lastModified: new Date(),
                    changeFrequency: 'weekly',
                    priority: 0.7,
                });
            })
        })

    } catch (error) {
        console.error('Error generating sitemap:', error);
    }

    console.log('sitemap end, size:', sitemapList.length);
    return sitemapList;
}