import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getDeliveries = query({
  args: {},
  handler: async (ctx) => {
    const completedOrders = await ctx.db
      .query("workOrders")
      .withIndex("by_status", (q) => q.eq("status", "complete"))
      .collect();
    
    // Enrich with vehicle and customer data
    const deliveries = await Promise.all(
      completedOrders.map(async (order) => {
        const vehicle = await ctx.db.get(order.vehicleId);
        const customer = await ctx.db.get(order.customerId);
        return {
          ...order,
          vehicle,
          customer,
        };
      })
    );
    
    return deliveries;
  },
});

