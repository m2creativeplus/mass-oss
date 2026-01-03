import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ============================================================
// MASS Car Workshop - Convex Functions
// Real-time CRUD with automatic inventory management
// ============================================================

// ============ USERS ============
export const getUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

export const createUser = mutation({
  args: {
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
    orgName: v.optional(v.string()), // Optional, defaults to "My Workshop"
  },
  handler: async (ctx, args) => {
    // 1. Create User
    const userId = await ctx.db.insert("users", {
      email: args.email,
      firstName: args.firstName,
      lastName: args.lastName,
      phone: args.phone,
      role: args.role,
      isActive: true,
      lastLoginAt: new Date().toISOString(),
    });

    // 2. If Admin, Create Default Organization
    if (args.role === "admin") {
      const orgId = await ctx.db.insert("organizations", {
        name: args.orgName || "My Workshop",
        slug: (args.orgName || "my-workshop").toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
        ownerId: userId,
        plan: "free",
        isActive: true,
      });

      // 3. Assign Role
      await ctx.db.insert("userOrgRoles", {
        userId,
        orgId,
        role: "admin",
        isActive: true,
      });
    }

    return userId;
  },
});

export const getUserOrgs = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const roles = await ctx.db
      .query("userOrgRoles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    
    // Fetch org details for each role
    const orgs = await Promise.all(
      roles.map(async (role) => {
        const org = await ctx.db.get(role.orgId);
        return { ...org, role: role.role };
      })
    );
    
    return orgs.filter(o => o.isActive); // Only active orgs
  },
});

// ============ CUSTOMERS ============
export const getCustomers = query({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("customers")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect();
  },
});

export const getCustomerById = query({
  args: { id: v.id("customers") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const addCustomer = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    country: v.optional(v.string()),

    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const count = await ctx.db
      .query("customers")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect();
    const customerNumber = `CUST-${String(count.length + 1).padStart(6, "0")}`;
    
    return await ctx.db.insert("customers", {
      ...args,
      customerNumber,
      isActive: true,
    });
  },
});

export const updateCustomer = mutation({
  args: {
    id: v.id("customers"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const deleteCustomer = mutation({
  args: { id: v.id("customers") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// ============ VEHICLES ============
export const getVehicles = query({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("vehicles")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect();
  },
});

export const getVehiclesByCustomer = query({
  args: { customerId: v.id("customers") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("vehicles")
      .withIndex("by_customer", (q) => q.eq("customerId", args.customerId))
      .collect();
  },
});

export const addVehicle = mutation({
  args: {
    customerId: v.optional(v.id("customers")),
    make: v.string(),
    model: v.string(),
    year: v.number(),
    vin: v.optional(v.string()),
    licensePlate: v.optional(v.string()),
    color: v.optional(v.string()),
    mileage: v.number(),
    status: v.union(
      v.literal("active"),
      v.literal("in-service"),
      v.literal("delivered"),
      v.literal("inactive")
    ),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("vehicles", args);
  },
});

export const updateVehicle = mutation({
  args: {
    id: v.id("vehicles"),
    mileage: v.optional(v.number()),
    status: v.optional(v.union(
      v.literal("active"),
      v.literal("in-service"),
      v.literal("delivered"),
      v.literal("inactive")
    )),
    lastServiceDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const deleteVehicle = mutation({
  args: { id: v.id("vehicles") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// ============ SUPPLIERS ============
export const getSuppliers = query({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("suppliers")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect();
  },
});

export const addSupplier = mutation({
  args: {
    name: v.string(),
    contactPerson: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    category: v.optional(v.string()),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const count = await ctx.db
      .query("suppliers")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect();
    const supplierCode = `SUP-${String(count.length + 1).padStart(4, "0")}`;
    
    return await ctx.db.insert("suppliers", {
      ...args,
      supplierCode,
      isActive: true,
    });
  },
});

// ============ INVENTORY (with stock tracking) ============
export const getInventory = query({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("inventory")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect();
  },
});

export const getInventoryByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("inventory")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
  },
});

export const getLowStockItems = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db.query("inventory").collect();
    return items.filter((item) => item.stockQuantity <= item.reorderPoint);
  },
});

export const addInventoryItem = mutation({
  args: {
    partNumber: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    category: v.string(),
    brand: v.optional(v.string()),
    supplierId: v.optional(v.id("suppliers")),
    costPrice: v.number(),
    sellingPrice: v.number(),
    stockQuantity: v.number(),
    minStockLevel: v.number(),
    reorderPoint: v.number(),
    condition: v.union(
      v.literal("new"),
      v.literal("used"),
      v.literal("refurbished")
    ),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("inventory", {
      ...args,
      isActive: true,
    });
  },
});

export const updateInventoryQuantity = mutation({
  args: {
    id: v.id("inventory"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { stockQuantity: args.quantity });
  },
});

// ============ LABOR GUIDE ============
export const getLaborGuide = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("laborGuide").collect();
  },
});

export const addLaborOperation = mutation({
  args: {
    operationCode: v.string(),
    description: v.string(),
    category: v.optional(v.string()),
    standardHours: v.number(),
    suggestedRate: v.number(),
    skillLevel: v.union(
      v.literal("basic"),
      v.literal("intermediate"),
      v.literal("advanced"),
      v.literal("expert")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("laborGuide", {
      ...args,
      isActive: true,
    });
  },
});

// ============ APPOINTMENTS ============
export const getAppointments = query({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("appointments")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect();
  },
});

export const getAppointmentsByDate = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("appointments")
      .withIndex("by_date", (q) => q.eq("appointmentDate", args.date))
      .collect();
  },
});

