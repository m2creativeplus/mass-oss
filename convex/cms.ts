import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ============================================================
// CMS Functions - Blog, FAQ, Dynamic Pages
// ============================================================

// ============ BLOG POSTS ============

export const getBlogPosts = query({
  args: { orgId: v.string(), status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let posts = await ctx.db
      .query("blogPosts")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect();
    
    if (args.status) {
      posts = posts.filter((p) => p.status === args.status);
    }
    
    return posts.sort((a, b) => 
      (b.publishedAt || b._creationTime.toString()).localeCompare(
        a.publishedAt || a._creationTime.toString()
      )
    );
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
    featuredImage: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("published"), v.literal("archived")),
    tags: v.array(v.string()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("blogPosts", {
      ...args,
      publishedAt: args.status === "published" ? new Date().toISOString() : undefined,
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
    featuredImage: v.optional(v.string()),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"), v.literal("archived"))),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const post = await ctx.db.get(id);
    
    // Set publishedAt if transitioning to published
    if (updates.status === "published" && post?.status !== "published") {
      (updates as any).publishedAt = new Date().toISOString();
    }
    
    return await ctx.db.patch(id, updates);
  },
});

export const deleteBlogPost = mutation({
  args: { id: v.id("blogPosts") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// ============ FAQS ============

export const getFaqs = query({
  args: { orgId: v.string(), category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let faqs = await ctx.db
      .query("faqs")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect();
    
    if (args.category) {
      faqs = faqs.filter((f) => f.category === args.category);
    }
    
    return faqs
      .filter((f) => f.isActive)
      .sort((a, b) => a.order - b.order);
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
    order: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const deleteFaq = mutation({
  args: { id: v.id("faqs") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// ============ DYNAMIC PAGES ============

export const getDynamicPages = query({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("dynamicPages")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect();
  },
});

export const getDynamicPageBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("dynamicPages")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
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
    return await ctx.db.patch(id, updates);
  },
});

export const deleteDynamicPage = mutation({
  args: { id: v.id("dynamicPages") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// ============ NOTIFICATION TEMPLATES ============

export const getNotificationTemplates = query({
  args: { orgId: v.string(), type: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let templates = await ctx.db
      .query("notificationTemplates")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect();
    
    if (args.type) {
      templates = templates.filter((t) => t.type === args.type);
    }
    
    return templates.filter((t) => t.isActive);
  },
});

export const createNotificationTemplate = mutation({
  args: {
    name: v.string(),
    type: v.union(v.literal("email"), v.literal("sms"), v.literal("whatsapp")),
    subject: v.optional(v.string()),
    body: v.string(),
    variables: v.array(v.string()),
    triggerEvent: v.optional(v.string()),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("notificationTemplates", {
      ...args,
      isActive: true,
    });
  },
});

export const updateNotificationTemplate = mutation({
  args: {
    id: v.id("notificationTemplates"),
    name: v.optional(v.string()),
    subject: v.optional(v.string()),
    body: v.optional(v.string()),
    variables: v.optional(v.array(v.string())),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

// ============ LOCATIONS ============

export const getLocations = query({
  args: { orgId: v.id("organizations") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("locations")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect();
  },
});

export const createLocation = mutation({
  args: {
    name: v.string(),
    code: v.string(),
    address: v.string(),
    city: v.string(),
    country: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    isHeadquarters: v.boolean(),
    orgId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("locations", {
      ...args,
      isActive: true,
    });
  },
});

export const updateLocation = mutation({
  args: {
    id: v.id("locations"),
    name: v.optional(v.string()),
    address: v.optional(v.string()),
    phone: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

// ============ SUPPORT TICKETS ============

export const getSupportTickets = query({
  args: { orgId: v.string(), status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let tickets = await ctx.db
      .query("supportTickets")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect();
    
    if (args.status) {
      tickets = tickets.filter((t) => t.status === args.status);
    }
    
    return tickets.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
});

export const getTicketsByCustomer = query({
  args: { customerId: v.id("customers") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("supportTickets")
      .withIndex("by_customer", (q) => q.eq("customerId", args.customerId))
      .collect();
  },
});

export const createSupportTicket = mutation({
  args: {
    customerId: v.id("customers"),
    subject: v.string(),
    description: v.string(),
    priority: v.union(v.literal("low"), v.literal("normal"), v.literal("high"), v.literal("urgent")),
    category: v.optional(v.string()),
    workOrderId: v.optional(v.id("workOrders")),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const ticketNumber = `TKT-${Date.now().toString(36).toUpperCase()}`;
    const now = new Date().toISOString();
    
    return await ctx.db.insert("supportTickets", {
      ...args,
      ticketNumber,
      status: "open",
      messages: [{
        senderId: args.customerId,
        senderType: "customer",
        message: args.description,
        timestamp: now,
      }],
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const addTicketMessage = mutation({
  args: {
    ticketId: v.id("supportTickets"),
    senderId: v.string(),
    senderType: v.union(v.literal("customer"), v.literal("staff")),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const ticket = await ctx.db.get(args.ticketId);
    if (!ticket) throw new Error("Ticket not found");
    
    const now = new Date().toISOString();
    const newMessage = {
      senderId: args.senderId,
      senderType: args.senderType,
      message: args.message,
      timestamp: now,
    };
    
    return await ctx.db.patch(args.ticketId, {
      messages: [...ticket.messages, newMessage],
      updatedAt: now,
      status: args.senderType === "staff" ? "in_progress" : "waiting_customer",
    });
  },
});

export const updateTicketStatus = mutation({
  args: {
    id: v.id("supportTickets"),
    status: v.union(
      v.literal("open"),
      v.literal("in_progress"),
      v.literal("waiting_customer"),
      v.literal("resolved"),
      v.literal("closed")
    ),
    assignedTo: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const updates: any = {
      status: args.status,
      updatedAt: new Date().toISOString(),
    };
    
    if (args.assignedTo) {
      updates.assignedTo = args.assignedTo;
    }
    
    if (args.status === "resolved") {
      updates.resolvedAt = new Date().toISOString();
    }
    
    return await ctx.db.patch(args.id, updates);
  },
});
