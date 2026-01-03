"use client"

import { Dashboard } from "@/components/dashboard/dashboard"
import { useOrganization } from "@/components/providers/organization-provider"

export default function DashboardPage() {
  const { organization } = useOrganization()

  if (!organization) return null

  return (
    <Dashboard orgId={organization._id} />
  )
}
