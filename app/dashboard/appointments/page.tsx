"use client"

import { Appointments } from "@/components/appointments/appointments"
import { useOrganization } from "@/components/providers/organization-provider"

export default function AppointmentsPage() {
  const { organization } = useOrganization()

  if (!organization) return null

  return (
    <Appointments orgId={organization._id} />
  )
}
