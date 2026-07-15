import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

const CONTACT_EMAIL = "eng.mohand2389@gmail.com";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Mohand Elshahawy — Senior Front-End Engineer.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="font-mono text-sm uppercase tracking-wide text-[var(--color-accent)]">Contact</p>
      <h1 className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight text-[var(--color-neutral-800)] sm:text-4xl">
        Get in touch
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-[var(--color-neutral-600)]">
        Send a message below, email me directly at{" "}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="select-all text-[var(--color-accent)] underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded"
        >
          {CONTACT_EMAIL}
        </a>
        , or find me on{" "}
        <a
          href="https://linkedin.com/in/mohand-elshahawy-b07523235"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--color-accent)] underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded"
        >
          LinkedIn
        </a>
        .
      </p>

      <ContactForm />
    </div>
  );
}