export const createAppointment = mutation({
  args: {
    customerId: v.id("customers"),
    vehicleId: v.id("vehicles"),
    technicianId: v.optional(v.id("users")),
    appointmentDate: v.string(),
    durationMinutes: v.number(),
    serviceType: v.optional(v.string()),
    priority: v.union(
      v.literal("low"),
      v.literal("normal"),
      v.literal("high"),
      v.literal("urgent")
    ),
    customerNotes: v.optional(v.string()),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const count = await ctx.db
      .query("appointments")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect();
    const appointmentNumber = `APT-${String(count.length + 1).padStart(6, "0")}`;
    
    return await ctx.db.insert("appointments", {
      ...args,
      appointmentNumber,
      status: "scheduled",
      reminderSent: false,
    });
  },
});

export const deleteAppointment = mutation({
  args: { id: v.id("appointments") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// ============ WORK ORDERS ============
export const getWorkOrders = query({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("workOrders")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect();
  },
});

export const getWorkOrdersByStatus = query({
  args: {
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
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("workOrders")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();
  },
});

export const createWorkOrder = mutation({
  args: {
    vehicleId: v.id("vehicles"),
    customerId: v.id("customers"),
    technicianId: v.optional(v.id("users")),
    services: v.array(v.string()),
    priority: v.union(
      v.literal("low"),
      v.literal("normal"),
      v.literal("high"),
      v.literal("urgent")
    ),
    customerComplaint: v.optional(v.string()),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const count = await ctx.db
      .query("workOrders")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect();
    const jobNumber = `JOB-${String(count.length + 1).padStart(6, "0")}`;
    
    // Update vehicle status to in-service
    await ctx.db.patch(args.vehicleId, { status: "in-service" });
    
    return await ctx.db.insert("workOrders", {
      ...args,
      jobNumber,
      status: "check-in",
      checkinDate: new Date().toISOString(),
    });
  },
});

export const updateWorkOrderStatus = mutation({
  args: {
    id: v.id("workOrders"),
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
  },
  handler: async (ctx, args) => {
    const workOrder = await ctx.db.get(args.id);
    
    const updates: Record<string, string> = { status: args.status };
    
    if (args.status === "in-progress" && !workOrder?.startedAt) {
      updates.startedAt = new Date().toISOString();
    }
    
    if (args.status === "complete") {
      updates.completedAt = new Date().toISOString();
      // Update vehicle status back to active
      if (workOrder?.vehicleId) {
        await ctx.db.patch(workOrder.vehicleId, { status: "active" });
      }
    }
    
    await ctx.db.patch(args.id, updates);
  },
});

export const deleteWorkOrder = mutation({
  args: { id: v.id("workOrders") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// ============ INSPECTIONS ============
export const getInspections = query({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("inspections")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect();
  },
});

export const createInspection = mutation({
  args: {
    vehicleId: v.id("vehicles"),
    customerId: v.id("customers"),
    technicianId: v.optional(v.id("users")),
    workOrderId: v.optional(v.id("workOrders")),
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
    })),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const count = await ctx.db
      .query("inspections")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect();
    const inspectionNumber = `INS-${String(count.length + 1).padStart(6, "0")}`;
    
    // Determine overall condition based on items
    const hasImmediate = args.items.some((i) => i.status === "immediate-attention");
    const hasAttention = args.items.some((i) => i.status === "attention");
    
    const overallCondition = hasImmediate ? "poor" : hasAttention ? "fair" : "good";
    const safetyRating = hasImmediate ? "unsafe" : hasAttention ? "attention-needed" : "safe";
    
    return await ctx.db.insert("inspections", {
      ...args,
      inspectionNumber,
      status: "completed",
      overallCondition,
      safetyRating,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    });
  },
});

// ============ ESTIMATES ============
export const getEstimates = query({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("estimates")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect();
  },
});

