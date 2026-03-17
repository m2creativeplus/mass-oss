import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * CMS Engine: Blog & Content Management
 * Authorized by M2 Autopilot Protocol.
 */

export const getBlogPosts = query({
  args: { 
    status: v.optional(v.string()),
    orgId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.orgId) {
      return await ctx.db.query("blogPosts")
        .withIndex("by_org", (q) => q.eq("orgId", args.orgId!))
        .collect();
    }
    return await ctx.db.query("blogPosts").collect();
  },
});

export const getBlogPostBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("blogPosts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const createBlogPost = mutation({
  args: { 
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    excerpt: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("published"), v.literal("archived")),
    tags: v.array(v.string()),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("blogPosts", {
      ...args,
      viewCount: 0,
    });
  },
});

export const updateBlogPost = mutation({
  args: { 
    id: v.id("blogPosts"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    content: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"), v.literal("archived"))),
    tags: v.optional(v.array(v.string())),
    featuredImage: v.optional(v.string()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    publishedAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const deleteBlogPost = mutation({
  args: { id: v.id("blogPosts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const getFaqs = query({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("faqs")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect();
  },
});

export const createFaq = mutation({
  args: {
    question: v.string(),
    answer: v.string(),
    category: v.optional(v.string()),
    order: v.number(),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("faqs", {
      ...args,
      isActive: true,
    });
  },
});

export const updateFaq = mutation({
  args: {
    id: v.id("faqs"),
    question: v.optional(v.string()),
    answer: v.optional(v.string()),
    category: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const deleteFaq = mutation({
  args: { id: v.id("faqs") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const getDynamicPages = query({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("dynamicPages")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect();
  },
});

export const createDynamicPage = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    template: v.optional(v.string()),
    isPublished: v.boolean(),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("dynamicPages", {
      ...args,
      publishedAt: args.isPublished ? new Date().toISOString() : undefined,
    });
  },
});

export const updateDynamicPage = mutation({
  args: {
    id: v.id("dynamicPages"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    content: v.optional(v.string()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    template: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    if (updates.isPublished) {
      (updates as any).publishedAt = new Date().toISOString();
    }
    await ctx.db.patch(id, updates);
  },
});

export const deleteDynamicPage = mutation({
  args: { id: v.id("dynamicPages") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
