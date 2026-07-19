import { NextResponse } from "next/server";
import { loginSchema } from "@portfolio/orders-core";
import { verifyLogin } from "@/lib/store";
import { createSessionToken, setSessionCookie } from "@/lib/session";
import { allowLoginAttempt } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!allowLoginAttempt(ip)) {
    return NextResponse.json({ error: "Too many attempts. Wait a moment and try again." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", fields: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const user = await verifyLogin(parsed.data.email, parsed.data.password);
  if (!user) {
    // One message for both "no such account" and "wrong password", so the
    // endpoint never reveals which emails are valid.
    return NextResponse.json({ error: "Those credentials don't match an account." }, { status: 401 });
  }

  const token = await createSessionToken(user);
  await setSessionCookie(token);
  return NextResponse.json({ ok: true, role: user.role });
}
