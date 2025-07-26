import { notFound } from "next/navigation";

import ProductSingleClient from "@/components/product-single-client";
import { getListingForUIBySlug } from "@/lib/airtable";
import { Metadata } from "next";
import { getAllSiteConfigs } from "@/config/site";

interface AppPageProps {
    params: {
        lang: string;
        app: string;
    }
}

// Generate metadata for the listing page
export async function generateMetadata({
    params,
}: AppPageProps): Promise<Metadata> {
    const { lang, app } = params;
    console.log('generateMetadata, lang:', lang, ', app', app);
    
    // URL decode the app slug
    const appSlug = decodeURIComponent(app);
    console.log('generateMetadata, appSlug:', appSlug);

    try {
        const listing = await getListingForUIBySlug(appSlug);
        console.log('AppPage, listing:', listing);
        
        if (!listing) {
            return {};
        }

        const siteConfig = getAllSiteConfigs()[lang] || getAllSiteConfigs()['en'];
        const currentUrl = `${siteConfig?.url}/${lang}/listing/${listing.slug}`;
        const canonicalUrl = `${siteConfig?.url}/en/listing/${listing.slug}`;

        return {
            title: `${listing.name} - ${siteConfig?.name}`,
            description: listing.desc || `${listing.name} tattoo shop in Portland`,
            alternates: {
                canonical: canonicalUrl,
            },
            openGraph: {
                type: "website",
                url: currentUrl,
                title: listing.name,
                images: listing.coverImage?.url ? [listing.coverImage.url] : [],
                description: listing.desc || `${listing.name} tattoo shop in Portland`,
            },
            twitter: {
                site: currentUrl,
                card: "summary_large_image",
                title: listing.name,
                description: listing.desc || `${listing.name} tattoo shop in Portland`,
                images: listing.coverImage?.url ? [listing.coverImage.url] : [],
            },
        }
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {};
    }
}

// Individual tattoo shop page
export default async function AppPage({ params }: AppPageProps) {
    const { lang, app } = params;
    console.log('AppPage, lang:', lang, ', app:', app);
    
    // URL decode the app slug
    const appSlug = decodeURIComponent(app);
    console.log('AppPage, appSlug:', appSlug);

    try {
        const listing = await getListingForUIBySlug(appSlug);
        console.log('AppPage, listing:', listing);
        
        if (!listing) {
            return notFound();
        }

        return (
            <ProductSingleClient lang={lang} product={listing} />
        );
    } catch (error) {
        console.error('Error loading listing:', error);
        return notFound();
    }
}