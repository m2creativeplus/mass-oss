import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getSuppliers = query({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("suppliers")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect();
  },
});

export const addSupplier = mutation({
  args: {
    name: v.string(),
    contactPerson: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    category: v.optional(v.string()),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const count = await ctx.db
      .query("suppliers")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect();
    const supplierCode = `SUP-${String(count.length + 1).padStart(4, "0")}`;
    
    return await ctx.db.insert("suppliers", {
      ...args,
      supplierCode,
      isActive: true,
    });
  },
});

