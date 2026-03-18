import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAppointments = query({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("appointments")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect();
  },
});

export const getAppointmentsByDate = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("appointments")
      .withIndex("by_date", (q) => q.eq("appointmentDate", args.date))
      .collect();
  },
});

export const createAppointment = mutation({
  args: {
    customerId: v.id("customers"),
    vehicleId: v.id("vehicles"),
    technicianId: v.optional(v.id("users")),
    appointmentDate: v.string(),
    durationMinutes: v.number(),
    serviceType: v.optional(v.string()),
    priority: v.union(
      v.literal("low"),
      v.literal("normal"),
      v.literal("high"),
      v.literal("urgent")
    ),
    customerNotes: v.optional(v.string()),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const count = await ctx.db
      .query("appointments")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect();
    const appointmentNumber = `APT-${String(count.length + 1).padStart(6, "0")}`;
    
    return await ctx.db.insert("appointments", {
      ...args,
      appointmentNumber,
      status: "scheduled",
      reminderSent: false,
    });
  },
});

export const deleteAppointment = mutation({
  args: { id: v.id("appointments") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

