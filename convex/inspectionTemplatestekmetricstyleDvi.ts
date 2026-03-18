import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getInspectionTemplates = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("inspectionTemplates")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
  },
});

export const getDefaultTemplate = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("inspectionTemplates")
      .withIndex("by_default", (q) => q.eq("isDefault", true))
      .first();
  },
});

export const createInspectionTemplate = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    vehicleType: v.optional(v.string()),
    groups: v.array(v.object({
      id: v.string(),
      name: v.string(),
      order: v.number(),
      tasks: v.array(v.object({
        id: v.string(),
        name: v.string(),
        order: v.number(),
        defaultFindings: v.optional(v.array(v.string())),
        cannedJobId: v.optional(v.id("cannedJobs")),
      })),
    })),
    isDefault: v.optional(v.boolean()),
    orgId: v.string(), // Added orgId
  },
  handler: async (ctx, args) => {
    // If setting as default, unset other defaults
    if (args.isDefault) {
      const existing = await ctx.db
        .query("inspectionTemplates")
        .withIndex("by_default", (q) => q.eq("isDefault", true))
        .collect();
      for (const template of existing) {
        await ctx.db.patch(template._id, { isDefault: false });
      }
    }
    
    return await ctx.db.insert("inspectionTemplates", {
      ...args,
      isActive: true,
      createdAt: new Date().toISOString(),
    });
  },
});

export const updateInspectionTemplate = mutation({
  args: {
    id: v.id("inspectionTemplates"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    groups: v.optional(v.array(v.object({
      id: v.string(),
      name: v.string(),
      order: v.number(),
      tasks: v.array(v.object({
        id: v.string(),
        name: v.string(),
        order: v.number(),
        defaultFindings: v.optional(v.array(v.string())),
        cannedJobId: v.optional(v.id("cannedJobs")),
      })),
    }))),
    isDefault: v.optional(v.boolean()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

