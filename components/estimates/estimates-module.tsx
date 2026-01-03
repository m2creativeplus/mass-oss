"use client"

import { useState } from "react"
import { EstimatesDashboard } from "./estimates-dashboard"
import { CreateEstimate } from "./create-estimate"
import { EstimateViewer } from "./estimate-viewer"

export function EstimatesModule() {
  const [view, setView] = useState<"dashboard" | "create" | "view">("dashboard")
  const [selectedEstimateId, setSelectedEstimateId] = useState<string | null>(null)

  const handleCreateEstimate = () => {
    setView("create")
  }

  const handleViewEstimate = (estimateId: string) => {
    setSelectedEstimateId(estimateId)
    setView("view")
  }

  const handleBackToDashboard = () => {
    setView("dashboard")
    setSelectedEstimateId(null)
  }

  return (
    <div className="container mx-auto py-6">
      {view === "dashboard" && <EstimatesDashboard onCreate={handleCreateEstimate} onOpen={handleViewEstimate} />}
      {view === "create" && <CreateEstimate onBack={handleBackToDashboard} />}
      {view === "view" && selectedEstimateId && (
        <EstimateViewer estimateId={selectedEstimateId} onBack={handleBackToDashboard} />
      )}
    </div>
  )
}

export default EstimatesModule
