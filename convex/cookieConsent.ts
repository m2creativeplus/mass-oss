import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ============================================================
// MASS OSS - Cookie Consent System (GDPR-style)
// ============================================================

export const saveConsent = mutation({
  args: {
    visitorId: v.string(),
    userId: v.optional(v.id("users")),
    essential: v.boolean(),
    analytics: v.boolean(),
    preferences: v.boolean(),
    ipAddress: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if consent already exists for this visitor
    const existing = await ctx.db
      .query("cookieConsents")
      .withIndex("by_visitor", (q) => q.eq("visitorId", args.visitorId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        essential: true, // Always true
        analytics: args.analytics,
        preferences: args.preferences,
        userId: args.userId,
        consentedAt: Date.now(),
      });
      return existing._id;
    }

    return await ctx.db.insert("cookieConsents", {
      visitorId: args.visitorId,
      userId: args.userId,
      essential: true,
      analytics: args.analytics,
      preferences: args.preferences,
      consentedAt: Date.now(),
      ipAddress: args.ipAddress,
    });
  },
});

export const getConsent = query({
  args: { visitorId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("cookieConsents")
      .withIndex("by_visitor", (q) => q.eq("visitorId", args.visitorId))
      .first();
  },
});
