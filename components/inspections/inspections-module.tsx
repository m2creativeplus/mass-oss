"use client"

import { useState } from "react"
import InspectionDashboard from "./inspection-dashboard"
import CreateInspection from "./create-inspection"
import InspectionChecklist from "./inspection-checklist"
import CustomerApproval from "./customer-approval"

/**
 * Wrapper that handles the full Digital Vehicle Inspection
 * workflow inside a single component.
 */
export function InspectionsModule() {
  const [step, setStep] = useState<"dashboard" | "create" | "checklist" | "approval">("dashboard")
  const [inspectionId, setInspectionId] = useState<string | null>(null)

  const gotoDashboard = () => setStep("dashboard")

  return (
    <>
      {step === "dashboard" && (
        <InspectionDashboard
          onCreate={() => setStep("create")}
          onOpen={(id) => {
            setInspectionId(id)
            setStep("checklist")
          }}
        />
      )}

      {step === "create" && (
        <CreateInspection
          onCancel={gotoDashboard}
          onStart={(id) => {
            setInspectionId(id)
            setStep("checklist")
          }}
        />
      )}

      {step === "checklist" && inspectionId && (
        <InspectionChecklist id={inspectionId} onComplete={() => setStep("approval")} onBack={gotoDashboard} />
      )}

      {step === "approval" && inspectionId && <CustomerApproval id={inspectionId} onBack={gotoDashboard} />}
    </>
  )
}

export default InspectionsModule
