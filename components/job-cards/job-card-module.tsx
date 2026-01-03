"use client"

import { useState } from "react"
import { JobCardDashboard } from "./job-card-dashboard"
import { CreateJobCard } from "./create-job-card"

export function JobCardModule() {
  const [view, setView] = useState<"dashboard" | "create" | "detail">("dashboard")
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <>
      {view === "dashboard" && (
        <JobCardDashboard
          onCreate={() => setView("create")}
          onView={(id) => { setSelectedId(id); setView("detail") }}
          onEdit={(id) => { setSelectedId(id); setView("detail") }}
        />
      )}
      {view === "create" && (
        <CreateJobCard
          onBack={() => setView("dashboard")}
          onSave={() => setView("dashboard")}
        />
      )}
      {view === "detail" && (
        <CreateJobCard
          onBack={() => setView("dashboard")}
          onSave={() => setView("dashboard")}
        />
      )}
    </>
  )
}

export default JobCardModule
