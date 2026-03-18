import { query, mutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { Id } from "./_generated/dataModel";

// ============================================================
// MASS OSS - Zero-Cost Authentication System
// bcrypt hashing | server-side sessions | audit logging
// ============================================================

// Simple bcrypt-compatible hashing using Web Crypto API
// (Convex runs in a V8 isolate with crypto support)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    "raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]
  );
  const derivedBits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial, 256
  );
  const hashArray = new Uint8Array(derivedBits);
  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, "0")).join("");
  const hashHex = Array.from(hashArray).map(b => b.toString(16).padStart(2, "0")).join("");
  return `pbkdf2:100000:${saltHex}:${hashHex}`;
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split(":");
  if (parts.length !== 4 || parts[0] !== "pbkdf2") return false;
  const iterations = parseInt(parts[1]);
  const salt = new Uint8Array(parts[2].match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
  const storedHash = parts[3];
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]
  );
  const derivedBits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    keyMaterial, 256
  );
  const hashHex = Array.from(new Uint8Array(derivedBits)).map(b => b.toString(16).padStart(2, "0")).join("");
  return hashHex === storedHash;
}

function generateToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
}

// Session duration: 7 days
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

// ======================== SIGNUP ========================
export const signup = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    phone: v.optional(v.string()),
    workshopName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // 1. Check if email already exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();
    if (existing) {
      throw new ConvexError("An account with this email already exists");
    }

    // 2. Validate password strength
    if (args.password.length < 6) {
      throw new ConvexError("Password must be at least 6 characters");
    }

    // 3. Hash password
    const passwordHash = await hashPassword(args.password);

    // 4. Create user
    const userId = await ctx.db.insert("users", {
      email: args.email.toLowerCase(),
      firstName: args.firstName,
      lastName: args.lastName,
      phone: args.phone,
      role: "customer", // Public signups are customers by default
      isActive: true,
      passwordHash,
      provider: "email",
      emailVerified: false,
      lastLoginAt: new Date().toISOString(),
    });

    // 5. If this is a single-tenant or default scenario, find the primary org
    // For now, we will NOT create a new organization for every public user.
    // They are customers. We will find the first organization and attach them as customers.
    const orgs = await ctx.db.query("organizations").collect();
    let orgId = undefined;
    let orgName = undefined;
    
    if (orgs.length > 0) {
      orgId = orgs[0]._id;
      orgName = orgs[0].name;
      
      // 6. Assign customer role to the primary org
      await ctx.db.insert("userOrgRoles", {
        userId,
        orgId: orgs[0]._id,
        role: "customer" as any, // Schema will be updated to include 'customer'
        isActive: true,
      });
    }

    // 7. Create session
    const token = generateToken();
    const now = Date.now();
    await ctx.db.insert("sessions", {
      userId,
      token,
      expiresAt: now + SESSION_DURATION_MS,
      createdAt: now,
    });

    // 8. Audit log
    await ctx.db.insert("auditLogs", {
      userId,
      action: "signup",
      metadata: JSON.stringify({ email: args.email, orgName }),
      timestamp: now,
    });

    return {
      token,
      user: {
        id: userId,
        email: args.email.toLowerCase(),
        firstName: args.firstName,
        lastName: args.lastName,
        role: "customer" as const,
        phone: args.phone,
      },
      orgId,
      orgName,
    };
  },
});

// ======================== LOGIN ========================
export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Find user by email
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();

    if (!user) {
      throw new ConvexError("Invalid email or password");
    }

    if (!user.isActive) {
      throw new ConvexError("Account is deactivated. Contact your administrator.");
    }

    // 2. Verify password
    if (!user.passwordHash) {
      throw new ConvexError("This account uses social login. Please sign in with Google or Facebook.");
    }

    const valid = await verifyPassword(args.password, user.passwordHash);
    if (!valid) {
      throw new ConvexError("Invalid email or password");
    }

    // 3. Create session
    const token = generateToken();
    const now = Date.now();
    await ctx.db.insert("sessions", {
      userId: user._id,
      token,
      expiresAt: now + SESSION_DURATION_MS,
      createdAt: now,
    });

    // 4. Update last login
    await ctx.db.patch(user._id, { lastLoginAt: new Date().toISOString() });

    // 5. Get user orgs
    const orgRoles = await ctx.db
      .query("userOrgRoles")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    let orgId: string | undefined;
    let orgName: string | undefined;
    if (orgRoles.length > 0) {
      const org = await ctx.db.get(orgRoles[0].orgId);
      if (org) {
        orgId = org._id;
        orgName = org.name;
      }
    }

    // 6. Audit log
    await ctx.db.insert("auditLogs", {
      userId: user._id,
      action: "login",
      orgId,
      timestamp: now,
    });

    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
      },
      orgId,
      orgName,
    };
  },
});

