import type { TopicContent } from '@/types';

export const reactContent: TopicContent[] = [
  {
    id: 'how-react-works',
    moduleId: 'react',
    title: 'How React Works Under the Hood',
    description: 'Virtual DOM, Fiber architecture, reconciliation, and React 18 automatic batching',
    estimatedTime: '50 min',
    sections: [
      {
        title: 'Virtual DOM',
        content: `The **Virtual DOM (VDOM)** is a lightweight JavaScript representation of the real DOM. Instead of directly manipulating the DOM (which is slow), React:

1. Maintains a virtual copy of the DOM in memory
2. When state changes, creates a NEW virtual DOM tree
3. **Diffs** the new tree against the previous tree (reconciliation)
4. Calculates the minimum number of real DOM operations needed
5. Applies only those changes to the real DOM (commit phase)

**Why VDOM?** Direct DOM manipulation is expensive. Batching changes and doing minimal updates is faster. The VDOM also enables React to render to different targets (DOM, Native, Server) via different renderers.`,
      },
      {
        title: 'React Fiber Architecture',
        content: `**Fiber** is React's internal reconciliation engine (rewritten in React 16). Before Fiber, the old reconciler was synchronous and couldn't be interrupted — long renders would block the main thread.

Fiber enables:
- **Incremental rendering:** Split rendering work into small chunks (fibers)
- **Prioritization:** Assign priority to different updates (user input > data fetch)
- **Pause and resume:** Pause work to handle higher-priority updates
- **Abort:** Abandon low-priority work if something more important comes up
- **Reuse:** Reuse previously completed work

A **Fiber node** is a JavaScript object representing a unit of work — one per React element. The Fiber tree mirrors the component tree.`,
      },
      {
        title: 'Reconciliation & Diffing',
        content: `React's diffing algorithm makes two assumptions to achieve O(n) complexity instead of O(n³):

1. **Different element types produce different trees.** If root element type changes (e.g., \`<div>\` → \`<span>\`), React tears down the old tree and builds new.

2. **Keys hint at stable identity.** Elements with matching keys between renders are assumed to be the same element, even if they moved in the list.

**Diffing rules:**
- Same element type: React updates only changed attributes, keeps DOM node
- Different element type: Full remount (component state is lost!)
- Lists without keys: React compares by position (inefficient)
- Lists with keys: React matches by key (efficient, preserves state)`,
      },
      {
        title: 'React 18 Automatic Batching',
        content: `**Batching** = grouping multiple state updates into a single re-render.

**Before React 18:** React only batched updates in React event handlers. Updates in setTimeout, Promises, or native event listeners were NOT batched (each caused a separate render).

**React 18:** Automatic batching everywhere — setTimeout, Promises, native events. React groups all state updates and re-renders once.

\`\`\`js
// React 18: only ONE re-render despite 2 setState calls
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // renders once! (was two renders before React 18)
}, 1000);
\`\`\`

If you need to opt out: \`flushSync\` from \`react-dom\`.`,
      },
    ],
    codeExamples: [
      {
        title: 'Why keys matter in lists',
        language: 'tsx',
        code: `// BAD: no keys — React compares by position
// Moving an item forces React to re-render everything
function BadList({ items }) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item.name}</li> // index as key is bad if list reorders!
      ))}
    </ul>
  );
}

// GOOD: stable unique keys
function GoodList({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li> // stable ID
      ))}
    </ul>
  );
}

// Why index as key fails:
// Original: [{id:1, name:'A'}, {id:2, name:'B'}]
// Keys:      [0,               1               ]
// After prepend: [{id:3, name:'C'}, {id:1, name:'A'}, {id:2, name:'B'}]
// Keys:           [0,               1,               2               ]
// React thinks key:0 changed from A→C, key:1 changed from B→A — expensive re-render
// Worse: input state on key:0 goes to the new item C`,
        explanation: 'Keys tell React which elements are the same across renders. Unstable keys (like index) cause incorrect behavior.',
      },
      {
        title: 'React 18 automatic batching',
        language: 'typescript',
        code: `import { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';

function Counter() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  // React 18: batched automatically — only 1 re-render
  const handleClick = () => {
    setCount(c => c + 1);
    setFlag(f => !f);
    // ONE render
  };

  // React 18: also batched in setTimeout!
  useEffect(() => {
    setTimeout(() => {
      setCount(c => c + 1);
      setFlag(f => !f);
      // ONE render (was TWO in React 17)
    }, 1000);
  }, []);

  // Opt out of batching when needed
  const handleSyncUpdate = () => {
    flushSync(() => setCount(c => c + 1)); // immediate re-render
    flushSync(() => setFlag(f => !f));      // another immediate re-render
    // TWO renders
  };

  console.log('render'); // check how often this logs
  return <div>{count} - {String(flag)}</div>;
}`,
        explanation: 'React 18 batches all state updates by default. flushSync opts out for cases where you need synchronous DOM updates.',
      },
      {
        title: 'Component type change forces full remount',
        language: 'tsx',
        code: `function Parent({ isLoggedIn }: { isLoggedIn: boolean }) {
  // React sees DIFFERENT element types based on condition
  // Complete unmount/remount — state is LOST
  return isLoggedIn ? <UserDashboard /> : <LoginForm />;
}

// BUT: same type, different props → React updates, state preserved
function Tabs({ activeTab }: { activeTab: 'profile' | 'settings' }) {
  // Same <TabContent> element type always
  // React just updates props — state inside TabContent is preserved
  return <TabContent key={activeTab} tab={activeTab} />;
  // NOTE: adding key forces unmount/remount when tab changes
  // Use key intentionally to reset state!
}

// Trick: force remount to reset state by changing the key
function SearchInput({ searchId }: { searchId: string }) {
  // When searchId changes, this component fully resets
  return <Input key={searchId} defaultValue="" />;
}`,
        explanation: 'Same element type = update (state preserved). Different type = full remount (state lost). key prop lets you force resets.',
      },
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between state and props?',
        answer: `**State** and **Props** are both plain JavaScript objects used to hold data that influences the render output, but they serve different roles:

* **State (Internal & Mutable):**
  - Managed *locally* inside the component itself.
  - Can be changed over time (usually via hooks like \`useState\` or \`useReducer\`).
  - When state changes, the component (and its children) re-renders.
  - Think of it as a component's private local memory.

* **Props (External & Immutable):**
  - Passed *down* to the component by its parent (external configuration).
  - Read-only (immutable) to the receiving component. Changing props in a child is a major anti-pattern.
  - If the parent passes new props, the child component automatically re-renders.
  - Think of props as arguments passed to a function.

| Feature | State | Props |
|---|---|---|
| Owned by | Component itself | Parent component |
| Mutable | Yes (via updater function) | No (read-only) |
| Triggers re-render | Yes | Yes |
| Access | Internal to component | Passed from outside |`,
        difficulty: 'easy',
      },
      {
        question: 'What is JSX and how does it work?',
        answer: `**JSX** (JavaScript XML) is a syntax extension for JavaScript that allows you to write HTML-like structures directly inside your JavaScript code. 

**How it works:**
1. **Developer Writes JSX:** You write code that looks like HTML for readability.
2. **Build-Time Compilation:** The browser cannot run JSX directly. During build time, compilers like Babel or TypeScript transform JSX into standard JavaScript function calls.
3. **New React Transform (React 17+):**
   \`\`\`jsx
   // JSX input
   const el = <h1 className="title">Hello</h1>;

   // Compiled output
   import { jsx as _jsx } from 'react/jsx-runtime';
   const el = _jsx('h1', { className: 'title', children: 'Hello' });
   \`\`\`
4. **React Element Creation:** These function calls return plain JavaScript objects called **React Elements** (e.g., \`{ type: 'h1', props: { className: 'title', children: 'Hello' } }\`), which describe the DOM structure to React.
5. **Real DOM Injection:** React takes these elements and mounts/commits them to the browser DOM.`,
        difficulty: 'easy',
      },
      {
        question: 'What is the virtual DOM and why does React use it?',
        answer: `The **Virtual DOM (VDOM)** is a lightweight, in-memory representation of the real DOM elements. It is a programming concept where a virtual representation of the UI is kept in memory and synced with the "real" DOM (a process called **reconciliation**).

**Why React uses it:**
1. **Real DOM manipulation is slow:** Updating DOM nodes in browsers is expensive because it triggers browser layout engines to recalculate styles, reflow layout, and repaint the screen.
2. **Batching Updates:** Instead of changing the real DOM node-by-node every time a variable changes, React re-renders the component tree in memory (Virtual DOM) first.
3. **Diffing Algorithm:** React compares (diffs) the new Virtual DOM tree with the previous Virtual DOM tree to find *exactly* what changed.
4. **Minimal Writes:** Once the differences are found, React batches the minimum number of real DOM updates required and commits them in a single paint phase, drastically improving performance.`,
        difficulty: 'easy',
      },
      {
        question: 'What is the difference between a functional and class component?',
        answer: `Historically, React components were written as **Class Components**, but modern React codebases use **Functional Components** with Hooks.

* **Functional Components:**
  - Plain JavaScript functions that accept props and return JSX.
  - Use **Hooks** (like \`useState\`, \`useEffect\`) to manage state and lifecycle.
  - No \`this\` keyword, avoiding binding issues and making code cleaner.
  - Less boilerplate, easier to test, and naturally optimized by JavaScript engines.

* **Class Components:**
  - ES6 classes extending \`React.Component\`.
  - Require a \`render()\` method to return JSX.
  - Manage state via \`this.state\` and \`this.setState()\`.
  - Use lifecycle methods (like \`componentDidMount\`, \`componentDidUpdate\`, \`componentWillUnmount\`).
  - Rely heavily on the \`this\` keyword, requiring binding for event handlers.

**Summary Comparison:**
- Functional components are simpler, modern, and use hooks. Class components are legacy (though still supported) and are only strictly required for features like Error Boundaries (\`componentDidCatch\`).`,
        difficulty: 'easy',
      },
      {
        question: 'How do you handle events in React?',
        answer: `Handling events in React is similar to handling events on DOM elements, with a few key syntactic and architectural differences:

1. **CamelCase Naming:** Event handlers are named using camelCase (e.g., \`onClick\` instead of \`onclick\`, \`onChange\` instead of \`onchange\`).
2. **Function Reference:** You pass a function pointer as the event handler rather than a string:
   \`\`\`jsx
   // React
   <button onClick={handleClick}>Click Me</button>
   
   // HTML counterpart
   <button onclick="handleClick()">Click Me</button>
   \`\`\`
3. **Prevent Default Behavior:** You must call \`e.preventDefault()\` explicitly; returning \`false\` from a handler does not prevent the default behavior.
4. **Synthetic Events:** React wraps browser native events into a **\`SyntheticEvent\`** object. This ensures cross-browser compatibility. React pools and delegates these events at the root node rather than binding them directly to individual DOM nodes (improving memory efficiency).`,
        difficulty: 'easy',
      },
      {
        question: "How does React's reconciliation algorithm decide what to re-render?",
        answer: `**Reconciliation** is React's diffing algorithm used to compare the new virtual tree with the previous one. It determines which DOM elements need to be updated, inserted, or removed.

**Heuristic Diffing Rules (O(n) complexity):**
1. **Different Element Types:** If two elements have different types (e.g., \`<div>\` to \`<span>\`, or \`<ComponentA>\` to \`<ComponentB>\`), React destroys the old tree entirely. It unmounts the old components (destroying state) and builds the new DOM from scratch.
2. **Same DOM Element Type:** If elements have the same HTML type (e.g., \`<div className="old">\` to \`<div className="new">\`), React keeps the DOM node, updates only the changed attributes (className), and recursively diffs its children.
3. **Same Component Type:** If components are of the same type, React keeps the component instance alive, updates its props to match the new render, and triggers its render method.
4. **Recoursing on Children (Keys):** By default, React diffs children list items by index. When a \`key\` is provided, React matches elements in the old tree with elements in the new tree using keys, avoiding unnecessary destroys and remounts.`,
        difficulty: 'hard',
      },
      {
        question: 'How does React handle list rendering and why does key matter?',
        answer: `In React, list rendering is accomplished by mapping over an array of data and returning a JSX element for each item (typically using \`.map()\`).

**Why the "key" prop matters:**
1. **Reconciliation Identification:** React uses the \`key\` prop to keep track of item identities across renders. It enables the diffing algorithm to distinguish between modified, added, or deleted elements.
2. **Performance Optimization:** Without keys, React compares items by position (index). If you prepend an item to a list of 100 items, React will re-render all 100 items because their index/position shifted. With unique keys, React knows 100 items are unchanged and only inserts the 1 new DOM node.
3. **Preserving Component State:** If a list item has local state (like an input field), omitting or using unstable keys (like \`Math.random()\` or index) causes state leaks where inputs swap places or clear unexpectedly when items are sorted/reordered.

**Rules for Keys:**
- Must be **unique** among siblings.
- Must be **stable** (do not use indices if list can be sorted, deleted from, or prepended to; do not use random numbers generated during render).`,
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'hooks',
    moduleId: 'react',
    title: 'Hooks — Complete Guide',
    description: 'Every hook you need to know with syntax, when to use, when not to, and common mistakes',
    estimatedTime: '90 min',
    sections: [
      {
        title: 'Rules of Hooks',
        content: `React hooks have two strict rules enforced by \`eslint-plugin-react-hooks\`:

1. **Only call hooks at the top level** — not inside loops, conditions, or nested functions. This ensures hook call order is consistent between renders (React tracks hooks by order).

2. **Only call hooks from React functions** — React functional components or custom hooks. Not regular JavaScript functions.

**Why these rules?** React relies on the ORDER of hook calls to associate state with the right hook. If you call hooks conditionally, the order can change between renders, corrupting the state association.`,
      },
      {
        title: 'useState — lazy initialization & functional updates',
        content: `**Lazy initialization:** Pass a function to useState for expensive initial state computation. The function runs only on first render.
\`\`\`js
const [data, setData] = useState(() => JSON.parse(localStorage.getItem('data') ?? 'null'));
\`\`\`

**Functional updates:** When new state depends on old state, use the functional form to avoid stale closures.
\`\`\`js
setCount(prev => prev + 1); // always uses current state
// vs
setCount(count + 1); // uses captured count — can be stale!
\`\`\`

**Object state pitfall:** setState replaces state, it doesn't merge. For objects, spread explicitly.
\`\`\`js
setUser(prev => ({ ...prev, name: 'Alice' })); // merge
\`\`\``,
      },
      {
        title: 'useEffect — the complete guide',
        content: `**When does useEffect run?**
- After every render (no deps array)
- After first render only (\`[]\` — empty deps array)
- After renders where the listed deps changed (\`[dep1, dep2]\`)

**The cleanup function:** Return a function to clean up side effects. Runs before next effect AND on unmount.

**Common mistakes:**
1. Missing dependencies (stale closure bug)
2. Not cleaning up (memory leaks, stale subscriptions)
3. Putting everything in one useEffect (should be split by concern)
4. Using useEffect for synchronous data transformation (just compute during render)
5. Race conditions in data fetching (need AbortController)

**When NOT to use useEffect:**
- Transforming data for rendering (just do it in render)
- User event handlers (put logic there, not in effect)
- Initializing non-React state once (just do it outside component)`,
      },
      {
        title: 'useRef — mutable values that dont trigger re-renders',
        content: `\`useRef\` returns a mutable \`{ current: ... }\` object. The object persists for the full lifetime of the component. Changing \`.current\` does NOT trigger a re-render.

**Two use cases:**
1. **DOM access:** Pass ref to a JSX element's \`ref\` prop to get the DOM node
2. **Mutable instance variable:** Store values that need to persist but shouldn't trigger re-renders (previous value, timer IDs, whether component is mounted)

**Callback ref:** Instead of the ref object, pass a function. Called with the DOM node when it mounts, null when it unmounts. Useful for measuring or setting up third-party libs.`,
      },
      {
        title: 'useMemo and useCallback — when they actually help',
        content: `**useMemo:** Memoizes the result of an expensive calculation. Only recomputes when deps change.
\`\`\`js
const sorted = useMemo(() => [...items].sort(comparator), [items, comparator]);
\`\`\`

**useCallback:** Memoizes a function reference. Returns the same function instance until deps change.
\`\`\`js
const handleClick = useCallback(() => setCount(c => c + 1), []);
\`\`\`

**When they HELP:**
- Expensive computations (filtering/sorting large arrays)
- Passing callbacks to React.memo'd children (prevents unnecessary re-renders)
- Stable function references for useEffect deps

**When they DON'T help (premature optimization):**
- Simple calculations that are fast anyway (the memoization overhead costs more)
- Components that always re-render anyway (parent always re-renders)
- Functions not passed to memo'd children

**Rule:** Only optimize after you've measured a performance problem.`,
      },
      {
        title: 'useReducer — complex state logic',
        content: `\`useReducer\` is preferred over \`useState\` when:
- Next state depends on previous state in complex ways
- Multiple sub-values that update together
- State transitions have names/meaning (action types)
- Testing state logic separately from the component

\`\`\`js
function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT': return { ...state, count: state.count + 1 };
    case 'RESET': return initialState;
    default: throw new Error('Unknown action');
  }
}
const [state, dispatch] = useReducer(reducer, initialState);
dispatch({ type: 'INCREMENT' });
\`\`\``,
      },
      {
        title: 'useContext — consuming context',
        content: `\`useContext\` subscribes a component to a context. When context value changes, all components consuming that context re-render.

**Performance pitfall:** Every consumer re-renders when context value changes, even if they only need part of the value. Solutions:
1. Split context into multiple smaller contexts
2. Memoize the context value (\`useMemo\`)
3. Use Zustand or another state library for frequently-updated state

**When to use Context:**
- Theme (dark/light)
- Current user
- Locale/i18n
- Feature flags

**When NOT to use Context:**
- Frequently updated data (use Zustand/Redux instead)
- Data that only a few components need (just pass as props)`,
      },
    ],
    codeExamples: [
      {
        title: 'useState — all patterns',
        language: 'typescript',
        code: `import { useState } from 'react';

// Basic
const [count, setCount] = useState(0);

// TypeScript typing
const [user, setUser] = useState<{ name: string; age: number } | null>(null);

// Lazy initialization (function runs only once)
const [data, setData] = useState<string[]>(() => {
  try {
    return JSON.parse(localStorage.getItem('items') ?? '[]');
  } catch {
    return [];
  }
});

// Functional update (CORRECT when new state depends on old)
setCount(prev => prev + 1); // always safe
setCount(count + 1);         // can be stale in async contexts

// Object state — must spread, setState doesn't merge
const [form, setForm] = useState({ name: '', email: '', age: 0 });
const updateField = (field: string, value: string | number) => {
  setForm(prev => ({ ...prev, [field]: value }));
};

// Array state patterns
const [items, setItems] = useState<string[]>([]);
const addItem = (item: string) => setItems(prev => [...prev, item]);
const removeItem = (index: number) => setItems(prev => prev.filter((_, i) => i !== index));
const updateItem = (index: number, value: string) =>
  setItems(prev => prev.map((item, i) => i === index ? value : item));`,
        explanation: 'useState patterns: lazy init for expensive default, functional update for stale-closure safety, spread for objects.',
      },
      {
        title: 'useEffect — full patterns with cleanup and AbortController',
        language: 'typescript',
        code: `import { useState, useEffect } from 'react';

function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // AbortController prevents race conditions and memory leaks
    const abortController = new AbortController();

    async function fetchUser() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(\`/api/users/\${userId}\`, {
          signal: abortController.signal,
        });
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
        const data = await res.json();
        setUser(data);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return; // ignore abort
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }

    fetchUser();

    // Cleanup: abort in-flight request when userId changes or unmount
    return () => abortController.abort();
  }, [userId]); // re-run when userId changes

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>{user?.name}</div>;
}

// Event listener cleanup pattern
function WindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handler = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler); // MUST clean up
  }, []); // empty deps — register once

  return <div>{size.width} x {size.height}</div>;
}`,
        explanation: 'Always clean up effects. AbortController prevents race conditions in fetch. Empty deps runs once, listed deps on change.',
      },
      {
        title: 'useRef — DOM access and mutable values',
        language: 'typescript',
        code: `import { useRef, useEffect, useState } from 'react';

// DOM ref — focus management
function AutoFocusInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return <input ref={inputRef} placeholder="Auto-focused" />;
}

// Mutable value — previous state
function Counter() {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef(count);

  useEffect(() => {
    prevCountRef.current = count;
  }); // no deps — runs after every render

  return (
    <div>
      Current: {count}, Previous: {prevCountRef.current}
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
}

// Ref to avoid stale closure in setInterval
function StableTimer() {
  const [count, setCount] = useState(0);
  const callbackRef = useRef(() => setCount(c => c + 1));

  // Keep ref up to date with latest callback (not stale)
  useEffect(() => {
    callbackRef.current = () => setCount(c => c + 1);
  });

  useEffect(() => {
    const id = setInterval(() => callbackRef.current(), 1000);
    return () => clearInterval(id);
  }, []); // Only runs once — no stale closure!

  return <div>Count: {count}</div>;
}

// Callback ref — for measuring DOM
function MeasuredBox() {
  const [height, setHeight] = useState(0);

  const measuredRef = (node: HTMLDivElement | null) => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  };

  return (
    <div>
      <div ref={measuredRef} style={{ padding: 20 }}>Content here</div>
      <p>Height: {height}px</p>
    </div>
  );
}`,
        explanation: 'useRef for DOM access, previous values, and stable callbacks. Changing .current does not cause re-renders.',
      },
      {
        title: 'useReducer — todo list with complex state',
        language: 'typescript',
        code: `import { useReducer } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

type Action =
  | { type: 'ADD'; text: string }
  | { type: 'TOGGLE'; id: number }
  | { type: 'DELETE'; id: number }
  | { type: 'CLEAR_COMPLETED' };

interface State {
  todos: Todo[];
  nextId: number;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD':
      return {
        ...state,
        todos: [...state.todos, { id: state.nextId, text: action.text, completed: false }],
        nextId: state.nextId + 1,
      };
    case 'TOGGLE':
      return {
        ...state,
        todos: state.todos.map(t =>
          t.id === action.id ? { ...t, completed: !t.completed } : t
        ),
      };
    case 'DELETE':
      return { ...state, todos: state.todos.filter(t => t.id !== action.id) };
    case 'CLEAR_COMPLETED':
      return { ...state, todos: state.todos.filter(t => !t.completed) };
    default:
      return state;
  }
}

function TodoApp() {
  const [state, dispatch] = useReducer(reducer, { todos: [], nextId: 1 });

  return (
    <div>
      <button onClick={() => dispatch({ type: 'ADD', text: 'New todo' })}>
        Add
      </button>
      {state.todos.map(todo => (
        <div key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => dispatch({ type: 'TOGGLE', id: todo.id })}
          />
          {todo.text}
          <button onClick={() => dispatch({ type: 'DELETE', id: todo.id })}>X</button>
        </div>
      ))}
    </div>
  );
}`,
        explanation: 'useReducer shines for state with multiple sub-values and named transitions. The reducer is pure and easily testable.',
      },
      {
        title: 'useContext — theme example with performance',
        language: 'typescript',
        code: `import { createContext, useContext, useState, useMemo, ReactNode } from 'react';

type Theme = 'dark' | 'light';
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');

  // Memoize to prevent re-renders of all consumers when provider re-renders
  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme(t => t === 'dark' ? 'light' : 'dark'),
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook with error boundary
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}

// Consumer
function ThemedButton({ children }: { children: ReactNode }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      style={{
        background: theme === 'dark' ? '#1a1a1a' : '#ffffff',
        color: theme === 'dark' ? '#ffffff' : '#1a1a1a',
      }}
    >
      {children}
    </button>
  );
}`,
        explanation: 'Memoize context values to prevent unnecessary re-renders. Provide a custom hook for type safety and error messages.',
      },
      {
        title: 'useMemo and useCallback — real examples',
        language: 'typescript',
        code: `import { useMemo, useCallback, memo, useState } from 'react';

// useMemo — expensive computation
function DataTable({ data, filterText }: { data: Item[]; filterText: string }) {
  // Without useMemo: re-filters on every render (even unrelated state changes)
  // With useMemo: only re-filters when data or filterText changes
  const filtered = useMemo(
    () => data.filter(item =>
      item.name.toLowerCase().includes(filterText.toLowerCase())
    ),
    [data, filterText]
  );

  return <Table items={filtered} />;
}

// useCallback — stable reference for memoized children
interface ChildProps { onClick: () => void; }
const ExpensiveChild = memo(({ onClick }: ChildProps) => {
  console.log('ExpensiveChild rendered');
  return <button onClick={onClick}>Click me</button>;
});

function Parent() {
  const [count, setCount] = useState(0);
  const [other, setOther] = useState(false);

  // Without useCallback: new function reference every render
  // → ExpensiveChild re-renders every time Parent re-renders
  // With useCallback: same function reference when deps unchanged
  // → ExpensiveChild only re-renders when its deps actually change
  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []); // no deps: function never changes

  return (
    <div>
      <button onClick={() => setOther(o => !o)}>Toggle other</button>
      <ExpensiveChild onClick={handleClick} />
      Count: {count}
    </div>
  );
}`,
        explanation: 'useMemo avoids recomputation. useCallback + React.memo prevents unnecessary re-renders of expensive children.',
      },
      {
        title: 'useTransition and useDeferredValue — React 18 concurrent',
        language: 'typescript',
        code: `import { useState, useTransition, useDeferredValue } from 'react';

// useTransition — mark update as non-urgent
function SearchPage() {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Urgent: update input immediately
    setQuery(e.target.value);
    // Non-urgent: update search results (can be interrupted)
    startTransition(() => {
      setSearchResults(searchDatabase(e.target.value));
    });
  };

  return (
    <div>
      <input value={query} onChange={handleChange} />
      {isPending && <Spinner />}
      <ResultsList />
    </div>
  );
}

// useDeferredValue — defer re-rendering a slow component
function SearchWithDeferred({ query }: { query: string }) {
  // deferredQuery lags behind query — keeps UI responsive
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery; // show loading state

  return (
    <div style={{ opacity: isStale ? 0.5 : 1 }}>
      {/* SlowList re-renders with old query while typing, catches up when idle */}
      <SlowList query={deferredQuery} />
    </div>
  );
}`,
        explanation: 'useTransition marks updates as non-urgent, keeping input responsive. useDeferredValue defers slow renders.',
      },
    ],
    interviewQuestions: [
      {
        question: 'What are the rules of hooks and why do they exist?',
        answer: `There are two rules:
1. Only call hooks at the **top level** (not in conditions, loops, or nested functions)
2. Only call hooks from **React function components or custom hooks**

**Why:** React tracks hooks by their call order. Each render, React expects hooks to be called in the same order. If you put a hook inside a condition, the order might differ between renders, causing React to associate state with the wrong hook.

\`\`\`js
// WRONG: conditional hook
function Component({ showExtra }) {
  const [base, setBase] = useState(0);
  if (showExtra) {
    const [extra, setExtra] = useState(0); // BAD: order changes!
  }
}
// On render 1 (showExtra=true): hook 1 = base, hook 2 = extra
// On render 2 (showExtra=false): hook 1 = base (no hook 2!)
// React's internal state array is now misaligned
\`\`\`

ESLint's \`exhaustive-deps\` rule and the \`react-hooks\` plugin enforce these rules automatically.`,
        difficulty: 'medium',
      },
      {
        question: 'When would you use useReducer instead of useState?',
        answer: `Prefer \`useReducer\` when:

1. **Complex state logic** — multiple sub-values that update together, or next state depends heavily on previous
2. **Multiple related state updates** — you often dispatch several updates together
3. **Named state transitions** — action types make code more readable and self-documenting
4. **Testing** — reducers are pure functions, easily unit tested without rendering
5. **Large component** — spreading reducer logic into many useState hooks becomes hard to follow

\`\`\`js
// useState gets messy:
const [todos, setTodos] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [filter, setFilter] = useState('all');

// useReducer is cleaner:
const [state, dispatch] = useReducer(todoReducer, initialState);
dispatch({ type: 'FETCH_START' });
dispatch({ type: 'FETCH_SUCCESS', todos });
\`\`\`

A good heuristic: if you find yourself writing multiple setState calls that always go together, that's a signal to useReducer.`,
        difficulty: 'medium',
      },
      {
        question: 'What is the difference between useEffect and useLayoutEffect?',
        answer: `Both accept a callback and deps array, but they differ in WHEN they run relative to the browser:

**\`useEffect\`:**
- Fires **asynchronously** after the browser has painted
- Does NOT block visual updates
- Use for: data fetching, subscriptions, logging — anything that doesn't need to see the DOM before paint

**\`useLayoutEffect\`:**
- Fires **synchronously** after DOM mutations but **before** the browser paints
- DOES block visual updates (can cause performance issues if slow)
- Use for: reading DOM measurements (getBoundingClientRect), triggering DOM mutations that must be visible in the same frame, preventing visual flicker

\`\`\`js
useLayoutEffect(() => {
  // This runs before paint — ideal for:
  const { width } = ref.current.getBoundingClientRect();
  setTooltipPosition(calculatePosition(width)); // prevent flicker
}, []);
\`\`\`

**Rule:** Start with \`useEffect\`. Switch to \`useLayoutEffect\` only when you need to prevent visual flickering by reading/writing DOM before the browser paints.`,
        difficulty: 'hard',
      },
      {
        question: 'What causes a stale closure bug inside useEffect and how do you fix it?',
        answer: `A **stale closure** occurs when a closure captures variables from an older outer scope that have since changed, but the closure continues to reference the outdated values.

**What causes it inside \`useEffect\`:**
When you run a \`useEffect\` with an empty dependency array \`[]\`, the effect callback is executed only once. If you declare a timer, event listener, or callback inside it that references state or props, that function "closes over" the state from that initial render. Even if the state changes later, the effect's function is never re-created, so it keeps reading the old, "stale" values.

\`\`\`js
// Stale closure bug
useEffect(() => {
  const interval = setInterval(() => {
    console.log(count); // Will always print 0 (the initial value)
  }, 1000);
  return () => clearInterval(interval);
}, []); // count is not in dependencies!
\`\`\`

**How to fix it:**
1. **Add to Dependency Array:** Include the variables referenced in the dependency array so the effect re-runs and re-creates the closure with fresh values.
   \`\`\`js
   useEffect(() => {
     const interval = setInterval(() => { console.log(count); }, 1000);
     return () => clearInterval(interval);
   }, [count]); // Fix: re-runs when count changes
   \`\`\`
2. **Functional Updates:** If you're updating state based on its previous value, use functional updates:
   \`\`\`js
   setCount(prev => prev + 1); // Doesn't need outer 'count' variable
   \`\`\`
3. **Use ref (\`useRef\`):** Store the value in a ref. Since ref objects maintain a stable reference but have a mutable \`.current\` property, you can always read the latest value without triggering effect re-runs.`,
        difficulty: 'hard',
      },
      {
        question: 'What is the difference between useState and useRef?',
        answer: `Both persist values across renders, but they behave differently:

**\`useState\`:**
- Triggers a re-render when value changes
- Value is part of React's rendering cycle
- Use for: anything that affects what's displayed on screen

**\`useRef\`:**
- Does NOT trigger a re-render when \`.current\` changes
- Mutable box that persists across renders
- Use for: DOM references, storing previous values, timers/intervals, any mutable value that shouldn't cause re-renders

\`\`\`jsx
function StopWatch() {
  const [time, setTime] = useState(0);     // re-renders to display
  const intervalRef = useRef<number>();    // stores interval ID, no re-render needed

  const start = () => {
    intervalRef.current = setInterval(() => setTime(t => t + 1), 1000);
  };
  const stop = () => clearInterval(intervalRef.current);
  return <div>{time}s <button onClick={start}>Start</button> <button onClick={stop}>Stop</button></div>;
}
\`\`\`

**Key distinction:** If changing a value should update the UI → \`useState\`. If you just need to remember something without triggering renders → \`useRef\`.`,
        difficulty: 'medium',
      },
      {
        question: 'What are the rules of hooks and why do they exist?',
        answer: `There are two rules enforced by \`eslint-plugin-react-hooks\`:

1. **Only call hooks at the top level** — never inside loops, conditions, or nested functions
2. **Only call hooks from React function components or custom hooks** — not regular JS functions

**Why these rules exist:** React tracks hooks internally by their call ORDER. Each render, React expects hooks to be called in exactly the same sequence. If a hook is inside a condition, it might not be called on some renders, shifting the order and corrupting state associations.

\`\`\`js
// BROKEN — conditional hook
function Bad({ show }) {
  if (show) {
    const [x, setX] = useState(0); // sometimes hook 1, sometimes skipped!
  }
  const [y, setY] = useState(0); // now hook 1 or hook 2 depending on show
}

// CORRECT — condition inside the hook call
function Good({ show }) {
  const [x, setX] = useState(0); // always hook 1
  const [y, setY] = useState(0); // always hook 2
  const value = show ? x : y;    // conditional logic AFTER hook calls
}
\`\`\``,
        difficulty: 'medium',
      },
      {
        question: 'What is the difference between useMemo and useCallback, and when does using them actually hurt performance?',
        answer: `Both \`useMemo\` and \`useCallback\` are built-in hooks used for optimization and memoization, but they memoize different things:

* **\`useMemo\`:** Memoizes the **result** of a calculation.
  \`\`\`js
  const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
  \`\`\`
* **\`useCallback\`:** Memoizes the **function declaration** itself.
  \`\`\`js
  const memoizedCallback = useCallback(() => { doSomething(a); }, [a]);
  \`\`\`
  *(Note: \`useCallback(fn, deps)\` is equivalent to \`useMemo(() => fn, deps)\`).*

**When they actually HURT performance:**
Memoization isn't free. Calling these hooks carries overhead (declaring dependency arrays, comparing dependency references on every single render).

Overusing them hurts performance in these scenarios:
1. **Cheap Operations:** Memoizing simple operations (like basic math or small filters) takes *more* execution time and memory than running the calculation fresh.
2. **Everyday Callback Functions:** Placing \`useCallback\` on click handlers for standard DOM buttons (e.g. \`<button onClick={cb}>\`) is useless because DOM buttons don't check for function reference changes.
3. **Empty Dependency Arrays on inline objects:** If you pass dependencies that change on every render, the hook executes the calculation every time anyway, adding the overhead of dependency checking for no benefit.

**Rule of Thumb:** Only use them when passing callbacks/values to memoized child components (\`React.memo\`) that check for reference equality, or for highly CPU-intensive computations.`,
        difficulty: 'hard',
      },
      {
        question: 'How does the Context API work and when should you avoid it?',
        answer: `The **Context API** is a React feature designed to share global data (like themes, language settings, or user auth state) across the component tree without manually passing props down through every level (avoiding "prop drilling").

**How it works:**
1. **Create:** You create a context using \`const MyContext = createContext(defaultValue)\`.
2. **Provide:** You wrap the parent component in a Provider: \`<MyContext.Provider value={data}>\`.
3. **Consume:** Any descendant component can access the value using the \`useContext(MyContext)\` hook. When the provider value changes, all consumer components automatically re-render.

**When you should AVOID Context:**
1. **High-Frequency State Updates:** Context is not optimized for rapid updates (like text inputs, animations, or game loops). Because any update to the Context value forces *all* consumers to re-render, it can lead to severe performance bottlenecks.
2. **General State Management:** Don't use Context as your primary state manager for complex states. State management libraries like Zustand, Recoil, or Redux are better suited for modular updates, selective rendering, and performance optimization.
3. **Component Reusability:** Overusing Context makes components less reusable because they become tightly coupled to their context providers.`,
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'custom-hooks',
    moduleId: 'react',
    title: 'Custom Hooks',
    description: 'Building reusable logic with custom hooks — 10 essential hooks built from scratch',
    estimatedTime: '60 min',
    sections: [
      {
        title: 'Why Custom Hooks',
        content: `Custom hooks let you extract component logic into reusable functions. Any function that starts with "use" and calls built-in hooks is a custom hook.

**Benefits:**
- Share stateful logic between components without render props or HOCs
- Separate concerns — keep components focused on rendering
- Easier to test logic in isolation
- Replace HOC and render prop patterns cleanly

**Rules:** Custom hooks must follow the Rules of Hooks — they are hooks themselves, so call order matters.`,
      },
    ],
    codeExamples: [
      {
        title: 'useDebounce',
        language: 'typescript',
        code: `import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer); // Cancel on value change before delay
  }, [value, delay]);

  return debouncedValue;
}

// Usage:
function SearchBox() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      fetch(\`/api/search?q=\${debouncedQuery}\`);
    }
  }, [debouncedQuery]); // only fires 300ms after user stops typing

  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}`,
        explanation: 'Debounce delays the value until input stops for the specified delay. The cleanup cancels the timer on each keystroke.',
      },
      {
        title: 'useLocalStorage',
        language: 'typescript',
        code: `import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = (newValue: T | ((prev: T) => T)) => {
    try {
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
      setValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('localStorage error:', error);
    }
  };

  return [value, setStoredValue] as const;
}

// Usage:
function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'dark');
  // Works exactly like useState but persists to localStorage
  return (
    <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>
      Toggle Theme (current: {theme})
    </button>
  );
}`,
        explanation: 'Persists state to localStorage. Lazy initializer reads from localStorage on first render.',
      },
      {
        title: 'useFetch — with loading, error, and abort',
        language: 'typescript',
        code: `import { useState, useEffect } from 'react';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

function useFetch<T>(url: string): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    setState({ data: null, loading: true, error: null });

    fetch(url, { signal: controller.signal })
      .then(async res => {
        if (!res.ok) throw new Error(\`HTTP \${res.status}: \${res.statusText}\`);
        const data: T = await res.json();
        setState({ data, loading: false, error: null });
      })
      .catch(err => {
        if (err.name === 'AbortError') return; // ignore cancellations
        setState({ data: null, loading: false, error: err });
      });

    return () => controller.abort(); // cancel on url change or unmount
  }, [url]);

  return state;
}

// Usage:
function UserCard({ id }: { id: string }) {
  const { data: user, loading, error } = useFetch<User>(\`/api/users/\${id}\`);

  if (loading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;
  return <div>{user?.name}</div>;
}`,
        explanation: 'Encapsulates fetch logic with loading/error states and automatic cancellation on URL change or unmount.',
      },
      {
        title: 'useMediaQuery',
        language: 'typescript',
        code: `import { useState, useEffect } from 'react';

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false; // SSR safety
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

// Usage:
function ResponsiveNav() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  return isMobile ? <MobileNav /> : <DesktopNav />;
}`,
        explanation: 'Reactively tracks CSS media queries. SSR-safe with window undefined check.',
      },
      {
        title: 'useClickOutside',
        language: 'typescript',
        code: `import { useEffect, RefObject } from 'react';

function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref.current;
      // Do nothing if clicking ref's element or its descendants
      if (!el || el.contains(event.target as Node)) return;
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

// Usage:
function Dropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setOpen(false));

  return (
    <div ref={dropdownRef}>
      <button onClick={() => setOpen(o => !o)}>Toggle</button>
      {open && <div className="dropdown">...options</div>}
    </div>
  );
}`,
        explanation: 'Detects clicks outside a referenced element. Cleans up listeners on unmount. Handles touch events for mobile.',
      },
      {
        title: 'useIntersectionObserver',
        language: 'typescript',
        code: `import { useState, useEffect, useRef, RefObject } from 'react';

interface UseIntersectionOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

function useIntersectionObserver(
  options: UseIntersectionOptions = {}
): [RefObject<HTMLDivElement>, boolean] {
  const { freezeOnceVisible = false, ...observerOptions } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      const visible = entry.isIntersecting;
      setIsVisible(visible);
      if (visible && freezeOnceVisible) {
        observer.disconnect(); // stop observing once seen
      }
    }, observerOptions);

    observer.observe(el);
    return () => observer.disconnect();
  }, [freezeOnceVisible, observerOptions.threshold, observerOptions.rootMargin]);

  return [ref, isVisible];
}

// Usage: lazy loading images
function LazyImage({ src, alt }: { src: string; alt: string }) {
  const [ref, isVisible] = useIntersectionObserver({ freezeOnceVisible: true });

  return (
    <div ref={ref}>
      {isVisible ? (
        <img src={src} alt={alt} />
      ) : (
        <div className="skeleton" style={{ width: 300, height: 200 }} />
      )}
    </div>
  );
}`,
        explanation: 'IntersectionObserver fires when element enters/leaves viewport. freezeOnceVisible optimizes for one-time reveal animations.',
      },
      {
        title: 'usePrevious',
        language: 'typescript',
        code: `import { useRef, useEffect } from 'react';

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value; // Update AFTER render
  }); // no deps — runs after every render

  return ref.current; // Returns value from PREVIOUS render
}

// Usage: animate based on direction of change
function AnimatedCounter({ count }: { count: number }) {
  const prevCount = usePrevious(count);
  const direction = prevCount === undefined
    ? 'none'
    : count > prevCount ? 'up' : 'down';

  return (
    <span className={\`counter \${direction}\`}>
      {count}
    </span>
  );
}`,
        explanation: 'Captures the value from the previous render using a ref that updates after render.',
      },
      {
        title: 'useWindowSize and useToggle',
        language: 'typescript',
        code: `import { useState, useEffect } from 'react';

// useWindowSize
function useWindowSize() {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const update = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return size;
}

// useToggle
function useToggle(initialValue = false): [boolean, () => void, (v: boolean) => void] {
  const [value, setValue] = useState(initialValue);
  const toggle = () => setValue(v => !v);
  return [value, toggle, setValue];
}

// Usage:
function App() {
  const { width } = useWindowSize();
  const [isOpen, toggleOpen, setOpen] = useToggle();

  return (
    <div>
      <p>Window width: {width}px</p>
      <button onClick={toggleOpen}>{isOpen ? 'Close' : 'Open'}</button>
      <button onClick={() => setOpen(false)}>Force Close</button>
    </div>
  );
}`,
        explanation: 'Small, focused hooks for common needs. useToggle exposes both toggle and direct set for flexibility.',
      },
    ],
    interviewQuestions: [
      {
        question: 'Walk me through how you would build a useDebounce hook.',
        answer: `\`\`\`js
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Schedule update after delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the timer if value changes before delay expires
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
\`\`\`

**How it works:**
1. We store a "delayed" copy of the value in state
2. Every time \`value\` changes, we start a new \`setTimeout\`
3. The cleanup function cancels the previous timer
4. If value keeps changing within \`delay\` ms, no update fires — only when it stabilizes
5. After \`delay\` ms of no change, \`setDebouncedValue\` fires and the debounced value updates

**Use cases:** Search-as-you-type (avoid API call on every keystroke), auto-save forms, resize/scroll handlers.`,
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'state-management',
    moduleId: 'react',
    title: 'State Management Patterns',
    description: 'Context, Zustand, Redux Toolkit — when to use what with real comparisons',
    estimatedTime: '60 min',
    sections: [
      {
        title: 'Local vs Global State',
        content: `**Decision framework:**

**Keep it local when:**
- Only one component or its direct children need the state
- State is UI-only (open/closed, selected tab)
- State resets when component unmounts

**Make it global when:**
- Multiple unrelated components need the same data
- Data must survive component unmounts/navigation
- State represents "app data" (current user, cart, notifications)

**Prop drilling** (passing props through many layers) is sometimes fine for 2-3 levels. Beyond that, reach for Context or a state library.`,
      },
      {
        title: 'Context API — use cases and limitations',
        content: `Context is ideal for **infrequently changing global data:**
- Theme (dark/light)
- Current user
- Locale/language
- Feature flags

**Performance problem:** Every component consuming the context re-renders when context value changes, regardless of whether they use the changed part.

**Solutions:**
1. Split into multiple contexts (ThemeContext, UserContext, etc.)
2. Memoize context value with useMemo
3. Use selector libraries (use-context-selector)
4. Use Zustand/Redux for frequently-updated data`,
      },
      {
        title: 'Zustand — why its better for global state',
        content: `Zustand solves the main Context problems:
- **Selective subscriptions:** Components only re-render when the slice they subscribe to changes
- **No Provider wrapping:** Just import and use
- **Simpler API:** No actions/reducers required (but supported)
- **DevTools support**
- **Middleware:** persist, devtools, immer

\`\`\`js
const useStore = create((set) => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 })),
}));

// Component only re-renders when count changes
const count = useStore(state => state.count);
\`\`\``,
      },
    ],
    codeExamples: [
      {
        title: 'Same feature: Context vs Zustand vs Redux comparison',
        language: 'typescript',
        code: `// ========= 1. CONTEXT APPROACH =========
// context/CartContext.tsx
const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? {...i, qty: i.qty + 1} : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  }, []);

  const value = useMemo(() => ({ items, addItem }), [items, addItem]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
// Problem: every consumer re-renders when items changes

// ========= 2. ZUSTAND APPROACH =========
// store/cartStore.ts
interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  total: number;
}

const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (item) => set(state => {
    const existing = state.items.find(i => i.id === item.id);
    if (existing) {
      return { items: state.items.map(i => i.id === item.id ? {...i, qty: i.qty + 1} : i) };
    }
    return { items: [...state.items, { ...item, qty: 1 }] };
  }),
  removeItem: (id) => set(state => ({ items: state.items.filter(i => i.id !== id) })),
  get total() { return get().items.reduce((sum, i) => sum + i.price * i.qty, 0); },
}));

// Usage — only re-renders when items changes, NOT total (if you select just items)
const items = useCartStore(state => state.items);
const total = useCartStore(state => state.total);
const addItem = useCartStore(state => state.addItem);
// No Provider needed!

// ========= 3. REDUX TOOLKIT APPROACH =========
// store/cartSlice.ts
const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] as CartItem[] },
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) { existing.qty += 1; } // Immer allows mutation
      else { state.items.push({ ...action.payload, qty: 1 }); }
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
  },
});

// Usage
const items = useSelector(state => state.cart.items);
dispatch(addItem(product));`,
        explanation: 'Context requires Providers and causes broad re-renders. Zustand is simpler with selective subscriptions. Redux adds boilerplate but excellent DevTools.',
      },
      {
        title: 'Zustand with persistence and devtools',
        language: 'typescript',
        code: `import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

interface UserStore {
  user: User | null;
  preferences: Preferences;
  setUser: (user: User | null) => void;
  updatePreference: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void;
}

const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        preferences: { theme: 'dark', language: 'en', notifications: true },

        setUser: (user) => set({ user }, false, 'setUser'),

        updatePreference: (key, value) =>
          set(state => ({
            preferences: { ...state.preferences, [key]: value }
          }), false, \`updatePreference/\${String(key)}\`),
      }),
      {
        name: 'user-storage', // localStorage key
        partialize: (state) => ({ preferences: state.preferences }), // only persist preferences
      }
    ),
    { name: 'UserStore' } // DevTools name
  )
);

// Selectors — components only re-render for their slice
const user = useUserStore(state => state.user);
const theme = useUserStore(state => state.preferences.theme);`,
        explanation: 'Zustand middleware chains: devtools for browser DevTools integration, persist for localStorage.',
      },
    ],
    interviewQuestions: [
      {
        question: 'When would you use Context vs Zustand vs Redux?',
        answer: `**Context API:**
- Infrequently-changing data (theme, user, locale)
- Small apps where overhead of extra library isn't worth it
- Avoid for frequently-updated data (performance issues)

**Zustand:**
- Medium-to-large apps with complex client state
- When you want simplicity without Redux boilerplate
- When you need selective subscriptions (only re-render what changed)
- When you want no Provider wrapping
- Most modern React apps use Zustand

**Redux Toolkit:**
- Large teams where action history/replay debugging is valuable
- Apps with complex state interactions and middleware needs
- When you already use Redux (migration cost)
- RTK Query is excellent for server state caching

**React Query / TanStack Query** (often overlooked):
- For server state (API data) — caching, background refetching, pagination
- Reduces need for Redux for most "server data in store" patterns

**Decision:** Use React Query for server state + Zustand for client state = the modern sweet spot.`,
        difficulty: 'medium',
      },
      {
        question: 'What is lifting state up and when should you do it?',
        answer: `Lifting state up means moving state from a child component to a common ancestor so multiple sibling components can share and synchronize it.

**When to lift:** When two or more sibling components need to reflect the same changing data.

\`\`\`jsx
// BEFORE: each input has its own state — can't compare
function TempCelsius() {
  const [temp, setTemp] = useState('');
  return <input value={temp} onChange={e => setTemp(e.target.value)} />;
}
function TempFahrenheit() {
  const [temp, setTemp] = useState('');
  return <input value={temp} onChange={e => setTemp(e.target.value)} />;
}

// AFTER: state lifted to parent — both stay in sync
function TemperatureConverter() {
  const [celsius, setCelsius] = useState('');
  const fahrenheit = celsius ? String(Number(celsius) * 9/5 + 32) : '';

  return (
    <>
      <input value={celsius} onChange={e => setCelsius(e.target.value)} placeholder="°C" />
      <input value={fahrenheit} readOnly placeholder="°F" />
    </>
  );
}
\`\`\`

**Downside:** As apps grow, lifting state up repeatedly leads to prop drilling. That's when Context or a state management library becomes the right solution.`,
        difficulty: 'medium',
      },
      {
        question: 'What is prop drilling and how do you solve it?',
        answer: `Prop drilling is when you pass props through many intermediate components that don't use the data themselves — they just forward it to a deeply nested child.

\`\`\`jsx
// Prop drilling — App → Layout → Sidebar → UserAvatar (only UserAvatar needs user)
function App() {
  const user = useCurrentUser();
  return <Layout user={user} />;
}
function Layout({ user }) {
  return <Sidebar user={user} />;
}
function Sidebar({ user }) {
  return <UserAvatar user={user} />;
}
\`\`\`

**Solutions:**

1. **Context API** — good for slowly-changing global data (auth user, theme)
\`\`\`jsx
const UserContext = createContext(null);
// Wrap app: <UserContext.Provider value={user}>
// Consume: const user = useContext(UserContext);
\`\`\`

2. **Component composition** — pass components as children/props instead of data:
\`\`\`jsx
function App() {
  const user = useCurrentUser();
  return <Layout sidebar={<UserAvatar user={user} />} />;
}
\`\`\`

3. **State management library** (Zustand, Redux) — any component subscribes directly without prop chains.`,
        difficulty: 'medium',
      },
      {
        question: 'What are the three core principles of Redux?',
        answer: `1. **Single source of truth** — the entire application state lives in one JavaScript object tree (the store). This makes state predictable, easy to inspect, and simple to serialize/restore.

2. **State is read-only** — the only way to change state is to dispatch an action (a plain object describing what happened). You never mutate state directly.

3. **Changes are made with pure functions (reducers)** — reducers take the previous state and an action, and return the next state. Being pure functions, they are deterministic and testable — same inputs always produce the same output.

\`\`\`js
// Pure reducer
function counter(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT': return state + 1;
    case 'DECREMENT': return state - 1;
    default: return state;
  }
}
\`\`\`

These three principles together make state changes explicit, traceable (DevTools time-travel), and easy to test.`,
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'performance',
    moduleId: 'react',
    title: 'React Performance Optimization',
    description: 'Understanding re-renders and fixing them with React.memo, useMemo, useCallback, and more',
    estimatedTime: '55 min',
    sections: [
      {
        title: 'When Does React Re-render?',
        content: `A component re-renders when:
1. Its **state** changes (useState, useReducer)
2. Its **props** change (or its parent re-renders and passes new props)
3. Its **context** value changes
4. Its **parent** re-renders (even if props are the same — unless wrapped in React.memo)

**Key insight:** React re-renders don't always mean DOM updates. React re-renders to compute new JSX, then checks if it needs to update the DOM. If JSX output is identical, no DOM changes happen. But the render function still ran.

**Profiling before optimizing:** Use React DevTools Profiler to identify actual slow renders. Premature optimization adds complexity without benefit.`,
      },
      {
        title: 'React.memo — shallow comparison',
        content: `\`React.memo\` is a HOC that memoizes a component. It shallowly compares props and skips re-rendering if props haven't changed.

\`\`\`js
const MyComponent = React.memo(function MyComponent({ name, onClick }) {
  return <button onClick={onClick}>{name}</button>;
});
\`\`\`

**Shallow comparison:** Primitive props (string, number, boolean) compare by value. Object/array/function props compare by reference.

**When memo doesn't help:** If parent re-renders and creates new object/function refs every time, memo's comparison returns "changed" and the child re-renders anyway. This is why useCallback is paired with memo.`,
      },
    ],
    codeExamples: [
      {
        title: 'React.memo with useCallback — full pattern',
        language: 'typescript',
        code: `import { useState, useCallback, memo } from 'react';

interface ItemProps {
  id: number;
  name: string;
  onDelete: (id: number) => void;
  onEdit: (id: number, newName: string) => void;
}

// memo: only re-renders when props shallowly change
const Item = memo(({ id, name, onDelete, onEdit }: ItemProps) => {
  console.log(\`Item \${id} rendered\`);
  return (
    <div>
      <span>{name}</span>
      <button onClick={() => onDelete(id)}>Delete</button>
      <button onClick={() => onEdit(id, name + '!')}>Edit</button>
    </div>
  );
});

function ItemList() {
  const [items, setItems] = useState([
    { id: 1, name: 'Apple' },
    { id: 2, name: 'Banana' },
  ]);
  const [other, setOther] = useState(0);

  // Without useCallback: new function every render → all Items re-render when 'other' changes
  // With useCallback: same function reference → Items DON'T re-render when 'other' changes
  const handleDelete = useCallback((id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []); // no deps needed — uses functional setState

  const handleEdit = useCallback((id: number, newName: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, name: newName } : item));
  }, []);

  return (
    <div>
      <button onClick={() => setOther(o => o + 1)}>
        Unrelated state: {other}
      </button>
      {items.map(item => (
        <Item
          key={item.id}
          id={item.id}
          name={item.name}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      ))}
    </div>
  );
}`,
        explanation: 'memo + useCallback work together. memo checks prop equality; useCallback ensures function refs are stable.',
      },
      {
        title: 'Code splitting with React.lazy and Suspense',
        language: 'typescript',
        code: `import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Lazy load heavy components — each becomes a separate bundle chunk
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

// Lazy loading a heavy component (e.g., chart library)
const HeavyChart = lazy(() => import('./components/HeavyChart'));

function ReportPage({ showChart }: { showChart: boolean }) {
  return (
    <div>
      <h1>Report</h1>
      {showChart && (
        <Suspense fallback={<div>Loading chart...</div>}>
          <HeavyChart />
        </Suspense>
      )}
    </div>
  );
}`,
        explanation: 'lazy() + Suspense splits bundles at component boundaries. Only downloads code when the component is first rendered.',
      },
      {
        title: 'Virtualization for large lists',
        language: 'typescript',
        code: `import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

// Without virtualization: 10,000 DOM nodes — slow to render and scroll
function BadList({ items }: { items: string[] }) {
  return (
    <div style={{ height: 600, overflow: 'auto' }}>
      {items.map((item, i) => (
        <div key={i} style={{ height: 40, padding: '8px 16px' }}>{item}</div>
      ))}
    </div>
  );
}

// With virtualization: only renders ~15 DOM nodes regardless of list size
function VirtualList({ items }: { items: string[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40, // estimated row height
    overscan: 5, // render 5 extra items above/below for smoother scroll
  });

  return (
    <div ref={parentRef} style={{ height: 600, overflow: 'auto' }}>
      {/* Spacer div sets total scroll height */}
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map(virtualRow => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: virtualRow.size,
              transform: \`translateY(\${virtualRow.start}px)\`,
              padding: '8px 16px',
            }}
          >
            {items[virtualRow.index]}
          </div>
        ))}
      </div>
    </div>
  );
}`,
        explanation: 'Virtualization renders only visible rows. 10,000 item list = ~15 DOM nodes. Essential for large datasets.',
      },
    ],
    interviewQuestions: [
      {
        question: '"This component is slow, how would you optimize it?"',
        answer: `**My process:**

1. **Measure first** — Open React DevTools Profiler, record interactions, identify which components are re-rendering too often or taking too long.

2. **Identify the cause:**
   - Component re-renders on every parent render? → \`React.memo\`
   - Expensive calculation runs on every render? → \`useMemo\`
   - Function prop causing child re-renders? → \`useCallback\` + \`React.memo\`
   - Huge list? → Virtualization (react-virtual, react-window)
   - Large bundle? → Code splitting with \`React.lazy\`
   - Unnecessary context re-renders? → Split context or use Zustand

3. **Apply targeted fixes** (not everything at once)

4. **Measure again** — confirm improvement

**Common quick wins:**
- Move state down closer to where it's used (smaller re-render subtree)
- Fix unstable object/array/function references passed as props
- Add keys to lists
- Code split heavy routes/components

**What I avoid:** Wrapping every component in memo, putting every value in useMemo — these add overhead and complexity without guaranteed benefit.`,
        difficulty: 'hard',
      },
      {
        question: 'What is React.memo and when should you use it?',
        answer: `\`React.memo\` is a higher-order component that wraps a functional component and prevents it from re-rendering if its props haven't changed (shallow comparison by default).

\`\`\`jsx
const ExpensiveChart = React.memo(function Chart({ data, color }) {
  // Only re-renders when data or color actually changes
  return <canvas>...</canvas>;
});

// Custom comparison for deep equality check
const Chart = React.memo(Chart, (prevProps, nextProps) => {
  return prevProps.data.length === nextProps.data.length;
  // return true = skip re-render, false = do re-render
});
\`\`\`

**When it helps:**
- Component renders frequently but props change rarely
- Component is expensive to render (complex charts, large lists)
- Parent re-renders often (e.g., every keystroke) but child props are stable

**When it doesn't help (common mistakes):**
- Props are objects/arrays/functions created inline — new reference every render bypasses memo
- Component is cheap to render — memo overhead costs more than the render itself

**Pair with \`useCallback\`** for function props to keep references stable.`,
        difficulty: 'medium',
      },
      {
        question: 'What is code splitting and how do you implement it in React?',
        answer: `Code splitting divides your bundle into smaller chunks that are loaded on demand, improving initial page load time.

**React.lazy + Suspense** (built-in, route-level):
\`\`\`jsx
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./Dashboard'));
const Settings = lazy(() => import('./Settings'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
\`\`\`

The Dashboard chunk is only downloaded when the user navigates to /dashboard.

**Dynamic import for heavy libraries:**
\`\`\`js
async function exportToPDF() {
  const { jsPDF } = await import('jspdf'); // only loads when needed
  const doc = new jsPDF();
  doc.save('file.pdf');
}
\`\`\`

**In Next.js:** Use \`next/dynamic\` which also supports SSR options:
\`\`\`js
const Chart = dynamic(() => import('./Chart'), { ssr: false });
\`\`\``,
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'patterns',
    moduleId: 'react',
    title: 'React Patterns',
    description: 'Compound Components, HOCs, Render Props, Controlled/Uncontrolled, and more',
    estimatedTime: '50 min',
    sections: [
      {
        title: 'Pattern Overview',
        content: `React patterns solve recurring design problems. Understanding them helps you:
- Choose the right tool for component composition
- Read and contribute to component libraries
- Answer "design a reusable X" interview questions

**The patterns:**
1. **Compound Components** — parent/child share implicit state (like \`<select>\` and \`<option>\`)
2. **Render Props** — pass render function as prop (superseded by hooks mostly)
3. **Higher-Order Components (HOC)** — wrap component to add behavior
4. **Controlled vs Uncontrolled** — who owns the state?
5. **Composition vs Inheritance** — prefer composition
6. **Slot Pattern** — named content areas (like web components)`,
      },
    ],
    codeExamples: [
      {
        title: 'Compound Components pattern',
        language: 'typescript',
        code: `import { createContext, useContext, useState, ReactNode } from 'react';

// Tabs compound component — parent and children share implicit state
interface TabsContextType {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextType | null>(null);

function Tabs({ children, defaultTab }: { children: ReactNode; defaultTab: string }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

function TabList({ children }: { children: ReactNode }) {
  return <div className="tab-list" role="tablist">{children}</div>;
}

function Tab({ id, children }: { id: string; children: ReactNode }) {
  const { activeTab, setActiveTab } = useContext(TabsContext)!;
  return (
    <button
      role="tab"
      aria-selected={activeTab === id}
      onClick={() => setActiveTab(id)}
      className={activeTab === id ? 'active' : ''}
    >
      {children}
    </button>
  );
}

function TabPanel({ id, children }: { id: string; children: ReactNode }) {
  const { activeTab } = useContext(TabsContext)!;
  if (activeTab !== id) return null;
  return <div role="tabpanel">{children}</div>;
}

// Attach as static properties
Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panel = TabPanel;

// Usage — clean, readable API
function App() {
  return (
    <Tabs defaultTab="profile">
      <Tabs.List>
        <Tabs.Tab id="profile">Profile</Tabs.Tab>
        <Tabs.Tab id="settings">Settings</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel id="profile"><ProfileContent /></Tabs.Panel>
      <Tabs.Panel id="settings"><SettingsContent /></Tabs.Panel>
    </Tabs>
  );
}`,
        explanation: 'Compound components share implicit state via context. The API is clean and flexible — consumers don\'t manage tab state.',
      },
      {
        title: 'Higher-Order Component (HOC) pattern',
        language: 'typescript',
        code: `import { ComponentType, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// HOC that adds authentication guard to any component
function withAuth<P extends object>(WrappedComponent: ComponentType<P>) {
  return function AuthGuard(props: P) {
    const navigate = useNavigate();
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);

    useEffect(() => {
      if (!isAuthenticated) {
        navigate('/login', { replace: true });
      }
    }, [isAuthenticated, navigate]);

    if (!isAuthenticated) return null;
    return <WrappedComponent {...props} />;
  };
}

// Usage
const ProtectedDashboard = withAuth(Dashboard);
const ProtectedSettings = withAuth(Settings);

// HOC for analytics tracking
function withAnalytics<P extends { componentName?: string }>(
  WrappedComponent: ComponentType<P>,
  componentName: string
) {
  return function WithAnalyticsWrapper(props: P) {
    useEffect(() => {
      analytics.track('component_view', { component: componentName });
    }, []);

    return <WrappedComponent {...props} />;
  };
}

// Modern alternative — custom hook (usually preferred over HOC now)
function useAuth() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  useEffect(() => {
    if (!isAuthenticated) navigate('/login', { replace: true });
  }, [isAuthenticated, navigate]);
  return isAuthenticated;
}

// Usage of hook approach — more transparent
function Dashboard() {
  const isAuthenticated = useAuth(); // clear dependency
  if (!isAuthenticated) return null;
  return <div>Dashboard</div>;
}`,
        explanation: 'HOCs add behavior to components by wrapping them. Custom hooks are often the modern replacement — more explicit, easier to compose.',
      },
      {
        title: 'Controlled vs Uncontrolled components',
        language: 'typescript',
        code: `// UNCONTROLLED: DOM owns the state
function UncontrolledForm() {
  const nameRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(nameRef.current?.value); // read on submit
  };

  return (
    <form onSubmit={handleSubmit}>
      <input ref={nameRef} defaultValue="Alice" /> {/* defaultValue, not value */}
      <button type="submit">Submit</button>
    </form>
  );
}

// CONTROLLED: React owns the state
function ControlledForm() {
  const [name, setName] = useState('Alice');

  return (
    <form>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <p>Length: {name.length}</p> {/* Can show derived data */}
    </form>
  );
}

// Making a component that supports BOTH (like react-hook-form)
interface InputProps {
  value?: string;       // controlled mode
  defaultValue?: string; // uncontrolled mode
  onChange?: (value: string) => void;
}

function FlexibleInput({ value, defaultValue, onChange }: InputProps) {
  const isControlled = value !== undefined;

  if (isControlled) {
    return <input value={value} onChange={e => onChange?.(e.target.value)} />;
  }
  return <input defaultValue={defaultValue} onChange={e => onChange?.(e.target.value)} />;
}`,
        explanation: 'Controlled = React state owns value. Uncontrolled = DOM owns value. Controlled is more flexible but more code.',
      },
    ],
    interviewQuestions: [
      {
        question: 'What is the compound component pattern and why would you use it?',
        answer: `The compound component pattern creates a set of components that work together to share implicit state. Think of native \`<select>\`/\`<option>\` — the option knows its selected state without you managing it.

**Why use it:**
- Clean, readable API for complex components (tabs, accordions, dropdowns)
- Consumer doesn't need to manage internal state
- Flexible — consumer controls the structure/layout
- Extensible — add new sub-components without breaking existing usage

**Implementation:** The parent holds state in context. Child components consume the context.

\`\`\`jsx
<Tabs defaultTab="a">
  <Tabs.List>
    <Tabs.Tab id="a">Tab A</Tabs.Tab>
    <Tabs.Tab id="b">Tab B</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel id="a">Content A</Tabs.Panel>
  <Tabs.Panel id="b">Content B</Tabs.Panel>
</Tabs>
\`\`\`

vs. awkward prop-driven approach:
\`\`\`jsx
<Tabs
  tabs={[{id:'a', label:'Tab A', content: <div>Content A</div>}]}
  defaultTab="a"
/>
\`\`\`

Compound components offer much more flexibility for customization.`,
        difficulty: 'hard',
      },
      {
        question: 'What is a Higher-Order Component (HOC) and when would you use one?',
        answer: `A Higher-Order Component is a function that takes a component and returns a new, enhanced component. It's a pattern for reusing component logic.

\`\`\`jsx
function withLogger(WrappedComponent) {
  return function LoggedComponent(props) {
    useEffect(() => {
      console.log(\`\${WrappedComponent.displayName} mounted\`);
      return () => console.log(\`\${WrappedComponent.displayName} unmounted\`);
    }, []);
    return <WrappedComponent {...props} />;
  };
}

const LoggedButton = withLogger(Button);
\`\`\`

**When HOCs are still useful:**
- Adding behavior to third-party components you can't modify
- When the same logic must wrap many different component types
- Authentication guards (\`withAuth\`)
- Analytics/logging wrappers

**When to prefer hooks instead:**
- Extracting stateful logic you control (hooks are simpler, no wrapper hell)
- When you need to compose multiple behaviors (hooks compose better than HOC chains)

**HOC caveats:** They create wrapper components in the tree, can cause "wrapper hell" when stacked, and need \`displayName\` set for DevTools debugging.`,
        difficulty: 'medium',
      },
      {
        question: 'What is the difference between controlled and uncontrolled components?',
        answer: `**Controlled components** — React state is the single source of truth for the input's value. Every change goes through \`setState\`:
\`\`\`jsx
const [name, setName] = useState('');
<input value={name} onChange={e => setName(e.target.value)} />
\`\`\`
- Immediate validation, conditional disabling, formatted input
- More verbose, re-renders on every keystroke
- Easier to test and reason about

**Uncontrolled components** — DOM manages the value; React reads it via a ref when needed (usually on submit):
\`\`\`jsx
const nameRef = useRef();
<input ref={nameRef} defaultValue="" />
// Read on submit: nameRef.current.value
\`\`\`
- Simpler for basic forms, integrates with non-React code
- Less predictable, harder to validate in real-time
- React Hook Form uses this approach internally for performance

**Rule of thumb:** Use controlled for complex forms with real-time validation. Use uncontrolled (via RHF) for forms where performance matters.`,
        difficulty: 'medium',
      },
      {
        question: 'What are portals in React and when would you use them?',
        answer: `A portal lets you render a component's output into a different DOM node than its parent — outside the normal React component hierarchy.

\`\`\`jsx
import { createPortal } from 'react-dom';

function Modal({ children, isOpen }) {
  if (!isOpen) return null;
  return createPortal(
    <div className="modal-overlay">
      <div className="modal-content">{children}</div>
    </div>,
    document.body  // rendered into body, not the parent div
  );
}
\`\`\`

**Why portals exist:** CSS \`overflow: hidden\` or \`z-index\` on a parent element can clip or bury modals, tooltips, and dropdowns. Rendering into \`document.body\` escapes those constraints.

**Common use cases:**
- Modals and dialogs
- Tooltips and popovers
- Dropdown menus
- Toast notifications

**Important:** Even though the DOM node is outside the parent, React event bubbling still works through the React tree (not the DOM tree). A click inside a portal bubble up through its React parent.`,
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'error-handling',
    moduleId: 'react',
    title: 'Error Handling in React',
    description: 'Error Boundaries, fallback UI, and async error handling strategies',
    estimatedTime: '30 min',
    sections: [
      {
        title: 'Error Boundaries',
        content: `**Error Boundaries** catch JavaScript errors anywhere in their child component tree, log them, and display a fallback UI instead of crashing the whole app.

They are **class components** (no hook equivalent yet — there's an RFC but not shipped as of React 18).

Error boundaries catch errors during:
- Rendering
- Lifecycle methods
- Constructors of child components

**They do NOT catch:**
- Event handlers (use try/catch)
- Async code (setTimeout, fetch callbacks)
- Server-side rendering
- Errors in the error boundary itself`,
      },
    ],
    codeExamples: [
      {
        title: 'Complete Error Boundary with recovery',
        language: 'typescript',
        code: `import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to error reporting service (Sentry, etc.)
    console.error('Error caught by boundary:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const { fallback } = this.props;
      if (typeof fallback === 'function') {
        return fallback(this.state.error!, this.reset);
      }
      return fallback ?? (
        <div style={{ padding: 20, border: '1px solid red', borderRadius: 8 }}>
          <h2>Something went wrong</h2>
          <pre style={{ fontSize: 12 }}>{this.state.error?.message}</pre>
          <button onClick={this.reset}>Try Again</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Usage
function App() {
  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <div>
          <p>Error: {error.message}</p>
          <button onClick={reset}>Retry</button>
        </div>
      )}
      onError={(error) => Sentry.captureException(error)}
    >
      <Dashboard />
    </ErrorBoundary>
  );
}`,
        explanation: 'Error boundaries must be class components. The fallback prop can be a node or render function for recovery.',
      },
    ],
    interviewQuestions: [
      {
        question: 'What are Error Boundaries and why are they class components?',
        answer: `Error Boundaries are React class components that catch JavaScript errors in their child component tree and display fallback UI. They implement either \`getDerivedStateFromError\` (to render fallback) or \`componentDidCatch\` (to log errors), or both.

**Why class components:** The \`getDerivedStateFromError\` and \`componentDidCatch\` lifecycle methods have no hook equivalents. The React team has acknowledged this gap and there's ongoing work on a \`use()\` hook and error boundary improvements, but as of React 18, class components are required.

**Workaround:** Libraries like \`react-error-boundary\` wrap the class component and provide a hook (\`useErrorBoundary\`) for throwing errors from within functional components into the nearest boundary.

**Granularity:** You can and should place Error Boundaries strategically:
- App level (catch all unhandled)
- Route level (one broken page doesn't break navigation)
- Component level (isolate experimental/risky components)`,
        difficulty: 'medium',
      },
      {
        question: 'What is Strict Mode in React and what does it actually do?',
        answer: `\`React.StrictMode\` is a development-only wrapper that helps you identify potential bugs by intentionally running certain things twice or logging deprecation warnings.

**What it does in development:**
1. **Double-invokes render functions** — components render twice to detect side effects in the render phase (pure functions should produce the same result twice)
2. **Double-invokes effects** — \`useEffect\` runs, cleans up, then runs again on mount — helps catch effects that don't clean up properly
3. **Warns about deprecated APIs** — \`findDOMNode\`, legacy context API, string refs
4. **Warns about unexpected side effects** — state initializers and reducers are also double-called

**Why double-invoke?** React's concurrent features may render components multiple times without committing. If your render phase has side effects (API calls, mutations), double-invoking surfaces those bugs in development.

\`\`\`jsx
// In Next.js App Router, Strict Mode is on by default in development
// You may notice effects running twice — this is intentional
\`\`\`

**In production:** Strict Mode has zero effect — none of the double-invoking happens.`,
        difficulty: 'medium',
      },
      {
        question: 'How do you handle errors in event handlers and async code in React?',
        answer: `Error Boundaries do NOT catch errors in event handlers or async code. For those, you need different strategies:

**Event handlers — use try/catch:**
\`\`\`jsx
async function handleSubmit() {
  try {
    await submitForm(data);
  } catch (error) {
    setError(error.message);
  }
}
\`\`\`

**Async data fetching — local error state:**
\`\`\`jsx
const [error, setError] = useState(null);
const [data, setData] = useState(null);

useEffect(() => {
  fetchData()
    .then(setData)
    .catch(err => setError(err.message));
}, []);

if (error) return <p>Error: {error}</p>;
\`\`\`

**Throwing into an Error Boundary from async code:**
\`\`\`jsx
// Use the useErrorBoundary hook from react-error-boundary library
const { showBoundary } = useErrorBoundary();

useEffect(() => {
  fetchData().catch(showBoundary); // throws into nearest boundary
}, []);
\`\`\`

**Global unhandled rejections:**
\`\`\`js
window.addEventListener('unhandledrejection', event => {
  Sentry.captureException(event.reason);
});
\`\`\``,
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'forms',
    moduleId: 'react',
    title: 'Forms in React',
    description: 'Controlled forms, React Hook Form, Zod validation, and complex form patterns',
    estimatedTime: '40 min',
    sections: [
      {
        title: 'React Hook Form — why it is the standard',
        content: `React Hook Form (RHF) solves the main problems with controlled forms:

1. **Performance:** Uses uncontrolled inputs (refs) internally — no re-render on every keystroke
2. **Less code:** No manual state management for every field
3. **Built-in validation:** \`register\` handles required, min, max, pattern, etc.
4. **Zod integration:** \`@hookform/resolvers/zod\` for schema validation
5. **First-class TypeScript:** Full type inference

**Core API:**
- \`register(name, options)\` — connects input to RHF
- \`handleSubmit(onValid, onInvalid)\` — wraps form submit
- \`formState.errors\` — validation errors
- \`watch(name)\` — watch specific field value
- \`setValue(name, value)\` — programmatically set values`,
      },
    ],
    codeExamples: [
      {
        title: 'React Hook Form with Zod validation',
        language: 'typescript',
        code: `import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// 1. Define schema with Zod
const signupSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-z0-9_]+$/, 'Only lowercase letters, numbers, and underscores'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  age: z.number({ coerce: true }).min(18, 'Must be 18 or older').max(120),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignupFormData = z.infer<typeof signupSchema>;

// 2. Use the form
function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    watch,
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur', // validate on blur (also: 'onChange', 'onSubmit', 'all')
  });

  const password = watch('password'); // watch for confirm-password comparison

  const onSubmit = async (data: SignupFormData) => {
    try {
      await createUser(data);
      reset();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label>Username</label>
        <input {...register('username')} />
        {errors.username && <p className="error">{errors.username.message}</p>}
      </div>

      <div>
        <label>Email</label>
        <input type="email" {...register('email')} />
        {errors.email && <p className="error">{errors.email.message}</p>}
      </div>

      <div>
        <label>Password</label>
        <input type="password" {...register('password')} />
        {errors.password && <p className="error">{errors.password.message}</p>}
      </div>

      <div>
        <label>Confirm Password</label>
        <input type="password" {...register('confirmPassword')} />
        {errors.confirmPassword && (
          <p className="error">{errors.confirmPassword.message}</p>
        )}
      </div>

      <button type="submit" disabled={isSubmitting || !isValid}>
        {isSubmitting ? 'Creating account...' : 'Sign Up'}
      </button>
    </form>
  );
}`,
        explanation: 'React Hook Form + Zod is the modern standard. Zod provides type-safe validation, RHF handles performance and state.',
      },
    ],
    interviewQuestions: [
      {
        question: 'What are the performance benefits of React Hook Form over controlled forms?',
        answer: `**Controlled forms** re-render on every keystroke because each character update triggers \`setState\`. For a form with 10 fields, typing in one field re-renders all 10 fields.

**React Hook Form** uses uncontrolled inputs with refs internally:
1. Input values live in DOM refs, not React state
2. No re-render on each keystroke — the component only re-renders when:
   - Validation errors change
   - The form is submitted
   - Watched values change (explicitly opted-in with \`watch()\`)

For complex forms (registration, multi-step forms), this can reduce renders by 10-100x.

**Additional benefits:**
- Less boilerplate — no \`onChange\` handlers and state for each field
- Form state is tracked internally (isDirty, isValid, isSubmitting)
- Easy integration with component libraries (just \`{...register('fieldName')}\`)`,
        difficulty: 'medium',
      },
      {
        question: 'What are synthetic events in React?',
        answer: `Synthetic events are React's cross-browser wrapper around the browser's native event objects. React normalizes events so they behave consistently across all browsers.

\`\`\`jsx
function Button() {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();     // works the same in all browsers
    e.stopPropagation();    // normalized behavior
    console.log(e.target);  // the DOM element that was clicked
    console.log(e.nativeEvent); // access the real browser event
  };
  return <button onClick={handleClick}>Click</button>;
}
\`\`\`

**Key differences from native events:**
- React uses event delegation — a single listener at the root captures all events (React 17+ uses root element, not \`document\`)
- React's pooling (React 16 and earlier): events were reused and reset asynchronously. In React 17+, pooling was removed — you can access event properties in async code safely.

**Common types:** \`React.MouseEvent\`, \`React.ChangeEvent<HTMLInputElement>\`, \`React.KeyboardEvent\`, \`React.FormEvent\`, \`React.DragEvent\``,
        difficulty: 'medium',
      },
      {
        question: 'How do you focus an input element on page load using React?',
        answer: `Use \`useRef\` to get a reference to the DOM element and call \`.focus()\` inside \`useEffect\` with an empty dependency array (runs once after mount).

\`\`\`jsx
import { useRef, useEffect } from 'react';

function SearchPage() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus(); // focus after first render
  }, []);

  return <input ref={inputRef} placeholder="Search..." />;
}
\`\`\`

**Why not focus in render?** The DOM element doesn't exist yet during the render phase — it's only created after React commits to the DOM. \`useEffect\` runs after commit, so the ref is populated.

**Alternative — the \`autoFocus\` HTML attribute:**
\`\`\`jsx
<input autoFocus placeholder="Search..." />
\`\`\`
This works for simple cases but doesn't give you programmatic control. Use \`useRef\` + \`useEffect\` when you need to focus conditionally or in response to events.`,
        difficulty: 'easy',
      },
    ],
  },
  {
    id: 'react-18-19',
    moduleId: 'react',
    title: 'React 18/19 Features',
    description: 'Concurrent rendering, Server Components, the React Compiler, and the use() hook',
    estimatedTime: '45 min',
    sections: [
      {
        title: 'React 18 Concurrent Features',
        content: `React 18 introduced **concurrent rendering** — React can interrupt renders to handle more urgent updates.

**Key features:**
- **Automatic batching** — all setState calls are batched (even in async code)
- **Transitions** — mark updates as non-urgent with \`startTransition\`
- **Suspense** — show fallback while waiting for async operations
- **\`useTransition\`** — manage pending state for transitions
- **\`useDeferredValue\`** — defer re-rendering slow components

**React 18 Root API:**
\`\`\`js
// Old
ReactDOM.render(<App />, container);
// New (enables concurrent features)
const root = ReactDOM.createRoot(container);
root.render(<App />);
\`\`\``,
      },
      {
        title: 'Server Components (React 19 / Next.js)',
        content: `**React Server Components (RSC)** are components that run exclusively on the server and send only HTML (no JavaScript) to the client.

**Benefits:**
- Zero client-side JavaScript (smaller bundle)
- Direct database/file access (no API layer needed)
- No hydration overhead
- Always have access to server-only data

**Limitations:**
- Cannot use browser APIs (window, document)
- Cannot use hooks (useState, useEffect, etc.)
- Cannot use event handlers
- Cannot directly render Client Components that use hooks without explicitly marking them "use client"

**"use client" boundary:** Adding this to a file marks it and its imports as Client Components. Everything above in the tree (without this directive) is a Server Component.`,
      },
      {
        title: 'React Compiler (React 19)',
        content: `The **React Compiler** (formerly React Forget) automatically memoizes components and values — eliminating the need for manual \`useMemo\`, \`useCallback\`, and \`React.memo\` in many cases.

It analyzes your code and determines which values and callbacks can be safely memoized, then adds memoization automatically at build time.

**Result:** You write plain React code without manual optimization. The compiler handles it.

**Currently:** Available as a Babel/SWC plugin. Opt-in per file with \`'use memo'\` or globally in babel config. Already powering instagram.com.`,
      },
    ],
    codeExamples: [
      {
        title: 'useTransition — keeping UI responsive',
        language: 'typescript',
        code: `import { useState, useTransition } from 'react';

const ITEMS = Array.from({ length: 10000 }, (_, i) => \`Item \${i}\`);

function FilterList() {
  const [filter, setFilter] = useState('');
  const [filtered, setFiltered] = useState(ITEMS);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Urgent: update input immediately (user sees typing)
    setFilter(value);

    // Non-urgent: filtering 10,000 items (can be deferred)
    startTransition(() => {
      const result = ITEMS.filter(item =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setFiltered(result);
    });
  };

  return (
    <div>
      <input value={filter} onChange={handleChange} placeholder="Filter..." />
      {isPending && <span>Updating...</span>}
      <ul style={{ opacity: isPending ? 0.5 : 1 }}>
        {filtered.map(item => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}`,
        explanation: 'startTransition marks the filtering as non-urgent. Input stays responsive while list update can be interrupted/batched.',
      },
      {
        title: 'Server Components vs Client Components',
        language: 'typescript',
        code: `// app/page.tsx — Server Component (default in Next.js App Router)
// No "use client" = runs on server only
import { db } from '@/lib/database';
import ClientCounter from './ClientCounter'; // can render client components

export default async function Page() {
  // Direct DB access — no API needed!
  const posts = await db.post.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <main>
      <h1>Blog</h1>
      {/* ClientCounter is interactive — has state */}
      <ClientCounter initialCount={posts.length} />
      {/* Server-rendered posts — no JS shipped for this list */}
      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </main>
  );
}

// app/ClientCounter.tsx — Client Component
'use client'; // this and all imports become client-side

import { useState } from 'react'; // hooks only work here

export default function ClientCounter({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount);
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}`,
        explanation: 'Server Components fetch data directly. Client Components add interactivity. Minimize "use client" boundaries to reduce JS bundle.',
      },
      {
        title: 'use() hook — React 19',
        language: 'typescript',
        code: `import { use, Suspense } from 'react';

// use() can unwrap promises — only in React 19
function UserProfile({ userPromise }: { userPromise: Promise<User> }) {
  // use() suspends the component while the promise is pending
  const user = use(userPromise);
  return <div>{user.name}</div>;
}

// Parent passes the promise
function App() {
  const userPromise = fetchUser(1); // start fetch immediately

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserProfile userPromise={userPromise} />
    </Suspense>
  );
}

// use() can also consume context (unlike useContext, use() can be conditional)
function ThemedButton() {
  const theme = use(ThemeContext); // equivalent to useContext(ThemeContext)
  return <button style={{ background: theme.background }}>Click</button>;
}

// Conditional use() — this is allowed!
function ConditionalConsumer({ showTheme }: { showTheme: boolean }) {
  if (!showTheme) return <button>Plain</button>;
  const theme = use(ThemeContext); // OK to use after condition
  return <button style={{ background: theme.background }}>Themed</button>;
}`,
        explanation: 'use() in React 19 unwraps Promises (causing Suspense) and Context. Unlike hooks, it can be used conditionally.',
      },
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between server components and client components in the App Router model?',
        answer: `In the Next.js App Router model, React components are split into two paradigms based on where they render:

* **React Server Components (RSC):**
  - **Render Location:** Exclusively on the server.
  - **JS Shipped:** Zero client-side JS is shipped for these components, reducing bundle size.
  - **Data Fetching:** Can execute async database queries or filesystem reads directly in the component.
  - **Restrictions:** Cannot use hooks (\`useState\`, \`useEffect\`), browser APIs (\`window\`), or event listeners (\`onClick\`).
  - **Default:** All components are Server Components by default.

* **Client Components:**
  - **Render Location:** Pre-rendered on the server to static HTML, then hydrated (made interactive) in the browser.
  - **JS Shipped:** Shipped to the browser so they can run interactive JS.
  - **Capabilities:** Can use all hooks, state managers, and standard browser APIs.
  - **Opt-in:** Created by placing the \`'use client'\` directive at the very top of the file.

**Comparison Summary:**
Use Server Components for layout, static content, and direct server access. Use Client Components for interactive forms, modals, toggles, or widgets using hooks.`,
        difficulty: 'hard',
      },
      {
        question: 'How does React 18 batch state updates differently from previous versions?',
        answer: `**Batching** is grouping multiple state updates into a single re-render for better performance.

* **Before React 18 (Partial Batching):**
  - React only batched updates inside React event handlers (like click listeners).
  - Updates triggered inside asynchronous code — like \`promises\`, \`fetch\` callbacks, \`setTimeout\`, or native event listeners — were NOT batched. Each update triggered a separate, synchronous re-render.
  \`\`\`js
  // React 17: Causes 2 separate renders
  setTimeout(() => {
    setCount(c => c + 1); // Render 1
    setFlag(f => !f);     // Render 2
  }, 100);
  \`\`\`

* **React 18+ (Automatic Batching):**
  - React batches state updates *everywhere* automatically.
  - Updates inside timeouts, promises, fetch callbacks, and native event handlers are grouped into a single re-render.
  \`\`\`js
  // React 18+: Causes only 1 re-render
  setTimeout(() => {
    setCount(c => c + 1);
    setFlag(f => !f);
    // groups updates and triggers one re-render
  }, 100);
  \`\`\`

**Opting Out:**
If you need to read state immediately after an update (forcing a synchronous DOM render), you can opt out of batching using \`flushSync\`:
\`\`\`js
import { flushSync } from 'react-dom';
flushSync(() => {
  setCount(c => c + 1); // forced to render DOM immediately
});
\`\`\``,
        difficulty: 'hard',
      },
      {
        question: 'What are the key differences between React 17, 18, and 19?',
        answer: `**React 17 (2020) — "No New Features" / Foundation release:**
- No new developer-facing features
- New JSX transform — no longer need \`import React from 'react'\` in every file
- Fixed event delegation: events attach to root element instead of \`document\` (important for micro-frontends)
- Gradual upgrade path — multiple React versions can coexist on one page

**React 18 (2022) — Concurrent React:**
- \`createRoot()\` replaces \`ReactDOM.render()\` — opt-in to concurrent features
- **Automatic batching** — setState calls in async code (setTimeout, Promises, native events) are batched into one render (was only React event handlers before)
- **\`useTransition\` / \`startTransition\`** — mark updates as non-urgent; React can interrupt and resume them
- **\`useDeferredValue\`** — defer re-rendering an expensive subtree
- **\`useId\`** — generate stable unique IDs that match between server and client
- **Suspense on the server** — streaming SSR with \`renderToPipeableStream\`
- **Strict Mode** double-invokes effects in dev to catch side-effect bugs

**React 19 (2024) — Actions & Compiler:**
- **React Compiler** (opt-in) — automatically memoizes components, replaces manual \`useMemo\`/\`useCallback\`/\`React.memo\`
- **\`use()\` hook** — unwrap Promises (triggers Suspense) and Context; can be called conditionally
- **Server Actions** — \`async\` functions with \`'use server'\` directive callable directly from Client Components
- **\`useActionState\`** — manage form submission state (replaces common loading/error patterns)
- **\`useOptimistic\`** — apply optimistic UI updates before server confirms
- **\`useFormStatus\`** — read parent form's pending state
- **ref as a prop** — no more \`forwardRef()\` wrapper needed; \`ref\` is now a regular prop
- **\`<form action={fn}>\`** — forms can accept async functions directly
- **document metadata** — \`<title>\`, \`<meta>\`, \`<link>\` tags rendered anywhere, hoisted to \`<head>\` automatically`,
        difficulty: 'medium',
      },
    ],
  },
];
