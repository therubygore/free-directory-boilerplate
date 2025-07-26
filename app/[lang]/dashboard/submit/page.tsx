import { notFound } from "next/navigation";

import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { ShareResourceForm } from "@/components/forms/share-resource-form";
import { getAllShareResourceConfigs } from "@/config/share-resource";
import { getCurrentUser } from "@/lib/session";

export const metadata = {
  title: "Share Resource",
  description: "Share useful tattoo-related resources with the community.",
}

export default async function ShareResourcePage({ params }: { params: { lang: string }; }) {
  const { lang } = params;
  const pageConfig = getAllShareResourceConfigs()[lang] || getAllShareResourceConfigs()['en'];

  const user = await getCurrentUser();
  if (!user) {
    console.log("ShareResourcePage, user not found");
    return notFound();
  }
  console.log('ShareResourcePage, userid:', user.id, 'username:', user.name);

  return (
    <DashboardShell>
      <DashboardHeader
        heading={pageConfig?.title || "Share Resource"}
        text={pageConfig?.subtitle || "Share useful tattoo-related resources with the community"}
      />
      <div className="grid gap-10">
        <ShareResourceForm 
          lang={lang} 
          user={{ id: user.id, name: user.name || "" }}
        />
      </div>
    </DashboardShell>
  )
}