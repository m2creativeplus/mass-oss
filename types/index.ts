/**
 * MASS OSS - Global Type Definitions
 * Centralizing inline interfaces to enforce workspace-wide type safety.
 */

// ----------------------------------------------------------------------------
// Authentication & Role Based Access
// ----------------------------------------------------------------------------
export type UserRole = "admin" | "owner" | "staff" | "technician" | "customer"

export interface AuthUser {
  id: string
  email: string
  role: UserRole
  firstName: string
  lastName: string
  phone?: string
  isActive: boolean
}

// ----------------------------------------------------------------------------
// Financials (Invoices & Estimates)
// ----------------------------------------------------------------------------
export interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export type PaymentMethod = 'cash' | 'zaad' | 'edahab' | 'card' | 'bank_transfer'
export type InvoiceStatus = 'draft' | 'sent' | 'partial' | 'paid' | 'overdue' | 'void'
export type EstimateStatus = 'draft' | 'sent' | 'approved' | 'declined' | 'expired'

export interface FinancialDocumentData {
  invoiceNumber?: string
  estimateNumber?: string
  date: string
  dueDate?: string
  validUntil?: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  vehiclePlate: string
  vehicleModel: string
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
  paymentMethod?: PaymentMethod
  notes?: string
}

export type InvoiceData = Required<Pick<FinancialDocumentData, 'invoiceNumber' | 'dueDate' | 'paymentMethod'>> & FinancialDocumentData
export type EstimateData = Required<Pick<FinancialDocumentData, 'estimateNumber' | 'validUntil'>> & FinancialDocumentData

// ----------------------------------------------------------------------------
// Vehicles & Inspections
// ----------------------------------------------------------------------------
export type InspectionSeverity = 'ok' | 'attention' | 'immediate'

export interface InspectionItem {
  id: string
  category: string
  name: string
  status: InspectionSeverity
  notes?: string
  photos?: string[]
}
