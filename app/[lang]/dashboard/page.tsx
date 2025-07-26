import { notFound } from "next/navigation";

import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { AccountInfoForm } from "@/components/forms/account-info-form";
import { getAllSettingsConfigs } from "@/config/settings";
import { getCurrentUser } from "@/lib/session";

export const metadata = {
  title: "Dashboard",
  description: "Manage your account and tattoo shop submissions.",
}

export default async function DashboardPage({ params }: { params: { lang: string }; }) {
  const { lang } = params;
  const pageConfig = getAllSettingsConfigs()[lang] || getAllSettingsConfigs()['en'];

  const user = await getCurrentUser();
  if (!user) {
    console.log("DashboardPage, user not found");
    return notFound();
  }

  console.log('DashboardPage, userid:', user.id, 'username:', user.name);

  return (
    <DashboardShell>
      <DashboardHeader
        heading={pageConfig?.title || "Dashboard"}
        text={pageConfig?.subtitle || "Manage your account and submissions"}
      />
      <div className="grid gap-10">
        <AccountInfoForm 
          lang={lang}
          user={{ id: user.id, name: user.name || "" }}
        />
      </div>
    </DashboardShell>
  )
}