export const createEstimate = mutation({
  args: {
    customerId: v.id("customers"),
    vehicleId: v.id("vehicles"),
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
      isApproved: v.boolean(),
    })),
    workDescription: v.optional(v.string()),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const count = await ctx.db
      .query("estimates")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect();
    const estimateNumber = `EST-${String(count.length + 1).padStart(6, "0")}`;
    
    const subtotal = args.lineItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const taxAmount = subtotal * 0.05; // 5% tax
    const totalAmount = subtotal + taxAmount;
    
    return await ctx.db.insert("estimates", {
      ...args,
      estimateNumber,
      status: "draft",
      priority: "normal",
      subtotal,
      taxAmount,
      totalAmount,
    });
  },
});

// ============ INVOICES ============
export const getInvoices = query({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("invoices")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect();
  },
});

// ============ SALES / POS ============
// KEY FEATURE: Automatic inventory decrement on sale
export const getSales = query({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sales")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect();
  },
});

export const getSalesToday = query({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toISOString().split("T")[0];
    const sales = await ctx.db.query("sales").collect();
    return sales.filter((sale) => sale.createdAt.startsWith(today));
  },
});

/**
 * CREATE SALE - with automatic inventory decrement
 * When a part sale is recorded in the POS, this mutation:
 * 1. Creates the sale record
 * 2. Automatically decreases inventory stock for each item sold
 */
export const createSale = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    // Generate sale number
    const count = await ctx.db.query("sales").collect();
    const saleNumber = `SALE-${String(count.length + 1).padStart(6, "0")}`;
    
    // 1. Create the sale record
    const saleId = await ctx.db.insert("sales", {
      ...args,
      saleNumber,
      createdAt: new Date().toISOString(),
    });
    
    // 2. AUTO-DECREMENT: Reduce inventory stock for each item sold
    for (const item of args.items) {
      const inventoryItem = await ctx.db.get(item.inventoryId);
      if (inventoryItem) {
        const newQuantity = Math.max(0, inventoryItem.stockQuantity - item.quantity);
        await ctx.db.patch(item.inventoryId, {
          stockQuantity: newQuantity,
        });
      }
    }
    
    return saleId;
  },
});

// ============ REMINDERS ============
export const getReminders = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("reminders").collect();
  },
});

export const getPendingReminders = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("reminders")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();
  },
});

export const createReminder = mutation({
  args: {
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
    title: v.string(),
    message: v.optional(v.string()),
    dueDate: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("reminders", {
      ...args,
      status: "pending",
    });
  },
});

// ============ DASHBOARD STATS ============
export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const vehicles = await ctx.db.query("vehicles").collect();
    const customers = await ctx.db.query("customers").collect();
    const inventory = await ctx.db.query("inventory").collect();
    const workOrders = await ctx.db.query("workOrders").collect();
    const sales = await ctx.db.query("sales").collect();
    
    // Today's data
    const today = new Date().toISOString().split("T")[0];
    const todaySales = sales.filter((s) => s.createdAt.startsWith(today));
    const todayRevenue = todaySales.reduce((sum, s) => sum + s.totalAmount, 0);
    
    // Inventory stats
    const totalParts = inventory.reduce((sum, item) => sum + item.stockQuantity, 0);
    const lowStockItems = inventory.filter((item) => item.stockQuantity <= item.reorderPoint);
    
    // Work order stats
    const activeWorkOrders = workOrders.filter(
      (wo) => !["complete", "invoiced", "cancelled"].includes(wo.status)
    );
    const completedToday = workOrders.filter(
      (wo) => wo.completedAt?.startsWith(today)
    );
    
    return {
      totalVehicles: vehicles.length,
      vehiclesInService: vehicles.filter((v) => v.status === "in-service").length,
      totalCustomers: customers.length,
      totalParts,
      lowStockCount: lowStockItems.length,
      activeWorkOrders: activeWorkOrders.length,
      completedToday: completedToday.length,
      todayRevenue,
      todaySalesCount: todaySales.length,
    };
  },
});

// ============ TECHNICIANS (Users with technician role) ============
export const getTechnicians = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "technician"))
      .collect();
  },
});

// ============ DELIVERIES (from Work Orders marked as complete) ============
export const getDeliveries = query({
  args: {},
  handler: async (ctx) => {
    const completedOrders = await ctx.db
      .query("workOrders")
      .withIndex("by_status", (q) => q.eq("status", "complete"))
      .collect();
    
    // Enrich with vehicle and customer data
    const deliveries = await Promise.all(
      completedOrders.map(async (order) => {
        const vehicle = await ctx.db.get(order.vehicleId);
        const customer = await ctx.db.get(order.customerId);
        return {
          ...order,
          vehicle,
          customer,
        };
      })
    );
    
    return deliveries;
  },
});

// ============ AUTOMOTIVE POIs (Stakeholder Network) ============
export const getAutomotivePois = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("automotivePois").collect();
  },
});

export const getPoisByCity = query({
  args: { city: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("automotivePois")
      .withIndex("by_city", (q) => q.eq("city", args.city))
      .collect();
  },
});

