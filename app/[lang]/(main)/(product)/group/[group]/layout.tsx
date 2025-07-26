import CategoryListClient from "@/components/category-list-client";
import { getCategories } from "@/lib/airtable";

interface ProductGroupLayoutProps {
    params: { lang: string; group: string };
    children: React.ReactNode;
}

export default async function ProductGroupLayout({ params, children }: ProductGroupLayoutProps) {
    console.log('ProductGroupLayout, params:', params);
    const { lang } = params;

    try {
        // Get categories from Airtable
        const categories = await getCategories();
        console.log('ProductGroupLayout, categories:', categories.length);

        // Convert categories to the format expected by CategoryListClient
        const categoryData = {
            _id: "group-tattoo",
            _type: "group" as const,
            _createdAt: new Date().toISOString(),
            _updatedAt: new Date().toISOString(),
            _rev: "1",
            name: "Tattoo Categories",
            slug: "tattoo",
            order: 0,
            date: new Date().toISOString(),
            categories: categories.map(cat => ({
                _id: `cat-${cat}`,
                _type: "category" as const,
                _createdAt: new Date().toISOString(),
                _updatedAt: new Date().toISOString(),
                _rev: "1",
                name: cat,
                slug: cat.toLowerCase().replace(/\s+/g, '-'),
                order: 0,
                date: new Date().toISOString()
            }))
        };

        return (
            <div className="grid space-y-8">
                {/* Category List */}
                <CategoryListClient lang={lang} group={categoryData} />

                {/* Product Grid */}
                {children}
            </div>
        );
    } catch (error) {
        console.error('Error loading categories:', error);
        
        // Fallback - just show children without categories
        return (
            <div className="grid space-y-8">
                {children}
            </div>
        );
    }
}