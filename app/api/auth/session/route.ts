import { NextRequest, NextResponse } from "next/server";
import { getConvexClient } from "@/lib/convex-server";
import { api } from "@/convex/_generated/api";

const SESSION_COOKIE = "mass_session";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(SESSION_COOKIE)?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const convex = getConvexClient();
    const session = await convex.query(api.auth.getSession, { token });

    if (!session) {
      const response = NextResponse.json({ user: null }, { status: 401 });
      response.cookies.set(SESSION_COOKIE, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });
      return response;
    }

    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
