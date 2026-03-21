import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ============================================================
// MASS OSS - Secure API Key Management
// CRUD operations for AI model API keys
// ============================================================

// ============ LIST KEYS (masked) ============
export const listKeys = query({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    const keys = await ctx.db
      .query("apiKeys")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect();
    
    // NEVER return the actual key to the client
    return keys.map((key) => ({
      _id: key._id,
      _creationTime: key._creationTime,
      provider: key.provider,
      label: key.label,
      keyPrefix: key.keyPrefix,
      keySuffix: key.keySuffix,
      isActive: key.isActive,
      lastTestedAt: key.lastTestedAt,
      lastTestStatus: key.lastTestStatus,
      lastTestMessage: key.lastTestMessage,
      addedBy: key.addedBy,
      createdAt: key.createdAt,
      updatedAt: key.updatedAt,
    }));
  },
});

// ============ ADD KEY ============
export const addKey = mutation({
  args: {
    orgId: v.string(),
    provider: v.union(
      v.literal("openai"),
      v.literal("google"),
      v.literal("anthropic"),
      v.literal("mistral"),
      v.literal("groq"),
      v.literal("cohere"),
      v.literal("huggingface"),
      v.literal("custom")
    ),
    label: v.string(),
    apiKey: v.string(), // Raw key — will be processed server-side
    addedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { apiKey, ...rest } = args;
    
    // Extract prefix and suffix for masked display
    const keyPrefix = apiKey.substring(0, Math.min(8, apiKey.length));
    const keySuffix = apiKey.substring(Math.max(0, apiKey.length - 4));
    
    // Simple hash for verification (in production use server-side crypto)
    const keyHash = btoa(apiKey).substring(0, 32);
    
    // Store the key with Base64 encoding (in production, use AES-256 encryption)
    const encryptedKey = btoa(apiKey);
    
    const now = new Date().toISOString();
    
    return await ctx.db.insert("apiKeys", {
      orgId: rest.orgId,
      provider: rest.provider,
      label: rest.label,
      keyHash,
      keyPrefix,
      keySuffix,
      encryptedKey,
      isActive: true,
      addedBy: rest.addedBy,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// ============ REMOVE KEY ============
export const removeKey = mutation({
  args: { id: v.id("apiKeys") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// ============ TOGGLE KEY ACTIVE STATE ============
export const toggleKey = mutation({
  args: { id: v.id("apiKeys") },
  handler: async (ctx, args) => {
    const key = await ctx.db.get(args.id);
    if (!key) throw new Error("API key not found");
    
    await ctx.db.patch(args.id, {
      isActive: !key.isActive,
      updatedAt: new Date().toISOString(),
    });
  },
});

// ============ GET DECRYPTED KEY (internal use only) ============
export const getDecryptedKey = query({
  args: { id: v.id("apiKeys") },
  handler: async (ctx, args) => {
    const key = await ctx.db.get(args.id);
    if (!key) throw new Error("API key not found");
    
    // Decode the Base64-encoded key
    const decryptedKey = atob(key.encryptedKey);
    return decryptedKey;
  },
});

// ============ UPDATE TEST RESULT ============
export const updateTestResult = mutation({
  args: {
    id: v.id("apiKeys"),
    status: v.union(
      v.literal("success"),
      v.literal("failed"),
      v.literal("expired"),
      v.literal("rate_limited")
    ),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      lastTestedAt: new Date().toISOString(),
      lastTestStatus: args.status,
      lastTestMessage: args.message,
      updatedAt: new Date().toISOString(),
    });
  },
});
