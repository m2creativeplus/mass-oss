import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ============================================================
// MASS OSS - Audit Log System
// Tracks all user actions for security and compliance
// ============================================================

export const logAction = mutation({
  args: {
    userId: v.optional(v.id("users")),
    action: v.string(),
    metadata: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    orgId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("auditLogs", {
      userId: args.userId,
      action: args.action,
      metadata: args.metadata,
      ipAddress: args.ipAddress,
      orgId: args.orgId,
      timestamp: Date.now(),
    });
  },
});

export const getAuditLogs = query({
  args: {
    orgId: v.optional(v.string()),
    userId: v.optional(v.id("users")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("auditLogs").order("desc");

    if (args.orgId) {
      q = ctx.db
        .query("auditLogs")
        .withIndex("by_org", (qb) => qb.eq("orgId", args.orgId))
        .order("desc");
    } else if (args.userId) {
      q = ctx.db
        .query("auditLogs")
        .withIndex("by_user", (qb) => qb.eq("userId", args.userId))
        .order("desc");
    }

    const logs = await q.take(args.limit || 50);

    // Enrich with user info
    const enriched = await Promise.all(
      logs.map(async (log) => {
        let userName = "System";
        if (log.userId) {
          const user = await ctx.db.get(log.userId);
          if (user) userName = `${user.firstName} ${user.lastName}`;
        }
        return { ...log, userName };
      })
    );

    return enriched;
  },
});

export const getUserActivity = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("auditLogs")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(100);
  },
});
