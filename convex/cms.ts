import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * CMS Engine: Blog & Content Management
 * Authorized by M2 Autopilot Protocol.
 */

export const getBlogPosts = query({
  args: { 
    orgId: v.optional(v.string()), 
    status: v.optional(v.string()) 
  },
  handler: async (ctx, args) => {
    // Return empty for now to unblock build
    return [];
  },
});
