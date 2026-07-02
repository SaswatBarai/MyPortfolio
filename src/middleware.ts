import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose/jwt/verify";

const COOKIE_NAME = "admin_token";

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET environment variable is not set");
  return new TextEncoder().encode(secret);
}

async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedPage =
    pathname.startsWith("/dashboard") && !pathname.startsWith("/dashboard/login");

  // GET /api/schedule/slots is public (used by the booking widget to show availability);
  // only the admin-only mutations (add/delete slots) need auth.
  const isProtectedSlotsMutation =
    pathname.startsWith("/api/schedule/slots") && request.method !== "GET";

  const isProtectedApi =
    pathname.startsWith("/api/schedule/requests") ||
    pathname.startsWith("/api/schedule/approve") ||
    pathname.startsWith("/api/schedule/reject") ||
    isProtectedSlotsMutation;

  if (!isProtectedPage && !isProtectedApi) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const valid = token ? await verifyToken(token) : false;

  if (!valid) {
    if (isProtectedPage) {
      return NextResponse.redirect(new URL("/dashboard/login", request.url));
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/schedule/requests",
    "/api/schedule/approve/:path*",
    "/api/schedule/reject/:path*",
    "/api/schedule/slots",
  ],
};
