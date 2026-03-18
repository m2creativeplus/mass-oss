import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const createCustomerApproval = mutation({
  args: {
    estimateId: v.id("estimates"),
    customerId: v.id("customers"),
    sentVia: v.union(v.literal("email"), v.literal("sms"), v.literal("whatsapp")),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    // Generate unique token
    const token = `APR-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    return await ctx.db.insert("customerApprovals", {
      ...args,
      approvalToken: token,
      sentAt: new Date().toISOString(),
      status: "pending",
    });
  },
});

export const getApprovalByToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("customerApprovals")
      .withIndex("by_token", (q) => q.eq("approvalToken", args.token))
      .first();
  },
});

export const approveEstimate = mutation({
  args: {
    token: v.string(),
    signatureData: v.optional(v.string()),
    approvedItems: v.array(v.string()),
    declinedItems: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const approval = await ctx.db
      .query("customerApprovals")
      .withIndex("by_token", (q) => q.eq("approvalToken", args.token))
      .first();
    
    if (!approval) throw new Error("Invalid approval token");
    if (approval.status !== "pending" && approval.status !== "viewed") {
      throw new Error("Approval already processed");
    }
    
    await ctx.db.patch(approval._id, {
      status: "approved",
      approvedAt: new Date().toISOString(),
      signatureData: args.signatureData,
      approvedItems: args.approvedItems,
      declinedItems: args.declinedItems,
      notes: args.notes,
    });
    
    // Update estimate status
    await ctx.db.patch(approval.estimateId, {
      status: "approved",
    });
    
    return approval._id;
  },
});

