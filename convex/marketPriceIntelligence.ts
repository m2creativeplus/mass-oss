import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

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
    orgId: v.string(), // Added orgId
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("marketPriceIntelligence", {
      ...args,
      recordedAt: new Date().toISOString(),
    });
  },
});