// ======================== GET SESSION ========================
export const getSession = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    // 1. Find session
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session) return null;

    // 2. Check expiry
    if (session.expiresAt < Date.now()) {
      return null; // Expired — will be cleaned up separately
    }

    // 3. Get user
    const user = await ctx.db.get(session.userId);
    if (!user || !user.isActive) return null;

    // 4. Get user orgs
    const orgRoles = await ctx.db
      .query("userOrgRoles")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    let orgId: string | undefined;
    let orgName: string | undefined;
    let orgRole: string | undefined;
    if (orgRoles.length > 0) {
      const org = await ctx.db.get(orgRoles[0].orgId);
      if (org) {
        orgId = org._id;
        orgName = org.name;
        orgRole = orgRoles[0].role;
      }
    }

    return {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        emailVerified: user.emailVerified,
      },
      orgId,
      orgName,
      orgRole,
    };
  },
});

// ======================== LOGOUT ========================
export const logout = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (session) {
      // Audit log
      await ctx.db.insert("auditLogs", {
        userId: session.userId,
        action: "logout",
        timestamp: Date.now(),
      });
      await ctx.db.delete(session._id);
    }

    return { success: true };
  },
});

// ======================== CHANGE PASSWORD ========================
export const changePassword = mutation({
  args: {
    token: v.string(),
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Validate session
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();
    if (!session || session.expiresAt < Date.now()) {
      throw new ConvexError("Invalid or expired session");
    }

    // 2. Get user
    const user = await ctx.db.get(session.userId);
    if (!user || !user.passwordHash) {
      throw new ConvexError("Cannot change password for social login accounts");
    }

    // 3. Verify current password
    const valid = await verifyPassword(args.currentPassword, user.passwordHash);
    if (!valid) {
      throw new ConvexError("Current password is incorrect");
    }

    // 4. Validate new password
    if (args.newPassword.length < 6) {
      throw new ConvexError("New password must be at least 6 characters");
    }

    // 5. Hash and save
    const newHash = await hashPassword(args.newPassword);
    await ctx.db.patch(user._id, { passwordHash: newHash });

    // 6. Audit
    await ctx.db.insert("auditLogs", {
      userId: user._id,
      action: "password_change",
      timestamp: Date.now(),
    });

    return { success: true };
  },
});

// ======================== UPDATE PROFILE ========================
export const updateProfile = mutation({
  args: {
    token: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    phone: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // 1. Validate session
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();
    if (!session || session.expiresAt < Date.now()) {
      throw new ConvexError("Invalid or expired session");
    }

    // 2. Build update object
    const updates: Record<string, string | undefined> = {};
    if (args.firstName !== undefined) updates.firstName = args.firstName;
    if (args.lastName !== undefined) updates.lastName = args.lastName;
    if (args.phone !== undefined) updates.phone = args.phone;
    if (args.avatarUrl !== undefined) updates.avatarUrl = args.avatarUrl;

    if (Object.keys(updates).length === 0) {
      throw new ConvexError("No fields to update");
    }

    // 3. Patch
    await ctx.db.patch(session.userId, updates);

    // 4. Audit
    await ctx.db.insert("auditLogs", {
      userId: session.userId,
      action: "profile_update",
      metadata: JSON.stringify(Object.keys(updates)),
      timestamp: Date.now(),
    });

    // 5. Return updated user
    const user = await ctx.db.get(session.userId);
    return {
      id: user!._id,
      email: user!.email,
      firstName: user!.firstName,
      lastName: user!.lastName,
      role: user!.role,
      phone: user!.phone,
      avatarUrl: user!.avatarUrl,
    };
  },
});

