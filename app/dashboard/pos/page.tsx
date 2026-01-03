"use client"

import dynamic from "next/dynamic"
import { useOrganization } from "@/components/providers/organization-provider"

const PartSellsModule = dynamic(() => import("@/components/pos/part-sells-module"), { ssr: false })

export default function PosPage() {
  const { organization } = useOrganization()

  if (!organization) return null

  return (
    <PartSellsModule orgId={organization._id} />
  )
}
