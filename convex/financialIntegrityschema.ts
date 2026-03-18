import { query, mutation } from "./_generated/server";
import { v } from "convex/values";


// --- PAYMENTS ---
export const getPaymentsByInvoice = query({
  args: { invoiceId: v.id("invoices") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("payments")
      .withIndex("by_invoice", (q) => q.eq("invoiceId", args.invoiceId))
      .collect();
  },
});

export const addPayment = mutation({
  args: {
    invoiceId: v.id("invoices"),
    amount: v.number(),
    method: v.union(
      v.literal("cash"),
      v.literal("zaad"),
      v.literal("edahab"),
      v.literal("card"),
      v.literal("bank_transfer"),
      v.literal("check")
    ),
    reference: v.optional(v.string()),
    receivedBy: v.id("users"),
    notes: v.optional(v.string()),
    isDeposit: v.boolean(),
  },
  handler: async (ctx, args) => {
    const invoice = await ctx.db.get(args.invoiceId);
    if (!invoice) throw new Error("Invoice not found");
    
    const payment = await ctx.db.insert("payments", {
      ...args,
      orgId: invoice.orgId,
      paymentDate: new Date().toISOString(),
    });

    // Update Invoice status and balances
    if (invoice) {
      const newPaidAmount = (invoice.paidAmount || 0) + args.amount;
      const newBalanceDue = invoice.totalAmount - newPaidAmount;
      
      let newStatus = invoice.status;
      if (newBalanceDue <= 0) {
        newStatus = "paid";
      } else if (newPaidAmount > 0) {
        newStatus = "partial";
      }

      await ctx.db.patch(args.invoiceId, {
        paidAmount: newPaidAmount,
        balanceDue: newBalanceDue,
        status: newStatus as any,
      });
    }

    return payment;
  },
});

// --- EXPENSES ---
export const getExpenses = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("expenses").collect();
  },
});

export const addExpense = mutation({
  args: {
    category: v.string(),
    amount: v.number(),
    description: v.string(),
    paidBy: v.id("users"),
    paymentMethod: v.string(),
    receiptUrl: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("paid")
    ),
    orgId: v.string(), // Added orgId
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("expenses", {
      ...args,
      date: new Date().toISOString(),
      status: "pending",
    });
  },
});

// --- EXPENSE CATEGORIES ---
export const getExpenseCategories = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("expenseCategories").collect();
  },
});

export const addExpenseCategory = mutation({
  args: {
    name: v.string(),
    type: v.union(
      v.literal("overhead"),
      v.literal("cogs"),
      v.literal("labor"),
      v.literal("marketing"),
      v.literal("equipment")
    ),
    description: v.optional(v.string()),
    orgId: v.string(), // Added orgId
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("expenseCategories", {
      ...args,
      isActive: true,
    });
  },
});

