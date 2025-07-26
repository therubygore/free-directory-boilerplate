import { notFound } from "next/navigation";

import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/lib/session";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const metadata = {
  title: "My Listings",
}

export default async function ListingsPage({ params }: { params: { lang: string }; }) {
  const { lang } = params;

  const user = await getCurrentUser();
  if (!user) {
    console.log("ListingsPage, user not found");
    return notFound();
  }
  console.log('ListingsPage, userid:', user.id);

  // TODO: Fetch user's submitted listings from Airtable
  // For now, we'll show an empty state
  const userListings: any[] = [];

  return (
    <DashboardShell className="">
      <DashboardHeader
        heading="My Submitted Shops"
        text="Manage your submitted tattoo shops" >
        <Link href={`/${lang}/dashboard/app`}
          className={cn(buttonVariants({ variant: "default" }))}>
          Submit New Shop
        </Link>
      </DashboardHeader>

      {userListings?.length > 0 && (
        <div className="grid gap-4">
          {userListings.map((listing) => (
            <Card key={listing.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{listing.name}</CardTitle>
                  <Badge variant={
                    listing.status === 'Published' ? 'default' :
                    listing.status === 'Review' ? 'secondary' :
                    listing.status === 'Draft' ? 'outline' : 'destructive'
                  }>
                    {listing.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {listing.description}
                </p>
                {listing.category && (
                  <Badge variant="outline" className="mt-2">
                    {listing.category}
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {userListings?.length === 0 && (
        <div>
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="dashboard" />
            <EmptyPlaceholder.Title>No submitted shops yet</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You haven&apos;t submitted any tattoo shops yet. Submit your first shop to get started!
            </EmptyPlaceholder.Description>
            <Link href={`/${lang}/dashboard/app`}
              className={cn(buttonVariants({ variant: "outline" }))}>
              Submit Your First Shop
            </Link>
          </EmptyPlaceholder>
        </div>
      )}

    </DashboardShell>
  )
}