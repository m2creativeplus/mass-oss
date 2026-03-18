import { query, mutation } from "./_generated/server";
import { v } from "convex/values";


// --- SERVICE PACKAGES ---
export const getServicePackages = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("servicePackages")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
  },
});

export const createServicePackage = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    vehicleType: v.optional(v.string()),
    basePrice: v.number(),
    includedItems: v.array(v.object({
      type: v.union(v.literal("part"), v.literal("labor"), v.literal("fee")),
      itemId: v.optional(v.string()), 
      description: v.string(),
      quantity: v.number(),
    })),
    orgId: v.string(), // Added orgId
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("servicePackages", {
      ...args,
      isActive: true,
    });
  },
});

// --- TIME ENTRIES (Technician Clock-in/out) ---
export const getTechnicianTimes = query({
  args: { technicianId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("timeEntries")
      .withIndex("by_tech", (q) => q.eq("technicianId", args.technicianId))
      .collect();
  },
});

export const clockIn = mutation({
  args: {
    technicianId: v.id("users"),
    workOrderId: v.id("workOrders"),
    serviceId: v.optional(v.string()), // e.g. "Oil Change" line item ID
    notes: v.optional(v.string()),
    orgId: v.string(), // Added orgId
  },
  handler: async (ctx, args) => {
    // Check if already clocked in? Implementation simplified for now.
    return await ctx.db.insert("timeEntries", {
      ...args,
      startTime: new Date().toISOString(),
    });
  },
});

export const clockOut = mutation({
  args: {
    entryId: v.id("timeEntries"),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const entry = await ctx.db.get(args.entryId);
    if (!entry) throw new Error("Time entry not found");
    if (entry.endTime) throw new Error("Already clocked out");

    const endTime = new Date().toISOString();
    const start = new Date(entry.startTime).getTime();
    const end = new Date(endTime).getTime();
    const durationMinutes = Math.round((end - start) / 1000 / 60);

    await ctx.db.patch(args.entryId, {
      endTime,
      durationMinutes,
      notes: args.notes ? (entry.notes ? entry.notes + "\n" + args.notes : args.notes) : entry.notes,
    });

    return durationMinutes;
  },
});

