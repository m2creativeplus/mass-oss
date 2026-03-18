import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// KEY FEATURE: Automatic inventory decrement on sale
export const getSales = query({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sales")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect();
  },
});

export const getSalesToday = query({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toISOString().split("T")[0];
    const sales = await ctx.db.query("sales").collect();
    return sales.filter((sale) => sale.createdAt.startsWith(today));
  },
});

/**
 * CREATE SALE - with automatic inventory decrement
 * When a part sale is recorded in the POS, this mutation:
 * 1. Creates the sale record
 * 2. Automatically decreases inventory stock for each item sold
 */
export const createSale = mutation({
  args: {
    items: v.array(v.object({
      inventoryId: v.id("inventory"),
      partNumber: v.string(),
      name: v.string(),
      quantity: v.number(),
      unitPrice: v.number(),
      totalPrice: v.number(),
    })),
    subtotal: v.number(),
    taxAmount: v.number(),
    discountAmount: v.optional(v.number()),
    totalAmount: v.number(),
    paymentMethod: v.union(
      v.literal("cash"),
      v.literal("zaad"),
      v.literal("edahab"),
      v.literal("card"),
      v.literal("bank-transfer")
    ),
    paymentReference: v.optional(v.string()),
    customerId: v.optional(v.id("customers")),
    cashierId: v.optional(v.id("users")),
    notes: v.optional(v.string()),
    orgId: v.string(), // Added orgId
  },
  handler: async (ctx, args) => {
    // Generate sale number
    const count = await ctx.db.query("sales").collect();
    const saleNumber = `SALE-${String(count.length + 1).padStart(6, "0")}`;
    
    // 1. Create the sale record
    const saleId = await ctx.db.insert("sales", {
      ...args,
      saleNumber,
      createdAt: new Date().toISOString(),
    });
    
    // 2. AUTO-DECREMENT: Reduce inventory stock for each item sold
    for (const item of args.items) {
      const inventoryItem = await ctx.db.get(item.inventoryId);
      if (inventoryItem) {
        const newQuantity = Math.max(0, inventoryItem.stockQuantity - item.quantity);
        await ctx.db.patch(item.inventoryId, {
          stockQuantity: newQuantity,
        });
        // Also record an inventory adjustment for the sale
        await ctx.db.insert("inventoryAdjustments", {
          inventoryId: item.inventoryId,
          quantityChange: -item.quantity,
          reason: "sale",
          adjustedBy: args.cashierId || undefined,
          notes: `Sale ${saleNumber} for ${item.quantity} units of ${item.name}`,
          date: new Date().toISOString(),
          orgId: args.orgId,
        });
      }
    }
    
    return saleId;
  },
});

