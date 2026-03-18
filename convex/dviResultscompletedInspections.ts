import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getDviByWorkOrder = query({
  args: { workOrderId: v.id("workOrders") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("dviResults")
      .withIndex("by_workOrder", (q) => q.eq("workOrderId", args.workOrderId))
      .first();
  },
});

export const startDvi = mutation({
  args: {
    workOrderId: v.id("workOrders"),
    vehicleId: v.id("vehicles"),
    templateId: v.optional(v.id("inspectionTemplates")),
    technicianId: v.id("users"),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    // Get template if specified, or use default
    let template;
    if (args.templateId) {
      template = await ctx.db.get(args.templateId);
    } else {
      template = await ctx.db
        .query("inspectionTemplates")
        .withIndex("by_default", (q) => q.eq("isDefault", true))
        .first();
    }
    
    // Initialize findings from template
    const findings = template?.groups.flatMap(group => 
      group.tasks.map(task => ({
        taskId: task.id,
        taskName: task.name,
        groupName: group.name,
        severity: "good" as const,
        finding: undefined,
        notes: undefined,
        photos: [],
        videos: [],
        markedUpPhotos: [],
        recommendedCannedJobId: task.cannedJobId,
      }))
    ) || [];
    
    return await ctx.db.insert("dviResults", {
      ...args,
      startedAt: new Date().toISOString(),
      status: "in_progress",
      findings,
    });
  },
});

export const updateDviFinding = mutation({
  args: {
    dviId: v.id("dviResults"),
    taskId: v.string(),
    severity: v.union(v.literal("good"), v.literal("attention"), v.literal("urgent")),
    finding: v.optional(v.string()),
    notes: v.optional(v.string()),
    photos: v.optional(v.array(v.string())),
    videos: v.optional(v.array(v.string())),
    markedUpPhotos: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const dvi = await ctx.db.get(args.dviId);
    if (!dvi) throw new Error("DVI not found");
    
    const updatedFindings = dvi.findings.map(f => {
      if (f.taskId === args.taskId) {
        return {
          ...f,
          severity: args.severity,
          finding: args.finding ?? f.finding,
          notes: args.notes ?? f.notes,
          photos: args.photos ?? f.photos,
          videos: args.videos ?? f.videos,
          markedUpPhotos: args.markedUpPhotos ?? f.markedUpPhotos,
        };
      }
      return f;
    });
    
    await ctx.db.patch(args.dviId, { findings: updatedFindings });
  },
});

export const completeDvi = mutation({
  args: {
    dviId: v.id("dviResults"),
    overallNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.dviId, {
      status: "completed",
      completedAt: new Date().toISOString(),
      overallNotes: args.overallNotes,
    });
  },
});

export const sendDviToCustomer = mutation({
  args: { dviId: v.id("dviResults") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.dviId, {
      status: "sent_to_customer",
      sentToCustomerAt: new Date().toISOString(),
    });
  },
});

