import type { TopicContent } from '@/types';

export const graphqlContent: TopicContent[] = [
  {
    id: 'fundamentals',
    moduleId: 'graphql',
    title: 'GraphQL Fundamentals',
    description: 'What GraphQL is, how it differs from REST, and core concepts',
    estimatedTime: '40 min',
    sections: [
      {
        title: 'What is GraphQL?',
        content: `**GraphQL** is a query language for APIs and a runtime for executing those queries. Developed by Facebook (2012, open-sourced 2015), it gives clients the power to ask for exactly the data they need.

**Core idea:** Instead of multiple REST endpoints returning fixed data shapes, GraphQL exposes a single endpoint where the client describes exactly what it wants.

\`\`\`graphql
# REST: GET /users/1 returns EVERYTHING about the user
# GraphQL: ask for only what you need
query {
  user(id: "1") {
    name
    email
    # avatar, bio, createdAt etc. are NOT fetched
  }
}
\`\`\`

**Three operation types:**
- **Query** — read data (like GET)
- **Mutation** — write/modify data (like POST/PUT/DELETE)
- **Subscription** — real-time data over WebSocket`,
      },
      {
        title: 'GraphQL vs REST',
        content: `**REST problems that GraphQL solves:**

**Over-fetching:** REST returns fixed shapes — you get fields you don't need.
- \`GET /users/1\` returns 20 fields, you only need name + avatar.

**Under-fetching (N+1 problem):** Need multiple requests to assemble data.
- \`GET /posts\` → then \`GET /users/:id\` for each post's author = N+1 requests.
- GraphQL: one query fetches posts AND their authors together.

**No versioning needed:** Add new fields without breaking existing clients (they don't request the new fields). REST often needs \`/v1\`, \`/v2\`.

**When REST is still better:**
- Simple CRUD with no complex data relationships
- File uploads (GraphQL handles it but REST is simpler)
- HTTP caching (REST caches at URL level; GraphQL POST requests don't cache easily)
- Public APIs where simplicity matters`,
      },
      {
        title: 'Schema & Type System',
        content: `GraphQL is **strongly typed**. Every API is defined by a schema using the GraphQL Schema Definition Language (SDL).

\`\`\`graphql
# Scalar types: String, Int, Float, Boolean, ID
# ! = non-nullable (required)
# [Type] = array

type User {
  id: ID!
  name: String!
  email: String!
  age: Int
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  body: String!
  author: User!
  createdAt: String!
}

type Query {
  user(id: ID!): User
  users: [User!]!
  post(id: ID!): Post
}

type Mutation {
  createUser(name: String!, email: String!): User!
  deletePost(id: ID!): Boolean!
}
\`\`\`

The schema is the **contract** between client and server. Clients can introspect it to discover available types and operations.`,
      },
    ],
    codeExamples: [
      {
        title: 'Basic Query and Variables',
        language: 'javascript',
        code: `// Query with variables (always prefer variables over string interpolation)
const GET_USER = \`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
      posts {
        id
        title
      }
    }
  }
\`;

// Execute with fetch
const response = await fetch('/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: GET_USER,
    variables: { id: '42' },
  }),
});

const { data, errors } = await response.json();
// data.user = { id: '42', name: 'Alice', ... }
// errors = array of any GraphQL errors`,
        explanation: 'GraphQL always uses POST to a single endpoint. Variables keep queries safe from injection attacks.',
      },
    ],
    interviewQuestions: [
      {
        question: 'What is GraphQL and how does it differ from REST?',
        answer: `**GraphQL** is a query language for APIs where the client specifies exactly what data it needs, rather than the server dictating a fixed response shape.

**Key differences from REST:**

**Single endpoint vs multiple:** REST has \`/users\`, \`/posts\`, \`/comments\` etc. GraphQL has one endpoint (usually \`/graphql\`) for everything.

**Client-driven vs server-driven shape:** REST returns whatever the server decides. GraphQL returns exactly what the client asks for — no more, no less.

**Solves over-fetching:** \`GET /users/1\` might return 20 fields; you needed 2. GraphQL query asks for only those 2.

**Solves under-fetching:** Getting a post with its author in REST = 2 requests. In GraphQL = 1 query.

**Strongly typed schema:** The entire API is self-documenting via the SDL. Clients can introspect available types and fields.

**No versioning:** New fields are additive — old clients keep working. REST often requires \`/v2\` when shapes change.

**When REST is still preferred:** Simple CRUD, file uploads, HTTP caching, public APIs for broad consumption.`,
        difficulty: 'medium',
      },
      {
        question: 'What is the N+1 problem in GraphQL and how do you solve it?',
        answer: `The **N+1 problem** happens when fetching a list of items, then making a separate database query for each item's related data.

**Example:**
\`\`\`graphql
query {
  posts {        # 1 query to get all posts
    title
    author {     # N queries — one per post to get each author!
      name
    }
  }
}
\`\`\`
If there are 100 posts → 1 + 100 = 101 database queries. Terrible performance.

**Solution: DataLoader (batching + caching)**
DataLoader collects all IDs requested within a single tick, then fetches them in one batched query:
\`\`\`js
const userLoader = new DataLoader(async (userIds) => {
  // Called ONCE with all IDs: ['1', '2', '3', ...]
  const users = await db.users.findMany({ where: { id: { in: userIds } } });
  return userIds.map(id => users.find(u => u.id === id));
});

// In resolver — called 100 times, but batched into 1 DB query
const authorResolver = (post) => userLoader.load(post.authorId);
\`\`\`
Result: 1 query for posts + 1 batched query for all authors = 2 queries total.`,
        difficulty: 'hard',
      },
    ],
  },
  {
    id: 'queries-mutations',
    moduleId: 'graphql',
    title: 'Queries & Mutations',
    description: 'Writing queries, mutations, fragments, and directives',
    estimatedTime: '35 min',
    sections: [
      {
        title: 'Queries',
        content: `A **query** reads data. You specify the shape of the response using fields.

\`\`\`graphql
# Named query (best practice — easier to debug)
query GetUserProfile($userId: ID!) {
  user(id: $userId) {
    id
    name
    avatar
    posts(limit: 5, orderBy: CREATED_AT_DESC) {
      id
      title
      likes
    }
  }
}
\`\`\`

**Aliases** — request same field twice with different args:
\`\`\`graphql
query {
  published: posts(status: PUBLISHED) { id title }
  drafts: posts(status: DRAFT) { id title }
}
\`\`\`

**Fragments** — reusable field selections:
\`\`\`graphql
fragment UserFields on User {
  id
  name
  avatar
}

query {
  me { ...UserFields }
  user(id: "1") { ...UserFields posts { title } }
}
\`\`\``,
      },
      {
        title: 'Mutations',
        content: `A **mutation** creates, updates, or deletes data. Mutations run sequentially (unlike queries which can run in parallel).

\`\`\`graphql
mutation CreatePost($input: CreatePostInput!) {
  createPost(input: $input) {
    id
    title
    createdAt
    author {
      name
    }
  }
}
\`\`\`

Variables:
\`\`\`json
{
  "input": {
    "title": "My Post",
    "body": "Content here...",
    "tags": ["react", "graphql"]
  }
}
\`\`\`

**Best practice:** Always return the mutated object so clients can update their cache without a separate query.

**Input types** keep mutation arguments clean:
\`\`\`graphql
input CreatePostInput {
  title: String!
  body: String!
  tags: [String!]
}
\`\`\``,
      },
    ],
    codeExamples: [
      {
        title: 'Mutation with optimistic response (Apollo)',
        language: 'javascript',
        code: `import { useMutation, gql } from '@apollo/client';

const LIKE_POST = gql\`
  mutation LikePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes
      isLiked
    }
  }
\`;

function LikeButton({ post }) {
  const [likePost, { loading }] = useMutation(LIKE_POST, {
    // Optimistic response — update UI immediately before server responds
    optimisticResponse: {
      likePost: {
        __typename: 'Post',
        id: post.id,
        likes: post.likes + 1,
        isLiked: true,
      },
    },
    // Update Apollo cache directly
    update(cache, { data: { likePost } }) {
      cache.modify({
        id: cache.identify(post),
        fields: {
          likes: () => likePost.likes,
          isLiked: () => likePost.isLiked,
        },
      });
    },
  });

  return (
    <button
      onClick={() => likePost({ variables: { postId: post.id } })}
      disabled={loading}
    >
      ❤️ {post.likes}
    </button>
  );
}`,
        explanation: 'Optimistic responses make UIs feel instant. Apollo updates the cache immediately, then reconciles with the server response.',
      },
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between a Query and a Mutation in GraphQL?',
        answer: `**Query** — for reading data. Queries are idempotent (calling the same query multiple times doesn't change anything). Multiple root fields in a query can be resolved in parallel.

**Mutation** — for writing data (create, update, delete). Mutations have side effects. Multiple root fields in a mutation run **sequentially** — this is intentional so you can, for example, increment a counter twice and get a predictable result.

\`\`\`graphql
# Query — safe to call multiple times
query {
  user(id: "1") { name }
}

# Mutation — causes a side effect
mutation {
  createUser(name: "Alice") { id }
  # If multiple mutations: they run one after the other
}
\`\`\`

**Best practices for mutations:**
- Always return the mutated resource so the client can update its cache
- Use Input types to group mutation arguments: \`createUser(input: CreateUserInput!)\`
- Return errors as part of the response shape (not just HTTP errors)`,
        difficulty: 'easy',
      },
    ],
  },
  {
    id: 'subscriptions',
    moduleId: 'graphql',
    title: 'Subscriptions & Real-time',
    description: 'GraphQL subscriptions over WebSocket for real-time data',
    estimatedTime: '30 min',
    sections: [
      {
        title: 'What are Subscriptions?',
        content: `**Subscriptions** are the third GraphQL operation type (after Query and Mutation). They enable **real-time data** by maintaining a persistent connection between client and server, typically over **WebSockets**.

**How it works:**
1. Client sends a subscription operation
2. Server opens a WebSocket connection
3. When the subscribed event occurs (e.g., new message), server pushes data to the client
4. Client receives updates without polling

\`\`\`graphql
subscription OnNewMessage($chatId: ID!) {
  messageAdded(chatId: $chatId) {
    id
    text
    sender {
      name
      avatar
    }
    createdAt
  }
}
\`\`\`

**Use cases:**
- Chat applications
- Live notifications
- Real-time dashboards (stock prices, live sports scores)
- Collaborative editing
- Live order tracking`,
      },
      {
        title: 'Subscriptions vs Polling vs SSE',
        content: `Three approaches to real-time data:

**Polling** — client repeatedly asks "any updates?" on an interval:
- Simple to implement
- Wasteful — most requests return nothing
- Adds latency (up to poll interval)
- OK for non-critical updates every 30s+

**Server-Sent Events (SSE)** — server pushes over HTTP:
- One-directional (server → client only)
- Works over regular HTTP (no WebSocket upgrade)
- Auto-reconnect built into the browser
- Great for notifications, feeds

**GraphQL Subscriptions (WebSocket)** — full-duplex connection:
- Bi-directional
- Real-time push (zero latency on push)
- Requires WebSocket server infrastructure
- More complex to scale (sticky sessions or pub/sub like Redis)
- Best for: chat, live collaboration, trading dashboards`,
      },
    ],
    codeExamples: [
      {
        title: 'Apollo Client subscription in React',
        language: 'javascript',
        code: `import { useSubscription, useQuery, gql } from '@apollo/client';

const GET_MESSAGES = gql\`
  query GetMessages($chatId: ID!) {
    messages(chatId: $chatId) {
      id text sender { name }
    }
  }
\`;

const NEW_MESSAGE = gql\`
  subscription OnNewMessage($chatId: ID!) {
    messageAdded(chatId: $chatId) {
      id text sender { name }
    }
  }
\`;

function Chat({ chatId }) {
  const { data, loading, subscribeToMore } = useQuery(GET_MESSAGES, {
    variables: { chatId },
  });

  useEffect(() => {
    // Subscribe and update the query's cache automatically
    const unsubscribe = subscribeToMore({
      document: NEW_MESSAGE,
      variables: { chatId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newMessage = subscriptionData.data.messageAdded;
        return {
          messages: [...prev.messages, newMessage],
        };
      },
    });
    return unsubscribe; // cleanup on unmount
  }, [chatId, subscribeToMore]);

  if (loading) return <p>Loading...</p>;

  return (
    <ul>
      {data.messages.map(msg => (
        <li key={msg.id}><strong>{msg.sender.name}:</strong> {msg.text}</li>
      ))}
    </ul>
  );
}`,
        explanation: 'subscribeToMore integrates real-time updates into an existing query result. New messages are appended to the cache automatically.',
      },
    ],
    interviewQuestions: [
      {
        question: 'What is a GraphQL Subscription and how does it work?',
        answer: `A **subscription** is a GraphQL operation that maintains a persistent connection (via WebSocket) and pushes data to the client whenever a specific event occurs on the server.

**Flow:**
1. Client sends a \`subscription\` operation to the server
2. Server registers the client as a listener for that event
3. When the event fires (e.g., new message inserted), server pushes the data to all subscribed clients
4. Client receives the update in real-time without polling

\`\`\`graphql
subscription {
  messageAdded(chatId: "room-1") {
    id
    text
    sender { name }
  }
}
\`\`\`

**vs Polling:** Polling wastes requests (client asks "anything new?" repeatedly). Subscriptions push only when there IS something new — efficient and truly real-time.

**vs SSE:** SSE is HTTP-only and one-directional. Subscriptions use WebSockets (bi-directional) and integrate natively into the GraphQL schema.

**Scaling challenge:** WebSockets require persistent connections. Horizontal scaling needs a pub/sub layer (Redis, etc.) so any server instance can push to any connected client.`,
        difficulty: 'medium',
      },
      {
        question: 'When would you use GraphQL Subscriptions vs polling vs SSE?',
        answer: `**Use Subscriptions (WebSocket) when:**
- True real-time is required with minimal latency (chat, live collaboration, trading)
- You're already using GraphQL and Apollo
- Data can be pushed from many different events

**Use SSE (Server-Sent Events) when:**
- Updates are one-directional (server → client only)
- You want simplicity — no WebSocket infrastructure
- Notifications, activity feeds, progress updates
- Works behind HTTP/2 multiplexing naturally

**Use Polling when:**
- Updates are infrequent (every 30s+ is fine)
- Infrastructure doesn't support persistent connections
- Simplest implementation is preferred
- Non-critical data (dashboard stats, feed refresh)

**Rule of thumb:**
- Chat/collaboration → Subscriptions
- Notifications/feeds → SSE
- Occasional refresh → Polling
- Don't use subscriptions for data that changes every few minutes — polling is simpler and cheaper to scale.`,
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'apollo-client',
    moduleId: 'graphql',
    title: 'Apollo Client with React',
    description: 'useQuery, useMutation, caching, and integrating Apollo with Next.js',
    estimatedTime: '45 min',
    sections: [
      {
        title: 'Apollo Client Setup',
        content: `**Apollo Client** is the most popular GraphQL client for React. It handles:
- Executing queries and mutations
- Normalised in-memory cache (avoids duplicate data)
- Loading and error states
- Optimistic updates
- Real-time subscriptions

\`\`\`js
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://api.example.com/graphql',
  cache: new InMemoryCache(),
  headers: {
    authorization: \`Bearer \${getToken()}\`,
  },
});

// Wrap your app
function App() {
  return (
    <ApolloProvider client={client}>
      <Router />
    </ApolloProvider>
  );
}
\`\`\``,
      },
      {
        title: 'useQuery and useMutation',
        content: `**useQuery** — fetches data when the component mounts:
\`\`\`js
const { data, loading, error, refetch } = useQuery(GET_USERS, {
  variables: { limit: 10 },
  fetchPolicy: 'cache-and-network', // serve cache first, then update
  pollInterval: 30000, // optional polling
  skip: !isLoggedIn, // skip query conditionally
});
\`\`\`

**Fetch policies:**
- \`cache-first\` (default) — use cache, fetch only if not cached
- \`cache-and-network\` — show cache immediately, then update from network
- \`network-only\` — always fetch, don't use cache for initial
- \`no-cache\` — fetch and don't store in cache

**useMutation** — returns a function you call to execute:
\`\`\`js
const [createPost, { loading, error, data }] = useMutation(CREATE_POST, {
  refetchQueries: [{ query: GET_POSTS }], // re-fetch after mutation
  onCompleted: (data) => navigate(\`/posts/\${data.createPost.id}\`),
  onError: (err) => toast.error(err.message),
});
\`\`\``,
      },
    ],
    codeExamples: [
      {
        title: 'Full CRUD with Apollo hooks',
        language: 'javascript',
        code: `import { useQuery, useMutation, gql } from '@apollo/client';

const GET_TODOS = gql\`
  query GetTodos {
    todos {
      id title completed
    }
  }
\`;

const ADD_TODO = gql\`
  mutation AddTodo($title: String!) {
    addTodo(title: $title) {
      id title completed
    }
  }
\`;

const TOGGLE_TODO = gql\`
  mutation ToggleTodo($id: ID!) {
    toggleTodo(id: $id) {
      id completed
    }
  }
\`;

function TodoApp() {
  const { data, loading, error } = useQuery(GET_TODOS);

  const [addTodo] = useMutation(ADD_TODO, {
    // Update cache directly instead of refetching
    update(cache, { data: { addTodo } }) {
      cache.modify({
        fields: {
          todos(existing = []) {
            const newRef = cache.writeFragment({
              data: addTodo,
              fragment: gql\`fragment NewTodo on Todo { id title completed }\`
            });
            return [...existing, newRef];
          }
        }
      });
    }
  });

  const [toggleTodo] = useMutation(TOGGLE_TODO);
  // Apollo auto-updates cache for toggleTodo because the response
  // includes id + changed fields (normalized cache by ID)

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {data.todos.map(todo => (
        <div key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo({ variables: { id: todo.id } })}
          />
          {todo.title}
        </div>
      ))}
      <button onClick={() => addTodo({ variables: { title: 'New todo' } })}>
        Add
      </button>
    </div>
  );
}`,
        explanation: 'Apollo\'s normalized cache means toggleTodo automatically updates the UI — Apollo matches by __typename + id and updates in place.',
      },
    ],
    interviewQuestions: [
      {
        question: 'What is memoization and how does React implement it?',
        answer: `**Memoization** is an optimization technique that caches the result of a function call and returns the cached result when the same inputs are provided again — avoiding re-computation.

**In JavaScript:**
\`\`\`js
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key); // cache hit
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
\`\`\`

**React's memoization tools:**

**\`useMemo\`** — memoizes a computed value:
\`\`\`js
const sortedList = useMemo(
  () => items.sort((a, b) => a.price - b.price),
  [items] // recompute only when items changes
);
\`\`\`

**\`useCallback\`** — memoizes a function reference:
\`\`\`js
const handleClick = useCallback(
  () => doSomething(id),
  [id] // new function only when id changes
);
\`\`\`

**\`React.memo\`** — memoizes a component (skips re-render if props unchanged):
\`\`\`js
const ExpensiveChart = React.memo(({ data }) => <Chart data={data} />);
\`\`\`

**Rule:** Only memoize when you've measured a real performance problem. Memoization has overhead and adds complexity — premature optimization is counterproductive.`,
          difficulty: 'medium',
      },
      {
        question: 'How does Apollo Client\'s cache work?',
        answer: `Apollo Client uses a **normalized in-memory cache**. Instead of storing query results as-is, it normalizes them into a flat store keyed by \`__typename:id\`.

**Example:**
\`\`\`js
// Query result:
{ user: { __typename: 'User', id: '1', name: 'Alice' } }

// Stored in cache as:
{ 'User:1': { id: '1', name: 'Alice' } }
\`\`\`

**Why normalization matters:** If two different queries return the same User (id: 1), they share one cache entry. Updating that user in a mutation automatically updates EVERY component that displays that user — no manual cache invalidation needed.

**Cache update strategies:**
- **Automatic:** Works for mutations returning objects with \`id\` + changed fields
- **refetchQueries:** Re-run specific queries after a mutation
- **cache.modify:** Manually update specific fields
- **Optimistic responses:** Assume success, update immediately, reconcile later

**fetchPolicy controls read/write behavior:**
- \`cache-first\`: fastest, may show stale data
- \`cache-and-network\`: good UX — show cached, then update
- \`network-only\`: always fresh, slower`,
        difficulty: 'hard',
      },
    ],
  },
];
