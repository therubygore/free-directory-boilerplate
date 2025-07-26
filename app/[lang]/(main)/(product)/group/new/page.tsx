import ProductGridClient from "@/components/product-grid-client";
import { AllSiteConfigs } from "@/config/site";
import { getListingsForUI } from "@/lib/airtable";
import { Metadata } from "next";

interface NewPageProps {
  params: { lang: string };
}

// Generate metadata for the new listings page
export async function generateMetadata({
  params,
}: NewPageProps): Promise<Metadata> {
  const { lang } = params;
  
  const siteConfig = AllSiteConfigs[lang] || AllSiteConfigs['en'];
  const currentUrl = `${siteConfig?.url}/${lang}/new`;
  const canonicalUrl = `${siteConfig?.url}/en/new`;

  return {
    title: `New Tattoo Shops - ${siteConfig?.name}`,
    description: `Discover the newest tattoo shops in Portland. ${siteConfig?.description}`,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function NewPage({ params }: NewPageProps) {
  console.log('NewPage, params:', params);
  const { lang } = params;

  try {
    console.log('NewPage: Starting to fetch listings...');
    
    // Get newest listings from Airtable in UI-compatible format
    const listings = await getListingsForUI({ 
      status: 'Published',
      limit: 48
    });
  
    console.log('NewPage: Successfully fetched listings:', listings.length);
    console.log('NewPage: First listing:', listings[0] ? listings[0].name : 'No listings');
  
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">New Tattoo Shops ({listings.length})</h1>
        <ProductGridClient lang={lang} itemList={listings} />
      </div>
    );
  } catch (error) {
    console.error('NewPage: Error loading new listings:', error);
    console.error('NewPage: Error details:', error.message);
    
    // Return error state with debug info
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6 text-red-600">Error Loading Listings</h1>
        <p className="text-red-500">Error: {error.message}</p>
        <ProductGridClient lang={lang} itemList={[]} />
      </div>
    );
  }
}