"use client"

import { Vehicles } from "@/components/vehicles/vehicles"
import { useOrganization } from "@/components/providers/organization-provider"

export default function VehiclesPage() {
  const { organization } = useOrganization()

  if (!organization) return null

  return (
    <Vehicles orgId={organization._id} />
  )
}
