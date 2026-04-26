import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminHash = process.env.ADMIN_PASSWORD_HASH;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || (!adminHash && !adminPassword)) {
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    const normalizedEmail = String(email ?? "").trim().toLowerCase();
    const normalizedAdminEmail = adminEmail.trim().toLowerCase();
    const normalizedAdminHash = adminHash?.trim();

    if (normalizedEmail !== normalizedAdminEmail) {
      return NextResponse.json(
        {
          error: "Invalid credentials",
          ...(process.env.NODE_ENV !== "production" ? { debug: "email_mismatch" } : {}),
        },
        { status: 401 }
      );
    }

    const normalizedPassword = String(password ?? "");
    const valid = adminPassword
      ? normalizedPassword === adminPassword
      : await bcrypt.compare(normalizedPassword, normalizedAdminHash as string);
    if (!valid) {
      return NextResponse.json(
        {
          error: "Invalid credentials",
          ...(process.env.NODE_ENV !== "production" ? { debug: "password_mismatch" } : {}),
        },
        { status: 401 }
      );
    }

    const token = await signToken({ email: normalizedAdminEmail, role: "admin" });

    const response = NextResponse.json({ success: true });
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8, // 8 hours
      path: "/",
    });

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