export const getPoisByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("automotivePois")
      .filter((q) => q.eq(q.field("category"), args.category))
      .collect();
  },
});

export const addAutomotivePoi = mutation({
  args: {
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
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    contactPerson: v.optional(v.string()),
    source: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("automotivePois", {
      ...args,
      isActive: true,
      verifiedAt: new Date().toISOString(),
    });
  },
});

// ============ SPARE PARTS MASTER (Toyota/Suzuki Catalog) ============
export const getSparePartsMaster = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("sparePartsMaster").collect();
  },
});

export const getPartsByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sparePartsMaster")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
  },
});

export const getPartsByModel = query({
  args: { model: v.string() },
  handler: async (ctx, args) => {
    const parts = await ctx.db.query("sparePartsMaster").collect();
    return parts.filter((part) => 
      part.compatibleModels.some((m) => 
        m.toLowerCase().includes(args.model.toLowerCase())
      )
    );
  },
});

export const getSteeringSideCriticalParts = query({
  args: {},
  handler: async (ctx) => {
    const parts = await ctx.db.query("sparePartsMaster").collect();
    return parts.filter((part) => part.steeringSideCritical);
  },
});

export const addSparePart = mutation({
  args: {
    partNumber: v.string(),
    oemNumber: v.optional(v.string()),
    name: v.string(),
    category: v.string(),
    subcategory: v.optional(v.string()),
    compatibleMakes: v.array(v.string()),
    compatibleModels: v.array(v.string()),
    engineCodes: v.optional(v.array(v.string())),
    priceUaeUsd: v.optional(v.number()),
    priceTier: v.union(
      v.literal("genuine_oem"),
      v.literal("premium_aftermarket"),
      v.literal("tijari_commercial")
    ),
    brand: v.optional(v.string()),
    steeringSideCritical: v.boolean(),
    failureRank: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Calculate landed cost: (UAE * 1.25) + 20
    const landedCostUsd = args.priceUaeUsd 
      ? (args.priceUaeUsd * 1.25) + 20 
      : undefined;
    
    return await ctx.db.insert("sparePartsMaster", {
      ...args,
      landedCostUsd,
      isActive: true,
    });
  },
});

// ============ MARKET PRICE INTELLIGENCE ============
export const getMarketPrices = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("marketPriceIntelligence").collect();
  },
});

export const getPricesByMake = query({
  args: { make: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("marketPriceIntelligence")
      .withIndex("by_make", (q) => q.eq("vehicleMake", args.make))
      .collect();
  },
});

export const addMarketPrice = mutation({
  args: {
    vehicleMake: v.string(),
    vehicleModel: v.string(),
    yearFrom: v.number(),
    yearTo: v.number(),
    source: v.string(),
    fobPriceUsd: v.optional(v.number()),
    cAndFPriceUsd: v.optional(v.number()),
    streetPriceUsd: v.optional(v.number()),
    averageMileage: v.optional(v.number()),
    condition: v.optional(v.string()),
    sampleSize: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("marketPriceIntelligence", {
      ...args,
      recordedAt: new Date().toISOString(),
    });
  },
});

// ============ MASS PARTNERS (B2B Network) ============
export const getMassPartners = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("massPartners").collect();
  },
});

export const getPartnersByCity = query({
  args: { city: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("massPartners")
      .withIndex("by_city", (q) => q.eq("city", args.city))
      .collect();
  },
});

export const getPartnersByStatus = query({
  args: { 
    status: v.union(
      v.literal("prospect"),
      v.literal("contacted"),
      v.literal("onboarding"),
      v.literal("active"),
      v.literal("inactive")
    )
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("massPartners")
      .withIndex("by_status", (q) => q.eq("partnershipStatus", args.status))
      .collect();
  },
});

export const addMassPartner = mutation({
  args: {
    partnerName: v.string(),
    partnerType: v.union(
      v.literal("importer"),
      v.literal("distributor"),
      v.literal("fleet_operator"),
      v.literal("garage_network"),
      v.literal("government"),
      v.literal("ngo")
    ),
    city: v.string(),
    contactPerson: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    supplyRegion: v.optional(v.string()),
    fleetSize: v.optional(v.number()),
    specializations: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("massPartners", {
      ...args,
      partnershipStatus: "prospect",
    });
  },
});
// ============ FINANCIAL INTEGRITY (Schema 2.0) ============

// --- PAYMENTS ---
export const getPaymentsByInvoice = query({
  args: { invoiceId: v.id("invoices") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("payments")
      .withIndex("by_invoice", (q) => q.eq("invoiceId", args.invoiceId))
      .collect();
  },
});

