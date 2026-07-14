import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-start px-4 py-24 sm:px-6 sm:py-32">
      <p className="font-mono text-sm uppercase tracking-wide text-[var(--color-accent)]">404</p>
      <h1 className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight text-[var(--color-neutral-800)] sm:text-4xl">
        Nothing here.
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-[var(--color-neutral-600)]">
        The page you&apos;re looking for doesn&apos;t exist, or moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-11 items-center justify-center rounded-md bg-[var(--color-accent)] px-4 text-base font-medium text-[var(--color-neutral-0)] transition-colors duration-150 ease-out hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-neutral-0)]"
      >
        Back home
      </Link>
    </div>
  );
}
