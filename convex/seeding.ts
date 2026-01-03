import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const seedDemoUsers = mutation({
  args: {},
  handler: async (ctx) => {
    const demoUsers = [
      {
        email: "admin@masscar.com",
        firstName: "Admin",
        lastName: "User",
        role: "admin",
      },
      {
        email: "staff@masscar.com",
        firstName: "Staff",
        lastName: "Member",
        role: "staff",
      },
      {
        email: "tech@masscar.com",
        firstName: "Tech",
        lastName: "Worker",
        role: "technician",
      },
      {
        email: "customer@masscar.com",
        firstName: "Customer",
        lastName: "User",
        role: "customer",
      },
      {
        email: "owner@masscar.com",
        firstName: "Owner",
        lastName: "Executive",
        role: "admin",
      }
    ];

    // 1. Create Organization if it doesn't exist
    let orgId;
    const existingOrg = await ctx.db
      .query("organizations")
      .withIndex("by_slug", (q) => q.eq("slug", "mass-hargeisa"))
      .first();

    if (existingOrg) {
      orgId = existingOrg._id;
    }

    const createdUserIds: Record<string, any> = {};

    for (const u of demoUsers) {
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", u.email))
        .first();

      if (!existingUser) {
        const newUserId = await ctx.db.insert("users", {
          email: u.email,
          firstName: u.firstName,
          lastName: u.lastName,
          role: u.role as any,
          isActive: true,
        });
        createdUserIds[u.email] = newUserId;
        console.log(`Created user: ${u.email}`);
      } else {
        createdUserIds[u.email] = existingUser._id;
        console.log(`User already exists: ${u.email}`);
      }
    }

    // Now ensuring Org Exists
    if (!existingOrg) {
      const ownerId = createdUserIds["owner@masscar.com"];
        if (ownerId) {
            orgId = await ctx.db.insert("organizations", {
                name: "MASS Car Workshop",
                slug: "mass-hargeisa",
                ownerId: ownerId,
                plan: "enterprise",
                isActive: true,
            });
            console.log("Created Organization: MASS Car Workshop");
        } else {
            console.error("Could not create org, owner not found");
        }
    } else {
         if (!orgId) orgId = existingOrg?._id;
    }
    
    // Assign Users to permissions if org exists
    if (orgId) {
        // Ensure UserOrgRoles
        const ownerId = createdUserIds["owner@masscar.com"];
        if (ownerId && !(await ctx.db.query("userOrgRoles").withIndex("by_user_org", q => q.eq("userId", ownerId).eq("orgId", orgId!)).first())) {
             await ctx.db.insert("userOrgRoles", { userId: ownerId, orgId: orgId, role: "admin", isActive: true });
        }
         const adminId = createdUserIds["admin@masscar.com"];
        if (adminId && !(await ctx.db.query("userOrgRoles").withIndex("by_user_org", q => q.eq("userId", adminId).eq("orgId", orgId!)).first())) {
             await ctx.db.insert("userOrgRoles", { userId: adminId, orgId: orgId, role: "admin", isActive: true });
        }
    }

    return "Seeding Completed";
  },
});
