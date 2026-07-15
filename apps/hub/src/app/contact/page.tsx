import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { ContactCTA } from "@/components/ContactCTA";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Mohand Elshahawy — Full-Stack Developer.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-6 sm:py-24">
      <ContactCTA />

      <Reveal delay={0.1}>
        <div className="mx-auto mt-14 max-w-xl rounded-3xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] p-7 shadow-[0_22px_50px_-34px_rgba(90,55,20,0.5)] sm:p-9">
          <p className="font-mono text-xs text-[var(--color-accent)]">/ or send a message</p>
          <h2 className="mt-3 font-[family-name:var(--font-heading)] text-2xl font-bold tracking-[-0.02em] text-[var(--color-neutral-800)]">
            Drop me a note
          </h2>
          <ContactForm />
        </div>
      </Reveal>
    </div>
  );
}
