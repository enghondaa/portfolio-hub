/**
 * A compact provenance bar shown at the top of every demo: what it's built
 * with, where the source is, and the matching case study back in the hub.
 *
 * This same file exists in each demo app. It only references design tokens
 * (--color-accent, --color-neutral-*), and each app redefines those in its
 * own globals.css, so the identical markup renders in that app's palette
 * without any per-app styling.
 */
export function DemoStrip({
  stack,
  sourcePath,
  caseStudySlug,
}: {
  stack: string[];
  sourcePath: string;
  caseStudySlug: string;
}) {
  const repo = "https://github.com/enghondaa/portfolio-hub";
  const hub = "https://mohand-hub.vercel.app";

  return (
    <div className="border-b border-[var(--color-neutral-200)] bg-[var(--color-neutral-100)]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-5 py-2.5 sm:px-6">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-neutral-400)]">
          Built with
        </span>

        <div className="flex flex-wrap items-center gap-1.5">
          {stack.map((item) => (
            <span
              key={item}
              className="rounded-full bg-[var(--color-neutral-50)] px-2 py-0.5 font-mono text-[10px] text-[var(--color-neutral-600)]"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-3">
          <a
            href={`${repo}/tree/main/${sourcePath}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] text-[var(--color-neutral-600)] underline underline-offset-2 transition-colors hover:text-[var(--color-accent)]"
          >
            Source
          </a>
          <a
            href={`${hub}/projects/${caseStudySlug}`}
            className="font-mono text-[11px] text-[var(--color-neutral-600)] underline underline-offset-2 transition-colors hover:text-[var(--color-accent)]"
          >
            Case study
          </a>
        </div>
      </div>
    </div>
  );
}
