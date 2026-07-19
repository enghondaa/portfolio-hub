import { Board } from "@/components/Board";
import { PersistenceBanner } from "@/components/PersistenceBanner";
import { Reveal } from "@/components/Reveal";

// The persistence banner reflects whether POSTGRES_URL is set, which can
// change without a code change, so this page must be evaluated per request
// rather than frozen at build time.
export const dynamic = "force-dynamic";

const FACTS = [
  { value: "5", label: "REST endpoints" },
  { value: "422", label: "with field errors" },
  { value: "17", label: "tests passing" },
  { value: "2", label: "storage backends" },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-20">
      <Reveal>
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--color-accent)]">
          / task board demo
        </p>
      </Reveal>

      <Reveal delay={0.06}>
        <h1 className="mt-5 font-[family-name:var(--font-heading)] text-[clamp(42px,7.5vw,86px)] font-bold leading-[0.95] tracking-[-0.035em] text-[var(--color-neutral-800)]">
          Drag it.
          <br />
          <span className="sheen">It actually saves.</span>
        </h1>
      </Reveal>

      <Reveal delay={0.12}>
        <p className="mt-7 max-w-xl text-[17px] leading-relaxed text-[var(--color-neutral-600)]">
          A real REST API behind a drag-and-drop board. Moves repaint instantly and roll
          back if the request fails, every write is Zod-validated at the route boundary,
          and the storage layer sits behind an adapter that runs on Postgres or in memory.
        </p>
      </Reveal>

      <Reveal delay={0.18}>
        <dl className="mt-9 flex flex-wrap gap-x-10 gap-y-5">
          {FACTS.map((fact) => (
            <div key={fact.label}>
              <dt className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-[var(--color-accent)]">
                {fact.value}
              </dt>
              <dd className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-neutral-400)]">
                {fact.label}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <Reveal delay={0.24}>
        <div className="mt-12">
          <PersistenceBanner />
        </div>
      </Reveal>

      <Reveal delay={0.3}>
        <div className="mt-6">
          <Board />
        </div>
      </Reveal>
    </div>
  );
}
