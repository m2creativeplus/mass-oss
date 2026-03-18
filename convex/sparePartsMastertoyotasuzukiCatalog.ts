import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

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
    orgId: v.string(), // Added orgId
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

