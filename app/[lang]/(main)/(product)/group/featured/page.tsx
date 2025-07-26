import ProductGridClient from "@/components/product-grid-client";
import { getAllSiteConfigs } from "@/config/site";
import { getListingsForUI } from "@/lib/airtable";
import { Metadata } from "next";

interface FeaturedPageProps {
    params: { lang: string; };
}

// Generate metadata for the featured page
export async function generateMetadata({
    params,
}: FeaturedPageProps): Promise<Metadata> {
    const { lang } = params;
    console.log('generateMetadata, lang:', lang);
    
    const siteConfig = getAllSiteConfigs()[lang] || getAllSiteConfigs()['en'];
    const currentUrl = `${siteConfig?.url}/${lang}/featured`;
    const canonicalUrl = `${siteConfig?.url}/en/featured`;

    return {
        title: `Featured Tattoo Shops - ${siteConfig?.name}`,
        description: `Discover our featured tattoo shops in Portland. ${siteConfig?.description}`,
        alternates: {
            canonical: canonicalUrl,
        },
    }
}

export default async function FeaturedPage({ params }: FeaturedPageProps) {
    console.log('FeaturedPage, params:', params);
    const { lang } = params;

    try {
        // Get all published listings from Airtable (Featured field not available yet)
        const listings = await getListingsForUI({ 
            status: 'Published',
            limit: 48
        });

        console.log('FeaturedPage, featured listings:', listings.length);

        return (
            <ProductGridClient lang={lang} itemList={listings} />
        );
    } catch (error) {
        console.error('Error loading featured listings:', error);
        
        // Return empty state on error
        return (
            <ProductGridClient lang={lang} itemList={[]} />
        );
    }
}