export const addPayment = mutation({
  args: {
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
    receivedBy: v.id("users"),
    notes: v.optional(v.string()),
    isDeposit: v.boolean(),
  },
  handler: async (ctx, args) => {
    const payment = await ctx.db.insert("payments", {
      ...args,
      paymentDate: new Date().toISOString(),
    });

    // Update Invoice status and balances
    const invoice = await ctx.db.get(args.invoiceId);
    if (invoice) {
      const newPaidAmount = (invoice.paidAmount || 0) + args.amount;
      const newBalanceDue = invoice.totalAmount - newPaidAmount;
      
      let newStatus = invoice.status;
      if (newBalanceDue <= 0) {
        newStatus = "paid";
      } else if (newPaidAmount > 0) {
        newStatus = "partial";
      }

      await ctx.db.patch(args.invoiceId, {
        paidAmount: newPaidAmount,
        balanceDue: newBalanceDue,
        status: newStatus as any,
      });
    }

    return payment;
  },
});

// --- EXPENSES ---
export const getExpenses = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("expenses").collect();
  },
});

export const addExpense = mutation({
  args: {
    category: v.string(),
    amount: v.number(),
    description: v.string(),
    paidBy: v.id("users"),
    paymentMethod: v.string(),
    receiptUrl: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("paid")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("expenses", {
      ...args,
      date: new Date().toISOString(),
    });
  },
});

// --- EXPENSE CATEGORIES ---
export const getExpenseCategories = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("expenseCategories").collect();
  },
});

export const addExpenseCategory = mutation({
  args: {
    name: v.string(),
    type: v.union(
      v.literal("overhead"),
      v.literal("cogs"),
      v.literal("labor"),
      v.literal("marketing"),
      v.literal("equipment")
    ),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("expenseCategories", {
      ...args,
      isActive: true,
    });
  },
});

// ============ SUPPLY CHAIN (Schema 2.0) ============

// --- PURCHASE ORDERS ---
export const getPurchaseOrders = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("purchaseOrders").collect();
  },
});

export const createPurchaseOrder = mutation({
  args: {
    supplierId: v.id("suppliers"),
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
  },
  handler: async (ctx, args) => {
    const count = await ctx.db.query("purchaseOrders").collect();
    const poNumber = `PO-${String(count.length + 1).padStart(6, "0")}`;
    
    return await ctx.db.insert("purchaseOrders", {
      ...args,
      poNumber,
      status: "draft",
      orderedAt: new Date().toISOString(),
    });
  },
});

/**
 * RECEIVE PURCHASE ORDER
 * Automatically updates status to "received" and INCREASES inventory stock
 */
export const receivePurchaseOrder = mutation({
  args: {
    id: v.id("purchaseOrders"),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const po = await ctx.db.get(args.id);
    if (!po) throw new Error("PO not found");
    if (po.status === "received") throw new Error("PO already received");

    // 1. Update PO status
    await ctx.db.patch(args.id, {
      status: "received",
      receivedAt: new Date().toISOString(),
      notes: args.notes,
    });

    // 2. AUTO-INCREASE INVENTORY
    for (const item of po.items) {
      // Find inventory item by part number (or create if logic becomes more complex)
      const inventoryItem = await ctx.db
        .query("inventory")
        .withIndex("by_partNumber", (q) => q.eq("partNumber", item.partNumber))
        .first();

      if (inventoryItem) {
        const newQuantity = inventoryItem.stockQuantity + item.quantityOrdered;
        await ctx.db.patch(inventoryItem._id, {
          stockQuantity: newQuantity,
          // Optionally update cost price to moving average
        });
      }
    }
  },
});

// --- INVENTORY ADJUSTMENTS ---
export const getInventoryAdjustments = query({
  args: { inventoryId: v.optional(v.id("inventory")) },
  handler: async (ctx, args) => {
    if (args.inventoryId) {
      return await ctx.db
        .query("inventoryAdjustments")
        .withIndex("by_inventory", (q) => q.eq("inventoryId", args.inventoryId))
        .collect();
    }
    return await ctx.db.query("inventoryAdjustments").collect();
  },
});

/**
 * ADJUST INVENTORY STOCK
 * Creates an audit record and immediately updates the live stock quantity
 */
export const adjustStock = mutation({
  args: {
    inventoryId: v.id("inventory"),
    quantityChange: v.number(), // +5 or -2
    reason: v.union(
      v.literal("damage"),
      v.literal("theft"),
      v.literal("audit_correction"),
      v.literal("return_restock"),
      v.literal("other")
    ),
    adjustedBy: v.id("users"),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // 1. Create Audit Record
    await ctx.db.insert("inventoryAdjustments", {
      ...args,
      date: new Date().toISOString(),
    });

    // 2. Update Live Inventory
    const item = await ctx.db.get(args.inventoryId);
    if (item) {
      const newQuantity = item.stockQuantity + args.quantityChange;
      await ctx.db.patch(args.inventoryId, {
        stockQuantity: newQuantity, // Allow negative checking in validation if needed
      });
    }
  },
});

// ============ OPERATIONS (Schema 2.0) ============

// --- SERVICE PACKAGES ---
export const getServicePackages = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("servicePackages")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
  },
});

