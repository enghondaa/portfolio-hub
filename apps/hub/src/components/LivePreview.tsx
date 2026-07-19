/**
 * Fills the case-study hero with the actual running app rather than a static
 * screenshot: a lazy-loaded iframe scaled down inside a browser-chrome frame,
 * with a click-through overlay to open the real site in a new tab.
 *
 * Chosen over a screenshot because it can't go stale — it is always the live
 * deployment — and needs no binary assets. Some sites decline to be framed
 * (X-Frame-Options / CSP); the overlay link is the guaranteed path either way,
 * and projects with no live URL fall back to a labelled static panel.
 */
export function LivePreview({
  liveUrl,
  title,
  status,
}: {
  liveUrl?: string;
  title: string;
  status: "live" | "in-progress";
}) {
  if (!liveUrl) {
    return (
      <div className="mt-10 flex aspect-video w-full items-center justify-center rounded-3xl border border-dashed border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)]">
        <p className="font-mono text-sm text-[var(--color-neutral-400)]">
          {status === "live" ? "Live demo" : "In progress — no live URL yet"}
        </p>
      </div>
    );
  }

  const host = liveUrl.replace(/^https?:\/\//, "");

  return (
    <div className="mt-10 overflow-hidden rounded-3xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] shadow-[0_30px_70px_-45px_rgba(90,55,20,0.55)]">
      <div className="flex items-center gap-2 bg-[var(--color-neutral-800)] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#e0674f]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#f0b35f]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#8fbf7f]" />
        <span className="flex-1 truncate text-center font-mono text-xs text-[#cfc2b0]">{host}</span>
        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-[var(--color-accent-light)]"
        >
          open ↗
        </a>
      </div>
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-neutral-50)]">
        <iframe
          src={liveUrl}
          title={`Live preview of ${title}`}
          loading="lazy"
          className="pointer-events-none block border-0"
          style={{ width: "166.667%", height: "166.667%", transform: "scale(0.6)", transformOrigin: "0 0" }}
        />
        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open the live ${title} demo in a new tab`}
          className="absolute inset-0 flex items-end justify-end p-4 transition-colors duration-300 hover:bg-[rgba(42,32,23,0.06)]"
        >
          <span className="rounded-full bg-[var(--color-accent)] px-5 py-2.5 font-mono text-[13px] font-medium text-[var(--color-neutral-800)]">
            Open live demo ↗
          </span>
        </a>
      </div>
    </div>
  );
}
