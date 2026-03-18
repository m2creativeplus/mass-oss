import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getEstimates = query({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("estimates")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .order("desc")
      .collect();
  },
});

export const getEstimateById = query({
  args: { estimateId: v.id("estimates") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.estimateId);
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

export const updateEstimateStatus = mutation({
  args: { 
    estimateId: v.id("estimates"), 
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("viewed"),
      v.literal("approved"),
      v.literal("declined"),
      v.literal("expired"),
      v.literal("revised")
    )
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.estimateId, { status: args.status });
  },
});

