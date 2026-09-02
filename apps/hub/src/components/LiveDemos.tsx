"use client";

import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { realProjects } from "@/lib/projects";

/** Tabbed live preview of the real production sites, embedded at ~60% scale inside a browser-chrome frame. Note: a couple of these sites may decline to be framed (X-Frame-Options/CSP) — the "Visit live site" overlay always works as a fallback. */
export function LiveDemos() {
  // Retired sites are excluded rather than framed. A dead URL in an iframe
  // renders as an empty rectangle, which reads as a broken portfolio rather
  // than as a site that has since been taken down.
  const liveProjects = realProjects.filter((project) => !project.retired);
  const [active, setActive] = useState(0);
  // Screenshots that 404 fall back to the live frame rather than showing a
  // broken image. That way a missing file degrades to the old behaviour
  // instead of to a hole in the page.
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const current = liveProjects[active] ?? liveProjects[0]!;
  const host = current.name;

  return (
    <section id="demos" className="mx-auto max-w-[1180px] scroll-mt-24 px-5 pb-16 sm:px-14 sm:pb-24">
      <Reveal>
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2.5">
          <h2 className="font-[family-name:var(--font-heading)] text-[clamp(30px,4.4vw,56px)] font-bold tracking-[-0.025em] text-[var(--color-neutral-800)]">
            Try them live
          </h2>
          <span className="font-mono text-xs text-[var(--color-neutral-600)]">/ click a preview to open it</span>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="mb-4 flex flex-wrap gap-2">
          {liveProjects.map((project, i) => (
            <button
              key={project.url}
              type="button"
              onClick={() => setActive(i)}
              className={
                i === active
                  ? "rounded-full border border-[var(--color-neutral-800)] bg-[var(--color-neutral-800)] px-4 py-2.5 font-mono text-xs font-medium text-[var(--color-neutral-0)] transition-colors duration-200"
                  : "rounded-full border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] px-4 py-2.5 font-mono text-xs font-medium text-[var(--color-neutral-600)] transition-colors duration-200"
              }
            >
              {project.name}
            </button>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="overflow-hidden rounded-3xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] shadow-[0_30px_70px_-40px_rgba(90,55,20,0.6)]">
          <div className="flex items-center gap-2 bg-[var(--color-neutral-800)] px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#e0674f]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#f0b35f]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#8fbf7f]" />
            <span className="flex-1 text-center font-mono text-xs text-[#cfc2b0]">{host}</span>
            <a href={current.url} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-[var(--color-accent-light)]">
              open ↗
            </a>
          </div>
          <div className="relative aspect-[16/9.5] overflow-hidden bg-[var(--color-neutral-50)]">
            {current.screenshot && !failed[current.url] ? (
              /* eslint-disable-next-line @next/next/no-img-element -- a plain
                 img keeps onError available, which is what drives the fallback
                 to the live frame when a screenshot has not been added yet. */
              <img
                key={current.screenshot}
                src={current.screenshot}
                alt={`${host} — screenshot of the running product`}
                loading="lazy"
                className="block h-full w-full object-cover object-top"
                onError={() => setFailed((prev) => ({ ...prev, [current.url]: true }))}
              />
            ) : (
              <iframe
                key={current.url}
                src={current.url}
                title={`Live preview of ${host}`}
                loading="lazy"
                className="pointer-events-none block border-0"
                style={{ width: "166.667%", height: "166.667%", transform: "scale(0.6)", transformOrigin: "0 0" }}
              />
            )}
            <a
              href={current.url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 flex items-end justify-end p-[18px] transition-colors duration-300 hover:bg-[rgba(42,32,23,0.05)]"
            >
              <span className="rounded-full bg-[var(--color-accent)] px-5 py-2.5 font-mono text-[13px] font-medium text-[var(--color-neutral-800)]">
                Visit live site ↗
              </span>
            </a>
          </div>
        </div>
        <p className="mt-3.5 px-1 font-mono text-[11.5px] text-[var(--color-neutral-400)]">
          / screenshots of the running products — three of these sit behind a
          sign-in, so the live page would only show you a login box
        </p>
      </Reveal>
    </section>
  );
}
