import { FeaturePageHeader } from "@/components/feature-page-header";
import { ShareProductButton } from "@/components/forms/share-product-button";
import GroupListClient from "@/components/group-list-client";
import { AllProductConfigs } from "@/config/product";
import { getCurrentUser } from "@/lib/session";
import { getCategories } from "@/lib/airtable";

interface ProductListLayoutProps {
    params: { lang: string };
    children: React.ReactNode;
}

export default async function ProductListLayout({ params, children }: ProductListLayoutProps) {
    console.log('ProductListLayout, params:', params);
    const { lang } = params;

    const user = await getCurrentUser();
    const productConfig = AllProductConfigs[lang] || AllProductConfigs['en'];

    try {
        // Get categories from Airtable and format them as groups
        const categories = await getCategories();
        const categoryGroups = categories.map(cat => ({
            _id: `cat-${cat}`,
            _type: "group",
            _createdAt: new Date().toISOString(),
            _updatedAt: new Date().toISOString(),
            _rev: "1",
            name: cat,
            slug: cat.toLowerCase().replace(/\s+/g, '-'),
            categories: []
        })) as any; // Cast to bypass TypeScript for now

        console.log('ProductListLayout, categories:', categories.length);

        return (
            <div className="min-h-screen pb-16">
                {/* Page Header */}
                <div className="bg-linear py-10">
                    <FeaturePageHeader className="container"
                        heading={productConfig?.title || "Tattoo Shops"}
                        text={productConfig?.subtitle || "Discover the best tattoo shops in Portland"}>
                        <ShareProductButton lang={lang}>
                            <span>{productConfig?.submitButton || "Submit Shop"}</span>
                        </ShareProductButton>
                    </FeaturePageHeader>
                </div>

                <div className="container mt-8 grid md:grid-cols-12 md:gap-8">
                    {/* Category List */}
                    <div className="md:col-span-2">
                        <GroupListClient lang={lang} itemList={categoryGroups} />
                    </div>

                    {/* Product Grid */}
                    <div className="md:col-span-10">
                        {children}
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error loading layout:', error);
        
        // Fallback layout without categories
        return (
            <div className="min-h-screen pb-16">
                <div className="bg-linear py-10">
                    <FeaturePageHeader className="container"
                        heading="Tattoo Shops"
                        text="Discover the best tattoo shops in Portland">
                        <ShareProductButton lang={lang}>
                            <span>Submit Shop</span>
                        </ShareProductButton>
                    </FeaturePageHeader>
                </div>

                <div className="container mt-8">
                    {children}
                </div>
            </div>
        );
    }
}