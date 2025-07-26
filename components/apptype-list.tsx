import { getCategories } from "@/lib/airtable";
import { Suspense } from "react";
import AppTypeListClient from "./apptype-list-client";
import AppTypeListLoading from "./apptype-list-loading";

export default function AppTypeList({ lang }: { lang: string }) {
    return (
        <Suspense fallback={<AppTypeListLoading />}>
            <AppTypeListRSC lang={lang} />
        </Suspense>
    );
}

async function AppTypeListRSC({ lang }: { lang: string }) {
    console.log('AppTypeListRSC, lang:', lang);
    
    try {
        // Get categories from Airtable
        const categories = await getCategories();
        console.log('AppTypeListRSC, categories:', categories.length);
        
        // Convert categories to the format expected by AppTypeListClient
        const categoryList = categories.map((cat, index) => ({
            _id: `cat-${index}`,
            name: cat,
            slug: cat.toLowerCase().replace(/\s+/g, '-'),
        }));

        return (
            <AppTypeListClient lang={lang} categoryList={categoryList} />
        );
    } catch (error) {
        console.error('Error loading categories:', error);
        
        // Return empty list on error
        return (
            <AppTypeListClient lang={lang} categoryList={[]} />
        );
    }
}