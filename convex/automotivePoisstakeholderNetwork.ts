import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

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
    orgId: v.string(), // Added orgId
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("automotivePois", {
      ...args,
      isActive: true,
      verifiedAt: new Date().toISOString(),
    });
  },
});

