import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

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

