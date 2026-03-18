import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getOrgSettings = query({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("settings")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .first();
  },
});

export const updateOrgSettings = mutation({
  args: {
    orgId: v.string(),
    siteName: v.optional(v.string()),
    timezone: v.optional(v.string()),
    currency: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    faviconUrl: v.optional(v.string()),
    primaryColor: v.optional(v.string()), // e.g. "#00A65A"
    secondaryColor: v.optional(v.string()),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    seoKeywords: v.optional(v.string()),
    googleAnalyticsId: v.optional(v.string()),
    facebookPixelId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { orgId, ...updates } = args;
    
    // Check if settings exist
    const existingSettings = await ctx.db
      .query("settings")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .first();

    if (existingSettings) {
      // Update existing
      await ctx.db.patch(existingSettings._id, updates);
      return existingSettings._id;
    } else {
      // Create new
      return await ctx.db.insert("settings", {
        orgId,
        ...updates
      });
    }
  },
});

