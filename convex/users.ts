import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

export const createUser = mutation({
  args: {
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    phone: v.optional(v.string()),
    role: v.union(
      v.literal("admin"),
      v.literal("staff"),
      v.literal("technician"),
      v.literal("customer")
    ),
    orgName: v.optional(v.string()), // Optional, defaults to "My Workshop"
  },
  handler: async (ctx, args) => {
    // 1. Create User
    const userId = await ctx.db.insert("users", {
      email: args.email,
      firstName: args.firstName,
      lastName: args.lastName,
      phone: args.phone,
      role: args.role,
      isActive: true,
      lastLoginAt: new Date().toISOString(),
    });

    // 2. If Admin, Create Default Organization
    if (args.role === "admin") {
      const orgId = await ctx.db.insert("organizations", {
        name: args.orgName || "My Workshop",
        slug: (args.orgName || "my-workshop").toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
        ownerId: userId,
        plan: "free",
        isActive: true,
      });

      // 3. Assign Role
      await ctx.db.insert("userOrgRoles", {
        userId,
        orgId,
        role: "admin",
        isActive: true,
      });
    }

    return userId;
  },
});

export const getUserOrgs = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const roles = await ctx.db
      .query("userOrgRoles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    
    // Fetch org details for each role
    const orgs = await Promise.all(
      roles.map(async (role) => {
        const org = await ctx.db.get(role.orgId);
        if (!org) return null;
        return { ...org, role: role.role };
      })
    );
    
    // Filter out nulls (deleted orgs) and inactive orgs
    return orgs.filter((o): o is NonNullable<typeof o> => o !== null && o.isActive);
  },
});

