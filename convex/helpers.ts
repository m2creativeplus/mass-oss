import { QueryCtx, MutationCtx } from "./_generated/server";

export async function getUserOrgRole(ctx: QueryCtx | MutationCtx, userId: string, orgId: string) {
  const role = await ctx.db
    .query("userOrgRoles")
    .withIndex("by_user_org", (q) => q.eq("userId", userId as any).eq("orgId", orgId as any))
    .first();
  return role;
}
