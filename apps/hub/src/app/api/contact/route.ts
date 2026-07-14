import { NextResponse } from "next/server";

const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "eng.mohand2389@gmail.com";

interface ContactBody {
  name?: string;
  email?: string;
  message?: string;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  let body: ContactBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email, and message are all required." }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "That email address doesn't look right." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // No email provider configured yet. Fail clearly so the client shows
    // the mailto fallback instead of a false "sent" confirmation.
    return NextResponse.json(
      { error: "Email delivery isn't configured yet. Use the mailto link below instead." },
      { status: 503 }
    );
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: TO_EMAIL,
      reply_to: email,
      subject: `Portfolio contact from ${name}`,
      text: message,
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "The email provider rejected the message. Try the mailto link instead." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
