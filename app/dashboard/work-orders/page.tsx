"use client"

import { WorkOrdersKanban } from "@/components/work-orders/work-orders-kanban"
import { useOrganization } from "@/components/providers/organization-provider"

export default function WorkOrdersPage() {
  const { organization } = useOrganization()

  if (!organization) return null

  return (
    <WorkOrdersKanban orgId={organization._id} />
  )
}
