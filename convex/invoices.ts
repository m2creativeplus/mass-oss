import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getInvoices = query({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("invoices")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .order("desc")
      .collect();
  },
});

export const getInvoiceById = query({
  args: { invoiceId: v.id("invoices") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.invoiceId);
  },
});

export const updateInvoiceStatus = mutation({
  args: { 
    invoiceId: v.id("invoices"), 
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("paid"),
      v.literal("partial"),
      v.literal("overdue"),
      v.literal("cancelled")
    )
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.invoiceId, { status: args.status });
  },
});

export const createInvoiceFromEstimate = mutation({
  args: { estimateId: v.id("estimates") },
  handler: async (ctx, args) => {
    const estimate = await ctx.db.get(args.estimateId);
    if (!estimate) throw new Error("Estimate not found");
    
    // Generate invoice number
    const count = await ctx.db
      .query("invoices")
      .withIndex("by_org", (q) => q.eq("orgId", estimate.orgId))
      .collect();
    const invoiceNumber = `INV-${String(count.length + 1).padStart(6, "0")}`;
    
    const invoiceId = await ctx.db.insert("invoices", {
      invoiceNumber,
      estimateId: args.estimateId,
      customerId: estimate.customerId,
      vehicleId: estimate.vehicleId,
      orgId: estimate.orgId,
      status: "draft",
      lineItems: estimate.lineItems.map(item => ({
        type: item.type,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      })),
      subtotal: estimate.subtotal,
      taxAmount: estimate.taxAmount,
      totalAmount: estimate.totalAmount,
      paidAmount: 0,
      balanceDue: estimate.totalAmount,
    });
    
    // Auto-update estimate to "invoiced" (or similar status if exists)
    // Actually current schema for estimates doesn't have "invoiced" status, it has "approved".
    // We could add it, but just keeping as is for now.
    
    return invoiceId;
  },
});


