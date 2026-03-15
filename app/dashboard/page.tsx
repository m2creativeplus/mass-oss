"use client"

import { Dashboard } from "@/components/dashboard/dashboard"
import { DirectivesDashboard } from "@/components/dashboard/directives-dashboard"
import { useOrganization } from "@/components/providers/organization-provider"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

export default function DashboardPage() {
  const { organization } = useOrganization()
  const directives = useQuery(api.directives.getLatest, 
    organization?._id ? { orgId: organization._id } : "skip"
  )

  if (!organization) return null

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 p-6">
      <div className="xl:col-span-3">
        <Dashboard orgId={organization._id} />
      </div>
      <div className="xl:col-span-1">
        <DirectivesDashboard directives={directives || []} />
      </div>
    </div>
  )
}
