"use client";

import { useState, type FormEvent } from "react";
import { Input, Button } from "@portfolio/ui";

type Status = "idle" | "loading" | "success" | "error";

const CONTACT_EMAIL = "eng.mohand2389@gmail.com";

export default function ContactPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const mailtoHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    `Portfolio contact from ${name || "a visitor"}`
  )}&body=${encodeURIComponent(message)}`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error ?? "Something went wrong. Use the mailto link below instead.");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setErrorMessage("Couldn't reach the server. Use the mailto link below instead.");
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="font-mono text-sm uppercase tracking-wide text-[var(--color-accent)]">Contact</p>
      <h1 className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight text-[var(--color-neutral-800)] sm:text-4xl">
        Get in touch
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-[var(--color-neutral-600)]">
        Send a message below, or email me directly at{" "}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-[var(--color-accent)] underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded"
        >
          {CONTACT_EMAIL}
        </a>
        .
      </p>

      {status === "success" ? (
        <div
          role="status"
          className="mt-10 rounded-lg border border-[var(--color-neutral-200)] bg-[var(--color-accent-soft)] p-5 text-[var(--color-neutral-800)]"
        >
          Message sent. I&apos;ll get back to you soon.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-10 space-y-5" noValidate>
          <Input
            label="Name"
            name="name"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="message" className="text-sm font-medium text-[var(--color-neutral-800)]">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              aria-describedby={status === "error" ? "contact-error" : undefined}
              aria-invalid={status === "error" || undefined}
              className="rounded-md border border-[var(--color-neutral-200)] bg-[var(--color-neutral-0)] px-3 py-2 text-base text-[var(--color-neutral-800)] placeholder:text-[var(--color-neutral-400)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            />
          </div>

          {status === "error" && (
            <div
              id="contact-error"
              role="alert"
              className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700"
            >
              {errorMessage}{" "}
              <a href={mailtoHref} className="font-medium underline underline-offset-2">
                Open in email instead
              </a>
              .
            </div>
          )}

          <Button type="submit" isLoading={status === "loading"}>
            {status === "loading" ? "Sending…" : "Send message"}
          </Button>
        </form>
      )}
    </div>
  );
}
