import type { TopicContent } from '@/types';

// =================== MODULE 5: SYSTEM DESIGN ===================
export const systemDesignContent: TopicContent[] = [
  {
    id: 'approach',
    moduleId: 'system-design',
    title: 'How to Approach System Design',
    description: 'Framework, communication tips, and time management for frontend system design interviews',
    estimatedTime: '30 min',
    sections: [
      {
        title: 'The RADCAP Framework',
        content: `Use this framework to structure every system design interview:

**R — Requirements** (~5 min)
Clarify functional and non-functional requirements. Ask:
- Who are the users? What device/browser?
- What are the core features? What's out of scope?
- What scale? (1K users vs 10M users changes everything)
- Any specific performance requirements?

**A — Architecture** (~5 min)
High-level architecture: What components exist? How do they communicate?
- Draw the component tree
- Identify data flow
- Note state management strategy

**D — Data Model & API Design** (~5 min)
- What data does each component need?
- How does data flow from parent to child?
- What API endpoints are needed? What do they return?
- Local state vs global state decision

**C — Component Design** (~10 min)
- Design key components in detail
- Props interface for each component
- State management
- Edge cases (empty state, error state, loading state)

**A — Accessibility & Responsiveness** (~3 min)
- Keyboard navigation
- Screen reader support
- Mobile layout

**P — Performance** (~5 min)
- Virtualization for large lists
- Code splitting
- Caching strategy
- Bundle optimization`,
      },
      {
        title: 'Communication Tips',
        content: `**Think out loud:** Interviewers want to hear your thought process. Narrate every decision.

**Ask clarifying questions:** Never assume. Ask about scale, browser support, existing systems, team preferences.

**Discuss tradeoffs:** For every decision, mention why you chose it AND what you gave up. "I chose virtualization here. The tradeoff is added complexity vs being able to render 100,000 items without performance issues."

**Start simple, then add complexity:** Don't jump to microservices. Start with the simplest solution that works.

**Manage time:** Don't spend 15 minutes on requirements. Keep moving. If you get deep into one area, say "I'll come back to this" and move on.

**Show seniority with concerns:**
- "I'd want to measure this before optimizing"
- "This is a good starting point; we'd need to revisit when we hit X scale"
- "I'd want to run A/B tests on this design"`,
      },
    ],
    codeExamples: [],
    interviewQuestions: [
      {
        question: 'How would you approach a frontend system design question?',
        answer: `I use the RADCAP framework:

1. **Requirements** (5 min): Clarify scope, users, scale, and non-functional requirements. Never skip this — assumptions that seem obvious often aren't.

2. **Architecture** (5 min): Draw the high-level component structure and data flow. What are the main components? How do they communicate?

3. **Data Model & API** (5 min): Define the data shape, API contracts, and state management strategy (local vs global, what library).

4. **Component Design** (10 min): Design key components in detail — props, state, interactions. Cover loading/error/empty states.

5. **Accessibility & Responsiveness** (3 min): Keyboard navigation, screen reader support, responsive breakpoints.

6. **Performance** (5 min): Identify bottlenecks and optimizations — virtualization, code splitting, caching, lazy loading.

Throughout: think out loud, discuss tradeoffs, ask clarifying questions, and demonstrate seniority by proactively raising concerns and edge cases.`,
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'analytics-dashboard',
    moduleId: 'system-design',
    title: 'Design: Analytics Dashboard',
    description: 'Full walkthrough — requirements, architecture, real-time data, charts, state management',
    estimatedTime: '60 min',
    sections: [
      {
        title: 'Requirements',
        content: `**Functional:**
- Display key metrics (revenue, users, events) with time-range filters
- Charts: line chart (trends), bar chart (comparison), pie chart (distribution)
- Data table with sorting, filtering, pagination
- Export to CSV
- Real-time updates for live metrics

**Non-Functional:**
- Handle 100K+ data points without lag
- Time to Interactive < 3 seconds
- Works on mobile (responsive)
- Real-time updates: <1s latency for live data`,
      },
      {
        title: 'Architecture',
        content: `**Component Tree:**
\`\`\`
DashboardPage
  ├── DashboardHeader (date range picker, export button)
  ├── MetricCards (revenue, users, events, conversion rate)
  ├── ChartSection
  │   ├── LineChart (trend over time)
  │   ├── BarChart (comparison)
  │   └── PieChart (distribution)
  └── DataTable (detailed breakdown with pagination)
\`\`\`

**State Management:**
- URL query params for filters (shareable, bookmarkable)
- Zustand for global dashboard state (date range, selected segments)
- React Query for server state (caching, background refetch)
- WebSocket for real-time metrics

**Data Flow:**
1. User changes date range → URL updates → React Query refetches
2. WebSocket pushes new data → React Query cache updates
3. All charts subscribe to the same cache → single source of truth`,
      },
    ],
    codeExamples: [
      {
        title: 'Dashboard architecture — component structure',
        language: 'typescript',
        code: `// types/dashboard.ts
interface DateRange {
  from: Date;
  to: Date;
  preset?: '7d' | '30d' | '90d' | '1y' | 'custom';
}

interface MetricData {
  label: string;
  value: number;
  change: number;      // percentage change vs previous period
  trend: 'up' | 'down' | 'flat';
}

interface ChartDataPoint {
  date: string;
  revenue: number;
  users: number;
  events: number;
}

interface TableRow {
  id: string;
  page: string;
  views: number;
  uniqueUsers: number;
  bounceRate: number;
  avgDuration: number;
}

// hooks/useDashboard.ts
function useDashboard(dateRange: DateRange) {
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['dashboard', 'metrics', dateRange],
    queryFn: () => fetchMetrics(dateRange),
    staleTime: 60_000, // fresh for 1 minute
    refetchInterval: 30_000, // background refetch every 30s
  });

  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ['dashboard', 'chart', dateRange],
    queryFn: () => fetchChartData(dateRange),
  });

  // Real-time WebSocket updates
  useEffect(() => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!);
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      queryClient.setQueryData(['dashboard', 'metrics', dateRange], (old: any) => ({
        ...old,
        ...update,
      }));
    };
    return () => ws.close();
  }, [dateRange]);

  return {
    metrics,
    chartData,
    isLoading: metricsLoading || chartLoading,
  };
}

// components/dashboard/MetricCard.tsx
function MetricCard({ metric }: { metric: MetricData }) {
  return (
    <div className="bg-card rounded-lg p-6 border">
      <p className="text-sm text-muted">{metric.label}</p>
      <p className="text-3xl font-bold mt-1">{formatValue(metric.value)}</p>
      <div className={\`flex items-center gap-1 mt-2 \${
        metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
      }\`}>
        <TrendIcon direction={metric.trend} />
        <span className="text-sm">{Math.abs(metric.change)}% vs last period</span>
      </div>
    </div>
  );
}

// components/dashboard/DashboardPage.tsx
function DashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
    preset: '30d',
  });

  const { metrics, chartData, isLoading } = useDashboard(dateRange);

  return (
    <div>
      <DashboardHeader dateRange={dateRange} onRangeChange={setDateRange} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {isLoading
          ? Array(4).fill(0).map((_, i) => <MetricCardSkeleton key={i} />)
          : metrics?.map(m => <MetricCard key={m.label} metric={m} />)
        }
      </div>

      <Suspense fallback={<ChartSkeleton />}>
        <Charts data={chartData} />
      </Suspense>

      <DataTable dateRange={dateRange} />
    </div>
  );
}`,
        explanation: 'React Query handles server state with caching and background refetch. WebSocket updates the query cache directly. Suspense for progressive loading.',
      },
    ],
    interviewQuestions: [
      {
        question: 'How would you handle real-time data in an analytics dashboard?',
        answer: `For real-time analytics data, I'd consider these approaches based on requirements:

**WebSocket (best for true real-time, <1s latency):**
- Persistent bidirectional connection
- Server pushes updates immediately
- Complexity: connection management, reconnection logic, auth
\`\`\`js
const ws = new WebSocket('/ws/metrics');
ws.onmessage = ({ data }) => queryClient.setQueryData(['metrics'], JSON.parse(data));
\`\`\`

**Server-Sent Events (simpler, server→client only):**
- One-way streaming (no client→server messages needed)
- Automatic reconnection built in
- Works over HTTP/2 with connection multiplexing
\`\`\`js
const es = new EventSource('/api/metrics/stream');
es.onmessage = ({ data }) => updateMetrics(JSON.parse(data));
\`\`\`

**Polling (simplest, acceptable for 10-30s refresh):**
\`\`\`js
useQuery({ queryKey: ['metrics'], refetchInterval: 30_000 })
\`\`\`

**My choice for analytics:** SSE for live counters (simple, sufficient), React Query's \`refetchInterval\` for chart data (doesn't need sub-second updates). Use WebSocket only if bidirectional communication is needed (e.g., user-triggered server actions).`,
        difficulty: 'hard',
      },
    ],
  },
  {
    id: 'infinite-scroll',
    moduleId: 'system-design',
    title: 'Design: Infinite Scroll Feed',
    description: 'Virtualization, cursor pagination, scroll restoration, and memory management',
    estimatedTime: '45 min',
    sections: [
      {
        title: 'Architecture and Key Decisions',
        content: `**Key challenges:**
1. DOM bloat — 1000s of items without virtualization = slow
2. Memory management — images + data in memory as user scrolls
3. Scroll position restoration — go to post, come back, find same position
4. Race conditions — rapid scrolling triggers multiple fetches

**Decisions:**
- **Cursor-based pagination** over offset (stable as new items are inserted)
- **Virtualization** with \`@tanstack/react-virtual\` (only renders visible items)
- **useInfiniteQuery** from React Query (handles pagination, deduplication)
- **Scroll position saved in sessionStorage** for restoration
- **IntersectionObserver** to trigger next page load`,
      },
    ],
    codeExamples: [
      {
        title: 'Infinite scroll with virtualization',
        language: 'typescript',
        code: `import { useInfiniteQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef, useEffect } from 'react';

interface Post {
  id: string;
  content: string;
  author: string;
  imageUrl?: string;
  cursor: string; // used for pagination
}

interface FeedResponse {
  posts: Post[];
  nextCursor: string | null;
}

function useInfiniteFeed() {
  return useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: ({ pageParam = null }) =>
      fetchFeed({ cursor: pageParam, limit: 20 }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 60_000,
  });
}

function Feed() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteFeed();

  // Flatten pages into single array
  const posts = data?.pages.flatMap(page => page.posts) ?? [];

  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: hasNextPage ? posts.length + 1 : posts.length, // +1 for loader
    getScrollElement: () => parentRef.current,
    estimateSize: () => 300, // estimated post height
    overscan: 5,
  });

  // Trigger next page when near bottom
  useEffect(() => {
    const lastItem = virtualizer.getVirtualItems().at(-1);
    if (!lastItem) return;
    if (lastItem.index >= posts.length - 1 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [virtualizer.getVirtualItems(), posts.length, hasNextPage, isFetchingNextPage]);

  return (
    <div ref={parentRef} style={{ height: '100vh', overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map(virtualRow => {
          const isLoaderRow = virtualRow.index > posts.length - 1;
          const post = posts[virtualRow.index];

          return (
            <div
              key={virtualRow.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: \`translateY(\${virtualRow.start}px)\`,
              }}
              ref={virtualizer.measureElement} // dynamic measurement
              data-index={virtualRow.index}
            >
              {isLoaderRow
                ? <PostSkeleton />
                : <PostCard post={post} />
              }
            </div>
          );
        })}
      </div>
    </div>
  );
}`,
        explanation: 'useInfiniteQuery handles cursor pagination and deduplication. Virtualizer renders only visible posts. measureElement handles variable heights.',
      },
    ],
    interviewQuestions: [
      {
        question: 'Why use cursor-based pagination over offset pagination for infinite scroll?',
        answer: `**Offset pagination problems:**
- Items shift when new content is inserted at the top
- Page 2 (offset 20) becomes wrong if 5 items were added since page 1
- The user sees duplicate posts or missing posts

**Cursor-based pagination:**
- Each item has a cursor (usually timestamp or ID)
- "Give me 20 items after cursor X"
- New items inserted don't affect what comes after cursor X
- Stable and consistent

**Example:**
\`\`\`
// Offset (bad for real-time feeds)
GET /feed?page=2&limit=20  // "items 20-40"
// If 3 new posts added → you see 3 from page 1 again

// Cursor (good)
GET /feed?cursor=post_id_20&limit=20  // "20 items after this post"
// New posts at top don't affect what's after cursor
\`\`\`

For infinite scroll feeds where new content is constantly added (Twitter, Instagram), cursor pagination is essential. Offset is fine for admin tables where data rarely changes.`,
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'ecommerce',
    moduleId: 'system-design',
    title: 'Design: E-Commerce Product Page',
    description: 'Image gallery, variant selection, cart, reviews, SEO, and performance budget',
    estimatedTime: '50 min',
    sections: [],
    codeExamples: [
      {
        title: 'Product page architecture',
        language: 'typescript',
        code: `// types/product.ts
interface ProductVariant {
  id: string;
  size: string;
  color: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  imageIndex: number; // which image to show for this variant
}

interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  variants: ProductVariant[];
  tags: string[];
  rating: { average: number; count: number };
}

// app/products/[slug]/page.tsx — Server Component
export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await db.product.findFirst({ where: { slug: params.slug } });
  if (!product) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 lg:grid lg:grid-cols-2 lg:gap-12">
      {/* Image Gallery — lazy load non-primary images */}
      <ProductGallery images={product.images} priority={0} />

      {/* Product Details — interactive, needs Client Component */}
      <ProductInfo product={product} />
    </div>
  );
}

// components/ProductInfo.tsx — Client Component
'use client';

function ProductInfo({ product }: { product: Product }) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const { addToCart, isInCart } = useCartStore();

  const activeVariant = selectedVariant ?? product.variants[0];
  const inCart = isInCart(activeVariant.id);
  const isOutOfStock = activeVariant.stock === 0;

  const handleAddToCart = async () => {
    if (isOutOfStock) return;
    // Optimistic update
    addToCart(activeVariant);
    // Sync with server
    await addToCartAPI(activeVariant.id);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">{product.name}</h1>

      <div className="mt-4 flex items-baseline gap-3">
        <span className="text-2xl font-semibold">\${activeVariant.price}</span>
        {activeVariant.compareAtPrice && (
          <span className="text-lg text-muted line-through">
            \${activeVariant.compareAtPrice}
          </span>
        )}
      </div>

      <VariantSelector
        variants={product.variants}
        selected={activeVariant}
        onSelect={setSelectedVariant}
      />

      <button
        onClick={handleAddToCart}
        disabled={isOutOfStock}
        className="mt-6 w-full py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50"
      >
        {isOutOfStock ? 'Out of Stock' : inCart ? 'Add More to Cart' : 'Add to Cart'}
      </button>

      <ProductDescription description={product.description} />
    </div>
  );
}`,
        explanation: 'Server Component fetches product data; Client Component handles interactivity. Optimistic cart update for instant feedback.',
      },
    ],
    interviewQuestions: [
      {
        question: 'How would you handle variant selection that changes the product image?',
        answer: `When a user selects a variant (e.g., "Red L"), the image gallery should switch to show the red product images.

**Implementation:**

1. **Data structure:** Each variant has an \`imageIndex\` or \`imageIds\` array pointing to which images correspond to that variant.

2. **State:** The selected variant index controls which images are "active" in the gallery.

3. **Optimization:** Pre-load all variant images but only display the active ones. Use \`priority\` for the first/selected image to preload it.

\`\`\`tsx
function ProductGallery({ images, activeImageIndex }: Props) {
  const [currentIndex, setCurrentIndex] = useState(activeImageIndex);

  // Sync with parent when variant changes
  useEffect(() => {
    setCurrentIndex(activeImageIndex);
  }, [activeImageIndex]);

  return (
    <div>
      <div className="relative aspect-square">
        <Image
          src={images[currentIndex]}
          alt={...}
          fill
          priority={currentIndex === 0}
          className="object-cover"
        />
      </div>
      <div className="flex gap-2 mt-4">
        {images.map((img, i) => (
          <button key={i} onClick={() => setCurrentIndex(i)}>
            <Image src={img} alt={...} width={80} height={80} />
          </button>
        ))}
      </div>
    </div>
  );
}
\`\`\``,
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'chat-app',
    moduleId: 'system-design',
    title: 'Design: Chat Application',
    description: 'Real-time messaging, virtualization, optimistic updates, and offline support',
    estimatedTime: '55 min',
    sections: [],
    codeExamples: [
      {
        title: 'Chat with optimistic updates',
        language: 'typescript',
        code: `// Optimistic message sending — feels instant
function useChat(conversationId: string) {
  const queryClient = useQueryClient();

  const sendMessage = useMutation({
    mutationFn: (content: string) =>
      api.post(\`/conversations/\${conversationId}/messages\`, { content }),

    // Optimistically add message immediately
    onMutate: async (content: string) => {
      await queryClient.cancelQueries({ queryKey: ['messages', conversationId] });

      const optimisticMessage: Message = {
        id: \`optimistic-\${Date.now()}\`, // temp ID
        content,
        senderId: currentUserId,
        status: 'sending',
        timestamp: new Date().toISOString(),
      };

      queryClient.setQueryData(['messages', conversationId], (old: Message[]) => [
        ...old,
        optimisticMessage,
      ]);

      return { optimisticId: optimisticMessage.id };
    },

    // Replace optimistic message with real one
    onSuccess: (realMessage, _, context) => {
      queryClient.setQueryData(['messages', conversationId], (old: Message[]) =>
        old.map(msg =>
          msg.id === context?.optimisticId ? { ...realMessage, status: 'sent' } : msg
        )
      );
    },

    // Remove optimistic message on failure
    onError: (_, __, context) => {
      queryClient.setQueryData(['messages', conversationId], (old: Message[]) =>
        old.map(msg =>
          msg.id === context?.optimisticId ? { ...msg, status: 'failed' } : msg
        )
      );
    },
  });

  return { sendMessage };
}`,
        explanation: 'Optimistic updates immediately add the message to UI, then replace it with the real message from the server on success.',
      },
    ],
    interviewQuestions: [
      {
        question: 'How would you implement optimistic updates in a chat app?',
        answer: `Optimistic updates mean showing the result immediately without waiting for the server — then reconciling with the actual server response.

**Steps:**
1. User sends message → immediately add it to the UI with a temporary ID and "sending" status
2. Fire the API call in the background
3. On success: replace the optimistic message with the real server message (real ID, "sent" status)
4. On failure: update the message status to "failed" with a retry button

**Key considerations:**
- Give optimistic messages a temporary ID (not conflicting with server IDs)
- Use React Query's \`onMutate\` + \`onSuccess\` + \`onError\` hooks for this pattern
- Store optimistic messages in the query cache for seamless integration with the real data
- Show visual indicators: "Sending...", "Sent", "Failed — Retry"

**Edge cases:**
- Network disconnect: queue messages, send when reconnected
- Duplicate messages: deduplicate by temp ID when reconciling
- Out-of-order delivery: sort by timestamp after reconciliation`,
        difficulty: 'hard',
      },
    ],
  },
  {
    id: 'form-builder',
    moduleId: 'system-design',
    title: 'Design: Form Builder',
    description: 'JSON schema-driven forms, drag-and-drop, validation engine, conditional fields, undo/redo',
    estimatedTime: '50 min',
    sections: [],
    codeExamples: [
      {
        title: 'JSON schema-driven form renderer',
        language: 'typescript',
        code: `// Schema-driven form — a form definition is just JSON
interface FieldSchema {
  id: string;
  type: 'text' | 'email' | 'select' | 'checkbox' | 'date' | 'number';
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  conditionalOn?: { fieldId: string; value: string | boolean }; // show if...
}

interface FormSchema {
  id: string;
  title: string;
  fields: FieldSchema[];
}

// Render any field based on its type
function DynamicField({ field, value, onChange, hidden }: {
  field: FieldSchema;
  value: any;
  onChange: (value: any) => void;
  hidden: boolean;
}) {
  if (hidden) return null;

  switch (field.type) {
    case 'select':
      return (
        <select value={value} onChange={e => onChange(e.target.value)}>
          <option value="">Select...</option>
          {field.options?.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      );
    case 'checkbox':
      return (
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={e => onChange(e.target.checked)}
        />
      );
    default:
      return (
        <input
          type={field.type}
          value={value ?? ''}
          placeholder={field.placeholder}
          onChange={e => onChange(e.target.value)}
        />
      );
  }
}

// Form renderer with conditional logic
function DynamicForm({ schema }: { schema: FormSchema }) {
  const [values, setValues] = useState<Record<string, any>>({});

  const isFieldVisible = (field: FieldSchema) => {
    if (!field.conditionalOn) return true;
    const { fieldId, value } = field.conditionalOn;
    return values[fieldId] === value;
  };

  const setValue = (fieldId: string, value: any) => {
    setValues(prev => ({ ...prev, [fieldId]: value }));
  };

  return (
    <form>
      <h2>{schema.title}</h2>
      {schema.fields.map(field => (
        <div key={field.id}>
          <label>{field.label}{field.required && ' *'}</label>
          <DynamicField
            field={field}
            value={values[field.id]}
            onChange={value => setValue(field.id, value)}
            hidden={!isFieldVisible(field)}
          />
        </div>
      ))}
    </form>
  );
}

// Example schema:
const jobApplicationSchema: FormSchema = {
  id: 'job-application',
  title: 'Job Application',
  fields: [
    { id: 'name', type: 'text', label: 'Full Name', required: true },
    { id: 'email', type: 'email', label: 'Email', required: true },
    { id: 'hasExperience', type: 'checkbox', label: 'Have relevant experience?' },
    {
      id: 'yearsExperience',
      type: 'number',
      label: 'Years of experience',
      conditionalOn: { fieldId: 'hasExperience', value: true }, // only shown if checked
    },
  ],
};`,
        explanation: 'Schema-driven forms decouple the form definition from rendering. Conditional fields check other field values at render time.',
      },
    ],
    interviewQuestions: [
      {
        question: 'How would you implement undo/redo in a form builder?',
        answer: `Undo/redo requires maintaining a history of states. I'd use the **Command Pattern** or a simple history stack:

\`\`\`typescript
interface HistoryState {
  past: FormSchema[];
  present: FormSchema;
  future: FormSchema[];
}

function historyReducer(state: HistoryState, action: Action): HistoryState {
  switch (action.type) {
    case 'ADD_FIELD':
    case 'REMOVE_FIELD':
    case 'UPDATE_FIELD': {
      const newPresent = applyAction(state.present, action);
      return {
        past: [...state.past, state.present],
        present: newPresent,
        future: [], // clear future on new action
      };
    }
    case 'UNDO': {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      return {
        past: state.past.slice(0, -1),
        present: previous,
        future: [state.present, ...state.future],
      };
    }
    case 'REDO': {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      return {
        past: [...state.past, state.present],
        present: next,
        future: state.future.slice(1),
      };
    }
  }
}
\`\`\`

**Keyboard shortcuts:** Ctrl+Z → UNDO, Ctrl+Shift+Z → REDO.
**Max history depth:** Limit to 50-100 steps to prevent memory bloat.
**Performance:** For large schemas, consider structural sharing (like Immer) to avoid deep copying entire schema trees on every change.`,
        difficulty: 'hard',
      },
    ],
  },
];

// =================== MODULE 6: PERFORMANCE ===================
export const performanceContent: TopicContent[] = [
  {
    id: 'core-web-vitals',
    moduleId: 'performance',
    title: 'Core Web Vitals',
    description: 'LCP, INP, and CLS — how to measure, diagnose, and fix each metric',
    estimatedTime: '50 min',
    sections: [
      {
        title: 'LCP — Largest Contentful Paint',
        content: `**What it measures:** Time until the largest content element (image, text block, video poster) is visible in the viewport.

**Good:** < 2.5s | **Needs Improvement:** 2.5-4s | **Poor:** > 4s

**Common causes of poor LCP:**
1. Slow server response (TTFB)
2. Render-blocking CSS/JS
3. Lazy-loaded hero images
4. Large unoptimized images

**Fixes:**
- Add \`priority\` to the \`next/image\` for above-the-fold images
- Use \`preload\` link for critical resources
- Optimize image formats (AVIF/WebP)
- Reduce TTFB (CDN, caching)
- Inline critical CSS`,
      },
      {
        title: 'INP — Interaction to Next Paint',
        content: `**What it measures:** Responsiveness to user interactions — time from input to next visual update.

**Good:** < 200ms | **Needs Improvement:** 200-500ms | **Poor:** > 500ms

**Common causes:**
1. Long JavaScript tasks blocking the main thread
2. Expensive rendering triggered by interactions
3. Unnecessary re-renders in React
4. Synchronous third-party scripts

**Fixes:**
- Break long tasks with \`setTimeout(0)\` or \`scheduler.yield()\`
- Use \`useTransition\` for non-urgent updates
- Debounce/throttle frequent handlers
- Virtualize large lists
- Move heavy computation to Web Workers`,
      },
      {
        title: 'CLS — Cumulative Layout Shift',
        content: `**What it measures:** Unexpected layout shifts during page load.

**Good:** < 0.1 | **Needs Improvement:** 0.1-0.25 | **Poor:** > 0.25

**Common causes:**
1. Images/videos without dimensions (no space reserved)
2. Content injected above existing content (ads, banners)
3. Web fonts causing FOIT/FOUT
4. Dynamic content (skeleton → real content with different size)

**Fixes:**
- Always specify \`width\` and \`height\` on images (or use \`aspect-ratio\`)
- Use \`next/image\` (reserves space automatically)
- Use \`next/font\` (prevents font swap CLS)
- Reserve space for dynamic content (min-height, skeleton with same size)`,
      },
    ],
    codeExamples: [
      {
        title: 'Measuring and reporting Web Vitals',
        language: 'typescript',
        code: `// Using web-vitals library
import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating, // 'good' | 'needs-improvement' | 'poor'
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType,
  });

  navigator.sendBeacon('/analytics', body);
}

onCLS(sendToAnalytics);
onINP(sendToAnalytics);
onLCP(sendToAnalytics);
onFCP(sendToAnalytics);
onTTFB(sendToAnalytics);

// Next.js built-in reporting
// app/layout.tsx
export function reportWebVitals(metric) {
  if (metric.label === 'web-vital') {
    console.log(metric.name, metric.value);
    sendToAnalytics(metric);
  }
}

// Real-world LCP optimization
// BEFORE: lazy-loaded hero image
<img src="/hero.jpg" loading="lazy" /> // WRONG for hero image!

// AFTER: prioritized hero image
import Image from 'next/image';
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority  // preloads, disables lazy loading
  sizes="100vw"
/>

// CLS fix: reserve space for dynamic content
// BEFORE: layout shift when ad loads
<div id="ad-slot"></div> // 0px until ad loads → shift!

// AFTER: reserved space
<div id="ad-slot" style={{ minHeight: 250, width: '100%' }}>
  {adLoaded ? <AdComponent /> : <div style={{ height: 250 }} />}
</div>`,
        explanation: 'Measure with web-vitals library, report to analytics. Priority images prevent LCP issues. Reserved space prevents CLS.',
      },
    ],
    interviewQuestions: [
      {
        question: 'What are Core Web Vitals and how do you improve them?',
        answer: `Core Web Vitals are Google's quality metrics for web page experience:

**LCP (Largest Contentful Paint)** — loading performance
- Good: < 2.5s
- Fix: \`priority\` on hero images, optimize image sizes, reduce TTFB, CDN

**INP (Interaction to Next Paint)** — interactivity
- Good: < 200ms
- Fix: break long JS tasks, useTransition for non-urgent updates, Web Workers for computation, virtualize lists

**CLS (Cumulative Layout Shift)** — visual stability
- Good: < 0.1
- Fix: explicit image dimensions, \`next/image\`, \`next/font\`, reserve space for dynamic content

**How to measure:**
- **Lab:** Lighthouse in Chrome DevTools (simulated, not real user)
- **Field:** Google Search Console, PageSpeed Insights (real user data — CrUX)
- **Real-time:** web-vitals JS library in production

**My process:**
1. Baseline with PageSpeed Insights (field data)
2. Reproduce in Lighthouse locally
3. Identify worst offender per metric using DevTools
4. Fix, verify in Lighthouse, deploy
5. Monitor field data to confirm improvement`,
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'bundle-optimization',
    moduleId: 'performance',
    title: 'Bundle Optimization',
    description: 'Code splitting, tree shaking, dynamic imports, and bundle analysis',
    estimatedTime: '40 min',
    sections: [
      {
        title: 'Tree Shaking',
        content: `**Tree shaking** eliminates unused exports from your bundle. Bundlers (webpack, Rollup) analyze \`import/export\` statements and remove code not reachable from your entry points.

**Requirements for tree shaking:**
- ES Modules (\`import/export\`), not CommonJS (\`require\`)
- Named exports (not default export of an object)
- Side-effect-free code (\`"sideEffects": false\` in package.json)

**Common tree-shaking failures:**
- Importing from barrel files that import everything: \`import { Button } from 'ui-library'\` (if barrel re-exports everything, you might get everything)
- \`import 'some-lib/styles.css'\` — side effect, won't be tree-shaken
- CommonJS imports (\`require\`)`,
      },
    ],
    codeExamples: [
      {
        title: 'Code splitting and bundle analysis',
        language: 'typescript',
        code: `// Dynamic import — creates separate chunk
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false, // don't render on server (uses browser APIs)
});

// Route-based splitting (automatic in Next.js App Router)
// Each page.tsx is a separate chunk

// Library-level: only import what you need
// BAD: imports entire lodash
import _ from 'lodash';
const shuffled = _.shuffle(array);

// GOOD: import only the function needed
import shuffle from 'lodash/shuffle';
const shuffled = shuffle(array);

// Or use ES modules version
import { shuffle } from 'lodash-es'; // tree-shakeable

// Date-fns example — import only what you need
import { format, parseISO, addDays } from 'date-fns'; // not the whole library

// Bundle analyzer setup (next.config.ts)
import bundleAnalyzer from '@next/bundle-analyzer';
const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });
export default withBundleAnalyzer({ reactStrictMode: true });
// Run: ANALYZE=true npm run build
// Opens visual map of what's in your bundle`,
        explanation: 'Dynamic imports split code at component boundaries. Targeted lodash/date-fns imports prevent bringing in entire libraries.',
      },
    ],
    interviewQuestions: [
      {
        question: 'What is tree shaking and what can break it?',
        answer: `Tree shaking is the process of removing unused JavaScript code (dead code elimination) from the final bundle. Bundlers analyze the import/export graph and exclude code not referenced from entry points.

**Requirements:**
- ES Module syntax (\`import\`/\`export\`), not CommonJS (\`require\`)
- Bundler configuration that enables it (webpack production mode, Rollup default)
- Package \`"sideEffects": false\` in \`package.json\`

**What breaks tree shaking:**

1. **CommonJS imports:** \`const { format } = require('date-fns')\` — bundler can't statically analyze dynamic requires

2. **Barrel file re-exports:**
\`\`\`js
// index.ts
export * from './Button'; // re-exports everything
export * from './Modal';
export * from './Table';
// Importing just Button may include everything
\`\`\`

3. **Side effects in module scope:**
\`\`\`js
// If this runs when imported, bundler can't remove it
console.log('module loaded'); // side effect
window.myLib = { ... };      // side effect
\`\`\`

4. **Dynamic imports in a way bundler can't analyze**

**Fix barrel files:** Use \`"sideEffects": false\` in package.json and import directly: \`import Button from 'ui/Button'\`.`,
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'network-performance',
    moduleId: 'performance',
    title: 'Network Performance',
    description: 'Resource hints, caching strategies, service workers, and CDN',
    estimatedTime: '35 min',
    sections: [
      {
        title: 'Resource Hints',
        content: `Resource hints tell the browser to fetch/connect to resources before they're needed:

- **\`preload\`:** Fetch this resource NOW — it's critical for this page (\`<link rel="preload" href="/font.woff2" as="font">\`)
- **\`prefetch\`:** Fetch this resource when idle — it will be needed for the NEXT navigation
- **\`preconnect\`:** Establish a connection to an origin (DNS + TCP + TLS) before we need it (\`<link rel="preconnect" href="https://fonts.googleapis.com">\`)
- **\`dns-prefetch\`:** Just resolve the DNS (faster than preconnect, lower priority)

**Use \`preload\` for:** LCP images, critical fonts, scripts that are loaded dynamically but immediately needed.

**Use \`prefetch\` for:** Routes the user is likely to navigate to next, lazy-loaded components likely to be used.`,
      },
    ],
    codeExamples: [
      {
        title: 'Resource hints and caching strategies',
        language: 'typescript',
        code: `// Next.js Head with resource hints
import Head from 'next/head';

function Page() {
  return (
    <>
      <Head>
        {/* Preconnect to external origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://api.example.com" />

        {/* Preload critical LCP image */}
        <link
          rel="preload"
          as="image"
          href="/hero.jpg"
          imageSrcSet="/hero-480.jpg 480w, /hero-960.jpg 960w"
          imageSizes="100vw"
        />
      </Head>
      {/* ... */}
    </>
  );
}

// Service Worker caching strategy (Workbox)
// public/sw.js
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';

// Cache First: images (rarely change)
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [{ cacheKeyWillBeUsed: async ({ request }) => request.url }],
  })
);

// Network First: API responses (fresh data preferred)
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 3, // fall back to cache if network > 3s
  })
);

// Stale While Revalidate: static assets with versioning
registerRoute(
  ({ request }) => request.destination === 'script',
  new StaleWhileRevalidate({ cacheName: 'scripts' })
);`,
        explanation: 'preload for critical current-page resources. prefetch for next-page resources. Caching strategies match resource update frequency.',
      },
    ],
    interviewQuestions: [
      {
        question: 'What are the different HTTP caching strategies?',
        answer: `**Cache-Control header strategies:**

**Cache-First (immutable assets):**
\`Cache-Control: public, max-age=31536000, immutable\`
- Cache forever, never revalidate
- Use for: assets with content-hash in filename (\`main.abc123.js\`)

**Network-First (fresh data preferred):**
\`Cache-Control: no-cache\`
- Always check network, fall back to cache on failure
- Use for: API responses, HTML pages that change

**Stale-While-Revalidate:**
\`Cache-Control: max-age=60, stale-while-revalidate=3600\`
- Serve from cache immediately (even if stale)
- Revalidate in background
- Use for: content that's okay to be slightly stale (news, social feeds)

**No Store:**
\`Cache-Control: no-store\`
- Never cache
- Use for: sensitive data, real-time prices

**In Next.js:**
- Static assets (\`_next/static\`) get long-lived headers with content hash
- HTML pages get \`Cache-Control: no-cache\` by default
- Customize in \`next.config.js\` \`headers()\``,
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'runtime-performance',
    moduleId: 'performance',
    title: 'Runtime Performance',
    description: 'Layout thrashing, requestAnimationFrame, Web Workers, debounce/throttle, and memory leaks',
    estimatedTime: '45 min',
    sections: [
      {
        title: 'Layout Thrashing',
        content: `**Layout thrashing** happens when you interleave DOM reads and writes in a loop. Each write invalidates the layout, forcing the browser to recalculate it on the next read.

\`\`\`js
// BAD: interleaved read/write — browser recalculates layout each iteration
elements.forEach(el => {
  const height = el.offsetHeight; // read — forces layout calculation
  el.style.height = height + 10 + 'px'; // write — invalidates layout
});

// GOOD: batch reads, then batch writes
const heights = elements.map(el => el.offsetHeight); // all reads
elements.forEach((el, i) => el.style.height = heights[i] + 10 + 'px'); // all writes
\`\`\`

\`requestAnimationFrame\` and libraries like FastDOM help batch DOM operations.`,
      },
    ],
    codeExamples: [
      {
        title: 'Debounce and throttle from scratch',
        language: 'typescript',
        code: `// Debounce: delay execution until after 'wait' ms of no calls
function debounce<T extends (...args: any[]) => any>(fn: T, wait: number) {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return function(this: any, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, wait);
  } as T;
}

// Use case: search-as-you-type
const search = debounce((query: string) => {
  fetch(\`/api/search?q=\${query}\`);
}, 300);
input.addEventListener('input', e => search(e.target.value));

// Throttle: execute at most once per 'limit' ms
function throttle<T extends (...args: any[]) => any>(fn: T, limit: number) {
  let lastRun = 0;

  return function(this: any, ...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastRun >= limit) {
      lastRun = now;
      fn.apply(this, args);
    }
  } as T;
}

// Use case: scroll handler (max 60fps = 16ms)
const handleScroll = throttle(() => {
  const scrollY = window.scrollY;
  updateNavbar(scrollY);
}, 16); // ~60fps
window.addEventListener('scroll', handleScroll);

// Key difference:
// Debounce: fires AFTER user stops (search input, resize)
// Throttle: fires DURING at a capped rate (scroll, mousemove)

// Throttle with trailing (fires at start AND at end of quiet period)
function throttleWithTrailing<T extends (...args: any[]) => any>(fn: T, limit: number) {
  let lastRun = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;

  return function(this: any, ...args: Parameters<T>) {
    const now = Date.now();
    const remaining = limit - (now - lastRun);

    if (remaining <= 0) {
      if (timer) { clearTimeout(timer); timer = null; }
      lastRun = now;
      fn.apply(this, args);
    } else if (!timer) {
      timer = setTimeout(() => {
        lastRun = Date.now();
        timer = null;
        fn.apply(this, args);
      }, remaining);
    }
  } as T;
}`,
        explanation: 'Debounce waits for quiet period (search inputs). Throttle caps rate (scroll/resize handlers). Both prevent performance-killing rapid invocations.',
      },
    ],
    interviewQuestions: [
      {
        question: 'What are common memory leaks in React and how do you fix them?',
        answer: `**1. Event listeners not cleaned up:**
\`\`\`js
useEffect(() => {
  window.addEventListener('resize', handler);
  // MISSING: return () => window.removeEventListener('resize', handler);
}, []);
\`\`\`
Fix: Always return cleanup function from useEffect.

**2. setInterval/setTimeout not cleared:**
\`\`\`js
useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id); // REQUIRED
}, []);
\`\`\`

**3. Unsubscribed observables/subscriptions:**
\`\`\`js
useEffect(() => {
  const sub = observable.subscribe(handler);
  return () => sub.unsubscribe(); // cleanup
}, []);
\`\`\`

**4. setState after unmount (stale async callbacks):**
\`\`\`js
useEffect(() => {
  let mounted = true;
  fetchData().then(data => {
    if (mounted) setState(data); // check before setting state
  });
  return () => { mounted = false; };
}, []);
// Better: use AbortController with fetch
\`\`\`

**5. Large objects in closures kept alive by effects/callbacks:**
Keep only what you need in closures; don't capture entire component state if only one value is needed.`,
        difficulty: 'medium',
      },
    ],
  },
];

// =================== MODULE 7: TESTING ===================
export const testingContent: TopicContent[] = [
  {
    id: 'philosophy',
    moduleId: 'testing',
    title: 'Testing Philosophy',
    description: 'Testing pyramid, what to test in frontend, and testing user behavior not implementation',
    estimatedTime: '25 min',
    sections: [
      {
        title: 'The Testing Pyramid',
        content: `**Unit Tests (base):** Test individual functions, hooks, and utility logic in isolation. Fast, cheap, many of them.

**Integration Tests (middle):** Test components with their dependencies — how they work together. React Testing Library primarily writes these.

**E2E Tests (top):** Test full user flows in a real browser. Slow, expensive, few but critical.

**The "Testing Trophy" (Kent C. Dodds):** For React apps, integration tests provide the most value. Unit tests for complex logic; E2E for critical paths only.`,
      },
      {
        title: 'Test User Behavior, Not Implementation',
        content: `The core principle of React Testing Library:
> "The more your tests resemble the way your software is used, the more confidence they can give you."

**BAD tests (implementation details):**
- Testing component state (state is private)
- Testing that a specific function was called
- Testing CSS class names
- Testing internal component structure

**GOOD tests (user behavior):**
- Can the user see X?
- Can the user click Y and see Z?
- Is the error message visible when the form is invalid?
- Does the data load after the user visits the page?`,
      },
    ],
    codeExamples: [],
    interviewQuestions: [
      {
        question: 'What is the testing pyramid and how does it apply to React apps?',
        answer: `The testing pyramid describes three levels of tests:

**Unit tests (bottom):** Fast, isolated, many. Test individual functions/hooks.
**Integration tests (middle):** Test components together. The sweet spot for React.
**E2E tests (top):** Full browser flows. Slow but high confidence. Write few.

**For React apps, I follow the "Testing Trophy" model:**
- Write MANY integration tests with React Testing Library — test components as users use them
- Write unit tests for complex business logic, utility functions, and custom hooks
- Write E2E tests for critical user journeys (checkout, login, core features)

**Why integration > unit for React:**
- Components are the unit of composition, not individual functions
- Testing components together (with child components, not mocked) catches integration bugs
- Tests that mock internal implementation become a maintenance burden when you refactor

**What I avoid testing:**
- Implementation details (state names, internal class names)
- Things that don't affect user behavior
- Third-party library behavior (trust their tests)`,
        difficulty: 'easy',
      },
    ],
  },
  {
    id: 'jest',
    moduleId: 'testing',
    title: 'Jest Fundamentals',
    description: 'Test structure, matchers, mocking, and async testing',
    estimatedTime: '45 min',
    sections: [],
    codeExamples: [
      {
        title: 'Complete Jest test patterns',
        language: 'typescript',
        code: `// utils/format.test.ts
describe('formatCurrency', () => {
  it('formats USD by default', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  it('handles negative numbers', () => {
    expect(formatCurrency(-50)).toBe('-$50.00');
  });

  it('formats other currencies', () => {
    expect(formatCurrency(100, 'EUR')).toBe('€100.00');
  });
});

// Mocking
jest.mock('@/lib/api', () => ({
  fetchUser: jest.fn(),
}));
import { fetchUser } from '@/lib/api';

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns user on success', async () => {
    (fetchUser as jest.Mock).mockResolvedValue({ id: '1', name: 'Alice' });
    const result = await getUser('1');
    expect(result.name).toBe('Alice');
    expect(fetchUser).toHaveBeenCalledWith('1');
  });

  it('throws on failure', async () => {
    (fetchUser as jest.Mock).mockRejectedValue(new Error('Not found'));
    await expect(getUser('1')).rejects.toThrow('Not found');
  });
});

// Async testing patterns
describe('async operations', () => {
  it('handles promises', async () => {
    const result = await asyncOperation();
    expect(result).toBe('done');
  });

  it('handles timers', () => {
    jest.useFakeTimers();
    const callback = jest.fn();
    setTimeout(callback, 1000);

    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    jest.useRealTimers();
  });
});`,
        explanation: 'describe groups tests. jest.fn() creates mock functions. mockResolvedValue/mockRejectedValue for async. jest.useFakeTimers for time control.',
      },
    ],
    interviewQuestions: [
      {
        question: 'When should you use jest.fn() vs jest.mock() vs jest.spyOn()?',
        answer: `**\`jest.fn()\`:** Creates a standalone mock function from scratch. Use when you need to pass a function as a prop or callback.
\`\`\`js
const onClick = jest.fn();
render(<Button onClick={onClick} />);
userEvent.click(button);
expect(onClick).toHaveBeenCalledOnce();
\`\`\`

**\`jest.mock('module')\`:** Replaces an entire module with mocks. Use when a component imports a module you want to control.
\`\`\`js
jest.mock('@/lib/api'); // auto-mocks all exports
// OR:
jest.mock('@/lib/api', () => ({
  fetchUser: jest.fn().mockResolvedValue({ id: '1' }),
}));
\`\`\`

**\`jest.spyOn(object, 'method')\`:** Wraps an existing method to track calls, but still calls the real implementation (unless you mock the return).
\`\`\`js
const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
// Now console.error doesn't log but you can assert it was called
expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('error'));
consoleSpy.mockRestore(); // restore original
\`\`\`

**Rule of thumb:** \`jest.fn()\` for callbacks/props, \`jest.mock()\` for module dependencies, \`spyOn\` to watch existing code without fully replacing it.`,
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'rtl',
    moduleId: 'testing',
    title: 'React Testing Library',
    description: 'Queries, user events, async testing, hooks testing, and MSW',
    estimatedTime: '55 min',
    sections: [
      {
        title: 'Query Priority',
        content: `React Testing Library provides queries in priority order (most to least accessible):

1. **getByRole** — best! Tests accessibility. \`getByRole('button', { name: 'Submit' })\`
2. **getByLabelText** — for form fields with labels
3. **getByPlaceholderText** — for inputs with placeholders
4. **getByText** — for text content
5. **getByDisplayValue** — for form elements with values
6. **getByAltText** — for images
7. **getByTitle** — for title attributes
8. **getByTestId** — last resort, avoid — ties tests to implementation

**getBy vs findBy vs queryBy:**
- \`getBy*\` — synchronous, throws if not found
- \`findBy*\` — async (awaitable), throws if not found after timeout
- \`queryBy*\` — synchronous, returns null if not found (use for asserting absence)`,
      },
    ],
    codeExamples: [
      {
        title: 'Complete component test with RTL',
        language: 'typescript',
        code: `import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import LoginForm from './LoginForm';

// MSW server to mock API
const server = setupServer(
  rest.post('/api/login', async (req, res, ctx) => {
    const { email, password } = await req.json();
    if (email === 'alice@example.com' && password === 'password123') {
      return res(ctx.json({ token: 'fake-token', user: { name: 'Alice' } }));
    }
    return res(ctx.status(401), ctx.json({ error: 'Invalid credentials' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('LoginForm', () => {
  it('submits with valid credentials and shows success', async () => {
    const user = userEvent.setup();
    const onSuccess = jest.fn();

    render(<LoginForm onSuccess={onSuccess} />);

    // Find elements by role/label
    await user.type(screen.getByLabelText(/email/i), 'alice@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    // Wait for async operation
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith({ name: 'Alice' });
    });
  });

  it('shows error message with invalid credentials', async () => {
    const user = userEvent.setup();

    render(<LoginForm onSuccess={jest.fn()} />);

    await user.type(screen.getByLabelText(/email/i), 'wrong@example.com');
    await user.type(screen.getByLabelText(/password/i), 'wrongpass');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });

  it('validates required fields before submitting', async () => {
    const user = userEvent.setup();
    const onSuccess = jest.fn();

    render(<LoginForm onSuccess={onSuccess} />);

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('disables submit button while loading', async () => {
    const user = userEvent.setup();

    render(<LoginForm onSuccess={jest.fn()} />);

    await user.type(screen.getByLabelText(/email/i), 'alice@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');

    const button = screen.getByRole('button', { name: /sign in/i });
    await user.click(button);

    // Immediately check disabled state (before response)
    expect(button).toBeDisabled();

    // Wait for it to re-enable
    await waitFor(() => expect(button).not.toBeDisabled());
  });
});`,
        explanation: 'MSW mocks at the network level — tests work just like real usage. getByLabelText and getByRole test accessibility. findBy waits for async UI.',
      },
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between getBy, findBy, and queryBy in React Testing Library?',
        answer: `All three find elements, but they differ in how they handle missing elements and async content:

**\`getBy*\`:**
- Synchronous
- Throws immediately if element is NOT found
- Use when the element MUST be present right now
\`\`\`js
const button = screen.getByRole('button', { name: 'Submit' });
// Throws if no such button exists
\`\`\`

**\`findBy*\`:**
- Asynchronous (returns a Promise)
- Keeps polling the DOM until the element appears or times out (1000ms default)
- Use for elements that appear after async operations (data loading, form submission)
\`\`\`js
const success = await screen.findByText('Order placed!'); // waits for it to appear
\`\`\`

**\`queryBy*\`:**
- Synchronous
- Returns \`null\` if element is NOT found (doesn't throw)
- Use when asserting that something does NOT exist
\`\`\`js
expect(screen.queryByText('Error message')).not.toBeInTheDocument();
// queryBy doesn't throw — perfect for "not present" assertions
\`\`\`

**Quick decision:**
- Element should be there now → \`getBy\`
- Element will appear after async → \`findBy\`
- Element might not be there → \`queryBy\``,
        difficulty: 'easy',
      },
    ],
  },
  {
    id: 'e2e',
    moduleId: 'testing',
    title: 'E2E Testing Basics',
    description: 'Cypress and Playwright overview, when to write E2E tests, and common patterns',
    estimatedTime: '35 min',
    sections: [],
    codeExamples: [
      {
        title: 'Playwright E2E test',
        language: 'typescript',
        code: `// e2e/checkout.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Checkout flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('complete checkout with valid card', async ({ page }) => {
    // Add item to cart
    await page.goto('/products/widget-pro');
    await page.click('button:has-text("Add to Cart")');

    // Verify cart count updated
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');

    // Go to checkout
    await page.click('a:has-text("Checkout")');
    await page.waitForURL('/checkout');

    // Fill shipping
    await page.fill('[name="firstName"]', 'Alice');
    await page.fill('[name="lastName"]', 'Smith');
    await page.fill('[name="address"]', '123 Main St');

    // Fill card (using Stripe test card)
    const stripeFrame = page.frameLocator('iframe[name="card-number"]');
    await stripeFrame.locator('[name="cardnumber"]').fill('4242424242424242');

    // Submit
    await page.click('button:has-text("Place Order")');

    // Verify success
    await expect(page).toHaveURL(/\/orders\/\w+/);
    await expect(page.locator('h1')).toHaveText('Order Confirmed!');
  });

  test('shows error for declined card', async ({ page }) => {
    await page.goto('/checkout');
    // ... fill form with declined card number
    await expect(page.locator('[role="alert"]')).toHaveText('Card declined');
  });
});`,
        explanation: 'E2E tests cover critical user journeys. beforeEach handles shared setup. Test against visible behavior, not implementation.',
      },
    ],
    interviewQuestions: [
      {
        question: 'When would you write E2E tests vs integration tests?',
        answer: `**E2E tests are for critical user journeys where:**
- Multiple systems interact (frontend + API + database)
- The flow has high business impact (checkout, login, signup, core feature)
- You need to verify the full experience including browser behavior
- Failures would be catastrophic (payment processing, data submission)

**Integration tests cover:**
- Individual components in isolation with mocked APIs
- Multiple components working together
- Most of your test coverage — they're fast and reliable

**Rule of thumb:**
- If it involves money, user data, or core feature completion → E2E
- If it involves a component rendering correctly with various inputs → RTL integration test
- If it involves complex logic → unit test

**Why not all E2E?**
- Slow (minutes vs seconds for unit/integration)
- Flaky (network, timing, browser inconsistencies)
- Expensive to write and maintain
- Don't identify WHERE bugs are (just that the flow is broken)

**Typical distribution:** 70% integration, 20% unit, 10% E2E`,
        difficulty: 'easy',
      },
    ],
  },
];

// =================== MODULE 8: BEHAVIORAL ===================
export const behavioralContent: TopicContent[] = [
  {
    id: 'star-method',
    moduleId: 'behavioral',
    title: 'STAR Method',
    description: 'Situation, Task, Action, Result — structuring behavioral answers perfectly',
    estimatedTime: '20 min',
    sections: [
      {
        title: 'The STAR Framework',
        content: `**S — Situation:** Set the scene. Where were you? What was the context? Keep this brief (1-2 sentences).

**T — Task:** What was your responsibility in this situation? What needed to be done? (1-2 sentences)

**A — Action:** What did YOU specifically do? Use "I", not "we". This is the most important part. Be specific. (2-4 sentences)

**R — Result:** What happened because of your actions? Quantify when possible. Include what you learned. (1-2 sentences)

**Timing:** Each answer should be 2-3 minutes. Practice with a timer. Interviewers lose focus after 3 minutes.

**Tip:** Prepare 5-6 strong stories that can flex to answer many different questions. Good stories about impact, leadership, conflict, failure, and cross-functional work.`,
      },
    ],
    codeExamples: [],
    interviewQuestions: [
      {
        question: 'How do you structure a behavioral interview answer?',
        answer: `Using the STAR framework:

**Situation (brief):** "At Youhue, we had a product with a 68% bounce rate on the main landing page — users were leaving within seconds."

**Task:** "I was asked to investigate and improve the conversion funnel. I had 6 weeks before the next sprint cycle locked in."

**Action:** "I started by analyzing user session recordings with Hotjar to find where users dropped off. I discovered two main issues: the page loaded in 4+ seconds, and the call-to-action was below the fold on mobile. I rebuilt the hero section with optimized images (using next/image with proper sizing), moved the CTA above the fold, and implemented critical CSS inlining. I also added A/B testing to validate changes."

**Result:** "The bounce rate dropped from 68% to 42% over 4 weeks. Page load time improved from 4.2s to 1.8s. The team adopted the performance-first approach for all subsequent pages."

Keep actions concrete and personal ("I built", "I discovered"). Quantify results whenever possible.`,
        difficulty: 'easy',
      },
    ],
  },
  {
    id: 'prepared-stories',
    moduleId: 'behavioral',
    title: 'Prepared Stories (Your CV)',
    description: 'Model STAR answers for common questions using Youhue, Bezoge, and SimonTech experience',
    estimatedTime: '60 min',
    sections: [
      {
        title: 'Your 90-Second Pitch',
        content: `**"Tell me about yourself"**

Structure: current role → key experience → what you bring → what you're looking for

Template:
"I'm a senior frontend developer with X years of experience specializing in React and Next.js. Currently at [current company], where I [key achievement]. Before that, I worked at [previous companies] where I built [key skills/achievements]. I'm known for [strengths — performance, team leadership, product thinking]. I'm now looking for [what excites you about this role/company — be specific]. I'm particularly excited about [something specific to this company's stack/product/mission]."

**Key points to include:**
- Specific tech: React 18, Next.js 14, TypeScript, Zustand
- Impact numbers: bounce rate reduction, performance improvements
- Leadership: managing concurrent projects, mentoring
- The civil engineering pivot: frame as strength (systems thinking, pragmatism, broad perspective)`,
      },
      {
        title: 'Model STAR Answers',
        content: `**"Tell me about a challenging technical problem you solved"**

S: At [company], the main product page had a 68% bounce rate — users were leaving immediately.

T: I was responsible for diagnosing and fixing the issue within a sprint cycle.

A: I set up performance monitoring (Lighthouse CI in our pipeline) and identified that the LCP was 4.2 seconds. Session recordings showed users on mobile couldn't find the CTA. I: (1) rewrote the image pipeline to use next/image with proper sizes, (2) moved the hero CTA above the fold, (3) extracted and inlined critical CSS, (4) set up A/B testing to validate each change independently.

R: Bounce rate dropped 26 points (68% → 42%). LCP improved from 4.2s to 1.8s. The A/B testing framework I set up became standard for all product pages going forward.

---

**"Tell me about a time you improved performance"**

S: At [company], we had a data table showing 5,000 product records. The page froze for 2-3 seconds on load and scrolling was janky on lower-end devices.

T: I needed to solve this without changing the data structure or backend.

A: I profiled the component in React DevTools — the issue was rendering 5,000 DOM nodes at once. I implemented react-virtuoso (virtual scrolling), which reduced rendered rows from 5,000 to ~20. I also memoized the row component with React.memo and useCallback on the sort handler to prevent unnecessary re-renders.

R: Page load from navigation dropped from 2.8s to 0.3s. Smooth 60fps scrolling. The table now handles 50,000 rows with the same performance.`,
      },
    ],
    codeExamples: [],
    interviewQuestions: [
      {
        question: '"Tell me about yourself" — give your 90-second pitch',
        answer: `"I'm a senior frontend developer with [X] years of experience specializing in React and Next.js.

At [current company], I [specific achievement — e.g., "led the rebuild of the main product page, reducing bounce rate by 26% and improving load time from 4.2 to 1.8 seconds"].

Before that at [previous company], I [another achievement — e.g., "worked on a team of 8 engineers, managing 3 concurrent projects and mentoring 2 junior developers"].

My background is unusual — I started in civil engineering, which gave me a strong foundation in systems thinking and working through complex constraints. When I moved into software, I found that the same discipline of understanding systems end-to-end translated really well into building performant, reliable frontends.

I specialize in React performance, Next.js App Router, and TypeScript, and I enjoy the intersection of engineering rigor and user experience.

I'm excited about this role specifically because [something specific to the company — product, tech stack, team, problem space]. [Question if time permits: 'Before I go further, is there a specific area you'd like me to focus on?']"

Keep it under 2 minutes. Memorize the structure, not the exact words.`,
        difficulty: 'easy',
      },
      {
        question: 'Why did you switch from civil engineering to software engineering?',
        answer: `"I've always been drawn to building things and solving complex problems — civil engineering and software engineering actually share more than people realize. Both involve understanding systems, managing constraints, and building things that last.

What drew me specifically to software was the feedback loop. In civil engineering, you design a bridge and wait years to see if your decisions were right. In software, I can ship a feature, see how users interact with it, and improve it within days. That rapid iteration is energizing.

I also discovered that I have a natural affinity for the frontend specifically — the intersection of technical problem-solving and direct user impact. When I optimize a page to load 60% faster, real people have a better experience immediately. That direct feedback loop is what keeps me excited to come to work every day.

The engineering background I bring actually turns out to be a strength — I approach performance problems analytically, I'm comfortable with tradeoffs and constraints, and I bring a different perspective to system design. I don't just ask 'does this work?' — I ask 'does this scale?' and 'what are the second-order effects?'"`,
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'questions-to-ask',
    moduleId: 'behavioral',
    title: 'Questions to Ask the Interviewer',
    description: '10 smart questions that show seniority, questions to avoid, and how to tailor to the company',
    estimatedTime: '20 min',
    sections: [
      {
        title: '10 Questions That Show Seniority',
        content: `**Engineering depth:**
1. "What does the current frontend tech debt look like, and how does the team prioritize it?"
2. "What's the testing philosophy on the frontend — how much coverage do you aim for?"
3. "How do you handle deployments? What does the CI/CD pipeline look like for frontend?"

**Team & process:**
4. "What does onboarding look like for a senior engineer? What would success look like in the first 3 months?"
5. "How are technical decisions made on the team? Is it RFC-driven, or more ad-hoc?"
6. "How does the frontend team interact with design — do you have a design system?"

**Growth & culture:**
7. "What are the biggest technical challenges the frontend team is working on right now?"
8. "What opportunities are there for technical leadership or mentoring?"
9. "What does a typical week look like for someone in this role?"

**Company direction:**
10. "Where is this product headed over the next 12 months, and how does the frontend team fit into that roadmap?"

**Questions to AVOID:**
- Salary (wait for them to bring it up or ask at the end with HR)
- "How much vacation do you have?" (off-putting early)
- Questions answered on their website (shows you didn't research)
- "What would I be working on?" (you should know this already from the JD)`,
      },
    ],
    codeExamples: [],
    interviewQuestions: [
      {
        question: 'What questions do you ask at the end of an interview?',
        answer: `I have a set of questions I always ask, depending on how the interview went:

**For understanding the role:**
"What does success look like in this role at 3 months, 6 months, and a year? What separates someone who does well from someone who thrives?"

**For understanding technical culture:**
"What does the frontend tech debt situation look like, and how does the team approach it?"

**For the team:**
"What do you personally find most challenging about working on this team right now?"

**For growth:**
"What opportunities exist for technical leadership — things like architecture decisions, technical RFCs, or mentoring?"

I also always ask the specific interviewer: "What do you enjoy most about working here?" — it's a great way to get authentic insight and shows genuine interest.

I tailor the questions to what came up in the interview. If performance was mentioned, I'll ask about their Core Web Vitals targets. If they mentioned a rewrite, I'll ask about the migration strategy. This shows I was listening.`,
        difficulty: 'easy',
      },
    ],
  },
];

// =================== MODULE 9: CODING CHALLENGES ===================
export const codingChallengesContent: TopicContent[] = [
  {
    id: 'dom-manipulation',
    moduleId: 'coding-challenges',
    title: 'DOM Manipulation Challenges',
    description: 'Classic challenges: debounce, throttle, event emitter, Promise.all, and more from scratch',
    estimatedTime: '90 min',
    sections: [],
    codeExamples: [
      {
        title: 'Implement debounce from scratch',
        language: 'javascript',
        code: `// Problem: Implement a debounce function that delays invoking fn
// until after 'delay' milliseconds have elapsed since the last invocation.
// Also support immediate: true option (call on leading edge)

function debounce(fn, delay, { immediate = false } = {}) {
  let timer = null;

  return function(...args) {
    const context = this;
    const callNow = immediate && !timer;

    clearTimeout(timer);

    timer = setTimeout(() => {
      timer = null;
      if (!immediate) fn.apply(context, args);
    }, delay);

    if (callNow) fn.apply(context, args);
  };
}

// Tests
const log = debounce(console.log, 300);
log('a'); // called but not executed yet
log('b'); // resets timer
log('c'); // resets timer — only 'c' will execute after 300ms

// Verify:
// 1. Call multiple times quickly — only last fires
// 2. Call once, wait 300ms — fires once
// 3. immediate: true — fires immediately, then blocked for 300ms`,
        explanation: 'Key insight: clear and reset the timer on each call. Only fire after delay with no new calls. immediate fires on leading edge.',
      },
      {
        title: 'Implement Promise.all from scratch',
        language: 'javascript',
        code: `function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (promises.length === 0) {
      resolve([]);
      return;
    }

    const results = new Array(promises.length);
    let resolved = 0;

    promises.forEach((promise, index) => {
      // Handle non-Promise values (Promise.all accepts non-promises)
      Promise.resolve(promise).then(
        value => {
          results[index] = value; // preserve order!
          resolved++;
          if (resolved === promises.length) {
            resolve(results);
          }
        },
        reason => reject(reason) // any rejection → reject immediately
      );
    });
  });
}

// Tests
promiseAll([
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3),
]).then(console.log); // [1, 2, 3]

promiseAll([
  Promise.resolve(1),
  Promise.reject('error'),
  Promise.resolve(3),
]).catch(console.error); // 'error' (fast-fails)

promiseAll([]).then(console.log); // []`,
        explanation: 'Track resolved count, preserve order using index. Any rejection immediately rejects. Handle non-promise values with Promise.resolve().',
      },
      {
        title: 'Implement a simple Event Emitter',
        language: 'javascript',
        code: `class EventEmitter {
  constructor() {
    this.events = new Map(); // eventName → Set of listeners
  }

  on(event, listener) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event).add(listener);
    return this; // for chaining
  }

  off(event, listener) {
    this.events.get(event)?.delete(listener);
    return this;
  }

  once(event, listener) {
    const wrapper = (...args) => {
      listener(...args);
      this.off(event, wrapper); // auto-remove after first call
    };
    wrapper._original = listener; // store for removal by original ref
    return this.on(event, wrapper);
  }

  emit(event, ...args) {
    this.events.get(event)?.forEach(listener => {
      listener(...args);
    });
    return this;
  }

  removeAllListeners(event) {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
    return this;
  }
}

// Tests
const emitter = new EventEmitter();
const handler = (msg) => console.log('received:', msg);

emitter.on('message', handler);
emitter.emit('message', 'hello'); // 'received: hello'
emitter.emit('message', 'world'); // 'received: world'
emitter.off('message', handler);
emitter.emit('message', 'gone');  // nothing

const onceHandler = (x) => console.log('once:', x);
emitter.once('click', onceHandler);
emitter.emit('click', 1); // 'once: 1'
emitter.emit('click', 2); // nothing (already removed)`,
        explanation: 'Map of event names to Sets of listeners. once wraps in self-removing handler. Return this for chaining.',
      },
      {
        title: 'Deep clone an object',
        language: 'javascript',
        code: `// Modern approach: structuredClone (doesn't handle functions)
const clone1 = structuredClone(obj);

// Custom deep clone
function deepClone(value, visited = new WeakMap()) {
  // Primitives
  if (value === null || typeof value !== 'object') return value;

  // Handle circular references
  if (visited.has(value)) return visited.get(value);

  // Date
  if (value instanceof Date) return new Date(value.getTime());

  // RegExp
  if (value instanceof RegExp) return new RegExp(value.source, value.flags);

  // Array
  if (Array.isArray(value)) {
    const clone = [];
    visited.set(value, clone);
    value.forEach((item, i) => { clone[i] = deepClone(item, visited); });
    return clone;
  }

  // Plain object
  const clone = Object.create(Object.getPrototypeOf(value));
  visited.set(value, clone);
  for (const key of Reflect.ownKeys(value)) { // includes symbols
    clone[key] = deepClone(value[key], visited);
  }
  return clone;
}

// Test circular reference
const a = { name: 'a' };
const b = { name: 'b', ref: a };
a.ref = b; // circular!
const cloned = deepClone(a); // doesn't infinitely recurse`,
        explanation: 'WeakMap tracks visited objects to handle circular references. Handle special types (Date, RegExp) before generic object handling.',
      },
      {
        title: 'Flatten a deeply nested array',
        language: 'javascript',
        code: `// Using Array.flat (modern, built-in)
[1, [2, [3, [4]]]].flat(Infinity); // [1, 2, 3, 4]

// Recursive implementation
function flatten(arr, depth = Infinity) {
  if (depth === 0) return [...arr];

  return arr.reduce((acc, item) => {
    if (Array.isArray(item) && depth > 0) {
      acc.push(...flatten(item, depth - 1));
    } else {
      acc.push(item);
    }
    return acc;
  }, []);
}

// Iterative (avoids stack overflow on very deep arrays)
function flattenIterative(arr) {
  const stack = [...arr];
  const result = [];

  while (stack.length > 0) {
    const item = stack.pop();
    if (Array.isArray(item)) {
      stack.push(...item); // spread back onto stack
    } else {
      result.unshift(item); // add to front (to maintain order with pop)
    }
  }

  return result;
}

// Flatten object (nested to dot notation)
function flattenObject(obj, prefix = '') {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const fullKey = prefix ? \`\${prefix}.\${key}\` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(acc, flattenObject(value, fullKey));
    } else {
      acc[fullKey] = value;
    }
    return acc;
  }, {});
}

flattenObject({ a: { b: { c: 1 }, d: 2 } });
// { 'a.b.c': 1, 'a.d': 2 }`,
        explanation: 'Recursive flatten is clean; iterative avoids stack overflow. flattenObject converts nested to dot-notation paths.',
      },
    ],
    interviewQuestions: [
      {
        question: 'Implement Array.prototype.reduce from scratch.',
        answer: `\`\`\`javascript
Array.prototype.myReduce = function(callback, initialValue) {
  if (this.length === 0 && arguments.length < 2) {
    throw new TypeError('Reduce of empty array with no initial value');
  }

  let accumulator;
  let startIndex;

  if (arguments.length >= 2) {
    accumulator = initialValue;
    startIndex = 0;
  } else {
    // No initial value: use first element as accumulator
    accumulator = this[0];
    startIndex = 1;
  }

  for (let i = startIndex; i < this.length; i++) {
    if (i in this) { // skip holes in sparse arrays
      accumulator = callback(accumulator, this[i], i, this);
    }
  }

  return accumulator;
};

// Tests
[1, 2, 3, 4].myReduce((acc, val) => acc + val, 0); // 10
[1, 2, 3].myReduce((acc, val) => acc + val);        // 6 (no initial)
[].myReduce((acc, val) => acc + val);               // TypeError
\`\`\`

Key points: handle no initialValue case, handle sparse arrays, throw on empty array with no initialValue.`,
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'react-challenges',
    moduleId: 'coding-challenges',
    title: 'React Coding Challenges',
    description: 'Build 9 real React components from scratch — todo, autocomplete, data table, and more',
    estimatedTime: '120 min',
    sections: [],
    codeExamples: [
      {
        title: 'Build a fully-featured Todo App',
        language: 'typescript',
        code: `import { useState, useEffect } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

type Filter = 'all' | 'active' | 'completed';

function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('todos') ?? '[]');
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const add = (text: string) => {
    if (!text.trim()) return;
    setTodos(prev => [...prev, { id: Date.now(), text, completed: false }]);
  };

  const toggle = (id: number) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const edit = (id: number, text: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, text } : t));
  };

  const remove = (id: number) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const clearCompleted = () => {
    setTodos(prev => prev.filter(t => !t.completed));
  };

  return { todos, add, toggle, edit, remove, clearCompleted };
}

function TodoApp() {
  const { todos, add, toggle, edit, remove, clearCompleted } = useTodos();
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [editingId, setEditingId] = useState<number | null>(null);

  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const activeCount = todos.filter(t => !t.completed).length;

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-4xl font-light text-center mb-8">todos</h1>

      {/* Input */}
      <div className="flex border rounded-lg overflow-hidden">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { add(input); setInput(''); }}}
          placeholder="What needs to be done?"
          className="flex-1 px-4 py-3 outline-none"
        />
        <button onClick={() => { add(input); setInput(''); }} className="px-4 bg-blue-500 text-white">
          Add
        </button>
      </div>

      {/* List */}
      <ul className="mt-4 border rounded-lg divide-y">
        {filtered.map(todo => (
          <li key={todo.id} className="flex items-center px-4 py-3 gap-3">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggle(todo.id)}
            />
            {editingId === todo.id ? (
              <input
                autoFocus
                defaultValue={todo.text}
                onBlur={e => { edit(todo.id, e.target.value); setEditingId(null); }}
                onKeyDown={e => {
                  if (e.key === 'Enter') { edit(todo.id, e.currentTarget.value); setEditingId(null); }
                  if (e.key === 'Escape') setEditingId(null);
                }}
                className="flex-1 border-b outline-none"
              />
            ) : (
              <span
                onDoubleClick={() => setEditingId(todo.id)}
                className={\`flex-1 \${todo.completed ? 'line-through text-gray-400' : ''}\`}
              >
                {todo.text}
              </span>
            )}
            <button onClick={() => remove(todo.id)} className="text-red-400">✕</button>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
        <span>{activeCount} items left</span>
        <div className="flex gap-2">
          {(['all', 'active', 'completed'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={\`px-2 py-1 rounded \${filter === f ? 'border border-blue-500' : ''}\`}
            >
              {f}
            </button>
          ))}
        </div>
        <button onClick={clearCompleted}>Clear completed</button>
      </div>
    </div>
  );
}`,
        explanation: 'Custom hook extracts all todo logic. localStorage persisted via useEffect. Filter is derived state (computed from todos). Edit mode toggles inline.',
      },
      {
        title: 'Build an Autocomplete Search Component',
        language: 'typescript',
        code: `import { useState, useRef, useEffect, useCallback } from 'react';

interface Option {
  id: string;
  label: string;
}

interface AutocompleteProps {
  options: Option[];
  onSelect: (option: Option) => void;
  placeholder?: string;
  debounceMs?: number;
}

function Autocomplete({ options, onSelect, placeholder = 'Search...', debounceMs = 300 }: AutocompleteProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), debounceMs);
    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  // Filter options
  const filtered = debouncedQuery
    ? options.filter(o => o.label.toLowerCase().includes(debouncedQuery.toLowerCase()))
    : [];

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = useCallback((option: Option) => {
    setQuery(option.label);
    setIsOpen(false);
    setFocusedIndex(-1);
    onSelect(option);
  }, [onSelect]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown') { setIsOpen(true); setFocusedIndex(0); }
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(i => Math.min(i + 1, filtered.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        if (focusedIndex >= 0 && filtered[focusedIndex]) {
          handleSelect(filtered[focusedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setFocusedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        ref={inputRef}
        value={query}
        onChange={e => { setQuery(e.target.value); setIsOpen(true); setFocusedIndex(-1); }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        role="combobox"
        aria-expanded={isOpen}
        aria-autocomplete="list"
        className="w-full px-4 py-2 border rounded-lg"
      />

      {isOpen && filtered.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto"
        >
          {filtered.map((option, index) => (
            <li
              key={option.id}
              role="option"
              aria-selected={index === focusedIndex}
              onClick={() => handleSelect(option)}
              className={\`px-4 py-2 cursor-pointer hover:bg-gray-100 \${
                index === focusedIndex ? 'bg-blue-50 text-blue-700' : ''
              }\`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`,
        explanation: 'Debounced query prevents filtering on every keystroke. Keyboard navigation with arrow keys, Enter, Escape. ARIA attributes for accessibility.',
      },
    ],
    interviewQuestions: [
      {
        question: 'Build a Star Rating component in React.',
        answer: `\`\`\`tsx
import { useState } from 'react';

interface StarRatingProps {
  max?: number;
  value: number;
  onChange: (rating: number) => void;
  readOnly?: boolean;
}

function StarRating({ max = 5, value, onChange, readOnly = false }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);

  return (
    <div
      className="flex gap-1"
      role="group"
      aria-label={\`Rating: \${value} out of \${max}\`}
    >
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1;
        const filled = starValue <= (hovered || value);
        return (
          <button
            key={i}
            type="button"
            aria-label={\`Rate \${starValue} out of \${max}\`}
            aria-pressed={value === starValue}
            disabled={readOnly}
            onClick={() => !readOnly && onChange(starValue)}
            onMouseEnter={() => !readOnly && setHovered(starValue)}
            onMouseLeave={() => setHovered(0)}
            className={\`text-2xl transition-colors \${
              filled ? 'text-yellow-400' : 'text-gray-300'
            } \${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}\`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

// Usage
const [rating, setRating] = useState(0);
<StarRating value={rating} onChange={setRating} />
\`\`\`

Key decisions: hover preview (hovered || value), readOnly mode disables interactions, ARIA labels for accessibility, keyboard-accessible via button elements.`,
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'leetcode',
    moduleId: 'coding-challenges',
    title: 'LeetCode Essentials (Frontend-Relevant)',
    description: 'The key algorithms and data structures that appear in frontend interviews',
    estimatedTime: '90 min',
    sections: [],
    codeExamples: [
      {
        title: 'Two Sum — O(n) with hashmap',
        language: 'javascript',
        code: `// Problem: Given array nums and target, return indices of two numbers that sum to target
// Constraints: exactly one solution, same element can't be used twice

// Brute force: O(n²)
function twoSumBrute(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) return [i, j];
    }
  }
}

// Optimal: O(n) with Map
function twoSum(nums, target) {
  const seen = new Map(); // value → index

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }

    seen.set(nums[i], i);
  }
}

// Examples:
twoSum([2, 7, 11, 15], 9);  // [0, 1] (2 + 7)
twoSum([3, 2, 4], 6);       // [1, 2] (2 + 4)

// Time: O(n) — one pass
// Space: O(n) — store up to n elements in map`,
        explanation: 'Store complement in hashmap. One pass: for each number, check if we\'ve seen its complement. O(n) time.',
      },
      {
        title: 'Valid Parentheses',
        language: 'javascript',
        code: `// Problem: Given string of '(', ')', '{', '}', '[', ']'
// Return true if the input string is valid (properly closed and nested)

function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };

  for (const char of s) {
    if ('({['.includes(char)) {
      stack.push(char); // opening bracket — push
    } else {
      // closing bracket — must match top of stack
      if (stack.pop() !== map[char]) return false;
    }
  }

  return stack.length === 0; // must be empty at end
}

// Examples:
isValid('()');      // true
isValid('()[]{}'): // true
isValid('(]');     // false
isValid('([)]');   // false
isValid('{[]}');   // true

// Time: O(n) | Space: O(n)`,
        explanation: 'Stack tracks opening brackets. Closing bracket must match the most recent opening bracket (LIFO). Stack empty at end = valid.',
      },
      {
        title: 'Longest Substring Without Repeating Characters',
        language: 'javascript',
        code: `// Problem: Find length of longest substring without repeating characters

// Sliding window approach: O(n)
function lengthOfLongestSubstring(s) {
  const charIndex = new Map(); // char → last seen index
  let maxLen = 0;
  let left = 0; // left boundary of window

  for (let right = 0; right < s.length; right++) {
    const char = s[right];

    // If char seen within current window, move left boundary past it
    if (charIndex.has(char) && charIndex.get(char) >= left) {
      left = charIndex.get(char) + 1;
    }

    charIndex.set(char, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}

// Examples:
lengthOfLongestSubstring('abcabcbb'); // 3 ('abc')
lengthOfLongestSubstring('bbbbb');    // 1 ('b')
lengthOfLongestSubstring('pwwkew');   // 3 ('wke')
lengthOfLongestSubstring('');         // 0

// Time: O(n) | Space: O(min(n, alphabet size))`,
        explanation: 'Sliding window: expand right, when duplicate found, shrink left past the previous occurrence. Track positions with Map.',
      },
      {
        title: 'Flatten Deeply Nested Array (interview version)',
        language: 'javascript',
        code: `// Problem: Write a function that returns a deeply nested array flattened to depth n
// This directly tests your understanding of recursion and data structures

function flatDeep(arr, depth = 1) {
  // Base case: depth 0 or not an array
  if (depth === 0) return arr.slice();

  return arr.reduce((acc, val) => {
    if (Array.isArray(val) && depth > 0) {
      acc.push(...flatDeep(val, depth - 1));
    } else {
      acc.push(val);
    }
    return acc;
  }, []);
}

// Test:
const nested = [1, [2, [3, [4, [5]]]]];
flatDeep(nested, 1);        // [1, 2, [3, [4, [5]]]]
flatDeep(nested, 2);        // [1, 2, 3, [4, [5]]]
flatDeep(nested, Infinity); // [1, 2, 3, 4, 5]

// Real-world use in React: flattening data from nested API responses
const departments = [
  { name: 'Eng', teams: [{ name: 'Frontend', members: ['Alice', 'Bob'] }, { name: 'Backend', members: ['Carol'] }] },
  { name: 'Design', teams: [{ name: 'Product', members: ['Dave'] }] },
];

const allMembers = departments.flatMap(d => d.teams.flatMap(t => t.members));
// ['Alice', 'Bob', 'Carol', 'Dave']`,
        explanation: 'Recursive reduce: spread flattened sub-arrays. depth - 1 tracks remaining depth. flatMap chains are the real-world equivalent.',
      },
    ],
    interviewQuestions: [
      {
        question: 'What is the time and space complexity of common array operations?',
        answer: `**Array:**
- Access by index: O(1)
- Search (unsorted): O(n)
- Insertion at end (push): O(1) amortized
- Insertion at start (unshift): O(n) — shifts everything
- Deletion at start (shift): O(n) — shifts everything
- Deletion at end (pop): O(1)

**Object/Map:**
- Access/insert/delete: O(1) average
- Iteration: O(n)

**Set:**
- Add/has/delete: O(1) average
- Iteration: O(n)

**Common algorithm complexities:**
- Sorting (Array.sort, quicksort): O(n log n)
- Binary search: O(log n)
- BFS/DFS on graph: O(V + E)
- Two-pointer technique: O(n)
- Sliding window: O(n)

**When to use what:**
- Need O(1) lookup? → Object or Map
- Need unique values? → Set
- Need ordered data? → Array
- Frequent insertions/deletions at start? → Linked list (but rarely needed in JS)`,
        difficulty: 'medium',
      },
    ],
  },
];
