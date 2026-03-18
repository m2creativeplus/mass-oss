import { NextRequest, NextResponse } from "next/server";
import { getConvexClient } from "@/lib/convex-server";
import { api } from "@/convex/_generated/api";

const SESSION_COOKIE = "mass_session";

export async function PATCH(request: NextRequest) {
  try {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, phone, avatarUrl } = body;

    const convex = getConvexClient();
    const result = await convex.mutation(api.auth.updateProfile, {
      token,
      firstName,
      lastName,
      phone,
      avatarUrl,
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
