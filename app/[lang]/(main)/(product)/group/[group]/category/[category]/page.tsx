import ProductGridClient from "@/components/product-grid-client";
import { getAllSiteConfigs } from "@/config/site";
import { getListingsForUI } from "@/lib/airtable";
import { Metadata } from "next";

interface CategoryPageProps {
    params: {
        lang: string;
        group: string;
        category: string;
    }
}

// Generate metadata for the category page
export async function generateMetadata({
    params,
}: CategoryPageProps): Promise<Metadata> {
    const { lang, category } = params;
    console.log('generateMetadata, lang:', lang, ', category:', category);

    const siteConfig = getAllSiteConfigs()[lang] || getAllSiteConfigs()['en'];
    
    // Convert slug back to readable category name
    const categoryName = category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    const currentUrl = `${siteConfig?.url}/${lang}/category/${category}`;
    const canonicalUrl = `${siteConfig?.url}/en/category/${category}`;

    return {
        title: `${categoryName} Tattoo Shops - ${siteConfig?.name}`,
        description: `Find the best ${categoryName.toLowerCase()} tattoo shops in Portland. ${siteConfig?.description}`,
        alternates: {
            canonical: canonicalUrl,
        },
    }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    console.log('CategoryPage, params:', params);
    const { lang, category } = params;
    
    // Convert slug back to readable category name for Airtable query
    const categoryName = category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    console.log('CategoryPage, category:', categoryName);

    try {
        // Fetch listings from Airtable filtered by category
        const listings = await getListingsForUI({ 
            category: categoryName,
            status: 'Published'
        });

        console.log('CategoryPage, found listings:', listings.length);

        return (
            <ProductGridClient lang={lang} itemList={listings} />
        );
    } catch (error) {
        console.error('Error fetching category listings:', error);
        
        // Return empty state on error
        return (
            <ProductGridClient lang={lang} itemList={[]} />
        );
    }
}