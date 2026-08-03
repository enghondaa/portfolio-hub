import type { TopicContent } from '@/types';

export const typescriptContent: TopicContent[] = [
  {
    id: 'fundamentals',
    moduleId: 'typescript',
    title: 'TypeScript Fundamentals',
    description: 'Basic types, interfaces, unions, intersections, type narrowing, and enums',
    estimatedTime: '50 min',
    sections: [
      {
        title: 'Basic Types',
        content: `TypeScript's type system catches bugs at compile time. Core types:

| Type | Example |
|------|---------|
| \`string\` | \`"hello"\` |
| \`number\` | \`42\`, \`3.14\` |
| \`boolean\` | \`true\`, \`false\` |
| \`null\` | \`null\` |
| \`undefined\` | \`undefined\` |
| \`any\` | disables type checking |
| \`unknown\` | safe version of any |
| \`never\` | never occurs (throw, infinite loop) |
| \`void\` | no return value |
| \`object\` | any non-primitive |
| \`T[]\` or \`Array<T>\` | array of T |
| \`[T, U]\` | tuple |
| \`(a: T) => U\` | function |`,
      },
      {
        title: 'Interface vs Type Alias',
        content: `Both define shapes, but have key differences:

**Interfaces:**
- Declaration merging (two interfaces with same name merge)
- Extends with \`extends\` keyword
- Better error messages
- Limited to object shapes

**Type Aliases:**
- Can represent any type (unions, intersections, primitives)
- Cannot merge
- More flexible (\`type ID = string | number\`)

**Rule of thumb:** Use \`interface\` for objects that represent "things" (User, Post, Config). Use \`type\` for unions, intersections, and complex type compositions.`,
      },
      {
        title: 'Type Narrowing',
        content: `TypeScript narrows the type inside conditional blocks based on checks:

- \`typeof\` — narrows primitives (\`string\`, \`number\`, etc.)
- \`instanceof\` — narrows class instances
- \`in\` operator — checks if property exists
- Equality checks (\`=== null\`, \`=== undefined\`)
- Truthiness checks (\`if (value)\`)
- Discriminated unions + \`switch\`

**Type guards:** Functions that return \`value is Type\` to tell TypeScript the narrowed type.`,
      },
    ],
    codeExamples: [
      {
        title: 'Interface vs Type — all the differences',
        language: 'typescript',
        code: `// Interface — declaration merging
interface User {
  id: string;
  name: string;
}
interface User {
  email: string; // MERGED — User now has id, name, AND email
}

// Type alias — no merging
type Product = {
  id: string;
  name: string;
};
// type Product = { price: number }; // ERROR: duplicate identifier

// Interface extends
interface Admin extends User {
  permissions: string[];
}

// Type intersection (equivalent to extends)
type AdminType = User & { permissions: string[] };

// Type-only features: unions
type ID = string | number;
type Status = 'pending' | 'active' | 'inactive';
type Result<T> = { data: T; error: null } | { data: null; error: Error };

// Both support generics
interface Repository<T> {
  findById(id: string): Promise<T>;
  findAll(): Promise<T[]>;
}

type Repository2<T> = {
  findById(id: string): Promise<T>;
  findAll(): Promise<T[]>;
};`,
        explanation: 'Interfaces merge and extend; type aliases are more flexible but don\'t merge. Use interfaces for object shapes, types for compositions.',
      },
      {
        title: 'Type narrowing — all patterns',
        language: 'typescript',
        code: `// typeof narrowing
function format(value: string | number) {
  if (typeof value === 'string') {
    return value.toUpperCase(); // TypeScript knows: string
  }
  return value.toFixed(2); // TypeScript knows: number
}

// instanceof narrowing
function handleError(error: Error | string) {
  if (error instanceof Error) {
    return error.message; // Error
  }
  return error; // string
}

// in operator narrowing
type Cat = { meow: () => void };
type Dog = { bark: () => void };

function makeSound(animal: Cat | Dog) {
  if ('meow' in animal) {
    animal.meow(); // Cat
  } else {
    animal.bark(); // Dog
  }
}

// Discriminated union — exhaustive checks with never
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; side: number }
  | { kind: 'rectangle'; width: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle': return Math.PI * shape.radius ** 2;
    case 'square': return shape.side ** 2;
    case 'rectangle': return shape.width * shape.height;
    default:
      const _exhaustive: never = shape; // TypeScript errors if we missed a case
      throw new Error('Unknown shape');
  }
}

// Custom type guard
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value
  );
}

const data: unknown = JSON.parse('{"id": "1", "name": "Alice"}');
if (isUser(data)) {
  console.log(data.name); // TypeScript knows: User
}`,
        explanation: 'Narrowing reduces union types to specific members. Discriminated unions + never enable exhaustive checks at compile time.',
      },
      {
        title: 'Enums vs const objects',
        language: 'typescript',
        code: `// Enum — compiled to JS object + reverse mapping
enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
}
// Generates JS: const Direction = { Up: 'UP', Down: 'DOWN', ... }
// + reverse: { UP: 'Up', DOWN: 'Down', ... } for numeric enums

// const enum — inlined at compile time (no JS object generated)
const enum Status {
  Pending = 'PENDING',
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}
// Usage becomes: Status.Pending → 'PENDING' inline (no runtime object)

// const object — preferred for most cases
const DIRECTION = {
  Up: 'UP',
  Down: 'DOWN',
  Left: 'LEFT',
  Right: 'RIGHT',
} as const;

type Direction2 = typeof DIRECTION[keyof typeof DIRECTION]; // 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'

// Why const objects over enums:
// 1. Plain JS object — works without TypeScript
// 2. No enum-specific TS behavior quirks
// 3. typeof DIRECTION gives you the shape at runtime`,
        explanation: 'const objects are generally preferred over enums in modern TypeScript. They\'re plain JS and avoid enum-specific quirks.',
      },
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between interface and type in TypeScript?',
        answer: `Both define types, but with key differences:

**Only interfaces can:**
- Declaration merge (two interfaces with same name are combined)
- Be implemented by classes with \`implements\`

**Only type aliases can:**
- Create union types: \`type ID = string | number\`
- Create intersection compositions: \`type AdminUser = User & Admin\`
- Name primitives: \`type Username = string\`
- Create mapped/conditional types

**Both can:**
- Define object shapes
- Be generic
- Be used for function signatures
- Extend each other (\`interface B extends A\` / \`type B = A & {...}\`)

**Convention:** Use \`interface\` for public API surfaces and when you expect others to extend your type. Use \`type\` for unions, computed types, and when declaration merging would be undesirable.`,
        difficulty: 'easy',
      },
      {
        question: 'What is a discriminated union and why is it useful?',
        answer: `A discriminated union is a union type where each member has a common property (the "discriminant") with a unique literal type value. TypeScript can narrow to the specific member using this property.

\`\`\`typescript
type Result<T> =
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }
  | { status: 'loading' };

function handleResult(result: Result<User>) {
  switch (result.status) {
    case 'success': return result.data.name; // TypeScript knows: { status: 'success'; data: User }
    case 'error': return result.error.message;
    case 'loading': return 'Loading...';
  }
}
\`\`\`

**Benefits:**
1. Type-safe branching — TypeScript narrows in each case
2. Exhaustiveness checking — add \`default: never\` to get a compile error if you miss a case
3. Self-documenting — the discriminant tells you what state you're in

Used extensively in Redux actions, async state management, and API responses.`,
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'generics',
    moduleId: 'typescript',
    title: 'Generics',
    description: 'Generic functions, components, hooks, constraints, and defaults',
    estimatedTime: '45 min',
    sections: [
      {
        title: 'What Are Generics',
        content: `Generics let you write reusable code that works with multiple types while maintaining type safety. Instead of using \`any\`, you parameterize the type.

\`\`\`ts
// Without generics: loses type information
function identity(arg: any): any { return arg; }

// With generics: preserves type
function identity<T>(arg: T): T { return arg; }

const str = identity('hello'); // TypeScript infers: string
const num = identity(42);      // TypeScript infers: number
\`\`\`

**Type inference:** TypeScript often infers generic type arguments from usage. You can also specify explicitly: \`identity<string>('hello')\`.

**Constraints:** Use \`extends\` to restrict what types T can be.`,
      },
    ],
    codeExamples: [
      {
        title: 'Generic functions and hooks',
        language: 'typescript',
        code: `// Generic function
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}
const firstNum = first([1, 2, 3]); // number | undefined
const firstStr = first(['a', 'b']); // string | undefined

// Generic with constraint
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
const user = { id: 1, name: 'Alice', email: 'alice@example.com' };
const name = getProperty(user, 'name'); // string — TypeScript knows!
// getProperty(user, 'foo'); // Error: 'foo' is not a key of user

// Generic useLocalStorage hook
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((prev: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [storedValue, setValue] as const;
}

// Usage: fully typed
const [theme, setTheme] = useLocalStorage<'dark' | 'light'>('theme', 'dark');
// theme: 'dark' | 'light' — not just string!

// Generic API client
async function fetchApi<TResponse>(url: string): Promise<TResponse> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  return res.json() as Promise<TResponse>;
}

interface User { id: string; name: string; }
const user2 = await fetchApi<User>('/api/users/1'); // User — not any!`,
        explanation: 'Generics preserve type information that any would lose. Constraints (extends) limit valid type arguments.',
      },
      {
        title: 'Generic React components',
        language: 'typescript',
        code: `import { ReactNode } from 'react';

// Generic Table component
interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], row: T) => ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string;
}

function Table<T>({ data, columns, keyExtractor }: TableProps<T>) {
  return (
    <table>
      <thead>
        <tr>
          {columns.map(col => (
            <th key={String(col.key)}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map(row => (
          <tr key={keyExtractor(row)}>
            {columns.map(col => (
              <td key={String(col.key)}>
                {col.render ? col.render(row[col.key], row) : String(row[col.key])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Usage — fully type-safe!
interface User { id: string; name: string; age: number; }

<Table<User>
  data={users}
  keyExtractor={user => user.id}
  columns={[
    { key: 'name', header: 'Name' },
    { key: 'age', header: 'Age', render: (age) => <span>{age} years</span> },
    // { key: 'foo', ... } // Error! 'foo' is not a key of User
  ]}
/>`,
        explanation: 'Generic components maintain type safety through the whole component. Columns are typed to the data shape.',
      },
    ],
    interviewQuestions: [
      {
        question: 'Explain generics in TypeScript. Build a generic useFetch hook.',
        answer: `Generics are type parameters that let you write reusable code that works with multiple types while preserving type information.

\`\`\`typescript
interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

function useFetch<T>(url: string): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null, loading: true, error: null,
  });

  useEffect(() => {
    const controller = new AbortController();
    fetch(url, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
        return res.json() as Promise<T>;
      })
      .then(data => setState({ data, loading: false, error: null }))
      .catch(error => {
        if (error.name !== 'AbortError') {
          setState({ data: null, loading: false, error });
        }
      });
    return () => controller.abort();
  }, [url]);

  return state;
}

// Usage:
interface User { id: string; name: string; }
const { data, loading } = useFetch<User>('/api/user/1');
// data is User | null — not any!
\`\`\`

The \`T\` parameter flows from the call site through to \`state.data\`, giving you full type safety on the result.`,
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'utility-types',
    moduleId: 'typescript',
    title: 'Utility Types',
    description: 'All built-in utility types with practical React examples',
    estimatedTime: '40 min',
    sections: [],
    codeExamples: [
      {
        title: 'All essential utility types',
        language: 'typescript',
        code: `interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

// Partial<T> — all properties optional
type UserUpdate = Partial<User>;
// { id?: string; name?: string; email?: string; ... }

function updateUser(id: string, updates: Partial<User>) {
  return db.user.update({ where: { id }, data: updates });
}

// Required<T> — all properties required (removes optional)
interface Config {
  debug?: boolean;
  timeout?: number;
}
type RequiredConfig = Required<Config>; // { debug: boolean; timeout: number }

// Pick<T, K> — only include specified keys
type UserPreview = Pick<User, 'id' | 'name'>;
// { id: string; name: string }

// Omit<T, K> — exclude specified keys
type UserWithoutId = Omit<User, 'id' | 'createdAt'>;
// { name: string; email: string; role: 'admin' | 'user' }

// Record<K, V> — object type with specific key/value types
type PermissionMap = Record<User['role'], string[]>;
// { admin: string[]; user: string[] }

const permissions: PermissionMap = {
  admin: ['read', 'write', 'delete'],
  user: ['read'],
};

// Readonly<T> — all properties read-only
type ImmutableUser = Readonly<User>;
const u: ImmutableUser = { id: '1', name: 'Alice', email: 'a@b.com', role: 'user', createdAt: new Date() };
// u.name = 'Bob'; // Error!

// NonNullable<T> — removes null and undefined
type MaybeString = string | null | undefined;
type DefinitelyString = NonNullable<MaybeString>; // string

// ReturnType<T> — extract return type of function
async function getUser() {
  return { id: '1', name: 'Alice' };
}
type GetUserReturn = Awaited<ReturnType<typeof getUser>>;
// { id: string; name: string }

// Parameters<T> — extract parameters as tuple
function createUser(name: string, email: string, role: 'admin' | 'user') {}
type CreateUserParams = Parameters<typeof createUser>;
// [name: string, email: string, role: 'admin' | 'user']

// Extract and Exclude
type StringOrNumber = string | number | boolean;
type JustStrings = Extract<StringOrNumber, string>; // string
type NotBoolean = Exclude<StringOrNumber, boolean>; // string | number`,
        explanation: 'Utility types transform existing types. They\'re crucial for DRY TypeScript code and React prop types.',
      },
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between Partial, Pick, and Omit?',
        answer: `All three create new types from an existing type, but differently:

**\`Partial<T>\`:** Makes ALL properties of T optional. Used for update operations where you might only change some fields.
\`\`\`ts
type UserPatch = Partial<User>; // all fields optional
\`\`\`

**\`Pick<T, K>\`:** Creates a type with ONLY the listed properties. Used to create lightweight "preview" or "summary" types.
\`\`\`ts
type UserCard = Pick<User, 'id' | 'name' | 'avatar'>; // only these 3
\`\`\`

**\`Omit<T, K>\`:** Creates a type with all properties EXCEPT the listed ones. Used to remove sensitive or internal fields.
\`\`\`ts
type PublicUser = Omit<User, 'passwordHash' | 'internalId'>; // remove sensitive
\`\`\`

In React: \`Omit\` and \`Pick\` are common for component props derived from data types. \`Partial\` is common for form state and update mutations.`,
        difficulty: 'easy',
      },
    ],
  },
  {
    id: 'react-patterns',
    moduleId: 'typescript',
    title: 'TypeScript with React Patterns',
    description: 'Typing props, hooks, context, discriminated unions, and polymorphic components',
    estimatedTime: '55 min',
    sections: [],
    codeExamples: [
      {
        title: 'Typing props — all patterns',
        language: 'typescript',
        code: `import { ReactNode, ComponentPropsWithoutRef, CSSProperties } from 'react';

// Basic props
interface ButtonProps {
  label: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

// Children prop
interface CardProps {
  children: ReactNode;          // any renderable content
  title: string;
  className?: string;
}

// Event handlers
interface InputProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  value: string;
}

// Style props
interface StyledProps {
  style?: CSSProperties;
  className?: string;
}

// Extending HTML element props (keeps all native button props)
interface IconButtonProps extends ComponentPropsWithoutRef<'button'> {
  icon: React.ReactNode;  // adds icon prop, keeps all button props
  label: string;          // for accessibility
}

function IconButton({ icon, label, ...buttonProps }: IconButtonProps) {
  return (
    <button aria-label={label} {...buttonProps}>
      {icon}
    </button>
  );
}

// Polymorphic "as" prop — render as different elements
type PolymorphicProps<T extends React.ElementType> = {
  as?: T;
  children: ReactNode;
} & ComponentPropsWithoutRef<T>;

function Box<T extends React.ElementType = 'div'>({
  as,
  children,
  ...props
}: PolymorphicProps<T>) {
  const Component = as ?? 'div';
  return <Component {...props}>{children}</Component>;
}

// Usage
<Box>Default div</Box>
<Box as="section" className="hero">Section</Box>
<Box as="button" onClick={() => {}}>Button-like box</Box>
// TypeScript enforces the right props for each element type`,
        explanation: 'ComponentPropsWithoutRef lets you extend native HTML element props. Polymorphic components use generics for the "as" prop.',
      },
      {
        title: 'Typing context and useRef',
        language: 'typescript',
        code: `import { createContext, useContext, useRef, MutableRefObject } from 'react';

// Typed context — null initial, assert with custom hook
interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

// Typing useRef — DOM vs mutable value
// 1. DOM ref: must include null (element may not be mounted)
const inputRef = useRef<HTMLInputElement>(null);
inputRef.current?.focus(); // optional chain because might be null

// 2. Mutable value ref: use | null or just provide initial
const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
const counterRef = useRef<number>(0);

// 3. ForwardRef with TypeScript
import { forwardRef } from 'react';

interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, value, onChange }, ref) => (
    <div>
      <label>{label}</label>
      <input
        ref={ref}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
);
Input.displayName = 'Input'; // for DevTools

// Usage
const ref = useRef<HTMLInputElement>(null);
<Input ref={ref} label="Name" value={name} onChange={setName} />
ref.current?.select();`,
        explanation: 'DOM refs need null in type. forwardRef needs both the element type and props type. Context null pattern with custom hook provides type safety.',
      },
      {
        title: 'Discriminated unions for component variants',
        language: 'typescript',
        code: `// Button with variants — discriminated union ensures correct prop combinations
type ButtonProps =
  | {
      variant: 'primary' | 'secondary';
      onClick: () => void;
      href?: never; // cannot have href with these variants
      children: ReactNode;
    }
  | {
      variant: 'link';
      href: string;
      onClick?: never; // cannot have onClick with link variant
      children: ReactNode;
    };

function Button(props: ButtonProps) {
  if (props.variant === 'link') {
    return <a href={props.href}>{props.children}</a>;
  }
  return <button onClick={props.onClick}>{props.children}</button>;
}

// TypeScript enforces:
<Button variant="primary" onClick={() => {}}>Click</Button> // ✓
<Button variant="link" href="/about">About</Button>         // ✓
// <Button variant="link" onClick={() => {}}>Link</Button>  // ✗ Error!
// <Button variant="primary" href="/about">Btn</Button>     // ✗ Error!

// Alert component with required props per type
type AlertProps =
  | { type: 'success'; message: string; onDismiss?: () => void }
  | { type: 'error'; message: string; code: number; onRetry: () => void }
  | { type: 'warning'; message: string; details?: string };

function Alert(props: AlertProps) {
  switch (props.type) {
    case 'error':
      // TypeScript knows: code and onRetry are available
      return (
        <div>
          Error {props.code}: {props.message}
          <button onClick={props.onRetry}>Retry</button>
        </div>
      );
    // ...
  }
}`,
        explanation: 'Discriminated unions + never prevent invalid prop combinations at compile time. Much better than just making everything optional.',
      },
    ],
    interviewQuestions: [
      {
        question: 'How do you type a polymorphic "as" prop in TypeScript?',
        answer: `A polymorphic component accepts an \`as\` prop that determines what HTML element or component to render, with TypeScript enforcing the correct props for that element.

\`\`\`typescript
type PolymorphicRef<C extends React.ElementType> =
  React.ComponentPropsWithRef<C>['ref'];

type PolymorphicProps<C extends React.ElementType, Props = {}> = Props &
  Omit<React.ComponentPropsWithoutRef<C>, keyof Props> & {
    as?: C;
    ref?: PolymorphicRef<C>;
  };

function Text<C extends React.ElementType = 'span'>({
  as,
  children,
  ...props
}: PolymorphicProps<C, { children: ReactNode }>) {
  const Component = as ?? 'span';
  return <Component {...props}>{children}</Component>;
}

// TypeScript enforces:
<Text as="a" href="/home">Link</Text>       // ✓ href valid for <a>
<Text as="button" onClick={() => {}}>Btn</Text> // ✓ onClick valid for <button>
// <Text as="a" onClick={() => {}}>...</Text>   // ✓ actually OK, a can have onClick
// <Text as="span" href="/x">...</Text>          // ✗ href not valid on span
\`\`\`

This is used in component libraries like Radix UI and Chakra UI for their \`asChild\` and \`as\` prop patterns.`,
        difficulty: 'hard',
      },
    ],
  },
  {
    id: 'advanced',
    moduleId: 'typescript',
    title: 'Advanced TypeScript',
    description: 'Conditional types, mapped types, template literals, infer, and module augmentation',
    estimatedTime: '60 min',
    sections: [
      {
        title: 'Conditional Types',
        content: `Conditional types choose between types based on a condition:
\`\`\`ts
type IsString<T> = T extends string ? true : false;
type A = IsString<string>; // true
type B = IsString<number>; // false
\`\`\`

Combined with \`infer\`, conditional types can extract inner types from complex types.`,
      },
      {
        title: 'Mapped Types',
        content: `Mapped types transform all properties of a type:
\`\`\`ts
type Optional<T> = { [K in keyof T]?: T[K] };
type Nullable<T> = { [K in keyof T]: T[K] | null };
type ReadonlyDeep<T> = { readonly [K in keyof T]: T[K] };
\`\`\`

You can also filter properties with \`as\` and template literals.`,
      },
    ],
    codeExamples: [
      {
        title: 'Conditional types with infer',
        language: 'typescript',
        code: `// infer — extract types within conditional types
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type A = UnwrapPromise<Promise<string>>; // string
type B = UnwrapPromise<string>;          // string (not a promise)

// Extract array element type
type ElementType<T> = T extends (infer U)[] ? U : never;
type C = ElementType<string[]>; // string
type D = ElementType<number[]>; // number

// Extract function return type (manual version of ReturnType)
type MyReturnType<T extends (...args: any[]) => any> =
  T extends (...args: any[]) => infer R ? R : never;

// Deeply unwrap nested Promise
type Awaited2<T> = T extends Promise<infer U> ? Awaited2<U> : T;
type E = Awaited2<Promise<Promise<string>>>; // string

// Distributive conditional types
type ToArray<T> = T extends any ? T[] : never;
type F = ToArray<string | number>; // string[] | number[] (distributes!)
// NOT (string | number)[]

// Prevent distribution with brackets
type ToArrayNoDistribute<T> = [T] extends [any] ? T[] : never;
type G = ToArrayNoDistribute<string | number>; // (string | number)[]`,
        explanation: 'infer extracts inner types. Conditional types distribute over unions by default — use [T] to prevent distribution.',
      },
      {
        title: 'Mapped types — building utilities from scratch',
        language: 'typescript',
        code: `interface User {
  id: string;
  name: string;
  age: number;
  email: string;
}

// Custom Partial
type MyPartial<T> = { [K in keyof T]?: T[K] };

// Make specific keys required
type RequireKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;
type UserWithRequiredEmail = RequireKeys<Partial<User>, 'email'>;
// All optional, but email is required

// Nullable only string properties
type NullableStrings<T> = {
  [K in keyof T]: T[K] extends string ? T[K] | null : T[K];
};

// Filter properties by type
type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

type UserStringKeys = StringKeys<User>; // 'id' | 'name' | 'email'

// Rename keys with template literals
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};
type UserGetters = Getters<User>;
// { getId: () => string; getName: () => string; ... }

// Deep Readonly
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};`,
        explanation: 'Mapped types iterate over keyof T. Template literal types rename keys. as clause filters/transforms keys.',
      },
      {
        title: 'Template literal types',
        language: 'typescript',
        code: `// Template literal types — compose string literal types
type EventName = 'click' | 'focus' | 'blur';
type Handler = \`on\${Capitalize<EventName>}\`;
// 'onClick' | 'onFocus' | 'onBlur'

// CSS property builder
type CSSProperty = 'margin' | 'padding';
type CSSDirection = 'Top' | 'Right' | 'Bottom' | 'Left';
type CSSProps = \`\${CSSProperty}\${CSSDirection}\`;
// 'marginTop' | 'marginRight' | ... | 'paddingBottom' | 'paddingLeft'

// API route builder
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type ApiRoute = '/users' | '/posts' | '/comments';
type ApiEndpoint = \`\${HttpMethod} \${ApiRoute}\`;
// 'GET /users' | 'POST /users' | ... | 'DELETE /comments'

// Extract from string literal
type ExtractRouteParam<T extends string> =
  T extends \`\${infer _Start}:\${infer Param}/\${infer _Rest}\`
    ? Param | ExtractRouteParam<\`/\${_Rest}\`>
    : T extends \`\${infer _Start}:\${infer Param}\`
      ? Param
      : never;

type Params = ExtractRouteParam<'/users/:userId/posts/:postId'>;
// 'userId' | 'postId'

// Practical: typed event emitter
type EventMap = {
  userCreated: { id: string; name: string };
  orderPlaced: { orderId: string; total: number };
  error: { message: string };
};

class TypedEmitter<Events extends Record<string, object>> {
  on<K extends keyof Events>(event: K, handler: (data: Events[K]) => void): this {
    return this;
  }
  emit<K extends keyof Events>(event: K, data: Events[K]): void {}
}

const emitter = new TypedEmitter<EventMap>();
emitter.on('userCreated', (data) => console.log(data.name)); // data is typed!
// emitter.on('unknown', ...); // Error!`,
        explanation: 'Template literals compose string literal types. Combined with infer, they parse strings at the type level.',
      },
    ],
    interviewQuestions: [
      {
        question: 'What is the "infer" keyword in TypeScript?',
        answer: `\`infer\` is used in conditional types to capture a type that TypeScript infers within a conditional check. It can only appear in the \`extends\` clause of a conditional type.

\`\`\`typescript
// Without infer — can't extract the inner type
type UnwrapArray<T> = T extends Array<any> ? any : T; // loses the inner type

// With infer — captures the inner type
type UnwrapArray<T> = T extends Array<infer U> ? U : T;
type A = UnwrapArray<string[]>; // string
type B = UnwrapArray<User[]>;   // User

// Practical example: get the resolved type of a Promise
type Awaited<T> = T extends Promise<infer U> ? U : T;

// Built-in uses in TypeScript:
// ReturnType<T> — extracts what a function returns
type ReturnType<T extends (...args: any) => any> =
  T extends (...args: any) => infer R ? R : never;

// Parameters<T> — extracts function parameters
type Parameters<T extends (...args: any) => any> =
  T extends (...args: infer P) => any ? P : never;
\`\`\`

Think of \`infer U\` as a "capture variable" — wherever TypeScript sees the pattern, it captures that type into \`U\`.`,
        difficulty: 'hard',
      },
    ],
  },
];
