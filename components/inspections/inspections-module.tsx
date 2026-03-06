"use client"

import * as React from "react"
import { useState } from "react"
import { InspectionDashboard } from "./inspection-dashboard"
import { CreateInspection } from "./create-inspection"
import { EnhancedInspectionChecklist } from "./enhanced-inspection-checklist"
import { DviReview } from "./dvi-review"
import { motion, AnimatePresence } from "framer-motion"

type ViewState = "dashboard" | "create" | "checklist" | "review"

export function InspectionsModule() {
  const [view, setView] = useState<ViewState>("dashboard")
  const [selectedInspectionId, setSelectedInspectionId] = useState<string | null>(null)

  const handleOpen = (id: string) => {
    setSelectedInspectionId(id)
    setView("checklist")
  }

  const handleStart = (id: string) => {
    setSelectedInspectionId(id)
    setView("checklist")
  }

  const handleComplete = () => {
    setView("review")
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <AnimatePresence mode="wait">
        {view === "dashboard" && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <InspectionDashboard 
              onOpen={handleOpen}
              onCreate={() => setView("create")}
            />
          </motion.div>
        )}

        {view === "create" && (
          <motion.div
            key="create"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <CreateInspection 
              onCancel={() => setView("dashboard")}
              onStart={handleStart}
            />
          </motion.div>
        )}

        {view === "checklist" && selectedInspectionId && (
          <motion.div
            key="checklist"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <EnhancedInspectionChecklist 
              id={selectedInspectionId}
              onBack={() => setView("dashboard")}
              onComplete={handleComplete}
            />
          </motion.div>
        )}

        {view === "review" && selectedInspectionId && (
          <motion.div
            key="review"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <DviReview 
              id={selectedInspectionId}
              onBack={() => setView("checklist")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default InspectionsModule
