"use client"

import { useState } from "react"
import { InvoicesDashboard } from "./invoices-dashboard"
import { InvoiceViewer } from "./invoice-viewer"

export function InvoicesModule() {
  const [view, setView] = useState<"dashboard" | "view">("dashboard")
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null)

  const handleViewInvoice = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId)
    setView("view")
  }

  const handleBackToDashboard = () => {
    setView("dashboard")
    setSelectedInvoiceId(null)
  }

  return (
    <div className="container mx-auto py-6">
      {view === "dashboard" && (
        <InvoicesDashboard onOpen={handleViewInvoice} />
      )}
      {view === "view" && selectedInvoiceId && (
        <InvoiceViewer invoiceId={selectedInvoiceId} onBack={handleBackToDashboard} />
      )}
    </div>
  )
}

export default InvoicesModule
