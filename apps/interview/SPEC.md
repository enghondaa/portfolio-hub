# Prompt: Build a Comprehensive Frontend Interview Study Platform

You are a senior frontend developer with 10+ years of experience in React and Next.js. You are building a personal study platform for a senior frontend developer preparing for React/Next.js interviews. This is NOT a generic tutorial site — it's a focused, interactive interview prep tool.

## Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand (for progress tracking)
- **Code Highlighting:** Prism.js or Shiki
- **Animations:** Framer Motion (subtle, professional)
- **Storage:** localStorage for progress tracking (no backend needed)
- **Deployment:** Vercel-ready

## Design Requirements
- Dark mode by default with light mode toggle
- Clean, minimal UI — inspired by the official React docs (react.dev) and Stripe's documentation
- Sidebar navigation with collapsible sections
- Progress tracking (percentage per topic, checkboxes per subtopic)
- Mobile responsive — must work perfectly on phone for studying on the go
- Each topic page should have: explanation → code example → interactive playground (where possible) → common interview questions → "gotchas" section
- Use a consistent color scheme: dark navy background, soft blue accents, white/gray text
- Code blocks must be syntax-highlighted, copyable with one click, and have a "Run" button where applicable
- Add a search bar (Cmd+K) that searches across all topics
- Add a "Random Question" button in the header that picks a random interview question from any topic
- Add a "Confidence Rating" system: after studying each subtopic, user rates themselves 1-5 stars. This feeds into a dashboard showing weak areas.

## Content Structure

Create the following topics with FULL content — not placeholders, not "coming soon", not summaries. Each topic must have real, working code examples, detailed explanations, and actual interview questions with model answers.

---

### MODULE 1: JavaScript Core (The Foundation)

#### 1.1 Execution Context & Hoisting
- What is execution context (global, function, eval)
- Creation phase vs execution phase
- Variable hoisting (var vs let vs const)
- Function hoisting (declarations vs expressions)
- Temporal Dead Zone (TDZ)
- **Code examples:** At least 5 tricky hoisting questions with step-by-step explanations
- **Interview questions:** 3-5 real questions with model answers

#### 1.2 Closures
- What closures are and how they form
- Lexical scope chain
- Practical uses: data privacy, function factories, partial application
- Closures in loops (the classic `var` vs `let` problem)
- Memory implications of closures
- **Code examples:** 5+ examples progressing from basic to tricky
- **Interview questions:** 5 questions including "what will this output?" style

#### 1.3 The `this` Keyword
- `this` in global context
- `this` in object methods
- `this` in arrow functions vs regular functions
- `this` with call, apply, bind
- `this` in event handlers
- `this` in classes
- **Code examples:** 6+ examples covering every scenario
- **Interview questions:** 5 questions with trick scenarios

#### 1.4 Prototypes & Inheritance
- Prototype chain
- `__proto__` vs `prototype`
- Object.create()
- ES6 classes (syntactic sugar explanation)
- `instanceof` and how it works
- **Code examples:** Show prototype chain visually with code

