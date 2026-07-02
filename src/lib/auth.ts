import { SignJWT } from "jose/jwt/sign";
import { jwtVerify } from "jose/jwt/verify";

const COOKIE_NAME = "admin_token";

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET environment variable is not set");
  return new TextEncoder().encode(secret);
}

export interface AdminPayload {
  email: string;
  role: "admin";
}

export async function signToken(payload: AdminPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as AdminPayload;
  } catch {
    return null;
  }
}

export { COOKIE_NAME };