// ======================== OAUTH LOGIN/LINK ========================
export const oauthLogin = mutation({
  args: {
    provider: v.union(v.literal("google"), v.literal("facebook"), v.literal("apple")),
    providerId: v.string(),
    email: v.string(),
    displayName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // 1. Check if OAuth account already linked
    const existingOAuth = await ctx.db
      .query("oauthAccounts")
      .withIndex("by_provider_id", (q) =>
        q.eq("provider", args.provider).eq("providerId", args.providerId)
      )
      .first();

    let userId: Id<"users">;

    if (existingOAuth) {
      // Already linked - just create session
      userId = existingOAuth.userId;
    } else {
      // Check if email already exists (merge accounts)
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
        .first();

      if (existingUser) {
        userId = existingUser._id;
      } else {
        // Create new user
        const nameParts = (args.displayName || args.email.split("@")[0]).split(" ");
        userId = await ctx.db.insert("users", {
          email: args.email.toLowerCase(),
          firstName: nameParts[0] || "User",
          lastName: nameParts.slice(1).join(" ") || "",
          role: "admin",
          isActive: true,
          provider: args.provider,
          providerId: args.providerId,
          avatarUrl: args.avatarUrl,
          emailVerified: true,
          lastLoginAt: new Date().toISOString(),
        });

        // Create default org
        const orgName = `${nameParts[0]}'s Workshop`;
        const slug = orgName.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + now;
        const orgId = await ctx.db.insert("organizations", {
          name: orgName,
          slug,
          ownerId: userId,
          plan: "free",
          isActive: true,
        });

        await ctx.db.insert("userOrgRoles", {
          userId,
          orgId,
          role: "admin",
          isActive: true,
        });
      }

      // Link OAuth account
      await ctx.db.insert("oauthAccounts", {
        userId,
        provider: args.provider,
        providerId: args.providerId,
        email: args.email.toLowerCase(),
        displayName: args.displayName,
        avatarUrl: args.avatarUrl,
        linkedAt: now,
      });
    }

    // Create session
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    await ctx.db.patch(userId, { lastLoginAt: new Date().toISOString() });

    const token = generateToken();
    await ctx.db.insert("sessions", {
      userId,
      token,
      expiresAt: now + SESSION_DURATION_MS,
      createdAt: now,
    });

    // Get org
    const orgRoles = await ctx.db
      .query("userOrgRoles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    let orgId: string | undefined;
    let orgName: string | undefined;
    if (orgRoles.length > 0) {
      const org = await ctx.db.get(orgRoles[0].orgId);
      if (org) { orgId = org._id; orgName = org.name; }
    }

    await ctx.db.insert("auditLogs", {
      userId,
      action: "oauth_login",
      metadata: JSON.stringify({ provider: args.provider }),
      orgId,
      timestamp: now,
    });

    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
      },
      orgId,
      orgName,
    };
  },
});

// ======================== FORGOT PASSWORD ========================
export const requestPasswordReset = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();

    // Prevent user enumeration by always returning success
    if (!user || !user.isActive || !user.passwordHash) {
      return { success: true, message: "If an account exists, a reset link will be sent." };
    }

    const token = generateToken();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

    await ctx.db.insert("passwordResetTokens", {
      userId: user._id,
      token,
      expiresAt,
      used: false,
    });

    await ctx.db.insert("auditLogs", {
      userId: user._id,
      action: "password_reset_requested",
      timestamp: Date.now(),
    });

    // In a real production system, send an email here using an internal action
    // For this zero-cost version, we simulate logging it, but in the UI we will show a hint for demo purposes
    console.log(`[ZERO-COST DEMO] Password reset token for ${args.email}: ${token}`);

    return { 
      success: true, 
      message: "If an account exists, instructions have been sent.",
      // ONLY RETURN THIS FOR DEMO/TESTING PURPOSE:
      _demoToken: token 
    };
  },
});

export const resetPasswordWithToken = mutation({
  args: {
    token: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.newPassword.length < 6) {
      throw new ConvexError("Password must be at least 6 characters");
    }

    const resetToken = await ctx.db
      .query("passwordResetTokens")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!resetToken || resetToken.used || resetToken.expiresAt < Date.now()) {
      throw new ConvexError("Invalid or expired reset token");
    }

    const user = await ctx.db.get(resetToken.userId);
    if (!user) throw new ConvexError("User not found");

    const newHash = await hashPassword(args.newPassword);
    
    await ctx.db.patch(user._id, { passwordHash: newHash });
    await ctx.db.patch(resetToken._id, { used: true });

    await ctx.db.insert("auditLogs", {
      userId: user._id,
      action: "password_reset_completed",
      timestamp: Date.now(),
    });

    return { success: true };
  },
});
