import { NextRequest, NextResponse } from "next/server";
import { getConvexClient } from "@/lib/convex-server";
import { api } from "@/convex/_generated/api";

const SESSION_COOKIE = "mass_session";
const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const convex = getConvexClient();
    const result = await convex.mutation(api.auth.login, { email, password });

    const response = NextResponse.json({
      user: result.user,
      orgId: result.orgId,
      orgName: result.orgName,
    });

    response.cookies.set(SESSION_COOKIE, result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
