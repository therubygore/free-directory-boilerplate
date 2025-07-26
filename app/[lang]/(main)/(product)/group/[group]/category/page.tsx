import { redirect } from "next/navigation";

// Simple redirect page - redirects to categories overview
export default async function CategoryIndexPage({ params }: { params: { lang: string, group: string }; }) {
    console.log('CategoryIndexPage, params:', params);
    const { lang } = params;
    
    // For a tattoo directory, redirect to a general categories page
    // or to the main listings page
    return redirect(`/${lang}/categories`);
}