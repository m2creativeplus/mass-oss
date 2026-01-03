import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all content for a specific section (e.g., "hero")
export const getSectionContent = query({
  args: { section: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("cmsContent")
      .withIndex("by_section", (q) => q.eq("section", args.section))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

// Update or create a content block
export const updateContent = mutation({
  args: {
    section: v.string(),
    key: v.string(),
    value: v.string(),
    type: v.union(
      v.literal("text"),
      v.literal("image"),
      v.literal("boolean"),
      v.literal("json")
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("cmsContent")
      .withIndex("by_key", (q) => q.eq("section", args.section).eq("key", args.key))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        value: args.value,
        type: args.type,
        // lastUpdatedBy: ctx.auth.getUserIdentity()?.tokenIdentifier // TODO: Add auth check
      });
    } else {
      await ctx.db.insert("cmsContent", {
        section: args.section,
        key: args.key,
        value: args.value,
        type: args.type,
        isActive: true,
      });
    }
  },
});
