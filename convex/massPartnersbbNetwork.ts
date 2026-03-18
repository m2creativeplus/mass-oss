import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

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
    orgId: v.string(), // Added orgId
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("massPartners", {
      ...args,
      partnershipStatus: "prospect",
    });
  },
});
