/**
 * MASS Car Workshop - PDF Invoice Generator
 * 
 * Generates professional PDF invoices using jsPDF
 */

export interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface InvoiceData {
  invoiceNumber: string
  date: string
  dueDate: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  vehiclePlate: string
  vehicleModel: string
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
  paymentMethod: 'cash' | 'zaad' | 'edahab' | 'card'
  notes?: string
}

export async function generateInvoicePDF(data: InvoiceData): Promise<Blob> {
  // Dynamic import for client-side only
  const { jsPDF } = await import('jspdf')
  
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  
  // Header - MASS Branding
  doc.setFillColor(249, 115, 22) // Orange
  doc.rect(0, 0, pageWidth, 40, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('MASS CAR WORKSHOP', 20, 20)
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Vehicle Workshop Management System', 20, 28)
  doc.text('Hargeisa, Somaliland | +252-63-4521789', 20, 35)
  
  // Invoice Title
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('INVOICE', pageWidth - 20, 25, { align: 'right' })
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(255, 255, 255)
  doc.text(`#${data.invoiceNumber}`, pageWidth - 20, 32, { align: 'right' })
  
  // Customer & Invoice Details
  let y = 55
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Bill To:', 20, y)
  doc.text('Invoice Details:', 120, y)
  
  y += 8
  doc.setFont('helvetica', 'normal')
  doc.text(data.customerName, 20, y)
  doc.text(`Date: ${data.date}`, 120, y)
  
  y += 6
  doc.text(data.customerPhone, 20, y)
  doc.text(`Due: ${data.dueDate}`, 120, y)
  
  y += 6
  if (data.customerEmail) {
    doc.text(data.customerEmail, 20, y)
  }
  doc.text(`Vehicle: ${data.vehiclePlate}`, 120, y)
  
  y += 6
  doc.text(`Model: ${data.vehicleModel}`, 120, y)
  
  // Items Table Header
  y += 15
  doc.setFillColor(51, 51, 51)
  doc.rect(15, y - 5, pageWidth - 30, 10, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.text('Description', 20, y + 2)
  doc.text('Qty', 100, y + 2)
  doc.text('Unit Price', 120, y + 2)
  doc.text('Total', pageWidth - 25, y + 2, { align: 'right' })
  
  // Items
  y += 12
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'normal')
  
  data.items.forEach((item, index) => {
    if (index % 2 === 0) {
      doc.setFillColor(245, 245, 245)
      doc.rect(15, y - 4, pageWidth - 30, 8, 'F')
    }
    doc.text(item.description.substring(0, 40), 20, y)
    doc.text(item.quantity.toString(), 100, y)
    doc.text(`$${item.unitPrice.toFixed(2)}`, 120, y)
    doc.text(`$${item.total.toFixed(2)}`, pageWidth - 25, y, { align: 'right' })
    y += 8
  })
  
  // Totals
  y += 10
  doc.setDrawColor(200, 200, 200)
  doc.line(120, y, pageWidth - 15, y)
  
  y += 8
  doc.text('Subtotal:', 120, y)
  doc.text(`$${data.subtotal.toFixed(2)}`, pageWidth - 25, y, { align: 'right' })
  
  y += 7
  doc.text('Tax (5%):', 120, y)
  doc.text(`$${data.tax.toFixed(2)}`, pageWidth - 25, y, { align: 'right' })
  
  y += 10
  doc.setFillColor(249, 115, 22)
  doc.rect(115, y - 5, pageWidth - 130, 12, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('TOTAL:', 120, y + 3)
  doc.text(`$${data.total.toFixed(2)}`, pageWidth - 25, y + 3, { align: 'right' })
  
  // Payment Method
  y += 20
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Payment Method:', 20, y)
  doc.setFont('helvetica', 'normal')
  
  const paymentLabels: Record<string, string> = {
    cash: 'Cash',
    zaad: 'Zaad (Telesom)',
    edahab: 'e-Dahab (Somtel)',
    card: 'Credit/Debit Card'
  }
  doc.text(paymentLabels[data.paymentMethod] || data.paymentMethod, 60, y)
  
  // Notes
  if (data.notes) {
    y += 15
    doc.setFont('helvetica', 'bold')
    doc.text('Notes:', 20, y)
    y += 6
    doc.setFont('helvetica', 'normal')
    doc.text(data.notes, 20, y)
  }
  
  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 20
  doc.setFontSize(8)
  doc.setTextColor(128, 128, 128)
  doc.text('Thank you for choosing MASS Car Workshop!', pageWidth / 2, footerY, { align: 'center' })
  doc.text('Powered by MASS Vehicle Workshop Management System', pageWidth / 2, footerY + 5, { align: 'center' })
  
  return doc.output('blob')
}

export function downloadInvoice(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
