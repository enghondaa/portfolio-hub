import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { AdminRole } from "@portfolio/orders-core";

/**
 * Signed, httpOnly session cookie via jose. Eight-hour expiry. The secret
 * comes from AUTH_SECRET; a build-time fallback keeps local dev running but is
 * never a real secret, so in production AUTH_SECRET must be set.
 */
export const SESSION_COOKIE = "kahwa_admin_session";
const MAX_AGE_SECONDS = 8 * 60 * 60;

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
}

function secretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET ?? "dev-only-insecure-secret-change-me-in-production-1234567890";
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secretKey());
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (
      typeof payload.id === "string" &&
      typeof payload.name === "string" &&
      typeof payload.email === "string" &&
      (payload.role === "owner" || payload.role === "staff")
    ) {
      return { id: payload.id, name: payload.name, email: payload.email, role: payload.role };
    }
    return null;
  } catch {
    return null;
  }
}

/** Reads and verifies the session from cookies. Server components / route handlers only. */
export async function getSession(): Promise<SessionUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function setSessionCookie(token: string): Promise<void> {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearSessionCookie(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}
