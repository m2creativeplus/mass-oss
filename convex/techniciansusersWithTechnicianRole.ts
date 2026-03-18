import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getTechnicians = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "technician"))
      .collect();
  },
});

