import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getInspections = query({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("inspections")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .order("desc")
      .collect();
  },
});

export const getInspectionById = query({
  args: { inspectionId: v.id("inspections") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.inspectionId);
  },
});

export const updateInspectionItem = mutation({
  args: { 
    inspectionId: v.id("inspections"),
    itemName: v.string(),
    status: v.union(v.literal("ok"), v.literal("attention"), v.literal("immediate-attention"), v.literal("not-applicable")),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const inspection = await ctx.db.get(args.inspectionId);
    if (!inspection) throw new Error("Inspection not found");
    
    const newItems = inspection.items.map(item => {
      if (item.name === args.itemName) {
        return {
          ...item,
          status: args.status,
          notes: args.notes ?? item.notes,
        };
      }
      return item;
    });
    
    await ctx.db.patch(args.inspectionId, { items: newItems });
  },
});

export const updateInspectionStatus = mutation({
  args: { 
    inspectionId: v.id("inspections"),
    status: v.union(v.literal("in-progress"), v.literal("completed")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.inspectionId, { status: args.status });
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