export const createServicePackage = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    vehicleType: v.optional(v.string()),
    basePrice: v.number(),
    includedItems: v.array(v.object({
      type: v.union(v.literal("part"), v.literal("labor"), v.literal("fee")),
      itemId: v.optional(v.string()), 
      description: v.string(),
      quantity: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("servicePackages", {
      ...args,
      isActive: true,
    });
  },
});

// --- TIME ENTRIES (Technician Clock-in/out) ---
export const getTechnicianTimes = query({
  args: { technicianId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("timeEntries")
      .withIndex("by_tech", (q) => q.eq("technicianId", args.technicianId))
      .collect();
  },
});

export const clockIn = mutation({
  args: {
    technicianId: v.id("users"),
    workOrderId: v.id("workOrders"),
    serviceId: v.optional(v.string()), // e.g. "Oil Change" line item ID
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if already clocked in? Implementation simplified for now.
    return await ctx.db.insert("timeEntries", {
      ...args,
      startTime: new Date().toISOString(),
    });
  },
});

export const clockOut = mutation({
  args: {
    entryId: v.id("timeEntries"),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const entry = await ctx.db.get(args.entryId);
    if (!entry) throw new Error("Time entry not found");
    if (entry.endTime) throw new Error("Already clocked out");

    const endTime = new Date().toISOString();
    const start = new Date(entry.startTime).getTime();
    const end = new Date(endTime).getTime();
    const durationMinutes = Math.round((end - start) / 1000 / 60);

    await ctx.db.patch(args.entryId, {
      endTime,
      durationMinutes,
      notes: args.notes ? (entry.notes ? entry.notes + "\n" + args.notes : args.notes) : entry.notes,
    });

    return durationMinutes;
  },
});

// ============ INSPECTION TEMPLATES (Tekmetric-style DVI) ============
export const getInspectionTemplates = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("inspectionTemplates")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
  },
});

export const getDefaultTemplate = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("inspectionTemplates")
      .withIndex("by_default", (q) => q.eq("isDefault", true))
      .first();
  },
});

export const createInspectionTemplate = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    vehicleType: v.optional(v.string()),
    groups: v.array(v.object({
      id: v.string(),
      name: v.string(),
      order: v.number(),
      tasks: v.array(v.object({
        id: v.string(),
        name: v.string(),
        order: v.number(),
        defaultFindings: v.optional(v.array(v.string())),
        cannedJobId: v.optional(v.id("cannedJobs")),
      })),
    })),
    isDefault: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // If setting as default, unset other defaults
    if (args.isDefault) {
      const existing = await ctx.db
        .query("inspectionTemplates")
        .withIndex("by_default", (q) => q.eq("isDefault", true))
        .collect();
      for (const template of existing) {
        await ctx.db.patch(template._id, { isDefault: false });
      }
    }
    
    return await ctx.db.insert("inspectionTemplates", {
      ...args,
      isActive: true,
      createdAt: new Date().toISOString(),
    });
  },
});

export const updateInspectionTemplate = mutation({
  args: {
    id: v.id("inspectionTemplates"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    groups: v.optional(v.array(v.object({
      id: v.string(),
      name: v.string(),
      order: v.number(),
      tasks: v.array(v.object({
        id: v.string(),
        name: v.string(),
        order: v.number(),
        defaultFindings: v.optional(v.array(v.string())),
        cannedJobId: v.optional(v.id("cannedJobs")),
      })),
    }))),
    isDefault: v.optional(v.boolean()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

// ============ CANNED JOBS (Pre-Built Service Packages) ============
export const getCannedJobs = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("cannedJobs")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
  },
});

export const getCannedJobsByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("cannedJobs")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
  },
});

export const createCannedJob = mutation({
  args: {
    name: v.string(),
    code: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.string(),
    laborHours: v.number(),
    laborRate: v.number(),
    parts: v.array(v.object({
      partId: v.optional(v.id("inventory")),
      partNumber: v.optional(v.string()),
      name: v.string(),
      quantity: v.number(),
      unitPrice: v.number(),
    })),
    applicableVehicles: v.optional(v.array(v.string())),
    isPackageDeal: v.optional(v.boolean()),
    packageDiscount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const totalLaborCost = args.laborHours * args.laborRate;
    const totalPartsCost = args.parts.reduce((sum, p) => sum + (p.quantity * p.unitPrice), 0);
    let totalPrice = totalLaborCost + totalPartsCost;
    
    // Apply package discount if applicable
    if (args.isPackageDeal && args.packageDiscount) {
      totalPrice = totalPrice * (1 - args.packageDiscount / 100);
    }
    
    return await ctx.db.insert("cannedJobs", {
      ...args,
      totalLaborCost,
      totalPartsCost,
      totalPrice,
      isActive: true,
    });
  },
});

