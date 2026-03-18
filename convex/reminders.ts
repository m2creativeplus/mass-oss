import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getReminders = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("reminders").collect();
  },
});

export const getPendingReminders = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("reminders")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();
  },
});

export const createReminder = mutation({
  args: {
    type: v.union(
      v.literal("service"),
      v.literal("registration"),
      v.literal("insurance"),
      v.literal("inspection"),
      v.literal("payment"),
      v.literal("follow-up")
    ),
    vehicleId: v.optional(v.id("vehicles")),
    customerId: v.id("customers"),
    title: v.string(),
    message: v.optional(v.string()),
    dueDate: v.string(),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const reminderId = await ctx.db.insert("reminders", {
      ...args,
      status: "pending",
    });
    return reminderId; // Return the ID of the new reminder
  },
});

