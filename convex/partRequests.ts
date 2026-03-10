import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Request a new part (called by Technician)
export const requestPart = mutation({
  args: {
    workOrderId: v.id("workOrders"),
    technicianId: v.id("users"),
    partDescription: v.string(),
    partNumber: v.optional(v.string()),
    quantity: v.number(),
    urgency: v.union(v.literal("low"), v.literal("normal"), v.literal("high"), v.literal("critical")),
    notes: v.optional(v.string()),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const requestId = await ctx.db.insert("partRequests", {
      ...args,
      status: "pending",
      requestedAt: new Date().toISOString(),
    });
    return requestId;
  },
});

// Update status (called by Service Advisor/Parts Dept)
export const updateRequestStatus = mutation({
  args: {
    requestId: v.id("partRequests"),
    status: v.union(
      v.literal("pending"),
      v.literal("ordered"),
      v.literal("ready"),
      v.literal("installed"),
      v.literal("cancelled")
    ),
    advisorId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const updateData: any = { status: args.status };
    if (args.advisorId) updateData.advisorId = args.advisorId;
    if (args.status === "ready" || args.status === "installed") {
      updateData.fulfilledAt = new Date().toISOString();
    }
    
    await ctx.db.patch(args.requestId, updateData);
    return args.requestId;
  },
});

// Get active requests for a specific organization (subscribable for real-time)
export const getActiveRequestsForOrg = query({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("partRequests")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .filter((q) => q.neq(q.field("status"), "installed"))
      .filter((q) => q.neq(q.field("status"), "cancelled"))
      .order("desc")
      .collect();
  },
});

// Get requests by work order
export const getRequestsByWorkOrder = query({
  args: { workOrderId: v.id("workOrders") },
  handler: async (ctx, args) => {
    return ctx.db
      .query("partRequests")
      .withIndex("by_workOrder", (q) => q.eq("workOrderId", args.workOrderId))
      .order("desc")
      .collect();
  },
});
