import { query, mutation } from "./_generated/server";
import { v } from "convex/values";


// --- PURCHASE ORDERS ---
export const getPurchaseOrders = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("purchaseOrders").collect();
  },
});

export const createPurchaseOrder = mutation({
  args: {
    supplierId: v.id("suppliers"),
    items: v.array(v.object({
      partNumber: v.string(),
      name: v.string(),
      quantityOrdered: v.number(),
      quantityReceived: v.number(),
      unitCost: v.number(),
      totalCost: v.number(),
    })),
    totalAmount: v.number(),
    expectedDate: v.optional(v.string()),
    orgId: v.string(), // Added orgId
  },
  handler: async (ctx, args) => {
    const count = await ctx.db.query("purchaseOrders").collect();
    const poNumber = `PO-${String(count.length + 1).padStart(6, "0")}`;
    
    const poId = await ctx.db.insert("purchaseOrders", {
      ...args,
      poNumber,
      status: "draft",
      orderedAt: new Date().toISOString(),
    });
    return poId; // Return the ID of the new purchase order
  },
});

/**
 * RECEIVE PURCHASE ORDER
 * Automatically updates status to "received" and INCREASES inventory stock
 */
export const receivePurchaseOrder = mutation({
  args: {
    id: v.id("purchaseOrders"),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const po = await ctx.db.get(args.id);
    if (!po) throw new Error("PO not found");
    if (po.status === "received") throw new Error("PO already received");

    // 1. Update PO status
    await ctx.db.patch(args.id, {
      status: "received",
      receivedAt: new Date().toISOString(),
      notes: args.notes,
    });

    // 2. AUTO-INCREASE INVENTORY
    for (const item of po.items) {
      // Find inventory item by part number (or create if logic becomes more complex)
      const inventoryItem = await ctx.db
        .query("inventory")
        .withIndex("by_partNumber", (q) => q.eq("partNumber", item.partNumber))
        .first();

      if (inventoryItem) {
        const newQuantity = inventoryItem.stockQuantity + item.quantityOrdered;
        await ctx.db.patch(inventoryItem._id, {
          stockQuantity: newQuantity,
          // Optionally update cost price to moving average
        });
        // Also record an inventory adjustment for the receipt
        await ctx.db.insert("inventoryAdjustments", {
          inventoryId: inventoryItem._id,
          quantityChange: item.quantityOrdered,
          reason: "purchase_receipt",
          adjustedBy: undefined, // Could be a user ID if tracked
          notes: `Received ${item.quantityOrdered} units of ${item.name} from PO ${po.poNumber}`,
          date: new Date().toISOString(),
          orgId: po.orgId,
        });
      }
    }
  },
});

// --- INVENTORY ADJUSTMENTS ---
export const getInventoryAdjustments = query({
  args: { inventoryId: v.optional(v.id("inventory")) },
  handler: async (ctx, args) => {
    if (args.inventoryId) {
      const inventoryId = args.inventoryId;
      return await ctx.db
        .query("inventoryAdjustments")
        .withIndex("by_inventory", (q) => q.eq("inventoryId", inventoryId))
        .collect();
    }
    return await ctx.db.query("inventoryAdjustments").collect();
  },
});

/**
 * ADJUST INVENTORY STOCK
 * Creates an audit record and immediately updates the live stock quantity
 */
export const adjustStock = mutation({
  args: {
    inventoryId: v.id("inventory"),
    quantityChange: v.number(), // +5 or -2
    reason: v.union(
      v.literal("damage"),
      v.literal("theft"),
      v.literal("audit_correction"),
      v.literal("return_restock"),
      v.literal("other")
    ),
    adjustedBy: v.id("users"),
    notes: v.optional(v.string()),
    orgId: v.string(), // Added orgId
  },
  handler: async (ctx, args) => {
    // 1. Create Audit Record
    await ctx.db.insert("inventoryAdjustments", {
      ...args,
      date: new Date().toISOString(),
    });

    // 2. Update Live Inventory
    const item = await ctx.db.get(args.inventoryId);
    if (item) {
      const newQuantity = item.stockQuantity + args.quantityChange;
      await ctx.db.patch(args.inventoryId, {
        stockQuantity: newQuantity, // Allow negative checking in validation if needed
      });
    }
  },
});

