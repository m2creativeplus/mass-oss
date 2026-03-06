/**
 * MASS Car Workshop - PDF Estimate Generator
 * 
 * Generates professional PDF estimates/quotes using jsPDF
 */

export interface EstimateLineItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
  type: 'labor' | 'parts' | 'other'
}

export interface EstimateData {
  estimateNumber: string
  date: string
  validUntil: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  vehiclePlate: string
  vehicleModel: string
  items: EstimateLineItem[]
  subtotal: number
  tax: number
  total: number
  notes?: string
  status: string
}

export async function generateEstimatePDF(data: EstimateData): Promise<Blob> {
  const { jsPDF } = await import('jspdf')
  
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  
  // Header - MASS Branding
  doc.setFillColor(245, 158, 11) // Amber-500
  doc.rect(0, 0, pageWidth, 40, 'F')
  
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('MASS CAR WORKSHOP', 20, 20)
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Vehicle Workshop Management System', 20, 28)
  doc.text('Hargeisa, Somaliland | +252-63-4521789', 20, 35)
  
  // Estimate Title
  doc.setTextColor(255, 255, 255)
  doc.setFillColor(0, 0, 0)
  doc.roundedRect(pageWidth - 65, 10, 55, 25, 3, 3, 'F')
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('ESTIMATE', pageWidth - 40, 22, { align: 'center' })
  doc.setFontSize(9)
  doc.text(`#${data.estimateNumber}`, pageWidth - 40, 30, { align: 'center' })
  
  // Status Badge
  let y = 50
  const statusColors: Record<string, [number, number, number]> = {
    'draft': [107, 114, 128],
    'sent': [59, 130, 246],
    'approved': [16, 185, 129],
    'declined': [239, 68, 68],
  }
  const statusColor = statusColors[data.status] || [107, 114, 128]
  doc.setFillColor(...statusColor)
  doc.roundedRect(pageWidth - 55, y - 5, 45, 10, 2, 2, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text(data.status.toUpperCase(), pageWidth - 33, y + 2, { align: 'center' })

  // Customer & Estimate Details
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Prepared For:', 20, y)
  doc.text('Estimate Details:', 120, y)
  
  y += 8
  doc.setFont('helvetica', 'normal')
  doc.text(data.customerName, 20, y)
  doc.text(`Date: ${data.date}`, 120, y)
  
  y += 6
  doc.text(data.customerPhone, 20, y)
  doc.text(`Valid Until: ${data.validUntil}`, 120, y)
  
  y += 6
  if (data.customerEmail) doc.text(data.customerEmail, 20, y)
  doc.text(`Vehicle: ${data.vehiclePlate}`, 120, y)
  
  y += 6
  doc.text(`Model: ${data.vehicleModel}`, 120, y)
  
  // Items Table Header
  y += 15
  doc.setFillColor(24, 24, 27)
  doc.rect(15, y - 5, pageWidth - 30, 10, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('Description', 20, y + 2)
  doc.text('Type', 95, y + 2)
  doc.text('Qty', 115, y + 2)
  doc.text('Rate', 135, y + 2)
  doc.text('Total', pageWidth - 25, y + 2, { align: 'right' })
  
  // Items
  y += 12
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  
  data.items.forEach((lineItem, index) => {
    if (index % 2 === 0) {
      doc.setFillColor(250, 250, 250)
      doc.rect(15, y - 4, pageWidth - 30, 8, 'F')
    }
    doc.text(lineItem.description.substring(0, 35), 20, y)
    doc.text(lineItem.type.charAt(0).toUpperCase() + lineItem.type.slice(1), 95, y)
    doc.text(lineItem.quantity.toString(), 115, y)
    doc.text(`$${lineItem.unitPrice.toFixed(2)}`, 135, y)
    doc.text(`$${lineItem.total.toFixed(2)}`, pageWidth - 25, y, { align: 'right' })
    y += 8
  })
  
  // Totals
  y += 10
  doc.setDrawColor(229, 231, 235)
  doc.line(120, y, pageWidth - 15, y)
  
  y += 8
  doc.setFontSize(10)
  doc.text('Subtotal:', 120, y)
  doc.text(`$${data.subtotal.toFixed(2)}`, pageWidth - 25, y, { align: 'right' })
  
  y += 7
  doc.text('Tax (5%):', 120, y)
  doc.text(`$${data.tax.toFixed(2)}`, pageWidth - 25, y, { align: 'right' })
  
  y += 10
  doc.setFillColor(245, 158, 11)
  doc.roundedRect(115, y - 6, pageWidth - 130, 14, 2, 2, 'F')
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('ESTIMATED TOTAL:', 120, y + 3)
  doc.text(`$${data.total.toFixed(2)}`, pageWidth - 25, y + 3, { align: 'right' })
  
  // Notes
  if (data.notes) {
    y += 20
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Notes / Conditions:', 20, y)
    y += 6
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    const lines = doc.splitTextToSize(data.notes, pageWidth - 40)
    doc.text(lines, 20, y)
  }
  
  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 25
  doc.setFontSize(8)
  doc.setTextColor(128, 128, 128)
  doc.text('This estimate is valid for 30 days from the date of issue.', pageWidth / 2, footerY, { align: 'center' })
  doc.text('Thank you for choosing MASS Car Workshop!', pageWidth / 2, footerY + 5, { align: 'center' })
  doc.text('Powered by MASS Vehicle Workshop Management System', pageWidth / 2, footerY + 10, { align: 'center' })
  
  return doc.output('blob')
}

export function downloadEstimate(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
