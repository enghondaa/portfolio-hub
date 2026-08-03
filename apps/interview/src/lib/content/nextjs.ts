import type { TopicContent } from '@/types';

export const nextjsContent: TopicContent[] = [
  {
    id: 'app-router',
    moduleId: 'nextjs',
    title: 'App Router Architecture',
    description: 'File-based routing, layouts, loading states, error handling, and all route conventions',
    estimatedTime: '50 min',
    sections: [
      {
        title: 'File Conventions',
        content: `The App Router uses the filesystem to define routes. Special filenames have specific meanings:

| File | Purpose |
|------|---------|
| \`page.tsx\` | Route UI — makes the segment publicly accessible |
| \`layout.tsx\` | Shared UI that wraps pages, persists between navigations |
| \`loading.tsx\` | Loading UI — instant loading state with Suspense |
| \`error.tsx\` | Error UI — error boundary for the segment |
| \`not-found.tsx\` | 404 UI for the segment |
| \`route.ts\` | API endpoint (replaces pages/api) |
| \`template.tsx\` | Like layout but re-mounts on navigation |
| \`default.tsx\` | Fallback for parallel routes |

**Key insight:** layout.tsx wraps its children (including nested layouts) without re-mounting on navigation. This preserves state and subscriptions.`,
      },
      {
        title: 'Dynamic Routes',
        content: `| Pattern | Matches | Params |
|---------|---------|--------|
| \`[slug]\` | \`/blog/hello\` | \`{ slug: 'hello' }\` |
| \`[...slug]\` | \`/blog/a/b/c\` | \`{ slug: ['a', 'b', 'c'] }\` |
| \`[[...slug]]\` | \`/blog\` or \`/blog/a/b\` | \`{}\` or \`{ slug: ['a', 'b'] }\` |

**Route Groups:** \`(marketing)/page.tsx\` — parentheses don't affect URL, used to organize routes or apply layouts to subsets.

**Parallel Routes:** \`@modal/page.tsx\` — render multiple pages in the same layout simultaneously (modals, dashboards).

**Intercepting Routes:** \`(..)photo/[id]/page.tsx\` — render a route in the context of another (photo modal on scroll, full page on direct visit).`,
      },
    ],
    codeExamples: [
      {
        title: 'Complete routing setup with all conventions',
        language: 'typescript',
        code: `// app/layout.tsx — Root layout (required)
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: { template: '%s | MyApp', default: 'MyApp' },
  description: 'My Next.js application',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav>...</nav>
        <main>{children}</main>
        <footer>...</footer>
      </body>
    </html>
  );
}

// app/page.tsx — Home page (/)
export default function HomePage() {
  return <h1>Home</h1>;
}

// app/blog/[slug]/page.tsx — Dynamic blog post
import { notFound } from 'next/navigation';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const posts = await fetchAllPosts();
  return posts.map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props) {
  const post = await fetchPost(params.slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPost({ params }: Props) {
  const post = await fetchPost(params.slug);
  if (!post) notFound();
  return <article><h1>{post.title}</h1><div>{post.content}</div></article>;
}

// app/blog/[slug]/loading.tsx — Shown while page data loads
export default function PostLoading() {
  return <div className="animate-pulse">Loading post...</div>;
}

// app/blog/[slug]/error.tsx — Error boundary for this route
'use client'; // error.tsx must be a Client Component
import { useEffect } from 'react';

export default function PostError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong loading this post</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}`,
        explanation: 'Each file convention serves a specific purpose. Layouts persist between navigations; loading/error are automatic Suspense/ErrorBoundary wrappers.',
      },
      {
        title: 'Parallel and Intercepting Routes for modals',
        language: 'typescript',
        code: `// app/layout.tsx — parallel route slot
export default function Layout({
  children,
  modal, // @modal slot
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modal} {/* Modal renders here, on top of page */}
    </>
  );
}

// app/@modal/default.tsx — required when slot is not active
export default function ModalDefault() {
  return null;
}

// app/@modal/(.)photo/[id]/page.tsx — intercepting route
// "(.) " means intercept same-level route
'use client';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal';

export default function PhotoModal({ params }: { params: { id: string } }) {
  const router = useRouter();
  return (
    <Modal onClose={() => router.back()}>
      <Photo id={params.id} />
    </Modal>
  );
}

// app/photo/[id]/page.tsx — actual full page
export default function PhotoPage({ params }: { params: { id: string } }) {
  return <div><Photo id={params.id} /></div>;
}

// Navigation behavior:
// - Click photo link from feed → shows modal (intercepted)
// - Direct URL visit /photo/123 → shows full page (not intercepted)
// - Refresh → shows full page (soft nav gone)`,
        explanation: 'Parallel routes render multiple pages simultaneously. Intercepting routes show modals for client nav but full pages on direct visit.',
      },
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between layout.tsx and template.tsx?',
        answer: `Both wrap child pages, but they differ in behavior between navigations:

**\`layout.tsx\`:**
- Persists between navigations for same-level routes
- Does NOT re-mount or re-render when navigating between children
- State is preserved
- Use for: navigation bars, sidebars, persistent UI

**\`template.tsx\`:**
- Creates a NEW instance for each navigation
- Re-mounts and re-renders on each navigation
- State is NOT preserved between navigations
- Use for: enter/exit animations, resetting state per page, analytics page view tracking

Example: If you have a sidebar with a scroll position, use \`layout.tsx\` to preserve the scroll position when navigating. If you want a page transition animation that triggers on each navigation, use \`template.tsx\`.`,
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'server-client-components',
    moduleId: 'nextjs',
    title: 'Server vs Client Components',
    description: 'Understanding the boundary, composition patterns, and when to use each',
    estimatedTime: '55 min',
    sections: [
      {
        title: 'The "use client" Boundary',
        content: `In Next.js App Router, **all components are Server Components by default**. Add \`"use client"\` to the top of a file to make it (and all its imports) Client Components.

**"use client" marks a boundary, not a component:**
- Everything "above" (closer to the root) without the directive is a Server Component
- Everything "below" (in the subtree) after a "use client" file is a Client Component
- You can pass Server Component JSX into Client Components as \`children\` props — this works!

**What cannot cross the server-to-client boundary:**
- Functions that are not serializable
- Class instances
- Closures
- React-specific objects (JSX)
- Only: strings, numbers, objects, arrays, Date, null, undefined`,
      },
      {
        title: 'Decision Tree: Server vs Client',
        content: `**Use Server Component when:**
- Fetching data
- Accessing backend resources directly
- Keeping sensitive info on server (API keys, secrets)
- Large dependencies that would bloat the client bundle
- No interactivity, no hooks, no browser APIs needed

**Use Client Component when:**
- Using \`useState\`, \`useEffect\`, or other hooks
- Using browser APIs (localStorage, window, geolocation)
- Event listeners (onClick, onChange)
- Real-time updates (WebSocket)
- Class-based React features

**Golden rule:** Push "use client" as deep in the tree as possible. Keep the vast majority of your app as Server Components.`,
      },
    ],
    codeExamples: [
      {
        title: 'Server parent with Client children — the right pattern',
        language: 'typescript',
        code: `// app/dashboard/page.tsx — Server Component
import { db } from '@/lib/db';
import ClientChart from '@/components/ClientChart';
import AddItemButton from '@/components/AddItemButton';

export default async function DashboardPage() {
  // Fetch data on the server — no loading states, no useEffect
  const [stats, items] = await Promise.all([
    db.stats.findFirst(),
    db.item.findMany({ orderBy: { createdAt: 'desc' } }),
  ]);

  return (
    <div>
      {/* Server-rendered static content — no JS */}
      <h1>Dashboard</h1>
      <p>Total items: {items.length}</p>

      {/* Client component receives serializable data */}
      <ClientChart data={stats} />

      {/* Server renders the list; button is interactive */}
      <ul>
        {items.map(item => <li key={item.id}>{item.name}</li>)}
      </ul>
      <AddItemButton />
    </div>
  );
}

// components/ClientChart.tsx — Client Component
'use client';
import { useState } from 'react';
import { BarChart } from 'recharts'; // large library — fine, only in client bundle

interface Stats { views: number; clicks: number; }

export default function ClientChart({ data }: { data: Stats }) {
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  return (
    <div>
      <button onClick={() => setChartType(t => t === 'bar' ? 'line' : 'bar')}>
        Toggle chart type
      </button>
      <BarChart data={[data]} />
    </div>
  );
}

// components/AddItemButton.tsx — Client Component
'use client';
import { useState } from 'react';

export default function AddItemButton() {
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    await fetch('/api/items', { method: 'POST' });
    setLoading(false);
  };

  return (
    <button onClick={handleAdd} disabled={loading}>
      {loading ? 'Adding...' : 'Add Item'}
    </button>
  );
}`,
        explanation: 'Server Component fetches data and renders structure. Client Components handle interactivity. Data is passed as props across the boundary.',
      },
      {
        title: 'Passing Server Components as children to Client Components',
        language: 'typescript',
        code: `// This is the key pattern that lets you compose Server + Client

// components/ClientModal.tsx — Client Component
'use client';
import { useState, ReactNode } from 'react';

export default function ClientModal({ trigger, children }: {
  trigger: string;
  children: ReactNode; // Server component JSX can be passed here!
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>{trigger}</button>
      {open && (
        <div className="modal">
          <button onClick={() => setOpen(false)}>Close</button>
          {children} {/* Rendered as-is — already computed on server */}
        </div>
      )}
    </>
  );
}

// app/page.tsx — Server Component
import ClientModal from '@/components/ClientModal';
import { db } from '@/lib/db';

export default async function Page() {
  const user = await db.user.findFirst(); // Server-side

  return (
    // Pass Server Component JSX as children to Client Component
    // The user data is already fetched — ClientModal just renders it
    <ClientModal trigger="View Profile">
      <div> {/* This JSX was computed on the server */}
        <img src={user.avatar} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.bio}</p>
      </div>
    </ClientModal>
  );
}`,
        explanation: 'Server Component JSX can be passed as children to Client Components. It\'s already rendered to a description; the client just places it.',
      },
    ],
    interviewQuestions: [
      {
        question: 'Explain Server Components. What are their benefits and limitations?',
        answer: `**Server Components** run exclusively on the server and send HTML to the client with no corresponding JavaScript bundle.

**Benefits:**
1. **Zero client JS** — no hydration, no client runtime for these components
2. **Direct server access** — query database, read files, use secrets without API routes
3. **Smaller bundle** — large server-only dependencies don't ship to client
4. **Better performance** — no network waterfall for data (fetched during render)

**Limitations:**
1. **No hooks** — useState, useEffect, useRef, etc. are client-only
2. **No browser APIs** — window, document, localStorage
3. **No event handlers** — onClick, onChange
4. **No real-time updates** — can't subscribe to WebSocket from server
5. **Not interactive** — they're static from the client's perspective

**How to add interactivity:** Import Client Components (\`"use client"\`) into Server Components. Server Components fetch/structure data; Client Components handle interaction.

**In Next.js:** All components in App Router are Server Components by default. \`"use client"\` opts into the client component model.`,
        difficulty: 'hard',
      },
    ],
  },
  {
    id: 'caching',
    moduleId: 'nextjs',
    title: 'Caching in Next.js',
    description: 'The most complex Next.js topic — all 4 caching layers explained clearly',
    estimatedTime: '65 min',
    sections: [
      {
        title: 'Overview — 4 Caching Layers',
        content: `Next.js has 4 independent caching mechanisms. Understanding them is crucial:

| Layer | What's cached | Where | Duration |
|-------|--------------|-------|----------|
| **Request Memoization** | \`fetch()\` return values | Server (per-request) | Single request |
| **Data Cache** | \`fetch()\` responses | Server (persistent) | Until revalidated |
| **Full Route Cache** | Rendered HTML + RSC payload | Server (persistent) | Until revalidated |
| **Router Cache** | RSC payload | Client (in-memory) | Session / 30s or 5min |

These layers build on each other. Understanding each one prevents the "why is my data stale?" confusion.`,
      },
      {
        title: 'Request Memoization',
        content: `**What:** Within a single server request, identical \`fetch()\` calls are memoized. Call \`fetch('/api/user/1')\` in 10 components — it hits the network only once.

**Scope:** Single request only. Doesn't persist between requests.

**Why it matters:** Server Components often need the same data (current user, site config). Without this, you'd have duplicate network calls. With this, you can fetch where you need it without worrying about duplication.

**Only applies to:** \`fetch()\` GET requests. Not POST, not database calls (use React's \`cache()\` function for those).`,
      },
      {
        title: 'Data Cache',
        content: `**What:** \`fetch()\` responses are cached persistently on the server. Survives across requests and deployments (on Vercel).

**Default behavior:** \`fetch()\` in Server Components is cached by default (\`cache: 'force-cache'\`).

**Opt out:** \`fetch(url, { cache: 'no-store' })\` — fresh data every request
**Time-based:** \`fetch(url, { next: { revalidate: 60 } })\` — ISR-style, revalidate every 60s

**Tagged revalidation:**
\`\`\`js
fetch(url, { next: { tags: ['posts'] } }); // tag the cache entry
revalidateTag('posts'); // invalidate all entries with this tag
\`\`\``,
      },
      {
        title: 'Full Route Cache',
        content: `**What:** Complete rendered HTML + RSC payload cached on the server. Served instantly without re-rendering.

**When:** Routes are statically rendered at build time (or first request for dynamic routes).

**Invalidated by:**
- \`revalidatePath('/blog')\` — next request re-renders the route
- \`revalidateTag('posts')\` — any fetch tagged 'posts' is re-fetched
- A route becoming dynamic (cookies(), headers(), searchParams, etc. make route dynamic)

**Dynamic routes (opt out of Full Route Cache):**
- Using \`cookies()\` or \`headers()\` in a Server Component
- Using \`searchParams\` prop
- Calling \`noStore()\` from \`next/cache\``,
      },
      {
        title: 'Router Cache (Client-Side)',
        content: `**What:** The client caches RSC payloads in memory. Navigation to cached routes is instant — no server round trip.

**Duration:**
- Static segments: 5 minutes
- Dynamic segments: 30 seconds

**Why it exists:** Enable instant back/forward navigation within a session.

**Opt out:** Hard to opt out of completely. \`router.refresh()\` clears it for the current route.

**Important:** This is a separate cache from the Data Cache. Data Cache is on the server; Router Cache is in the browser.`,
      },
    ],
    codeExamples: [
      {
        title: 'Controlling the Data Cache',
        language: 'typescript',
        code: `// app/blog/page.tsx

// 1. DEFAULT: cached indefinitely (force-cache)
async function fetchPostsCached() {
  const res = await fetch('https://api.example.com/posts');
  return res.json();
}

// 2. NO CACHE: fresh on every request
async function fetchPostsFresh() {
  const res = await fetch('https://api.example.com/posts', {
    cache: 'no-store',
  });
  return res.json();
}

// 3. ISR-STYLE: revalidate every 60 seconds
async function fetchPostsISR() {
  const res = await fetch('https://api.example.com/posts', {
    next: { revalidate: 60 },
  });
  return res.json();
}

// 4. TAGGED: revalidate when specific tag is invalidated
async function fetchPostsTagged() {
  const res = await fetch('https://api.example.com/posts', {
    next: { tags: ['posts'] },
  });
  return res.json();
}

export default async function BlogPage() {
  const posts = await fetchPostsTagged();
  return (
    <ul>
      {posts.map(post => <li key={post.id}>{post.title}</li>)}
    </ul>
  );
}

// Route handler that revalidates after mutation
// app/api/posts/route.ts
import { revalidateTag, revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  const body = await request.json();
  await createPost(body);

  // Invalidate all fetches tagged 'posts'
  revalidateTag('posts');
  // OR: re-render a specific path
  revalidatePath('/blog');

  return Response.json({ success: true });
}`,
        explanation: 'Four modes of fetch caching. Tagged revalidation lets mutations trigger precise cache invalidation.',
      },
      {
        title: 'cache() for non-fetch server data',
        language: 'typescript',
        code: `import { cache } from 'react';
import { db } from '@/lib/db';

// cache() = request memoization for non-fetch calls
// Multiple components calling getUser(1) in one request = one DB query
export const getUser = cache(async (id: string) => {
  console.log('DB query for user:', id); // only logs once per request even if called multiple times
  return db.user.findUnique({ where: { id } });
});

// app/page.tsx
export default async function Page() {
  const user = await getUser('1'); // hits DB
  return (
    <div>
      <UserProfile userId="1" /> {/* calls getUser('1') again — cache hit! */}
      <p>{user.name}</p>
    </div>
  );
}

// components/UserProfile.tsx
export async function UserProfile({ userId }: { userId: string }) {
  const user = await getUser(userId); // cache hit — no DB query
  return <div>{user.name}</div>;
}`,
        explanation: 'React\'s cache() deduplicates non-fetch async calls within a request — like automatic request memoization for database queries.',
      },
      {
        title: 'Understanding dynamic vs static routes',
        language: 'typescript',
        code: `// STATIC route — cached at build time (Full Route Cache)
export default async function BlogPage() {
  const posts = await fetch('https://api/posts', { next: { revalidate: 3600 } }).then(r => r.json());
  return <PostList posts={posts} />;
}
// This page is rendered once, cached, served instantly

// DYNAMIC route — rendered per request (no Full Route Cache)
import { cookies, headers } from 'next/headers';

export default async function DashboardPage() {
  const cookieStore = cookies(); // This OPTS OUT of Full Route Cache
  const token = cookieStore.get('auth-token');
  const user = await fetchUser(token?.value);
  return <Dashboard user={user} />;
}

// Also dynamic:
export default async function SearchPage({
  searchParams, // accessing searchParams makes route dynamic
}: {
  searchParams: { q: string };
}) {
  const results = await search(searchParams.q);
  return <ResultsList results={results} />;
}

// Force dynamic rendering explicitly:
import { unstable_noStore as noStore } from 'next/cache';

export default async function AlwaysFreshPage() {
  noStore(); // opt out explicitly
  const data = await fetchData();
  return <div>{data.value}</div>;
}`,
        explanation: 'Using cookies(), headers(), or searchParams makes a route dynamic (rendered per request). Static routes are pre-rendered and cached.',
      },
    ],
    interviewQuestions: [
      {
        question: 'Explain the 4 caching layers in Next.js.',
        answer: `Next.js has 4 caching layers that work together:

**1. Request Memoization (Server, per-request):**
Deduplicates identical \`fetch()\` calls within a single request. If 5 components fetch \`/api/user/1\`, it's only fetched once. Cleared after the request completes.

**2. Data Cache (Server, persistent):**
Stores \`fetch()\` responses on the server, persisting between requests. Default is \`force-cache\`. Opt out with \`cache: 'no-store'\` or set TTL with \`next: { revalidate: 60 }\`. Invalidated by \`revalidateTag\` or \`revalidatePath\`.

**3. Full Route Cache (Server, persistent):**
Caches the entire rendered HTML + RSC payload. Static routes are cached at build time. Made dynamic (bypassed) when you use \`cookies()\`, \`headers()\`, or dynamic data.

**4. Router Cache (Client, in-memory):**
Browser caches RSC payloads for visited routes. Enables instant back/forward navigation. Duration: 5min for static, 30s for dynamic. Cleared with \`router.refresh()\`.

**Common issue:** Data updated in the database doesn't appear because the Data Cache or Full Route Cache serves stale data. Fix: call \`revalidateTag\` or \`revalidatePath\` after mutations.`,
        difficulty: 'hard',
      },
    ],
  },
  {
    id: 'data-fetching',
    moduleId: 'nextjs',
    title: 'Data Fetching Patterns',
    description: 'Server Components, Route Handlers, Server Actions, streaming, and all data patterns',
    estimatedTime: '60 min',
    sections: [
      {
        title: 'Server Components for Data Fetching',
        content: `The primary data fetching pattern in App Router: fetch data directly in async Server Components.

**Benefits over useEffect fetching:**
- No loading state boilerplate
- No client-side waterfall (data + component JS in one trip)
- Can use secrets/credentials server-side
- Data is included in initial HTML — no layout shift`,
      },
      {
        title: 'Server Actions',
        content: `**Server Actions** are async functions that run on the server, callable directly from client components. No manual API routes needed for mutations.

\`"use server"\` marks a function (or entire file) as a Server Action.

**Use Server Actions for:**
- Form submissions
- Data mutations (create, update, delete)
- Server-side operations triggered by UI
- Can be called from form \`action\` prop or event handlers`,
      },
    ],
    codeExamples: [
      {
        title: 'All data fetching patterns',
        language: 'typescript',
        code: `// 1. SEQUENTIAL — each awaits the previous
async function SequentialPage({ id }: { id: string }) {
  const user = await fetchUser(id);      // first
  const posts = await fetchPosts(user.id); // depends on user.id
  return <div>{user.name} has {posts.length} posts</div>;
}

// 2. PARALLEL — start all fetches simultaneously
async function ParallelPage({ id }: { id: string }) {
  const [user, settings, notifications] = await Promise.all([
    fetchUser(id),
    fetchSettings(id),
    fetchNotifications(id),
  ]);
  return <Dashboard user={user} settings={settings} notifications={notifications} />;
}

// 3. STREAMING — show content progressively with Suspense
import { Suspense } from 'react';

export default async function StreamingPage({ id }: { id: string }) {
  return (
    <div>
      {/* Fast content loads first */}
      <Suspense fallback={<UserSkeleton />}>
        <UserProfile id={id} />
      </Suspense>

      {/* Slow content streams in later */}
      <Suspense fallback={<PostsSkeleton />}>
        <UserPosts id={id} />
      </Suspense>
    </div>
  );
}

// UserProfile and UserPosts are async Server Components
async function UserProfile({ id }: { id: string }) {
  const user = await fetchUser(id); // slow or fast — doesn't block other content
  return <div>{user.name}</div>;
}

// 4. ROUTE HANDLERS (API routes in App Router)
// app/api/users/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const user = await db.user.findUnique({ where: { id: id! } });
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(user);
}

export async function POST(request: Request) {
  const body = await request.json();
  const user = await db.user.create({ data: body });
  return NextResponse.json(user, { status: 201 });
}`,
        explanation: 'Sequential for dependent data, parallel for independent, streaming for progressive loading.',
      },
      {
        title: 'Server Actions for mutations',
        language: 'typescript',
        code: `// lib/actions.ts — Server Actions file
'use server'; // entire file is server actions

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const CreatePostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(10),
});

export async function createPost(prevState: any, formData: FormData) {
  const validated = CreatePostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
  });

  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors };
  }

  try {
    await db.post.create({ data: validated.data });
    revalidatePath('/blog');
    redirect('/blog'); // redirect after success
  } catch (error) {
    return { error: { _form: ['Failed to create post'] } };
  }
}

// components/CreatePostForm.tsx — Client Component using Server Action
'use client';
import { useFormState, useFormStatus } from 'react-dom';
import { createPost } from '@/lib/actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending}>{pending ? 'Creating...' : 'Create Post'}</button>;
}

export default function CreatePostForm() {
  const [state, formAction] = useFormState(createPost, null);

  return (
    <form action={formAction}>
      <input name="title" placeholder="Post title" />
      {state?.error?.title && <p>{state.error.title}</p>}

      <textarea name="content" placeholder="Post content" />
      {state?.error?.content && <p>{state.error.content}</p>}

      {state?.error?._form && <p>{state.error._form}</p>}
      <SubmitButton />
    </form>
  );
}`,
        explanation: 'Server Actions run on the server, called from forms. useFormState handles pending/error state. No manual API route needed.',
      },
    ],
    interviewQuestions: [
      {
        question: 'What are Server Actions and when would you use them over API routes?',
        answer: `**Server Actions** are async server-side functions that can be called directly from Client Components. They eliminate the need for API routes for mutations.

**Use Server Actions when:**
- Form submissions that need server-side processing
- Simple CRUD mutations (create, update, delete)
- Operations that need to revalidate Next.js cache after mutation
- You want progressive enhancement (works without JavaScript)

**Use API Routes (Route Handlers) when:**
- Third-party webhooks need to call your endpoint
- You need the URL to be callable from outside your app
- You need full control over the HTTP response (status codes, headers)
- Building a public API consumed by mobile apps or external services

**Key advantages of Server Actions:**
1. No manual API client code needed — call the function directly
2. Type safety end-to-end (TypeScript)
3. Automatic CSRF protection
4. Works with HTML \`<form>\` natively (progressive enhancement)
5. Easy cache invalidation with \`revalidatePath\`/\`revalidateTag\``,
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'rendering',
    moduleId: 'nextjs',
    title: 'Rendering Strategies',
    description: 'Static, Dynamic, Streaming, ISR, and PPR — choosing the right strategy',
    estimatedTime: '50 min',
    sections: [
      {
        title: 'Decision Matrix',
        content: `| Strategy | When rendered | Cached | Use for |
|----------|--------------|--------|---------|
| **Static (default)** | Build time | Yes | Blog posts, marketing pages |
| **Dynamic** | Every request | No | User dashboards, authenticated pages |
| **ISR** | Build + background revalidation | Yes (TTL) | Product pages, frequently-updated content |
| **Streaming** | Per-request, incrementally | Partial | Dashboards with slow + fast data |
| **PPR** | Static shell + dynamic islands | Partial | Best of both worlds |

**What makes a route dynamic automatically:**
- Accessing \`cookies()\` or \`headers()\`
- Using \`searchParams\`
- Calling \`unstable_noStore()\`
- Any dynamic segment that isn't pre-generated`,
      },
    ],
    codeExamples: [
      {
        title: 'All rendering strategies in practice',
        language: 'typescript',
        code: `// 1. STATIC RENDERING (default)
// Built once, served from CDN
export default async function StaticBlogPost({ params }: { params: { slug: string } }) {
  const post = await fetch(\`https://api/posts/\${params.slug}\`, {
    cache: 'force-cache', // cached indefinitely
  }).then(r => r.json());
  return <article>{post.content}</article>;
}

// 2. ISR — Revalidate every hour
export const revalidate = 3600; // seconds

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await fetch(\`https://api/products/\${params.id}\`).then(r => r.json());
  return <div>{product.name}: \${product.price}</div>;
}

// 3. DYNAMIC — Per-request, never cached
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic'; // explicit, or use cookies()/headers()

export default async function DashboardPage() {
  const session = cookies().get('session');
  const user = await fetchUserFromSession(session?.value);
  return <UserDashboard user={user} />;
}

// 4. STREAMING — Progressive loading
import { Suspense } from 'react';

export default function DashboardWithStreaming() {
  return (
    <div>
      {/* Fast: static content loads immediately */}
      <h1>Dashboard</h1>

      {/* Slow: streams in when ready */}
      <Suspense fallback={<RevenueChartSkeleton />}>
        <RevenueChart /> {/* fetches slow analytics data */}
      </Suspense>

      <Suspense fallback={<LatestInvoicesSkeleton />}>
        <LatestInvoices /> {/* fetches latest invoices */}
      </Suspense>
    </div>
  );
}

// 5. generateStaticParams — pre-generate dynamic routes
export async function generateStaticParams() {
  const posts = await fetch('https://api/posts').then(r => r.json());
  return posts.map((post: { slug: string }) => ({ slug: post.slug }));
}
// Generates /blog/hello, /blog/world, etc. at build time
// Unknown slugs are rendered on-demand and cached`,
        explanation: 'Each strategy suits different content types. Streaming combines static shell with dynamic data for best UX.',
      },
    ],
    interviewQuestions: [
      {
        question: 'What is SSR (Server-Side Rendering)? Explain in detail.',
        answer: `**SSR** means HTML is generated on the server for every incoming request, then sent to the browser. The browser receives fully-rendered HTML — no blank page waiting for JavaScript to run.

**How it works step by step:**
1. User requests a page (e.g. \`/products/42\`)
2. Server receives the request
3. Server fetches any required data (database, API)
4. React renders the component tree to an HTML string on the server
5. Server sends the complete HTML to the browser
6. Browser displays the HTML immediately (fast First Contentful Paint)
7. React **hydrates** — attaches event listeners to the server-rendered HTML
8. Page becomes fully interactive

**SSR vs CSR vs SSG:**
- **CSR (Client-Side Rendering):** Browser downloads empty HTML + JS bundle, renders everything client-side. Slow initial load, bad SEO.
- **SSR:** HTML generated per-request on server. Fast FCP, great SEO, but server cost per request.
- **SSG (Static Site Generation):** HTML generated at build time. Fastest delivery (CDN cached), but data can be stale.

**In Next.js App Router — SSR is \`dynamic\`:**
\`\`\`js
export const dynamic = 'force-dynamic'; // SSR every request
// OR just use cookies()/headers() — Next.js auto-detects dynamic

export default async function Page() {
  const data = await fetch('https://api/data', { cache: 'no-store' }); // no-store = SSR
  return <div>{data}</div>;
}
\`\`\`

**When to use SSR:**
- Personalized content (user dashboard, account pages)
- Real-time data that must be fresh on every request
- Pages that depend on request data (cookies, headers, search params)
- When SEO matters AND content changes frequently`,
        difficulty: 'medium',
      },
      {
        question: 'Is Next.js good for SEO? Why?',
        answer: `**Yes — Next.js is excellent for SEO**, primarily because it solves the biggest SEO problem with React: search engine crawlers struggle to index JavaScript-rendered content.

**Why Next.js helps SEO:**

**1. Server-rendered HTML:** Crawlers (Googlebot, Bing) receive complete HTML with content already in it. No need to execute JavaScript to discover content.

**2. Built-in Metadata API:**
\`\`\`js
export const metadata = {
  title: 'Product Name | Store',
  description: 'Detailed product description for search snippets',
  openGraph: { title: '...', images: ['/og-image.jpg'] },
  alternates: { canonical: 'https://mysite.com/products/42' },
};
\`\`\`

**3. Static Generation (SSG):** Pre-rendered pages are instantly available — no server processing delay. Google scores page speed as a ranking factor.

**4. Automatic sitemap support:** Easy to generate \`sitemap.xml\` and \`robots.txt\` via route handlers.

**5. Image optimization:** \`next/image\` automatically serves WebP, correct sizes, with lazy loading — all Core Web Vitals factors that affect ranking.

**6. Fast Core Web Vitals:** LCP, CLS, INP — all improve with SSR/SSG + optimized assets.

**Caveat:** SSR/SSG only helps if you use them. A Next.js app that client-side renders everything is no better than plain React for SEO.`,
        difficulty: 'easy',
      },
      {
        question: 'What is ISR and how does it work in Next.js App Router?',
        answer: `**ISR (Incremental Static Regeneration)** lets you update static pages after build without rebuilding the entire site.

**In App Router:**

**Time-based revalidation:**
\`\`\`js
export const revalidate = 60; // revalidate this route every 60 seconds
// OR per-fetch:
fetch(url, { next: { revalidate: 60 } })
\`\`\`

**How it works:**
1. Route is statically rendered and cached
2. After TTL expires, next request triggers background re-render
3. The STALE cached version is served while re-rendering happens
4. Once re-rendered, the new version replaces the cache
5. Users always get fast responses (even when stale)

**On-demand revalidation:**
\`\`\`js
revalidatePath('/blog/[slug]'); // re-render specific path
revalidateTag('blog-posts');   // re-render all with this tag
\`\`\`

**Use for:** Product pages, blog posts, pricing pages — content that changes occasionally but must be fast to serve.`,
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'middleware',
    moduleId: 'nextjs',
    title: 'Middleware',
    description: 'Authentication, redirects, geolocation routing, and rate limiting with Next.js Middleware',
    estimatedTime: '35 min',
    sections: [
      {
        title: 'What Middleware Can Do',
        content: `Next.js Middleware runs before a request is completed. It runs on the **Edge Runtime** (globally distributed, fast).

**Capabilities:**
- Redirect and rewrite requests
- Modify request/response headers
- Check cookies for authentication
- A/B testing (route to different pages based on logic)
- Geolocation routing
- Bot protection
- Rate limiting

**Limitations (Edge Runtime):**
- No Node.js APIs (no fs, no native modules)
- No database connections (use external APIs)
- Small bundle size limit

**Location:** \`middleware.ts\` in the project root (or \`src/\` if using src dir).`,
      },
    ],
    codeExamples: [
      {
        title: 'Authentication middleware',
        language: 'typescript',
        code: `// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth'; // Edge-compatible JWT verification

const PUBLIC_PATHS = ['/', '/login', '/register', '/about'];
const API_PATHS = ['/api/public'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some(path => pathname === path)) {
    return NextResponse.next();
  }

  // Allow public API endpoints
  if (API_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check auth token
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    // Redirect to login with return URL
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const payload = await verifyToken(token);

    // Add user info to headers for downstream use
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.userId);
    requestHeaders.set('x-user-role', payload.role);

    // Role-based access control
    if (pathname.startsWith('/admin') && payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next({ request: { headers: requestHeaders } });
  } catch {
    // Invalid token
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth-token');
    return response;
  }
}

// Only run middleware on specific paths
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};`,
        explanation: 'Middleware intercepts requests before they reach pages. Perfect for auth gates, role checks, and header injection.',
      },
    ],
    interviewQuestions: [
      {
        question: 'What can Next.js Middleware do and what are its limitations?',
        answer: `**Middleware can:**
- Read and write cookies (for auth session checks)
- Redirect and rewrite requests
- Modify request/response headers
- Run conditional logic based on URL, cookies, headers, geolocation
- A/B test by routing users to different pages

**Key limitation — Edge Runtime:**
Middleware runs on the Edge Runtime (V8 isolates, not Node.js), so:
- No Node.js built-in modules (\`fs\`, \`crypto\`, \`path\`)
- No native npm modules with C++ bindings
- No direct database connections (no \`prisma\`, \`pg\`, etc.)
- Bundle size limit (~1MB)

**Auth in middleware:** You can verify JWTs (jose library is Edge-compatible) but cannot query databases. Pattern: verify the JWT signature + claims in middleware, do actual user lookup in the route.

**matcher config:** Always configure \`export const config = { matcher: [...] }\` to exclude Next.js internals (\`_next/static\`, \`_next/image\`, \`favicon.ico\`) from running middleware — avoids unnecessary processing.`,
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'image-font',
    moduleId: 'nextjs',
    title: 'Image & Font Optimization',
    description: 'next/image and next/font for optimal Core Web Vitals',
    estimatedTime: '30 min',
    sections: [
      {
        title: 'next/image',
        content: `\`next/image\` automatically:
- Converts to modern formats (WebP, AVIF) based on browser support
- Resizes images based on the \`sizes\` prop
- Lazy loads by default (IntersectionObserver)
- Prevents CLS with reserved space (requires \`width\` and \`height\` OR \`fill\`)
- Serves from CDN (Vercel) or custom CDN

**Key props:**
- \`priority\` — disables lazy loading, preloads (use for LCP images)
- \`fill\` — fills parent container (parent must be \`position: relative\`)
- \`sizes\` — tells browser what size the image will be at each breakpoint
- \`placeholder="blur"\` — shows blur preview while loading (+ \`blurDataURL\`)
- \`quality\` — 1-100, default 75`,
      },
      {
        title: 'next/font',
        content: `\`next/font\` automatically:
- Downloads fonts at build time (no runtime request to Google)
- Generates optimized CSS with \`@font-face\`
- Uses \`size-adjust\` to prevent CLS from font swap
- Self-hosts the font files

**Zero layout shift:** next/font applies font metrics to the fallback font so it takes up the same space — no layout shift when the custom font loads.`,
      },
    ],
    codeExamples: [
      {
        title: 'Optimized image gallery and font setup',
        language: 'typescript',
        code: `// Font setup in layout.tsx
import { Inter, Fira_Code } from 'next/font/google';
import localFont from 'next/font/local';

// Google font — downloaded at build time, self-hosted
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter', // CSS variable for use in Tailwind
});

// Monospace for code
const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-fira-code',
});

// Local font
const myFont = localFont({
  src: [
    { path: '../fonts/MyFont-Regular.woff2', weight: '400' },
    { path: '../fonts/MyFont-Bold.woff2', weight: '700' },
  ],
  variable: '--font-my',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={\`\${inter.variable} \${firaCode.variable}\`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}

// Image component usage
import Image from 'next/image';

function HeroSection() {
  return (
    <section>
      {/* LCP image — use priority to preload */}
      <Image
        src="/hero.jpg"
        alt="Hero image"
        width={1200}
        height={600}
        priority // disables lazy loading, adds preload link
        sizes="100vw"
        className="rounded-lg"
      />
    </section>
  );
}

function ImageGallery({ images }: { images: string[] }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((src, i) => (
        <div key={i} className="relative aspect-square">
          <Image
            src={src}
            alt={\`Gallery image \${i + 1}\`}
            fill // fills the relative parent
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover rounded"
            placeholder="blur"
            blurDataURL="data:image/png;base64,..." // tiny placeholder
          />
        </div>
      ))}
    </div>
  );
}`,
        explanation: 'priority on LCP images improves LCP scores. fill with sizes lets Next.js serve the right size. Fonts prevent CLS.',
      },
    ],
    interviewQuestions: [
      {
        question: 'How does next/image prevent Cumulative Layout Shift (CLS)?',
        answer: `CLS occurs when images load and push content around. \`next/image\` prevents this in two ways:

1. **Reserved space:** Requires \`width\` and \`height\` props (or \`fill\`). Next.js generates CSS that reserves the exact space the image will occupy before it loads. The image loads into a pre-existing space — no layout shift.

2. **Placeholder:** With \`placeholder="blur"\`, a blurred version shows while the full image loads, filling the space without a jarring layout shift.

**With \`fill\` layout:**
\`\`\`jsx
// Parent needs position:relative and explicit dimensions
<div className="relative w-full h-64">
  <Image src={src} alt="..." fill className="object-cover" />
</div>
\`\`\`

**With explicit dimensions:**
\`\`\`jsx
<Image src={src} alt="..." width={800} height={600} />
\`\`\`

Both approaches ensure the browser allocates space before the image loads.`,
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'seo-metadata',
    moduleId: 'nextjs',
    title: 'SEO & Metadata',
    description: 'Static metadata, generateMetadata, Open Graph, sitemaps, and structured data',
    estimatedTime: '35 min',
    sections: [],
    codeExamples: [
      {
        title: 'Complete SEO setup for a production app',
        language: 'typescript',
        code: `// app/layout.tsx — base metadata
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://myapp.com'),
  title: {
    template: '%s | MyApp',
    default: 'MyApp — The Best App',
  },
  description: 'MyApp is the best app for doing things.',
  keywords: ['next.js', 'react', 'typescript'],
  authors: [{ name: 'Alice', url: 'https://alice.dev' }],
  openGraph: {
    type: 'website',
    url: 'https://myapp.com',
    title: 'MyApp',
    description: 'MyApp is the best app for doing things.',
    siteName: 'MyApp',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@myapp',
    creator: '@alice',
  },
  robots: { index: true, follow: true },
};

// app/blog/[slug]/page.tsx — dynamic metadata
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await fetchPost(params.slug);
  if (!post) return { title: 'Post Not Found' };

  return {
    title: post.title, // becomes "Post Title | MyApp"
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: [post.coverImage ? { url: post.coverImage } : { url: '/default-og.png' }],
    },
  };
}

// app/sitemap.ts — auto-generate sitemap
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await fetchAllPosts();

  return [
    { url: 'https://myapp.com', lastModified: new Date(), changeFrequency: 'yearly', priority: 1 },
    { url: 'https://myapp.com/blog', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    ...posts.map(post => ({
      url: \`https://myapp.com/blog/\${post.slug}\`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}

// app/robots.ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: '/private/' }],
    sitemap: 'https://myapp.com/sitemap.xml',
  };
}

// JSON-LD structured data — in a Server Component
function ArticleJsonLd({ post }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    author: { '@type': 'Person', name: post.author.name },
    datePublished: post.publishedAt,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}`,
        explanation: 'Static metadata for global settings, generateMetadata for dynamic pages. Sitemap and robots.ts are auto-generated file conventions.',
      },
    ],
    interviewQuestions: [
      {
        question: 'How do you handle dynamic SEO metadata in Next.js App Router?',
        answer: `Use the \`generateMetadata\` async function exported from a \`page.tsx\` or \`layout.tsx\` file. It receives the same route params and searchParams as the page component and returns a \`Metadata\` object.

\`\`\`typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await fetchProduct(params.id);
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      images: [{ url: product.imageUrl }],
    },
  };
}
\`\`\`

**Key points:**
- Next.js deduplicates the fetch between \`generateMetadata\` and the page component (request memoization)
- Title templates: \`{ template: '%s | SiteName', default: 'SiteName' }\` automatically appends site name
- \`metadataBase\` resolves relative URLs for Open Graph images
- Return \`{}\` or just \`{}\` for missing content — Next.js won't throw

Metadata is evaluated on the server and injected into the HTML \`<head>\` — perfect for SEO crawlers.`,
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'authentication',
    moduleId: 'nextjs',
    title: 'Authentication in Next.js',
    description: 'NextAuth.js setup, middleware protection, session management, and patterns',
    estimatedTime: '50 min',
    sections: [],
    codeExamples: [
      {
        title: 'NextAuth.js / Auth.js with middleware protection',
        language: 'typescript',
        code: `// auth.ts — NextAuth v5 (Auth.js) setup
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub, // OAuth

    Credentials({
      async authorize(credentials) {
        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        });
        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password as string, user.passwordHash);
        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role; // add role to JWT
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub!;
      session.user.role = token.role as string;
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
});

// app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/auth';
export const { GET, POST } = handlers;

// middleware.ts — protect routes
import { auth } from '@/auth';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith('/login');
  const isProtected = req.nextUrl.pathname.startsWith('/dashboard');

  if (isProtected && !isLoggedIn) {
    return Response.redirect(new URL('/login', req.url));
  }
  if (isAuthPage && isLoggedIn) {
    return Response.redirect(new URL('/dashboard', req.url));
  }
});

export const config = { matcher: ['/dashboard/:path*', '/login'] };

// Server Component — get session
import { auth } from '@/auth';

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect('/login');
  return <div>Welcome {session.user.name} ({session.user.role})</div>;
}

// Client Component — use session
'use client';
import { useSession, signOut } from 'next-auth/react';

export default function UserMenu() {
  const { data: session, status } = useSession();
  if (status === 'loading') return <Spinner />;
  if (!session) return <a href="/login">Sign in</a>;
  return (
    <div>
      <span>{session.user.name}</span>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}`,
        explanation: 'Auth.js handles OAuth + credentials. JWT callback adds custom claims. Middleware protects routes. Server/Client components access session differently.',
      },
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between JWT and database sessions in NextAuth?',
        answer: `**JWT Sessions (default):**
- Session data stored in a signed/encrypted cookie on the client
- No database lookup required on each request — decode JWT
- Fast (no DB round trip)
- Cannot be invalidated server-side until they expire (logout doesn't really work)
- Good for: stateless apps, serverless deployments where DB latency is a concern

**Database Sessions:**
- Session token stored in a cookie; session data in the database
- Each request looks up the session in DB
- Can be invalidated immediately (logout works, forced sign-out works)
- Slightly slower (DB lookup per request)
- Required for: apps needing true session invalidation, user management, "log out all devices"

**In NextAuth/Auth.js:**
\`\`\`js
export const { handlers } = NextAuth({
  session: { strategy: 'jwt' }, // default — cookie-based JWT
  // vs
  session: { strategy: 'database' }, // DB sessions (requires adapter)
  adapter: PrismaAdapter(db), // needed for database strategy
});
\`\`\`

**Recommendation:** JWT for most apps, database sessions when you need reliable sign-out or user session management.`,
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'deployment',
    moduleId: 'nextjs',
    title: 'Deployment & Production',
    description: 'Vercel deployment, environment variables, Edge vs Node.js runtimes, and production checklist',
    estimatedTime: '40 min',
    sections: [
      {
        title: 'Environment Variables',
        content: `| Variable | Available on | Use for |
|----------|-------------|---------|
| \`.env.local\` | Never committed | Local dev secrets |
| \`NEXT_PUBLIC_*\` | Browser + Server | Public config (API URLs) |
| Without prefix | Server only | Secrets, private keys |
| \`.env.production\` | Build time | Production overrides |

**Vercel:** Set environment variables in the dashboard. They're injected at build time and runtime.

**IMPORTANT:** \`NEXT_PUBLIC_\` variables are inlined at build time — they're baked into the JavaScript bundle. Never put secrets in \`NEXT_PUBLIC_\` variables.`,
      },
      {
        title: 'Edge vs Node.js Runtime',
        content: `**Node.js Runtime (default):**
- Full Node.js API access
- Larger bundle (no limit effectively)
- Slower cold starts
- Use for: database connections, file system, native modules

**Edge Runtime:**
- V8 isolates — globally distributed
- Tiny bundle limit (~1MB)
- Near-instant cold starts (microseconds)
- No Node.js APIs
- Use for: middleware, lightweight API routes, auth checks

\`\`\`js
// Opt into Edge Runtime for a route
export const runtime = 'edge';
\`\`\``,
      },
    ],
    codeExamples: [
      {
        title: 'Production deployment checklist',
        language: 'typescript',
        code: `// next.config.ts — production optimizations
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Strict mode for catching bugs
  reactStrictMode: true,

  // Image optimization domains
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-eval' 'unsafe-inline'",
          },
        ],
      },
    ];
  },

  // Bundle analyzer (run: ANALYZE=true npm run build)
  ...(process.env.ANALYZE === 'true'
    ? { bundleAnalyzer: { enabled: true } }
    : {}),
};

export default nextConfig;

// Environment variable validation at startup
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  // Public vars
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

// This throws at startup if any required env var is missing
export const env = envSchema.parse(process.env);`,
        explanation: 'Validate env vars at startup to fail fast. Security headers prevent common attacks. Image domains whitelist prevents SSRF.',
      },
    ],
    interviewQuestions: [
      {
        question: 'What are common production issues with Next.js apps?',
        answer: `**1. Stale data from caching:**
- Default \`fetch\` is cached → mutations don't update the page
- Fix: \`revalidatePath\`/\`revalidateTag\` after mutations, or \`cache: 'no-store'\`

**2. "Missing environment variables in production":**
- Variables work locally but not on Vercel
- Fix: Add all variables to Vercel dashboard; \`NEXT_PUBLIC_\` for client-accessible vars

**3. Large bundle size:**
- Third-party libraries (charts, date libs) inflating client bundle
- Fix: \`React.lazy\` for heavy components, check that heavy Server Components don't import "use client"

**4. Memory leaks in Server Components:**
- Holding database connections open, not using connection pooling
- Fix: Use Prisma with connection pooling, Neon Serverless, or PlanetScale

**5. Hydration mismatches:**
- Server and client render different content (Math.random(), Date.now(), window access)
- Fix: Use \`suppressHydrationWarning\` for date/time; check window access with \`typeof window !== 'undefined'\`

**6. Edge Runtime incompatibility:**
- Middleware using Node.js APIs
- Fix: Use Edge-compatible libraries (jose for JWT, not jsonwebtoken)`,
        difficulty: 'hard',
      },
    ],
  },
];
