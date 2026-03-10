"use client"

import { Settings } from "@/components/settings/settings-page"
import { useOrganization } from "@/components/providers/organization-provider"

export default function SettingsPage() {
  const { organization, isLoading } = useOrganization()

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500" />
      </div>
    )
  }

  if (!organization) {
    return (
      <div className="flex h-[60vh] items-center justify-center flex-col gap-3 text-center">
        <p className="text-muted-foreground">No organization found. Please contact your administrator.</p>
      </div>
    )
  }

  return (
    <Settings orgId={organization._id} />
  )
}

