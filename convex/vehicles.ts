import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

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

