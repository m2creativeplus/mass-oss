"use client"

import { Customers } from "@/components/customers/customers"
import { useOrganization } from "@/components/providers/organization-provider"

export default function CustomersPage() {
  const { organization } = useOrganization()

  if (!organization) return null

  return (
    <Customers orgId={organization._id} />
  )
}
