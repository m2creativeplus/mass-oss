"use client";

import jsPDF from "jspdf";

export interface BookingDocumentData {
  // Workshop details
  workshopName: string;
  workshopAddress: string;
  workshopPhone: string;
  workshopEmail?: string;
  workshopLogo?: string;
  
  // Booking details
  bookingNumber: string;
  bookingDate: string;
  
  // Customer details
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress?: string;
  
  // Vehicle details
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  vehiclePlate: string;
  vehicleVin?: string;
  mileageIn: number;
  fuelLevel: number;
  overallCondition: string;
  
  // Inspection summary
  partsChecklist: {
    name: string;
    category: string;
    status: string;
    notes?: string;
  }[];
  
  damageMarkers: {
    severity: string;
    description: string;
  }[];
  
  defectNotes?: string;
  
  // Signature
  signatureData?: string;
}

/**
 * Generate a PDF booking document for vehicle check-in
 */
export function generateBookingPDF(data: BookingDocumentData): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  let yPos = margin;
  
  // Helper functions
  const addHeader = () => {
    // Company header
    doc.setFillColor(16, 185, 129); // Emerald-500
    doc.rect(0, 0, pageWidth, 35, "F");
    
    // Workshop name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(data.workshopName || "MASS Workshop", margin, 18);
    
    // Contact info
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`${data.workshopAddress || "Workshop Address"} | ${data.workshopPhone || "Phone"}`, margin, 28);
    
    // Document title
    yPos = 45;
    doc.setTextColor(31, 41, 55); // Gray-800
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("VEHICLE CHECK-IN REPORT", pageWidth / 2, yPos, { align: "center" });
    
    // Booking number
    yPos += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(107, 114, 128); // Gray-500
    doc.text(`Booking #: ${data.bookingNumber} | Date: ${data.bookingDate}`, pageWidth / 2, yPos, { align: "center" });
    
    yPos += 12;
  };
  
  const addSection = (title: string) => {
    if (yPos > 260) {
      doc.addPage();
      yPos = margin;
    }
    
    yPos += 5;
    doc.setFillColor(243, 244, 246); // Gray-100
    doc.rect(margin, yPos - 5, contentWidth, 8, "F");
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(31, 41, 55);
    doc.text(title, margin + 3, yPos);
    yPos += 8;
  };
  
  const addField = (label: string, value: string, inline = false) => {
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(107, 114, 128);
    doc.text(label + ":", margin + 3, yPos);
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(31, 41, 55);
    if (inline) {
      doc.text(value || "N/A", margin + 40, yPos);
    } else {
      yPos += 4;
      doc.text(value || "N/A", margin + 3, yPos);
    }
    yPos += 6;
  };
  
  const addTwoColumns = (left: { label: string; value: string }[], right: { label: string; value: string }[]) => {
    const startY = yPos;
    const colWidth = contentWidth / 2;
    
    // Left column
    left.forEach((item) => {
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(107, 114, 128);
      doc.text(item.label + ":", margin + 3, yPos);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(31, 41, 55);
      doc.text(item.value || "N/A", margin + 35, yPos);
      yPos += 5;
    });
    
    // Right column
    let rightY = startY;
    right.forEach((item) => {
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(107, 114, 128);
      doc.text(item.label + ":", margin + colWidth + 3, rightY);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(31, 41, 55);
      doc.text(item.value || "N/A", margin + colWidth + 35, rightY);
      rightY += 5;
    });
    
    yPos = Math.max(yPos, rightY);
    yPos += 3;
  };
  
  // === BUILD DOCUMENT ===
  
  // Header
  addHeader();
  
  // Customer & Vehicle Info (side by side)
  addSection("CUSTOMER INFORMATION");
  addTwoColumns(
    [
      { label: "Name", value: data.customerName },
      { label: "Phone", value: data.customerPhone },
      { label: "Email", value: data.customerEmail || "N/A" },
    ],
    [
      { label: "Address", value: data.customerAddress || "N/A" },
    ]
  );
  
  addSection("VEHICLE INFORMATION");
  addTwoColumns(
    [
      { label: "Make", value: data.vehicleMake },
      { label: "Model", value: data.vehicleModel },
      { label: "Year", value: String(data.vehicleYear) },
    ],
    [
      { label: "Plate", value: data.vehiclePlate || "N/A" },
      { label: "VIN", value: data.vehicleVin || "N/A" },
      { label: "Mileage In", value: `${data.mileageIn.toLocaleString()} km` },
    ]
  );
  
  // Vehicle Condition
  addSection("VEHICLE CONDITION");
  addTwoColumns(
    [
      { label: "Fuel Level", value: `${data.fuelLevel}%` },
      { label: "Overall", value: data.overallCondition.charAt(0).toUpperCase() + data.overallCondition.slice(1) },
    ],
    [
      { label: "Damage Points", value: `${data.damageMarkers.length} marked` },
    ]
  );
  
  // Parts Checklist Summary
  if (data.partsChecklist.length > 0) {
    addSection("INSPECTION CHECKLIST");
    
    const issues = data.partsChecklist.filter(p => p.status !== "ok" && p.status !== "not-applicable");
    
    if (issues.length > 0) {
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      yPos += 2;
      
      issues.forEach((item) => {
        const statusIcon = item.status === "immediate-attention" ? "🔴" : "🟡";
        const statusText = item.status === "immediate-attention" ? "URGENT" : "Attention";
        
        doc.setTextColor(31, 41, 55);
        doc.text(`• ${item.name} - ${statusText}`, margin + 3, yPos);
        
        if (item.notes) {
          yPos += 4;
          doc.setTextColor(107, 114, 128);
          doc.setFontSize(8);
          doc.text(`  ${item.notes}`, margin + 5, yPos);
          doc.setFontSize(9);
        }
        yPos += 5;
      });
    } else {
      doc.setFontSize(9);
      doc.setTextColor(16, 185, 129);
      doc.text("✓ All items checked OK", margin + 3, yPos);
      yPos += 6;
    }
  }
  
  // Damage Markers
  if (data.damageMarkers.length > 0) {
    addSection("DAMAGE REPORT");
    
    data.damageMarkers.forEach((marker, idx) => {
      const severityColor = marker.severity === "severe" ? "🔴" : marker.severity === "moderate" ? "🟠" : "🟡";
      
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(31, 41, 55);
      doc.text(
        `${idx + 1}. ${marker.severity.charAt(0).toUpperCase() + marker.severity.slice(1)}: ${marker.description || "No description"}`,
        margin + 3,
        yPos
      );
      yPos += 5;
    });
    yPos += 2;
  }
  
  // Defect Notes
  if (data.defectNotes) {
    addSection("ADDITIONAL NOTES");
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(31, 41, 55);
    
    const lines = doc.splitTextToSize(data.defectNotes, contentWidth - 6);
    doc.text(lines, margin + 3, yPos);
    yPos += lines.length * 4 + 5;
  }
  
  // Signature Section
  addSection("CUSTOMER ACKNOWLEDGMENT");
  
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(107, 114, 128);
  doc.text(
    "I acknowledge that the vehicle condition described above is accurate at the time of check-in.",
    margin + 3,
    yPos
  );
  yPos += 8;
  
  // Signature box
  doc.setDrawColor(209, 213, 219); // Gray-300
  doc.rect(margin, yPos, 80, 25);
  
  // Add signature image if available
  if (data.signatureData) {
    try {
      doc.addImage(data.signatureData, "PNG", margin + 2, yPos + 2, 76, 21);
    } catch (e) {
      console.error("Failed to add signature image:", e);
    }
  }
  
  // Signature label
  yPos += 28;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(107, 114, 128);
  doc.text("Customer Signature", margin + 3, yPos);
  
  // Date signed
  doc.text(`Date: ${data.bookingDate}`, margin + 50, yPos);
  
  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 10;
  doc.setFontSize(7);
  doc.setTextColor(156, 163, 175);
  doc.text(
    `Generated by MASS Workshop Management System | ${new Date().toISOString()}`,
    pageWidth / 2,
    footerY,
    { align: "center" }
  );
  
  return doc;
}

/**
 * Download the booking document as PDF
 */
export function downloadBookingPDF(data: BookingDocumentData, filename?: string): void {
  const doc = generateBookingPDF(data);
  const defaultFilename = `booking-${data.bookingNumber}-${data.vehiclePlate || "vehicle"}.pdf`;
  doc.save(filename || defaultFilename);
}

/**
 * Get the PDF as a blob for uploading/emailing
 */
export function getBookingPDFBlob(data: BookingDocumentData): Blob {
  const doc = generateBookingPDF(data);
  return doc.output("blob");
}

/**
 * Get the PDF as base64 for storage
 */
export function getBookingPDFBase64(data: BookingDocumentData): string {
  const doc = generateBookingPDF(data);
  return doc.output("datauristring");
}
