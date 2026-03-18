import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const processCheckout = mutation({
  args: {
    orgId: v.string(),
    items: v.array(v.object({
      id: v.id("inventory"),
      name: v.string(),
      price: v.number(),
      quantity: v.number(),
    })),
    subtotal: v.number(),
    taxAmount: v.number(),
    totalAmount: v.number(),
    paymentMethod: v.union(
      v.literal("cash"),
      v.literal("zaad"),
      v.literal("edahab"),
      v.literal("card"),
      v.literal("bank_transfer") // Catch-all for schema compatibility if needed
    ),
    customerPhone: v.optional(v.string()),
    customerName: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    // 1. Verify all stock first to avoid partial transactions
    const verifiedItems = [];
    for (const item of args.items) {
      const dbItem = await ctx.db.get(item.id);
      if (!dbItem) throw new Error(`Item ${item.name} not found in inventory`);
      if (dbItem.stockQuantity < item.quantity) {
        throw new Error(`Not enough stock for ${item.name}. Available: ${dbItem.stockQuantity}`);
      }
      verifiedItems.push({ ...item, partNumber: dbItem.partNumber });
    }

    // 2. Generate generic saleNumber
    const count = await ctx.db
      .query("sales")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect();
    const saleNumber = `SALE-${String(count.length + 1).padStart(6, "0")}`;

    // 3. Create the Sale Record
    const saleId = await ctx.db.insert("sales", {
      saleNumber,
      orgId: args.orgId,
      customerId: undefined, // Optional walk-in
      totalAmount: args.totalAmount,
      subtotal: args.subtotal,
      taxAmount: args.taxAmount,
      paymentMethod: args.paymentMethod as any, // Cast to avoid literal mismatches
      createdAt: new Date().toISOString(),
      items: verifiedItems.map(i => ({
        inventoryId: i.id,
        name: i.name,
        partNumber: i.partNumber,
        quantity: i.quantity,
        unitPrice: i.price,
        totalPrice: i.price * i.quantity
      }))
    });

    // 4. Deduct Inventory & Create Adjustments
    for (const item of args.items) {
      const dbItem = await ctx.db.get(item.id);
      if (dbItem) {
        const newStock = dbItem.stockQuantity - item.quantity;
        
        // Record Adjustment
        await ctx.db.insert("inventoryAdjustments", {
          inventoryId: item.id,
          quantityChange: -item.quantity,
          reason: "sale",
          date: new Date().toISOString(),
          orgId: args.orgId,
          notes: `Sale #${saleNumber}`
        });

        // Update Item
        await ctx.db.patch(item.id, { stockQuantity: newStock });
      }
    }

    return { success: true, saleId, saleNumber };
  }
});
