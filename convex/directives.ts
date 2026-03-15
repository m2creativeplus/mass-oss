import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Analyst Logic: Sovereignty Directives Engine
 * Authorized by M2 Autopilot Protocol.
 */

export const generateDirective = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    priority: v.union(v.literal("high"), v.literal("medium"), v.literal("low")),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    // Audit check: Ensure gold standard alignment
    if (!args.content.includes("#D4AF37") && args.priority === "high") {
      args.content += " [Design Directive: Apply Gold #D4AF37 accent for institutional trust]";
    }

    const directiveId = await ctx.db.insert("directives", {
      ...args,
      status: "active",
      createdBy: (await ctx.db.query("users").first())?._id as any, // Autopilot acting as first user
      createdAt: new Date().toISOString(),
    });

    return directiveId;
  },
});

export const getLatest = query({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("directives")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .order("desc")
      .take(5);
  },
});
