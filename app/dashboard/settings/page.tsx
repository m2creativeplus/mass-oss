"use client"

import { Settings } from "@/components/settings/settings-page"
import { useOrganization } from "@/components/providers/organization-provider"

export default function SettingsPage() {
  const { organization } = useOrganization()

  if (!organization) return null

  return (
    <Settings orgId={organization._id} />
  )
}
