import { notFound } from "next/navigation";

import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { SubmitListingForm } from "@/components/forms/submit-listing-form";
import { getAllSubmitConfigs } from "@/config/submit-app";
import { getCurrentUser } from "@/lib/session";
import { getCategories } from "@/lib/airtable";

export const metadata = {
  title: "Submit Tattoo Shop",
  description: "Submit your tattoo shop to the PDX Tattoo Directory.",
}

export default async function SubmitListingPage({ params }: { params: { lang: string }; }) {
  const { lang } = params;
  const pageConfig = getAllSubmitConfigs()[lang] || getAllSubmitConfigs()['en']; // fallback to English
  console.log('SubmitListingPage, lang:', lang);

  const user = await getCurrentUser();
  if (!user) {
    console.log("SubmitListingPage, user not found");
    return notFound();
  }
  console.log('SubmitListingPage, userid:', user.id);

  try {
    // Get categories from Airtable
    const categories = await getCategories();
    console.log('SubmitListingPage, categories:', categories.length);

    return (
      <DashboardShell>
        <DashboardHeader
          heading={pageConfig?.title || "Submit Tattoo Shop"}
          text={pageConfig?.subtitle || "Add your tattoo shop to the PDX Tattoo Directory"}
        />
        <div className="grid gap-10">
          <SubmitListingForm 
            lang={lang}
            user={{ id: user.id, name: user.name || "" }}
            categories={categories}
          />
        </div>
      </DashboardShell>
    )
  } catch (error) {
    console.error('Error loading submit page:', error);
    return notFound();
  }
}