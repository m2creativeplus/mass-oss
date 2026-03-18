import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getInventory = query({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("inventory")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect();
  },
});

export const getInventoryByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("inventory")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
  },
});

export const getLowStockItems = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db.query("inventory").collect();
    return items.filter((item) => item.stockQuantity <= item.reorderPoint);
  },
});

export const addInventoryItem = mutation({
  args: {
    partNumber: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    category: v.string(),
    brand: v.optional(v.string()),
    supplierId: v.optional(v.id("suppliers")),
    costPrice: v.number(),
    sellingPrice: v.number(),
    stockQuantity: v.number(),
    minStockLevel: v.number(),
    reorderPoint: v.number(),
    condition: v.union(
      v.literal("new"),
      v.literal("used"),
      v.literal("refurbished")
    ),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("inventory", {
      ...args,
      isActive: true,
    });
  },
});

export const updateInventoryQuantity = mutation({
  args: {
    id: v.id("inventory"),
    quantity: v.number(),
    orgId: v.string(), // Added orgId
    reason: v.optional(v.union( // Added reason for adjustment
      v.literal("damage"),
      v.literal("theft"),
      v.literal("audit_correction"),
      v.literal("return_restock"),
      v.literal("sale"), // Added sale as a reason
      v.literal("purchase_receipt"), // Added purchase_receipt as a reason
      v.literal("other")
    )),
    adjustedBy: v.optional(v.id("users")), // Added adjustedBy
    notes: v.optional(v.string()), // Added notes
  },
  handler: async (ctx, args) => {
    const { id: inventoryId, quantity, orgId, reason, adjustedBy, notes } = args;
    const item = await ctx.db.get(inventoryId);
    if (!item) throw new Error("Inventory item not found");

    // 1. Record Inventory Adjustment
    await ctx.db.insert("inventoryAdjustments", {
      inventoryId,
      quantityChange: quantity - item.stockQuantity, // Calculate change
      reason: reason || "audit_correction", // Default reason if not provided
      adjustedBy: adjustedBy || undefined, // Use provided or undefined
      notes: notes || `Quantity updated from ${item.stockQuantity} to ${quantity}`,
      date: new Date().toISOString(),
      orgId: orgId,
    });
    
    // 2. Patch current item
    await ctx.db.patch(inventoryId, { stockQuantity: quantity });
  },
});

