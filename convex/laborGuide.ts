import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getLaborGuide = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("laborGuide").collect();
  },
});

export const addLaborOperation = mutation({
  args: {
    operationCode: v.string(),
    description: v.string(),
    category: v.optional(v.string()),
    standardHours: v.number(),
    suggestedRate: v.number(),
    skillLevel: v.union(
      v.literal("basic"),
      v.literal("intermediate"),
      v.literal("advanced"),
      v.literal("expert")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("laborGuide", {
      ...args,
      isActive: true,
    });
  },
});

