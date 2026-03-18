import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getWorkOrders = query({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("workOrders")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect();
  },
});

export const getWorkOrdersByStatus = query({
  args: {
    status: v.union(
      v.literal("check-in"),
      v.literal("inspecting"),
      v.literal("awaiting-approval"),
      v.literal("in-progress"),
      v.literal("waiting-parts"),
      v.literal("complete"),
      v.literal("invoiced"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("workOrders")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();
  },
});

export const createWorkOrder = mutation({
  args: {
    vehicleId: v.id("vehicles"),
    customerId: v.id("customers"),
    technicianId: v.optional(v.id("users")),
    services: v.array(v.string()),
    priority: v.union(
      v.literal("low"),
      v.literal("normal"),
      v.literal("high"),
      v.literal("urgent")
    ),
    customerComplaint: v.optional(v.string()),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const count = await ctx.db
      .query("workOrders")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect();
    const jobNumber = `JOB-${String(count.length + 1).padStart(6, "0")}`;
    
    // Update vehicle status to in-service
    await ctx.db.patch(args.vehicleId, { status: "in-service" });
    
    return await ctx.db.insert("workOrders", {
      ...args,
      jobNumber,
      status: "check-in",
      checkinDate: new Date().toISOString(),
    });
  },
});

export const updateWorkOrderStatus = mutation({
  args: {
    id: v.id("workOrders"),
    status: v.union(
      v.literal("check-in"),
      v.literal("inspecting"),
      v.literal("awaiting-approval"),
      v.literal("in-progress"),
      v.literal("waiting-parts"),
      v.literal("complete"),
      v.literal("invoiced"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    const workOrder = await ctx.db.get(args.id);
    
    const updates: Record<string, string> = { status: args.status };
    
    if (args.status === "in-progress" && !workOrder?.startedAt) {
      updates.startedAt = new Date().toISOString();
    }
    
    if (args.status === "complete") {
      updates.completedAt = new Date().toISOString();
      // Update vehicle status back to active
      if (workOrder?.vehicleId) {
        await ctx.db.patch(workOrder.vehicleId, { status: "active" });
      }
    }
    
    await ctx.db.patch(args.id, updates);
  },
});

export const deleteWorkOrder = mutation({
  args: { id: v.id("workOrders") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

