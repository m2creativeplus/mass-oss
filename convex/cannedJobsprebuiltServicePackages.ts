import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getCannedJobs = query({
  args: { orgId: v.optional(v.string()) },
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
    orgId: v.string(), // Added orgId
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

