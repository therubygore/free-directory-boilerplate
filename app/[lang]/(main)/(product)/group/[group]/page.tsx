import { redirect } from "next/navigation";

// Simple redirect page - redirects to main listings page
export default async function GroupPage({ params }: { params: { lang: string, group: string }; }) {
    console.log('GroupPage, params:', params);
    const { lang } = params;
    
    // For a tattoo directory, redirect to the main listings page
    return redirect(`/${lang}`);
}