export const updateCannedJob = mutation({
  args: {
    id: v.id("cannedJobs"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    laborHours: v.optional(v.number()),
    laborRate: v.optional(v.number()),
    parts: v.optional(v.array(v.object({
      partId: v.optional(v.id("inventory")),
      partNumber: v.optional(v.string()),
      name: v.string(),
      quantity: v.number(),
      unitPrice: v.number(),
    }))),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    // Recalculate prices if parts or labor changed
    if (updates.laborHours || updates.laborRate || updates.parts) {
      const existing = await ctx.db.get(id);
      if (existing) {
        const laborHours = updates.laborHours ?? existing.laborHours;
        const laborRate = updates.laborRate ?? existing.laborRate;
        const parts = updates.parts ?? existing.parts;
        
        const totalLaborCost = laborHours * laborRate;
        const totalPartsCost = parts.reduce((sum, p) => sum + (p.quantity * p.unitPrice), 0);
        
        Object.assign(updates, {
          totalLaborCost,
          totalPartsCost,
          totalPrice: totalLaborCost + totalPartsCost,
        });
      }
    }
    
    await ctx.db.patch(id, updates);
  },
});

// ============ CUSTOMER APPROVALS (Digital Signatures) ============
export const createCustomerApproval = mutation({
  args: {
    estimateId: v.id("estimates"),
    customerId: v.id("customers"),
    sentVia: v.union(v.literal("sms"), v.literal("email"), v.literal("whatsapp")),
  },
  handler: async (ctx, args) => {
    // Generate unique token
    const token = `APR-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    return await ctx.db.insert("customerApprovals", {
      ...args,
      approvalToken: token,
      sentAt: new Date().toISOString(),
      status: "pending",
    });
  },
});

export const getApprovalByToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("customerApprovals")
      .withIndex("by_token", (q) => q.eq("approvalToken", args.token))
      .first();
  },
});

export const approveEstimate = mutation({
  args: {
    token: v.string(),
    signatureData: v.optional(v.string()),
    approvedItems: v.array(v.string()),
    declinedItems: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const approval = await ctx.db
      .query("customerApprovals")
      .withIndex("by_token", (q) => q.eq("approvalToken", args.token))
      .first();
    
    if (!approval) throw new Error("Invalid approval token");
    if (approval.status !== "pending" && approval.status !== "viewed") {
      throw new Error("Approval already processed");
    }
    
    await ctx.db.patch(approval._id, {
      status: "approved",
      approvedAt: new Date().toISOString(),
      signatureData: args.signatureData,
      approvedItems: args.approvedItems,
      declinedItems: args.declinedItems,
      notes: args.notes,
    });
    
    // Update estimate status
    await ctx.db.patch(approval.estimateId, {
      status: "approved",
    });
    
    return approval._id;
  },
});

// ============ DVI RESULTS (Completed Inspections) ============
export const getDviByWorkOrder = query({
  args: { workOrderId: v.id("workOrders") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("dviResults")
      .withIndex("by_workOrder", (q) => q.eq("workOrderId", args.workOrderId))
      .first();
  },
});

export const startDvi = mutation({
  args: {
    workOrderId: v.id("workOrders"),
    vehicleId: v.id("vehicles"),
    templateId: v.optional(v.id("inspectionTemplates")),
    technicianId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Get template if specified, or use default
    let template;
    if (args.templateId) {
      template = await ctx.db.get(args.templateId);
    } else {
      template = await ctx.db
        .query("inspectionTemplates")
        .withIndex("by_default", (q) => q.eq("isDefault", true))
        .first();
    }
    
    // Initialize findings from template
    const findings = template?.groups.flatMap(group => 
      group.tasks.map(task => ({
        taskId: task.id,
        taskName: task.name,
        groupName: group.name,
        severity: "good" as const,
        finding: undefined,
        notes: undefined,
        photos: [],
        videos: [],
        markedUpPhotos: [],
        recommendedCannedJobId: task.cannedJobId,
      }))
    ) || [];
    
    return await ctx.db.insert("dviResults", {
      ...args,
      startedAt: new Date().toISOString(),
      status: "in_progress",
      findings,
    });
  },
});

export const updateDviFinding = mutation({
  args: {
    dviId: v.id("dviResults"),
    taskId: v.string(),
    severity: v.union(v.literal("good"), v.literal("attention"), v.literal("urgent")),
    finding: v.optional(v.string()),
    notes: v.optional(v.string()),
    photos: v.optional(v.array(v.string())),
    videos: v.optional(v.array(v.string())),
    markedUpPhotos: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const dvi = await ctx.db.get(args.dviId);
    if (!dvi) throw new Error("DVI not found");
    
    const updatedFindings = dvi.findings.map(f => {
      if (f.taskId === args.taskId) {
        return {
          ...f,
          severity: args.severity,
          finding: args.finding ?? f.finding,
          notes: args.notes ?? f.notes,
          photos: args.photos ?? f.photos,
          videos: args.videos ?? f.videos,
          markedUpPhotos: args.markedUpPhotos ?? f.markedUpPhotos,
        };
      }
      return f;
    });
    
    await ctx.db.patch(args.dviId, { findings: updatedFindings });
  },
});

export const completeDvi = mutation({
  args: {
    dviId: v.id("dviResults"),
    overallNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.dviId, {
      status: "completed",
      completedAt: new Date().toISOString(),
      overallNotes: args.overallNotes,
    });
  },
});

export const sendDviToCustomer = mutation({
  args: { dviId: v.id("dviResults") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.dviId, {
      status: "sent_to_customer",
      sentToCustomerAt: new Date().toISOString(),
    });
  },
});

// ============ SETTINGS (SaaS Admin) ============
export const getOrgSettings = query({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("settings")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .first();
  },
});

export const updateOrgSettings = mutation({
  args: {
    orgId: v.string(),
    siteName: v.optional(v.string()),
    timezone: v.optional(v.string()),
    currency: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    faviconUrl: v.optional(v.string()),
    primaryColor: v.optional(v.string()), // e.g. "#00A65A"
    secondaryColor: v.optional(v.string()),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    seoKeywords: v.optional(v.string()),
    googleAnalyticsId: v.optional(v.string()),
    facebookPixelId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { orgId, ...updates } = args;
    
    // Check if settings exist
    const existingSettings = await ctx.db
      .query("settings")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .first();

    if (existingSettings) {
      // Update existing
      await ctx.db.patch(existingSettings._id, updates);
      return existingSettings._id;
    } else {
      // Create new
      return await ctx.db.insert("settings", {
        orgId,
        ...updates
      });
    }
  },
});

// ============ SEEDING ============
export const seedDemoUsers = mutation({
  args: {},
  handler: async (ctx) => {
    const demoUsers = [
      {
        email: "admin@masscar.com",
        firstName: "Admin",
        lastName: "User",
        role: "admin",
      },
      {
        email: "staff@masscar.com",
        firstName: "Staff",
        lastName: "Member",
        role: "staff",
      },
      {
        email: "tech@masscar.com",
        firstName: "Tech",
        lastName: "Worker",
        role: "technician",
      },
      {
        email: "customer@masscar.com",
        firstName: "Customer",
        lastName: "User",
        role: "customer",
      },
      {
        email: "owner@masscar.com",
        firstName: "Owner",
        lastName: "Executive",
        role: "admin",
      }
    ];

    // 1. Create Organization if it doesn't exist
    let orgId;
    const existingOrg = await ctx.db
      .query("organizations")
      .withIndex("by_slug", (q) => q.eq("slug", "mass-hargeisa"))
      .first();

    if (existingOrg) {
      orgId = existingOrg._id;
    }

    const createdUserIds: Record<string, any> = {};

    for (const u of demoUsers) {
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", u.email))
        .first();

      if (!existingUser) {
        const newUserId = await ctx.db.insert("users", {
          email: u.email,
          firstName: u.firstName,
          lastName: u.lastName,
          role: u.role as any,
          isActive: true,
        });
        createdUserIds[u.email] = newUserId;
        console.log(`Created user: ${u.email}`);
      } else {
        createdUserIds[u.email] = existingUser._id;
        console.log(`User already exists: ${u.email}`);
      }
    }

    // Now ensuring Org Exists
    if (!existingOrg) {
      const ownerId = createdUserIds["owner@masscar.com"];
        if (ownerId) {
            orgId = await ctx.db.insert("organizations", {
                name: "MASS Car Workshop",
                slug: "mass-hargeisa",
                ownerId: ownerId,
                plan: "enterprise",
                isActive: true,
            });
            console.log("Created Organization: MASS Car Workshop");
        } else {
            console.error("Could not create org, owner not found");
        }
    } else {
         // handle case where org exists but orgId variable wasn't set (though logic above handles it)
         if (!orgId) orgId = existingOrg?._id;
    }
    
    // Assign Users to permissions if org exists
    if (orgId) {
        // Ensure UserOrgRoles
        const ownerId = createdUserIds["owner@masscar.com"];
        if (ownerId && !(await ctx.db.query("userOrgRoles").withIndex("by_user_org", q => q.eq("userId", ownerId).eq("orgId", orgId!)).first())) {
             await ctx.db.insert("userOrgRoles", { userId: ownerId, orgId: orgId, role: "admin", isActive: true });
        }
         const adminId = createdUserIds["admin@masscar.com"];
        if (adminId && !(await ctx.db.query("userOrgRoles").withIndex("by_user_org", q => q.eq("userId", adminId).eq("orgId", orgId!)).first())) {
             await ctx.db.insert("userOrgRoles", { userId: adminId, orgId: orgId, role: "admin", isActive: true });
        }
    }

    return "Seeding Completed";
  },
});