#### 1.5 Event Loop & Asynchronous JavaScript
- Call stack
- Web APIs
- Callback queue (macrotask queue)
- Microtask queue (Promise queue)
- Order of execution: synchronous → microtasks → macrotasks
- requestAnimationFrame in the event loop
- **Code examples:** 8+ "what's the output order?" examples with step-by-step execution breakdown
- **Interactive widget:** An event loop visualizer that shows code executing step by step
- **Interview questions:** 5-8 questions (this is the #1 most asked topic)

#### 1.6 Promises & Async/Await
- Promise states (pending, fulfilled, rejected)
- Promise chaining
- Promise.all, Promise.allSettled, Promise.race, Promise.any — with real use cases for each
- Error handling (try/catch vs .catch, common mistakes)
- Async/await under the hood (it's just promises)
- Sequential vs parallel execution
- **Code examples:** 6+ real-world patterns
- **Interview questions:** 5 questions including error handling edge cases

#### 1.7 ES6+ Features Deep Dive
- Destructuring (nested, default values, renaming)
- Spread/rest operators (objects, arrays, function params)
- Optional chaining (?.) and nullish coalescing (??)
- Map, Set, WeakMap, WeakSet — when to use each
- Symbols and their use cases
- Generators and iterators (basic understanding)
- Proxy and Reflect (basic understanding)
- **Code examples:** Practical examples for each feature

#### 1.8 Array & Object Methods
- map, filter, reduce, find, findIndex, some, every, flatMap, flat
- Object.keys, Object.values, Object.entries, Object.fromEntries, Object.assign
- Immutable patterns (spread, structuredClone)
- **Code examples:** Real-world data transformation challenges
- **Practice problems:** 5 "transform this data" exercises with solutions

#### 1.9 Type Coercion & Equality
- Abstract vs strict equality (== vs ===)
- Type coercion rules
- Truthy and falsy values (complete list)
- Common gotchas: `[] == false`, `"" == 0`, `null == undefined`
- **Code examples:** 10+ "true or false?" quick-fire examples

#### 1.10 Scope & Variable Declarations
- Global scope, function scope, block scope
- var vs let vs const — complete comparison
- Variable shadowing
- IIFE pattern and why it existed
- Module scope
- **Code examples:** 5+ scope-related trick questions

---

### MODULE 2: React Deep Dive

#### 2.1 How React Works Under the Hood
- Virtual DOM and Fiber architecture
- Reconciliation algorithm
- Diffing strategy (key importance, element type comparison)
- Batching updates (React 18 automatic batching)
- Concurrent features overview
- **Diagram:** Visual representation of the reconciliation process
- **Interview questions:** "Explain how React updates the DOM" — model answer

#### 2.2 Component Lifecycle (Class vs Functional)
- Class lifecycle methods mapping to hooks
- Mount → Update → Unmount phases
- Why componentDidMount !== useEffect (the subtle differences)
- Strict Mode double-rendering and why it exists
- **Code examples:** Side-by-side class vs functional component

#### 2.3 Hooks — Complete Guide
For EACH hook below, provide: what it does, syntax, when to use it, when NOT to use it, common mistakes, and 2+ code examples.

- **useState:** Lazy initialization, functional updates, object state pitfalls
- **useEffect:** Dependency array (empty, populated, none), cleanup function, race conditions, AbortController
- **useRef:** DOM refs, mutable values that don't trigger re-renders, callback refs
- **useMemo:** When it actually helps vs premature optimization, reference equality
- **useCallback:** Stabilizing callbacks for child components, the connection to React.memo
- **useReducer:** Complex state logic, dispatch pattern, when to choose over useState
- **useContext:** Creating context, consuming context, performance pitfalls
- **useLayoutEffect:** vs useEffect, measuring DOM, preventing flicker
- **useId:** Accessibility, server/client ID matching
- **useDeferredValue:** Concurrent React, keeping UI responsive
- **useTransition:** startTransition, isPending pattern
- **Interview questions per hook:** 2-3 each

#### 2.4 Custom Hooks
- Rules of hooks
- How to extract logic into custom hooks
- Build these custom hooks step by step with full explanation:
  - useDebounce
  - useThrottle
  - useFetch (with loading, error, abort)
  - useLocalStorage
  - useMediaQuery
  - useClickOutside
  - useIntersectionObserver
  - usePrevious
  - useToggle
  - useWindowSize
- **Interview task:** "Build a useDebounce hook" — walk through solution

#### 2.5 State Management Patterns
- Local state vs global state — decision framework
- Prop drilling and why it's sometimes fine
- Context API — implementation, performance problem, solutions
- Zustand — setup, selectors, middleware, why it's better than Context for global state
- Redux Toolkit — slices, createAsyncThunk, RTK Query basics
- When to use what — decision tree
- **Code examples:** Same feature built with Context, Zustand, and Redux for comparison

#### 2.6 React Performance Optimization
- When React re-renders (parent re-render, state change, context change)
- React.memo — how it works, when to use, shallow comparison
- useMemo and useCallback — real performance gains vs premature optimization
- Code splitting with React.lazy and Suspense
- Virtualization (react-window / react-virtuoso) for large lists
- Image optimization strategies
- Bundle analysis and tree shaking
- React DevTools Profiler walkthrough
- **Code examples:** Before/after optimization with measurable difference
- **Interview question:** "This component is slow, how would you optimize it?" — model answer

#### 2.7 React Patterns
- Compound Components
- Render Props
- Higher-Order Components (HOC)
- Controlled vs Uncontrolled Components
- Container/Presentational pattern
- Composition vs Inheritance
- Slot pattern
- **Code examples:** Each pattern with real-world use case

#### 2.8 Error Handling in React
- Error Boundaries (class-based, why no hook equivalent yet)
- Fallback UI patterns
- Error handling in async operations
- Global error handling strategy
- **Code examples:** Complete error boundary implementation with recovery

#### 2.9 Forms in React
- Controlled vs uncontrolled forms
- React Hook Form — setup, validation, performance benefits
- Zod integration for schema validation
- Complex form patterns (multi-step, dynamic fields)
- **Code examples:** Complete form with validation

#### 2.10 React 18/19 Features
- Automatic batching
- Transitions (startTransition, useTransition)
- Suspense for data fetching
- Server Components (concept)
- React Compiler (React 19)
- use() hook
- **Code examples:** Each feature with practical usage

---

### MODULE 3: Next.js Mastery

#### 3.1 App Router Architecture
- File-based routing (page.tsx, layout.tsx, loading.tsx, error.tsx, not-found.tsx)
- Route groups
- Parallel routes
- Intercepting routes
- Dynamic routes ([slug], [...slug], [[...slug]])
- **Code examples:** Complete routing setup for a real app

#### 3.2 Server Components vs Client Components
- What are React Server Components
- "use client" directive — when and why
- Serialization boundary (what can't pass from server to client)
- Composition patterns (server parent with client children)
- When to use which — decision tree with examples
- **Code examples:** Same feature built as server vs client component, explaining tradeoffs
- **Interview question:** "Explain Server Components" — model answer

#### 3.3 Data Fetching Patterns
- Server-side fetching in Server Components
- Route handlers (API routes in App Router)
- Server Actions — forms, mutations, revalidation
- Parallel data fetching
- Sequential data fetching
- Streaming with Suspense
- **Code examples:** Each pattern with real scenario

#### 3.4 Rendering Strategies
- Static Rendering (default)
- Dynamic Rendering (when it triggers)
- Streaming
- ISR (Incremental Static Regeneration) — revalidate, on-demand
- PPR (Partial Prerendering) — concept
- When to use what — decision matrix
- **Code examples:** Same page built with different strategies

#### 3.5 Caching in Next.js
- Request Memoization
- Data Cache
- Full Route Cache
- Router Cache
- cache() function
- revalidatePath, revalidateTag
- Opting out of caching
- **Diagram:** Visual caching layers diagram
- **This is the #1 most confusing Next.js topic — explain it extremely clearly**

#### 3.6 Middleware
- What middleware can do
- Authentication patterns
- Redirects and rewrites
- Geolocation-based routing
- Rate limiting concept
- **Code examples:** Auth middleware, locale detection

#### 3.7 Image & Font Optimization
- next/image — sizes, priority, placeholder, formats
- next/font — Google fonts, local fonts, variable fonts
- Core Web Vitals impact
- **Code examples:** Optimized image gallery, font setup

#### 3.8 SEO & Metadata
- Static metadata
- Dynamic metadata (generateMetadata)
- Open Graph, Twitter cards
- Sitemap generation
- robots.txt
- JSON-LD structured data
- **Code examples:** Complete SEO setup for a production app

#### 3.9 Authentication in Next.js
- NextAuth.js / Auth.js setup
- Middleware-based auth
- Protected routes pattern
- Session management (JWT vs database)
- **Code examples:** Complete auth flow

#### 3.10 Deployment & Production
- Vercel deployment
- Environment variables (.env.local, NEXT_PUBLIC_)
- Edge runtime vs Node.js runtime
- Monitoring and analytics
- Common production issues

---

### MODULE 4: TypeScript for React

#### 4.1 TypeScript Fundamentals
- Basic types, interfaces, type aliases
- Union and intersection types
- Literal types
- Type narrowing and type guards
- Enums vs const objects
- **Code examples:** Each concept with React context

#### 4.2 Generics
- Generic functions
- Generic components
- Generic hooks
- Constraints (extends)
- Default generic types
- **Code examples:** Build a generic Table component, generic useFetch hook

#### 4.3 Utility Types
- Partial, Required, Pick, Omit
- Record, Extract, Exclude
- ReturnType, Parameters
- NonNullable
- Awaited
- Custom utility types
- **Code examples:** Real-world usage in React components

#### 4.4 TypeScript with React Patterns
- Typing props (children, event handlers, styles)
- Typing hooks (useState with generics, useRef)
- Typing context
- Discriminated unions for component variants
- Polymorphic components ("as" prop)
- ComponentPropsWithoutRef, ComponentPropsWithRef
- **Code examples:** Each pattern fully typed

#### 4.5 Advanced TypeScript
- Conditional types
- Mapped types
- Template literal types
- infer keyword
- Declaration merging
- Module augmentation
- **Code examples:** Building complex types step by step

---

### MODULE 5: Frontend System Design

#### 5.1 How to Approach System Design
- Framework: Requirements → Architecture → Component Design → Data Flow → API Design → Performance → Accessibility
- Communication tips (think out loud, ask clarifying questions, discuss tradeoffs)
- Time management (don't spend 15 min on requirements)

#### 5.2 Design: Analytics Dashboard
- Requirements gathering
- Component architecture
- Real-time data handling (WebSocket vs polling)
- Chart library selection and integration
- State management for filters/date ranges
- Responsive layout strategy
- Performance with large datasets
- **Full walkthrough with diagrams and code structure**

#### 5.3 Design: E-Commerce Product Page
- Image gallery with zoom
- Variant selection (size, color)
- Add to cart flow
- Reviews section (pagination, sorting)
- SEO considerations
- Performance budget
- **Full walkthrough**

#### 5.4 Design: Chat Application
- Real-time messaging (WebSocket)
- Message list virtualization
- Typing indicators
- File/image sharing
- Offline support
- Optimistic updates
- **Full walkthrough**

#### 5.5 Design: Infinite Scroll Feed
- Virtualization
- Data fetching strategy (cursor-based pagination)
- Image lazy loading
- Scroll position restoration
- Memory management
- **Full walkthrough with code**

#### 5.6 Design: Form Builder
- Dynamic form generation from JSON schema
- Drag and drop
- Validation engine
- Conditional fields
- Undo/redo
- **Full walkthrough**

---

### MODULE 6: Performance & Web Vitals

#### 6.1 Core Web Vitals
- LCP (Largest Contentful Paint) — what affects it, how to optimize
- FID/INP (First Input Delay / Interaction to Next Paint) — how to measure and fix
- CLS (Cumulative Layout Shift) — common causes and fixes
- How to measure (Lighthouse, Web Vitals library, Chrome DevTools)
- **Code examples:** Before/after fixes for each metric

#### 6.2 Bundle Optimization
- Code splitting strategies
- Dynamic imports
- Tree shaking (how it works, what breaks it)
- Bundle analyzer usage
- Lazy loading routes and components

#### 6.3 Network Performance
- HTTP/2 and HTTP/3 benefits
- Resource hints (preload, prefetch, preconnect)
- Service workers basics
- Caching strategies (Cache-Control headers)
- CDN usage

#### 6.4 Runtime Performance
- Avoiding layout thrashing
- requestAnimationFrame usage
- Web Workers for heavy computation
- Debouncing and throttling (implementation from scratch)
- Memory leaks in React (common causes and fixes)

---

### MODULE 7: Testing

#### 7.1 Testing Philosophy
- Testing pyramid (unit, integration, e2e)
- What to test in frontend applications
- Testing user behavior, not implementation

#### 7.2 Jest Fundamentals
- Test structure (describe, it, expect)
- Matchers
- Mocking (jest.fn, jest.mock, jest.spyOn)
- Async testing
- **Code examples:** 5+ test files for different scenarios

#### 7.3 React Testing Library
- Queries (getBy, findBy, queryBy — when to use which)
- User events (userEvent vs fireEvent)
- Testing hooks
- Testing forms
- Testing async components
- MSW (Mock Service Worker) for API mocking
- **Code examples:** Complete test suite for a real component

#### 7.4 E2E Testing Basics
- Cypress or Playwright overview
- When to write e2e tests
- Common patterns

---

### MODULE 8: Behavioral Interview Prep

#### 8.1 STAR Method
- Situation, Task, Action, Result framework
- How to structure answers
- Keeping answers concise (2-3 minutes max)

#### 8.2 Prepared Stories (Tailored to the CV)
Write model STAR answers for these common questions using real scenarios from Youhue, Bezoge, and SimonTech:

- "Tell me about yourself" — 90 second pitch
- "Tell me about a challenging technical problem you solved" — use the bounce rate reduction (68% → 42%)
- "Tell me about a time you led a project" — use managing 3 concurrent projects at Youhue
- "How do you handle disagreements with team members?" — use cross-functional team collaboration
- "Tell me about a time you improved performance" — use the 45% page load improvement
- "Why did you switch from civil engineering to software?" — frame as a strength
- "How do you stay updated with new technologies?"
- "Tell me about a time you failed"
- "How do you mentor junior developers?"
- "Why are you leaving your current role?" — diplomatic answer template

#### 8.3 Questions to Ask the Interviewer
- 10 smart questions that show seniority and genuine interest
- Questions to avoid
- How to tailor questions to the company

---

### MODULE 9: Coding Challenges (Frontend-Focused)

#### 9.1 DOM Manipulation Challenges
- Implement debounce from scratch
- Implement throttle from scratch
- Implement a simple event emitter
- Implement Promise.all from scratch
- Implement Array.prototype.map/filter/reduce from scratch
- Deep clone an object
- Flatten a nested array/object
- **Each with: problem statement, hints, step-by-step solution, time complexity**

#### 9.2 React Coding Challenges
- Build a todo app with add, delete, edit, filter, persist to localStorage
- Build an autocomplete/search component with debouncing
- Build an infinite scroll component
- Build a modal/dialog system
- Build a multi-step form with validation
- Build a data table with sorting, filtering, pagination
- Build a star rating component
- Build a countdown timer
- Build a drag-and-drop kanban board
- **Each with: requirements, starter code, complete solution, and explanation of key decisions**

#### 9.3 LeetCode Essentials (Frontend-Relevant Only)
- Two Sum
- Valid Parentheses
- Merge Two Sorted Lists
- Best Time to Buy and Sell Stock
- Group Anagrams
- Longest Substring Without Repeating Characters
- Flatten Deeply Nested Array
- **Each with: problem, brute force solution, optimized solution, time/space complexity**

---

## IMPORTANT IMPLEMENTATION NOTES

1. **DO NOT use placeholder content anywhere.** Every section must have complete, real, working content. If a section says "5 code examples," there must be 5 actual code examples.

2. **Code examples must be correct and runnable.** Test them mentally — don't write code that has bugs. Use TypeScript for all React/Next.js examples.

3. **Interview questions must have model answers.** Not just the question — include a complete, well-structured answer that someone could memorize and adapt.

4. **Progress tracking must persist.** Use localStorage + Zustand. Show overall progress on the dashboard and per-module progress on each module page.

5. **The search must actually work.** Index all content and make it searchable via Cmd+K or a search bar.

6. **Make it printable.** Add a print-friendly stylesheet so users can print individual topics.

7. **Add a "Study Mode" toggle** that hides answers/solutions until clicked, so users can test themselves.

8. **Add estimated study time per topic** based on content length (e.g., "~45 min" for closures).

9. **Add a "Daily Study Plan" page** that suggests what to study today based on confidence ratings and last-studied dates.

10. **Add a "Mock Interview" mode** that presents random questions across all modules with a timer (3 minutes per question), and the user can reveal the model answer after attempting it.

## File Structure Expected:
```
src/
  app/
    layout.tsx
    page.tsx (dashboard with progress overview)
    modules/
      javascript/
        page.tsx (module overview)
        [topic]/
          page.tsx (full topic content)
      react/
        page.tsx
        [topic]/
          page.tsx
      nextjs/
        ...
      typescript/
        ...
      system-design/
        ...
      performance/
        ...
      testing/
        ...
      behavioral/
        ...
      coding-challenges/
        ...
    mock-interview/
      page.tsx
    study-plan/
      page.tsx
  components/
    layout/
      Sidebar.tsx
      Header.tsx
      SearchModal.tsx
    ui/
      CodeBlock.tsx (syntax highlighted, copyable, runnable)
      ConfidenceRating.tsx
      StudyModeToggle.tsx
      ProgressBar.tsx
      InterviewQuestion.tsx (collapsible answer)
      Timer.tsx
    content/
      TopicPage.tsx (reusable topic layout)
  lib/
    content/ (all topic content as structured data)
    store.ts (Zustand store for progress)
    search.ts (search index)
  types/
    index.ts
```

Build this application completely. Do not skip sections. Do not write "TODO" or "more examples coming." This is a complete, production-ready study tool.
