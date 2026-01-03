import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// ============================================================
// MASS Car Workshop - Complete Convex Schema (13 Tables)
// Type-safe definitions for Vehicles, Inventory, Work Orders, POS
// ============================================================

export default defineSchema({
  // ============ 1. USERS (Profile & Authentication) ============
  users: defineTable({
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    phone: v.optional(v.string()),
    role: v.union(
      v.literal("admin"),
      v.literal("staff"),
      v.literal("technician"),
      v.literal("customer")
    ),
    isActive: v.boolean(),
    avatarUrl: v.optional(v.string()),
    lastLoginAt: v.optional(v.string()),
  }).index("by_email", ["email"])
    .index("by_role", ["role"]),

  // ============ 1.1 ORGANIZATIONS (Tenants) ============
  organizations: defineTable({
    name: v.string(),
    slug: v.string(), // URL friendly ID
    ownerId: v.id("users"),
    logoUrl: v.optional(v.string()),
    plan: v.union(v.literal("free"), v.literal("pro"), v.literal("enterprise")),
    isActive: v.boolean(),
    subscriptionStatus: v.optional(v.string()),
    stripeCustomerId: v.optional(v.string()),
  }).index("by_slug", ["slug"]),

  // ============ 1.2 USER ORG ROLES (Permissions) ============
  userOrgRoles: defineTable({
    userId: v.id("users"),
    orgId: v.id("organizations"),
    role: v.union(
      v.literal("admin"),
      v.literal("staff"),
      v.literal("technician")
    ),
    isActive: v.boolean(),
  }).index("by_user", ["userId"])
    .index("by_org", ["orgId"])
    .index("by_user_org", ["userId", "orgId"]),

  // ============ 2. CUSTOMERS (CRM) ============
  customers: defineTable({
    customerNumber: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    country: v.optional(v.string()),
    dateOfBirth: v.optional(v.string()),
    preferredContact: v.optional(v.union(
      v.literal("phone"),
      v.literal("email"),
      v.literal("sms")
    )),
    notes: v.optional(v.string()),
    isActive: v.boolean(),
    orgId: v.string(),
  }).index("by_email", ["email"])
    .index("by_phone", ["phone"])
    .index("by_customerNumber", ["customerNumber"])
    .index("by_org", ["orgId"]),

  // ============ 3. VEHICLES (Fleet Registry) ============
  vehicles: defineTable({
    customerId: v.optional(v.id("customers")),
    make: v.string(),
    model: v.string(),
    year: v.number(),
    vin: v.optional(v.string()),
    licensePlate: v.optional(v.string()),
    color: v.optional(v.string()),
    engineType: v.optional(v.string()),
    transmission: v.optional(v.string()),
    fuelType: v.optional(v.union(
      v.literal("gasoline"),
      v.literal("diesel"),
      v.literal("electric"),
      v.literal("hybrid")
    )),
    mileage: v.number(),
    lastServiceDate: v.optional(v.string()),
    nextServiceDue: v.optional(v.number()),
    insuranceExpiry: v.optional(v.string()),
    registrationExpiry: v.optional(v.string()),
    notes: v.optional(v.string()),
    status: v.union(
      v.literal("active"),
      v.literal("in-service"),
      v.literal("delivered"),
      v.literal("inactive")
    ),
    orgId: v.string(),
  }).index("by_customer", ["customerId"])
    .index("by_vin", ["vin"])
    .index("by_plate", ["licensePlate"])
    .index("by_status", ["status"])
    .index("by_org", ["orgId"]),

  // ============ 4. SUPPLIERS (Vendor Database) ============
  suppliers: defineTable({
    supplierCode: v.string(),
    name: v.string(),
    contactPerson: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    country: v.optional(v.string()),
    category: v.optional(v.string()),
    paymentTerms: v.optional(v.string()),
    creditLimit: v.optional(v.number()),
    taxId: v.optional(v.string()),
    website: v.optional(v.string()),
    notes: v.optional(v.string()),
    isActive: v.boolean(),
    orgId: v.string(),
  }).index("by_code", ["supplierCode"])
    .index("by_category", ["category"])
    .index("by_org", ["orgId"]),

  // ============ 5. INVENTORY (Parts Catalog) ============
  inventory: defineTable({
    partNumber: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    category: v.string(),
    subcategory: v.optional(v.string()),
    brand: v.optional(v.string()),
    supplierId: v.optional(v.id("suppliers")),
    costPrice: v.number(),
    sellingPrice: v.number(),
    markupPercentage: v.optional(v.number()),
    stockQuantity: v.number(),
    minStockLevel: v.number(),
    maxStockLevel: v.optional(v.number()),
    reorderPoint: v.number(),
    unitOfMeasure: v.optional(v.string()),
    weight: v.optional(v.number()),
    dimensions: v.optional(v.string()),
    warrantyPeriod: v.optional(v.number()), // in months
    barcode: v.optional(v.string()),
    location: v.optional(v.string()),
    condition: v.union(
      v.literal("new"),
      v.literal("used"),
      v.literal("refurbished")
    ),
    isActive: v.boolean(),
    orgId: v.string(),
  }).index("by_partNumber", ["partNumber"])
    .index("by_category", ["category"])
    .index("by_supplier", ["supplierId"])
    .index("by_barcode", ["barcode"])
    .index("by_org", ["orgId"]),

  // ============ 6. LABOR GUIDE (Service Operations) ============
  laborGuide: defineTable({
    operationCode: v.string(),
    description: v.string(),
    category: v.optional(v.string()),
    subcategory: v.optional(v.string()),
    standardHours: v.number(),
    suggestedRate: v.number(),
    skillLevel: v.union(
      v.literal("basic"),
      v.literal("intermediate"),
      v.literal("advanced"),
      v.literal("expert")
    ),
    toolsRequired: v.optional(v.array(v.string())),
    safetyNotes: v.optional(v.string()),
    isActive: v.boolean(),
  }).index("by_code", ["operationCode"])
    .index("by_category", ["category"]),

  // ============ 7. APPOINTMENTS (Scheduling) ============
  appointments: defineTable({
    appointmentNumber: v.string(),
    customerId: v.id("customers"),
    vehicleId: v.id("vehicles"),
    technicianId: v.optional(v.id("users")),
    serviceAdvisorId: v.optional(v.id("users")),
    appointmentDate: v.string(),
    durationMinutes: v.number(),
    serviceType: v.optional(v.string()),
    status: v.union(
      v.literal("scheduled"),
      v.literal("confirmed"),
      v.literal("in-progress"),
      v.literal("completed"),
      v.literal("cancelled"),
      v.literal("no-show")
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("normal"),
      v.literal("high"),
      v.literal("urgent")
    ),
    customerNotes: v.optional(v.string()),
    internalNotes: v.optional(v.string()),
    estimatedCost: v.optional(v.number()),
    reminderSent: v.boolean(),
    orgId: v.string(),
  }).index("by_date", ["appointmentDate"])
    .index("by_customer", ["customerId"])
    .index("by_vehicle", ["vehicleId"])
    .index("by_technician", ["technicianId"])
    .index("by_status", ["status"])
    .index("by_org", ["orgId"]),

  // ============ 8. WORK ORDERS (Job Cards) ============
  workOrders: defineTable({
    jobNumber: v.string(),
    appointmentId: v.optional(v.id("appointments")),
    vehicleId: v.id("vehicles"),
    customerId: v.id("customers"),
    technicianId: v.optional(v.id("users")),
    serviceAdvisorId: v.optional(v.id("users")),
    status: v.union(
      v.literal("check-in"),
      v.literal("inspecting"),
      v.literal("awaiting-approval"),
      v.literal("in-progress"),
      v.literal("waiting-parts"),
      v.literal("complete"),
      v.literal("invoiced"),
      v.literal("cancelled")
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("normal"),
      v.literal("high"),
      v.literal("urgent")
    ),
    services: v.array(v.string()),
    customerComplaint: v.optional(v.string()),
    diagnosis: v.optional(v.string()),
    workPerformed: v.optional(v.string()),
    recommendations: v.optional(v.string()),
    mileageIn: v.optional(v.number()),
    mileageOut: v.optional(v.number()),
    laborHours: v.optional(v.number()),
    partsTotal: v.optional(v.number()),
    laborTotal: v.optional(v.number()),
    taxAmount: v.optional(v.number()),
    totalAmount: v.optional(v.number()),
    checkinDate: v.string(),
    startedAt: v.optional(v.string()),
    completedAt: v.optional(v.string()),
    orgId: v.string(),
  }).index("by_jobNumber", ["jobNumber"])
    .index("by_customer", ["customerId"])
    .index("by_vehicle", ["vehicleId"])
    .index("by_technician", ["technicianId"])
    .index("by_status", ["status"])
    .index("by_org", ["orgId"]),

  // ============ 9. INSPECTIONS (Digital Vehicle Inspection) ============
  inspections: defineTable({
    inspectionNumber: v.string(),
    workOrderId: v.optional(v.id("workOrders")),
    vehicleId: v.id("vehicles"),
    customerId: v.id("customers"),
    technicianId: v.optional(v.id("users")),
    status: v.union(
      v.literal("draft"),
      v.literal("in-progress"),
      v.literal("completed"),
      v.literal("approved"),
      v.literal("declined")
    ),
    mileage: v.optional(v.number()),
    fuelLevel: v.optional(v.string()),
    overallCondition: v.union(
      v.literal("excellent"),
      v.literal("good"),
      v.literal("fair"),
      v.literal("poor")
    ),
    safetyRating: v.union(
      v.literal("safe"),
      v.literal("attention-needed"),
      v.literal("unsafe")
    ),
    items: v.array(v.object({
      name: v.string(),
      category: v.string(),
      status: v.union(
        v.literal("ok"),
        v.literal("attention"),
        v.literal("immediate-attention"),
        v.literal("not-applicable")
      ),
      notes: v.optional(v.string()),
      photoUrls: v.optional(v.array(v.string())),
    })),
    customerNotes: v.optional(v.string()),
    technicianNotes: v.optional(v.string()),
    recommendations: v.optional(v.string()),
    nextInspectionDue: v.optional(v.string()),
    startedAt: v.optional(v.string()),
    completedAt: v.optional(v.string()),
    approvedAt: v.optional(v.string()),
    orgId: v.string(),
  }).index("by_vehicle", ["vehicleId"])
    .index("by_customer", ["customerId"])
    .index("by_technician", ["technicianId"])
    .index("by_status", ["status"])
    .index("by_org", ["orgId"]),

  // ============ 10. ESTIMATES (Quotes) ============
  estimates: defineTable({
    estimateNumber: v.string(),
    workOrderId: v.optional(v.id("workOrders")),
    inspectionId: v.optional(v.id("inspections")),
    customerId: v.id("customers"),
    vehicleId: v.id("vehicles"),
    technicianId: v.optional(v.id("users")),
    serviceAdvisorId: v.optional(v.id("users")),
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("viewed"),
      v.literal("approved"),
      v.literal("declined"),
      v.literal("expired"),
      v.literal("revised")
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("normal"),
      v.literal("high"),
      v.literal("urgent")
    ),
    lineItems: v.array(v.object({
      type: v.union(
        v.literal("part"),
        v.literal("labor"),
        v.literal("service"),
        v.literal("misc")
      ),
      description: v.string(),
      partId: v.optional(v.id("inventory")),
      laborId: v.optional(v.id("laborGuide")),
      quantity: v.number(),
      unitPrice: v.number(),
      discountPercentage: v.optional(v.number()),
      totalPrice: v.number(),
      isApproved: v.boolean(),
    })),
    workDescription: v.optional(v.string()),
    customerNotes: v.optional(v.string()),
    internalNotes: v.optional(v.string()),
    subtotal: v.number(),
    discountPercentage: v.optional(v.number()),
    discountAmount: v.optional(v.number()),
    taxPercentage: v.optional(v.number()),
    taxAmount: v.number(),
    totalAmount: v.number(),
    validUntil: v.optional(v.string()),
    sentAt: v.optional(v.string()),
    viewedAt: v.optional(v.string()),
    approvedAt: v.optional(v.string()),
    declinedAt: v.optional(v.string()),
    declineReason: v.optional(v.string()),
    orgId: v.string(),
  }).index("by_customer", ["customerId"])
    .index("by_vehicle", ["vehicleId"])
    .index("by_status", ["status"])
    .index("by_estimateNumber", ["estimateNumber"])
    .index("by_org", ["orgId"]),

  // ============ 11. INVOICES (Billing) ============
  invoices: defineTable({
    invoiceNumber: v.string(),
    workOrderId: v.optional(v.id("workOrders")),
    estimateId: v.optional(v.id("estimates")),
    customerId: v.id("customers"),
    vehicleId: v.id("vehicles"),
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("paid"),
      v.literal("partial"),
      v.literal("overdue"),
      v.literal("cancelled")
    ),
    lineItems: v.array(v.object({
      type: v.union(
        v.literal("part"),
        v.literal("labor"),
        v.literal("service"),
        v.literal("misc")
      ),
      description: v.string(),
      quantity: v.number(),
      unitPrice: v.number(),
      totalPrice: v.number(),
    })),
    subtotal: v.number(),
    discountAmount: v.optional(v.number()),
    taxAmount: v.number(),
    totalAmount: v.number(),
    paidAmount: v.number(),
    balanceDue: v.number(),
    dueDate: v.optional(v.string()),
    paymentTerms: v.optional(v.string()),
    notes: v.optional(v.string()),
    sentAt: v.optional(v.string()),
    orgId: v.string(),
  }).index("by_customer", ["customerId"])
    .index("by_vehicle", ["vehicleId"])
    .index("by_status", ["status"])
    .index("by_invoiceNumber", ["invoiceNumber"])
    .index("by_org", ["orgId"]),

  // ============ 12. SALES (POS Transactions) ============
  // KEY FEATURE: Inventory auto-decrements when a sale is recorded
  sales: defineTable({
    saleNumber: v.string(),
    items: v.array(v.object({
      inventoryId: v.id("inventory"),
      partNumber: v.string(),
      name: v.string(),
      quantity: v.number(),
      unitPrice: v.number(),
      totalPrice: v.number(),
    })),
    subtotal: v.number(),
    taxAmount: v.number(),
    discountAmount: v.optional(v.number()),
    totalAmount: v.number(),
    paymentMethod: v.union(
      v.literal("cash"),
      v.literal("zaad"),
      v.literal("edahab"),
      v.literal("card"),
      v.literal("bank-transfer")
    ),
    paymentReference: v.optional(v.string()),
    customerId: v.optional(v.id("customers")),
    cashierId: v.optional(v.id("users")),
    notes: v.optional(v.string()),
    createdAt: v.string(),
    orgId: v.string(),
  }).index("by_date", ["createdAt"])
    .index("by_customer", ["customerId"])
    .index("by_paymentMethod", ["paymentMethod"])
    .index("by_org", ["orgId"]),

  // ============ 13. REMINDERS (Notifications) ============
  reminders: defineTable({
    type: v.union(
      v.literal("service"),
      v.literal("registration"),
      v.literal("insurance"),
      v.literal("inspection"),
      v.literal("payment"),
      v.literal("follow-up")
    ),
    vehicleId: v.optional(v.id("vehicles")),
    customerId: v.id("customers"),
    workOrderId: v.optional(v.id("workOrders")),
    title: v.string(),
    message: v.optional(v.string()),
    dueDate: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("sent"),
      v.literal("completed"),
      v.literal("overdue"),
      v.literal("cancelled")
    ),
    notificationChannel: v.optional(v.union(
      v.literal("sms"),
      v.literal("email"),
      v.literal("whatsapp"),
      v.literal("app")
    )),
    sentAt: v.optional(v.string()),
    completedAt: v.optional(v.string()),
    notes: v.optional(v.string()),
    orgId: v.string(),
  }).index("by_customer", ["customerId"])
    .index("by_vehicle", ["vehicleId"])
    .index("by_dueDate", ["dueDate"])
    .index("by_status", ["status"])
    .index("by_type", ["type"])
    .index("by_org", ["orgId"]),

  // ============ 14. AUTOMOTIVE POIs (Points of Interest) ============
  // Stakeholder mapping for garages, dealers, and parts shops
  automotivePois: defineTable({
    businessName: v.string(),
    category: v.union(
      v.literal("garage"),
      v.literal("spare_parts"),
      v.literal("car_dealer"),
      v.literal("tire_shop"),
      v.literal("fuel_station"),
      v.literal("fleet_operator"),
      v.literal("oil_lubricants"),
      v.literal("batteries"),
      v.literal("tools_equipment")
    ),
    city: v.string(),
    address: v.optional(v.string()),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    rating: v.optional(v.number()),
    reviewCount: v.optional(v.number()),
    website: v.optional(v.string()),
    source: v.string(), // "manual", "directory", "research"
    contactPerson: v.optional(v.string()),
    operatingHours: v.optional(v.string()),
    verifiedAt: v.optional(v.string()),
    notes: v.optional(v.string()),
    isActive: v.boolean(),
  }).index("by_city", ["city"])
    .index("by_category", ["category"]),

  // ============ 15. SPARE PARTS MASTER (Toyota/Suzuki Catalog) ============
  // Common failure parts for 2010-2016 Japanese vehicles in Somaliland
  sparePartsMaster: defineTable({
    partNumber: v.string(),
    oemNumber: v.optional(v.string()),
    name: v.string(),
    nameArabic: v.optional(v.string()),
    category: v.string(), // Engine, Suspension, Brakes, Electrical, Interior
    subcategory: v.optional(v.string()),
    compatibleMakes: v.array(v.string()), // ["Toyota", "Suzuki"]
    compatibleModels: v.array(v.string()), // ["Hilux 2010-2016", "Vitz", "Crown"]
    engineCodes: v.optional(v.array(v.string())), // ["2KD-FTV", "1NZ-FE"]
    priceUaeUsd: v.optional(v.number()),
    landedCostUsd: v.optional(v.number()), // (UAE * 1.25) + 20
    localPriceUsd: v.optional(v.number()), // Hargeisa market price
    priceTier: v.union(
      v.literal("genuine_oem"),
      v.literal("premium_aftermarket"),
      v.literal("tijari_commercial")
    ),
    brand: v.optional(v.string()), // Denso, KYB, NGK, etc.
    steeringSideCritical: v.boolean(), // LHD/RHD safety warning
    failureRank: v.optional(v.number()), // 1-10, how common is failure
    averageLifespanKm: v.optional(v.number()),
    warrantyMonths: v.optional(v.number()),
    notes: v.optional(v.string()),
    isActive: v.boolean(),
  }).index("by_partNumber", ["partNumber"])
    .index("by_category", ["category"])
    .index("by_priceTier", ["priceTier"]),

  // ============ 16. MARKET PRICE INTELLIGENCE ============
  // Vehicle pricing benchmarks: BE FORWARD vs Street Price
  marketPriceIntelligence: defineTable({
    vehicleMake: v.string(),
    vehicleModel: v.string(),
    yearFrom: v.number(),
    yearTo: v.number(),
    source: v.string(), // "beforward", "local_market", "research"
    fobPriceUsd: v.optional(v.number()), // Japan FOB price
    cAndFPriceUsd: v.optional(v.number()), // Cost + Freight to Berbera
    streetPriceUsd: v.optional(v.number()), // Hargeisa street price
    averageMileage: v.optional(v.number()),
    condition: v.optional(v.string()), // "Excellent", "Good", "Fair"
    sampleSize: v.optional(v.number()),
    recordedAt: v.string(),
    notes: v.optional(v.string()),
  }).index("by_make", ["vehicleMake"])
    .index("by_model", ["vehicleModel"]),

  // ============ 17. MASS PARTNERS (B2B Network) ============
  // Importers, fleet operators, and potential partners
  massPartners: defineTable({
    partnerName: v.string(),
    partnerType: v.union(
      v.literal("importer"),
      v.literal("distributor"),
      v.literal("fleet_operator"),
      v.literal("garage_network"),
      v.literal("government"),
      v.literal("ngo")
    ),
    registrationYear: v.optional(v.number()),
    supplyRegion: v.optional(v.string()), // "Dubai", "Japan", "Local"
    contactPerson: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    city: v.string(),
    fleetSize: v.optional(v.number()),
    specializations: v.optional(v.array(v.string())),
    partnershipStatus: v.union(
      v.literal("prospect"),
      v.literal("contacted"),
      v.literal("onboarding"),
      v.literal("active"),
      v.literal("inactive")
    ),
    notes: v.optional(v.string()),
  }).index("by_city", ["city"])
    .index("by_type", ["partnerType"])
    .index("by_status", ["partnershipStatus"]),

  // ============ 18. PAYMENTS (Financial Integrity) ============
  // Tracks split payments, deposits, and payment methods
  payments: defineTable({
    invoiceId: v.id("invoices"),
    amount: v.number(),
    method: v.union(
      v.literal("cash"),
      v.literal("zaad"),
      v.literal("edahab"),
      v.literal("card"),
      v.literal("bank_transfer"),
      v.literal("check")
    ),
    reference: v.optional(v.string()),
    receivedBy: v.id("users"), // Staff who took payment
    paymentDate: v.string(),
    notes: v.optional(v.string()),
    isDeposit: v.boolean(),
    orgId: v.string(),
  }).index("by_invoice", ["invoiceId"])
    .index("by_date", ["paymentDate"])
    .index("by_method", ["method"])
    .index("by_org", ["orgId"]),

  // ============ 19. EXPENSES (Operational Costs) ============
  // Tracks shop spending beyond COGS
  expenses: defineTable({
    category: v.string(), // "Rent", "Utilities", "Tools"
    amount: v.number(),
    description: v.string(),
    paidBy: v.id("users"),
    paymentMethod: v.string(),
    date: v.string(),
    receiptUrl: v.optional(v.string()), // For uploaded receipts
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("paid")
    ),
    orgId: v.string(),
  }).index("by_category", ["category"])
    .index("by_date", ["date"])
    .index("by_org", ["orgId"]),

  // ============ 20. EXPENSE CATEGORIES ============
  // Configurable types for expense reporting
  expenseCategories: defineTable({
    name: v.string(),
    type: v.union(
      v.literal("overhead"), // Rent, Utilities
      v.literal("cogs"),     // Cost of Goods Sold adjustment
      v.literal("labor"),    // Contract labor
      v.literal("marketing"),
      v.literal("equipment")
    ),
    description: v.optional(v.string()),
    isActive: v.boolean(),
    orgId: v.string(),
  }).index("by_type", ["type"])
    .index("by_org", ["orgId"]),

  // ============ 21. PURCHASE ORDERS (Supply Chain) ============
  // Tracks stock ordering from suppliers
  purchaseOrders: defineTable({
    poNumber: v.string(),
    supplierId: v.id("suppliers"),
    status: v.union(
      v.literal("draft"),
      v.literal("ordered"),
      v.literal("partial"), // Partially received
      v.literal("received"),
      v.literal("cancelled")
    ),
    items: v.array(v.object({
      partNumber: v.string(),
      name: v.string(),
      quantityOrdered: v.number(),
      quantityReceived: v.number(),
      unitCost: v.number(),
      totalCost: v.number(),
    })),
    totalAmount: v.number(),
    expectedDate: v.optional(v.string()),
    orderedAt: v.optional(v.string()),
    receivedAt: v.optional(v.string()),
    notes: v.optional(v.string()),
    orgId: v.string(),
  }).index("by_supplier", ["supplierId"])
    .index("by_status", ["status"])
    .index("by_org", ["orgId"]),

  // ============ 22. INVENTORY ADJUSTMENTS (Audit Trail) ============
  // Tracks manual corrections, shrinkage, or damages
  inventoryAdjustments: defineTable({
    inventoryId: v.id("inventory"),
    adjustedBy: v.id("users"),
    quantityChange: v.number(), // Positive or Negative
    reason: v.union(
      v.literal("damage"),
      v.literal("theft"),
      v.literal("audit_correction"),
      v.literal("return_restock"),
      v.literal("other")
    ),
    notes: v.optional(v.string()),
    date: v.string(),
    orgId: v.string(),
  }).index("by_inventory", ["inventoryId"])
    .index("by_date", ["date"])
    .index("by_org", ["orgId"]),

  // ============ 23. SERVICE PACKAGES (Operations) ============
  // Bundled services for efficiency (e.g., "Full Service - Toyota Vitz")
  servicePackages: defineTable({
    name: v.string(), // "Gold Service Package"
    description: v.optional(v.string()),
    vehicleType: v.optional(v.string()), // "Sedan", "SUV", or specific model
    basePrice: v.number(),
    includedItems: v.array(v.object({
      type: v.union(v.literal("part"), v.literal("labor"), v.literal("fee")),
      itemId: v.optional(v.string()), // ID of part or labor operation
      description: v.string(),
      quantity: v.number(),
    })),
    isActive: v.boolean(),
  }).index("by_active", ["isActive"]),

  // ============ 24. TIME ENTRIES (Technician Efficiency) ============
  // Tracks actual time spent vs. billed time
  timeEntries: defineTable({
    technicianId: v.id("users"),
    workOrderId: v.id("workOrders"),
    serviceId: v.optional(v.string()), // Which specific job on the ticket
    startTime: v.string(),
    endTime: v.optional(v.string()),
    durationMinutes: v.optional(v.number()),
    notes: v.optional(v.string()),
    orgId: v.string(),
  }).index("by_tech", ["technicianId"])
    .index("by_workOrder", ["workOrderId"])
    .index("by_org", ["orgId"]),

  // ============ 25. INSPECTION TEMPLATES (Customizable DVI) ============
  // Allows shops to create custom inspection checklists
  inspectionTemplates: defineTable({
    name: v.string(), // "18-Point Inspection", "Pre-Purchase Inspection"
    description: v.optional(v.string()),
    vehicleType: v.optional(v.string()), // "SUV", "Sedan", "All"
    groups: v.array(v.object({
      id: v.string(),
      name: v.string(), // "Exterior", "Under Hood", "Brakes"
      order: v.number(),
      tasks: v.array(v.object({
        id: v.string(),
        name: v.string(), // "Front Brake Pads"
        order: v.number(),
        defaultFindings: v.optional(v.array(v.string())), // ["Good", "Worn 50%", "Needs Replacement"]
        cannedJobId: v.optional(v.id("cannedJobs")), // Auto-add to estimate if fail
      })),
    })),
    isDefault: v.optional(v.boolean()), // Use as default template
    isActive: v.boolean(),
    createdBy: v.optional(v.id("users")),
    createdAt: v.optional(v.string()),
    orgId: v.string(),
  }).index("by_active", ["isActive"])
    .index("by_default", ["isDefault"])
    .index("by_org", ["orgId"]),

  // ============ 26. CANNED JOBS (Pre-Built Service Packages) ============
  // Like Tekmetric's canned jobs - pre-configured labor + parts bundles
  cannedJobs: defineTable({
    name: v.string(), // "Oil Change - Synthetic"
    code: v.optional(v.string()), // "OIL-SYN-001"
    description: v.optional(v.string()),
    category: v.string(), // "Maintenance", "Brakes", "Suspension"
    laborHours: v.number(), // 0.5
    laborRate: v.number(), // 50 (SL Shilling)
    parts: v.array(v.object({
      partId: v.optional(v.id("inventory")),
      partNumber: v.optional(v.string()),
      name: v.string(),
      quantity: v.number(),
      unitPrice: v.number(),
    })),
    totalLaborCost: v.number(),
    totalPartsCost: v.number(),
    totalPrice: v.number(),
    marginPercent: v.optional(v.number()),
    applicableVehicles: v.optional(v.array(v.string())), // ["Toyota", "Suzuki"]
    isPackageDeal: v.optional(v.boolean()), // Bundle discount
    packageDiscount: v.optional(v.number()), // Percentage off
    isActive: v.boolean(),
    sortOrder: v.optional(v.number()),
    orgId: v.string(),
  }).index("by_category", ["category"])
    .index("by_active", ["isActive"])
    .index("by_org", ["orgId"]),

  // ============ 27. CUSTOMER APPROVALS (Digital Signatures) ============
  // Track customer approval of estimates via unique links
  customerApprovals: defineTable({
    estimateId: v.id("estimates"),
    customerId: v.id("customers"),
    approvalToken: v.string(), // Unique URL token
    sentAt: v.string(),
    sentVia: v.union(v.literal("sms"), v.literal("email"), v.literal("whatsapp")),
    viewedAt: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("viewed"),
      v.literal("approved"),
      v.literal("declined"),
      v.literal("expired")
    ),
    approvedAt: v.optional(v.string()),
    declinedAt: v.optional(v.string()),
    declineReason: v.optional(v.string()),
    signatureData: v.optional(v.string()), // Base64 signature image
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    approvedItems: v.optional(v.array(v.string())), // IDs of approved line items
    declinedItems: v.optional(v.array(v.string())), // IDs of declined line items
    notes: v.optional(v.string()),
    orgId: v.string(),
  }).index("by_estimate", ["estimateId"])
    .index("by_token", ["approvalToken"])
    .index("by_customer", ["customerId"])
    .index("by_status", ["status"])
    .index("by_org", ["orgId"]),

  // ============ 28. DVI RESULTS (Completed Inspections) ============
  // Store completed inspections with findings, photos, videos
  dviResults: defineTable({
    workOrderId: v.id("workOrders"),
    vehicleId: v.id("vehicles"),
    templateId: v.optional(v.id("inspectionTemplates")),
    technicianId: v.id("users"),
    startedAt: v.string(),
    completedAt: v.optional(v.string()),
    status: v.union(
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("sent_to_customer"),
      v.literal("approved")
    ),
    findings: v.array(v.object({
      taskId: v.string(),
      taskName: v.string(),
      groupName: v.string(),
      severity: v.union(
        v.literal("good"),
        v.literal("attention"),
        v.literal("urgent")
      ),
      finding: v.optional(v.string()),
      notes: v.optional(v.string()),
      photos: v.optional(v.array(v.string())), // Storage IDs
      videos: v.optional(v.array(v.string())), // Storage IDs
      markedUpPhotos: v.optional(v.array(v.string())), // With annotations
      recommendedCannedJobId: v.optional(v.id("cannedJobs")),
    })),
    overallNotes: v.optional(v.string()),
    customerViewedAt: v.optional(v.string()),
    customerApprovedAt: v.optional(v.string()),
    sentToCustomerAt: v.optional(v.string()),
    orgId: v.string(),
  }).index("by_workOrder", ["workOrderId"])
    .index("by_vehicle", ["vehicleId"])
    .index("by_technician", ["technicianId"])
    .index("by_status", ["status"])
    .index("by_org", ["orgId"]),

  // ============ 29. CMS CONTENT (Dynamic Website Config) ============
  // Stores text and settings for the Public Landing Page
  cmsContent: defineTable({
    section: v.string(), // "hero", "features", "pricing", "contact"
    key: v.string(), // "headline", "subheadline", "banner_image"
    value: v.string(), // The text content or image URL
    type: v.union(
      v.literal("text"),
      v.literal("image"),
      v.literal("boolean"),
      v.literal("json")
    ),
    isActive: v.boolean(),
    lastUpdatedBy: v.optional(v.id("users")),
    orgId: v.string(),
  }).index("by_section", ["section"])
    .index("by_key", ["section", "key"])
    .index("by_org", ["orgId"]),

  // ============ 30. SETTINGS (SaaS Configuration) ============
  // Stores organization-specific settings for branding, SEO, integrations
  settings: defineTable({
    orgId: v.string(),
    siteName: v.optional(v.string()), // "My Workshop"
    timezone: v.optional(v.string()), // "Africa/Nairobi"
    currency: v.optional(v.string()), // "USD", "SLSH"
    
    // Branding
    logoUrl: v.optional(v.string()),
    faviconUrl: v.optional(v.string()),
    primaryColor: v.optional(v.string()), // "#00A65A"
    secondaryColor: v.optional(v.string()),
    
    // SEO
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    seoKeywords: v.optional(v.string()),
    
    // Integrations
    googleAnalyticsId: v.optional(v.string()),
    facebookPixelId: v.optional(v.string()),
    
    // System
    invoicePrefix: v.optional(v.string()), // "INV-"
    jobPrefix: v.optional(v.string()), // "JOB-"
  }).index("by_org", ["orgId"]),

  // ============================================================
  // MASS OS - AUTOMOTIVE INTELLIGENCE TABLES
  // ============================================================

  // ============ 31. AUTOMOTIVE ENTITIES (Workshops, Dealers, etc.) ============
  automotiveEntities: defineTable({
    entityType: v.union(
      v.literal("workshop"),
      v.literal("dealer"),
      v.literal("parts_seller"),
      v.literal("dilaal"),
      v.literal("tire_shop"),
      v.literal("fuel_station"),
      v.literal("fleet_operator"),
      v.literal("service_provider")
    ),
    businessName: v.string(),
    businessNameSomali: v.optional(v.string()),
    city: v.string(),
    neighborhood: v.optional(v.string()),
    addressRaw: v.optional(v.string()),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    phoneNumbers: v.array(v.string()),
    email: v.optional(v.string()),
    whatsapp: v.optional(v.string()),
    facebook: v.optional(v.string()),
    tiktok: v.optional(v.string()),
    servicesOffered: v.array(v.string()),
    brandsSpecialized: v.array(v.string()),
    laborRate: v.optional(v.number()),
    trustScore: v.number(), // 0-100
    dataQuality: v.union(v.literal("high"), v.literal("medium"), v.literal("low")),
    source: v.union(
      v.literal("google_maps"),
      v.literal("facebook"),
      v.literal("tiktok"),
      v.literal("manual"),
      v.literal("gold_standard")
    ),
    verified: v.boolean(),
    isActive: v.boolean(),
    lastUpdated: v.string(),
    googlePlaceId: v.optional(v.string()),
    mediaAssets: v.optional(v.array(v.string())),
  }).index("by_city", ["city"])
    .index("by_type", ["entityType"])
    .index("by_verified", ["verified"])
    .index("by_source", ["source"]),

  // ============ 32. VEHICLE INTELLIGENCE (Market Data) ============
  vehicleIntelligence: defineTable({
    make: v.string(),
    model: v.string(),
    variant: v.optional(v.string()),
    yearRangeStart: v.number(),
    yearRangeEnd: v.number(),
    popularityScore: v.number(), // 1-100
    primaryUse: v.union(
      v.literal("taxi"),
      v.literal("personal"),
      v.literal("commercial"),
      v.literal("government"),
      v.literal("ngo")
    ),
    typicalImportSource: v.union(
      v.literal("japan"),
      v.literal("uae"),
      v.literal("europe"),
      v.literal("usa"),
      v.literal("china")
    ),
    priceRangeLow: v.number(),
    priceRangeHigh: v.number(),
    fuelType: v.union(
      v.literal("petrol"),
      v.literal("diesel"),
      v.literal("hybrid"),
      v.literal("electric")
    ),
    commonFaults: v.array(v.string()),
    repairFrequencyMonths: v.optional(v.number()),
    partsAvailability: v.union(v.literal("abundant"), v.literal("common"), v.literal("rare")),
    maintenanceCostIndex: v.number(), // Relative to Toyota Vitz = 100
    somaliNickname: v.optional(v.string()),
    mechanicNotes: v.array(v.string()),
    climateConsiderations: v.array(v.string()),
  }).index("by_make", ["make"])
    .index("by_model", ["make", "model"])
    .index("by_popularity", ["popularityScore"]),

  // ============ 33. PARTS INTELLIGENCE (Market Pricing) ============
  partsIntelligence: defineTable({
    partNumber: v.string(),
    partNumberOem: v.optional(v.string()),
    name: v.string(),
    nameSomali: v.optional(v.string()),
    category: v.string(),
    subcategory: v.optional(v.string()),
    compatibleMakes: v.array(v.string()),
    compatibleModels: v.array(v.string()),
    priceOemUsd: v.optional(v.number()),
    priceAftermarketUsd: v.optional(v.number()),
    priceUsedUsd: v.optional(v.number()),
    availabilityScore: v.number(), // 0-100
    counterfeitRisk: v.union(v.literal("high"), v.literal("medium"), v.literal("low")),
    demandLevel: v.union(v.literal("very_high"), v.literal("high"), v.literal("medium"), v.literal("low")),
    lastPriceUpdate: v.string(),
    priceSource: v.optional(v.string()),
  }).index("by_category", ["category"])
    .index("by_part_number", ["partNumber"])
    .index("by_demand", ["demandLevel"]),

  // ============ 34. MARKET SNAPSHOTS (Daily Analytics) ============
  marketSnapshots: defineTable({
    date: v.string(), // YYYY-MM-DD
    city: v.string(),
    totalWorkshops: v.number(),
    totalVehicles: v.number(),
    averageRepairCost: v.number(),
    topRepairs: v.array(v.object({
      repair: v.string(),
      count: v.number(),
    })),
    topParts: v.array(v.object({
      part: v.string(),
      demand: v.number(),
    })),
    priceChanges: v.optional(v.array(v.object({
      item: v.string(),
      previousPrice: v.number(),
      newPrice: v.number(),
      changePercent: v.number(),
    }))),
  }).index("by_date", ["date"])
    .index("by_city", ["city"])
    .index("by_date_city", ["date", "city"]),
});

