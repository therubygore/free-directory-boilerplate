import ProductGridClient from "@/components/product-grid-client";
import { getAllSiteConfigs } from "@/config/site";
import { getListingsForUI } from "@/lib/airtable";
import { Metadata } from "next";

interface AppTypePageProps {
    params: {
        lang: string;
        type: string;
    }
}

// Generate metadata for the app type page
export async function generateMetadata({
    params,
}: AppTypePageProps): Promise<Metadata> {
    const { lang, type } = params;
    console.log('generateMetadata, lang:', lang, ', type:', type);

    const siteConfig = getAllSiteConfigs()[lang] || getAllSiteConfigs()['en'];
    
    // Convert type to readable name
    const typeName = type === 'featured' ? 'Featured' : 
                    type === 'new' ? 'New' : 
                    type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    const currentUrl = `${siteConfig?.url}/${lang}/type/${type}`;
    const canonicalUrl = `${siteConfig?.url}/en/type/${type}`;

    return {
        title: `${typeName} Tattoo Shops - ${siteConfig?.name}`,
        description: `Discover ${typeName.toLowerCase()} tattoo shops in Portland. ${siteConfig?.description}`,
        alternates: {
            canonical: currentUrl,
        },
    }
}

export default async function AppListPage({ params }: AppTypePageProps) {
    console.log('AppListPage, params:', params);

    const { lang, type } = params;
    const category = type;
    console.log('AppListPage, category:', category);

    try {
        let listings;
        
        if (category === 'featured') {
            // Get featured listings
            listings = await getListingsForUI({ 
                featured: true,
                status: 'Published',
                limit: 24
            });
        } else if (category === 'new') {
            // Get newest listings
            listings = await getListingsForUI({ 
                status: 'Published',
                limit: 24
            });
        } else {
            // Get listings by specific category
            const categoryName = category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            listings = await getListingsForUI({ 
                category: categoryName,
                status: 'Published',
                limit: 24
            });
        }

        console.log('AppListPage, found listings:', listings.length);

        return (
            <ProductGridClient lang={lang} itemList={listings} />
        );
    } catch (error) {
        console.error('Error loading listings:', error);
        
        // Return empty state on error
        return (
            <ProductGridClient lang={lang} itemList={[]} />
        );
    }
}