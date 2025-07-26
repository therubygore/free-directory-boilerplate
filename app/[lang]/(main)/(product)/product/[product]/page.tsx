import { notFound } from "next/navigation";

import ProductSingleClient from "@/components/product-single-client";
import { getListingForUIBySlug } from "@/lib/airtable";
import { Metadata } from "next";
import { getAllSiteConfigs } from "@/config/site";

interface ProductPageProps {
    params: {
        lang: string;
        product: string;
    }
}

// Generate metadata for the product page
export async function generateMetadata({
    params,
}: ProductPageProps): Promise<Metadata> {
    const { lang, product } = params;
    console.log('generateMetadata, lang:', lang, ', product:', product);

    try {
        const listing = await getListingForUIBySlug(product);
        console.log('ProductPage, listing:', listing);
        
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
export default async function ProductPage({ params }: ProductPageProps) {
    const { lang, product } = params;
    console.log('ProductPage, lang:', lang, ', product', product);

    try {
        const listing = await getListingForUIBySlug(product);
        console.log('ProductPage, listing:', listing);
        
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