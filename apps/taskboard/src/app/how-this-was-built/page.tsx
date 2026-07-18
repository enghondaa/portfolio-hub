import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How this was built",
  description: "The API design, optimistic-update strategy, and storage adapter behind this task board.",
  alternates: { canonical: "/how-this-was-built" },
};

export default function HowThisWasBuiltPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-14 sm:px-6 sm:py-20">
      <Link href="/" className="font-mono text-xs text-[var(--color-neutral-600)] hover:text-[var(--color-accent)]">
        ← Back to the board
      </Link>

      <h1 className="mt-6 font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-[var(--color-neutral-800)] sm:text-4xl">
        How this was built
      </h1>

      <div className="prose-article mt-8">
        <p>
          The board you just used is a React client talking to a real REST API.
          Nothing is faked in the browser: every drag, edit, and delete is an
          HTTP request that can succeed or fail, and the UI is written to
          handle both.
        </p>

        <h2>The API</h2>
        <p>
          Five endpoints, all Next.js Route Handlers:
        </p>
        <pre>{`GET    /api/tasks           list every task
POST   /api/tasks           create one
PATCH  /api/tasks/[id]      partial update
DELETE /api/tasks/[id]      remove one
POST   /api/tasks/reorder   persist a column's order`}</pre>
        <p>
          Each write endpoint validates its body with a Zod schema before
          touching storage. Invalid input comes back as <code>422</code> with
          field-level messages, not a generic <code>400</code>, so the form can
          show the error next to the field that caused it. Malformed JSON is a
          separate <code>400</code>. A missing id is <code>404</code>. A
          successful delete is <code>204</code> with no body.
        </p>
        <p>
          The reorder endpoint exists because dragging a card changes the
          position of every card below it. Sending one <code>PATCH</code> per
          affected card would mean a burst of requests for a single gesture, so
          the client sends the whole ordered id list for that column and the
          server writes it in one statement.
        </p>

        <h2>Optimistic updates</h2>
        <p>
          A drag repaints the board immediately, before the request resolves.
          The previous state is captured first, and if the request fails the
          board is restored and an error appears:
        </p>
        <pre>{`const previous = tasks;
setTasks(next);            // repaint now

try {
  await api.reorder(column, orderedIds);
} catch {
  setTasks(previous);      // put it back
  setError("That move didn't save.");
}`}</pre>
        <p>
          This is the part that separates a demo that feels real from one that
          doesn&apos;t. Waiting for a round trip before moving the card makes
          the board feel broken on a slow connection; moving it and never
          reconciling makes it lie about what was saved.
        </p>

        <h2>The storage adapter</h2>
        <p>
          Storage sits behind a <code>TaskStore</code> interface with two
          implementations. When <code>POSTGRES_URL</code> is set, the Postgres
          adapter runs, creating its schema on first use and doing the reorder
          as a single <code>UPDATE ... FROM unnest(...) WITH ORDINALITY</code>
          rather than a loop. Without it, an in-memory store takes over.
        </p>
        <p>
          The route handlers are written once against the interface and have no
          idea which one is live. That&apos;s the point of the pattern, and it
          also means this demo deploys and works with zero database
          provisioning. The trade-off is real: the in-memory board resets when
          the serverless function cold-starts. The banner on the board says so
          rather than letting you assume otherwise.
        </p>

        <h2>Accessibility</h2>
        <p>
          Drag and drop is powered by dnd-kit with both a pointer sensor and a
          keyboard sensor, so cards can be moved without a mouse. The form
          fields carry real labels, errors are announced through{" "}
          <code>role=&quot;alert&quot;</code>, and the whole app honours{" "}
          <code>prefers-reduced-motion</code>.
        </p>
      </div>
    </div>
  );
}
