"use client"

import { InventoryManagement } from "@/components/inventory/inventory-management"
import { useOrganization } from "@/components/providers/organization-provider"

export default function InventoryPage() {
  const { organization } = useOrganization()

  if (!organization) return null

  return (
    <InventoryManagement orgId={organization._id} />
  )
}
