import type { TopicContent } from '@/types';

export const javascriptContent: TopicContent[] = [
  {
    id: 'execution-context',
    moduleId: 'javascript',
    title: 'Execution Context & Hoisting',
    description: 'Understanding how JavaScript sets up the environment before running your code',
    estimatedTime: '45 min',
    sections: [
      {
        title: 'What is Execution Context?',
        content: `An **execution context** is the environment in which JavaScript code is evaluated and executed. Every time JavaScript runs code, it creates an execution context. Think of it as a "wrapper" that manages the environment for the currently running code.

There are three types of execution contexts:

1. **Global Execution Context (GEC):** Created when the script first loads. There is only one GEC. It creates the \`window\` object (in browsers) or \`global\` object (in Node.js) and sets \`this\` to that object.

2. **Function Execution Context (FEC):** Created every time a function is called. Each function call gets its own execution context.

3. **Eval Execution Context:** Created when code runs inside \`eval()\`. Rarely used and generally avoided.

The **Call Stack** keeps track of all execution contexts. When a function is called, its context is pushed onto the stack. When it returns, it's popped off.`,
      },
      {
        title: 'Creation Phase vs Execution Phase',
        content: `Every execution context has two phases:

**Creation Phase:**
- The JavaScript engine scans the code
- Creates the \`arguments\` object (for functions)
- Sets up the scope chain
- **Hoists** variable and function declarations:
  - \`var\` declarations are hoisted and initialized to \`undefined\`
  - \`function\` declarations are hoisted in their entirety
  - \`let\` and \`const\` are hoisted but NOT initialized (TDZ)

**Execution Phase:**
- Code is executed line by line
- Values are assigned to variables
- Functions are called, creating new execution contexts`,
      },
      {
        title: 'Variable Hoisting: var vs let vs const',
        content: `**var hoisting:** \`var\` declarations are moved to the top of their function scope (or global scope) and initialized to \`undefined\`. The assignment stays in place.

**let and const hoisting:** \`let\` and \`const\` ARE hoisted (the engine knows they exist) but they are NOT initialized. Accessing them before their declaration throws a \`ReferenceError\`. This is the **Temporal Dead Zone (TDZ)**.

**Function hoisting:** Function *declarations* are fully hoisted — both the name AND the body. Function *expressions* (assigned to variables) follow the same rules as \`var\`, \`let\`, or \`const\`.`,
      },
      {
        title: 'Temporal Dead Zone (TDZ)',
        content: `The **Temporal Dead Zone** is the period between the start of a block scope and the point where a \`let\` or \`const\` variable is declared and initialized. During this time, the variable exists (it's been hoisted) but cannot be accessed.

\`\`\`js
// This throws ReferenceError: Cannot access 'x' before initialization
console.log(x); // TDZ!
let x = 5;
\`\`\`

The TDZ exists to catch bugs where you might accidentally use a variable before it's ready. It's a safety feature over \`var\`'s silent \`undefined\`.`,
      },
    ],
    codeExamples: [
      {
        title: 'Classic var hoisting trap',
        language: 'javascript',
        code: `console.log(name); // undefined (NOT ReferenceError)
var name = "Alice";
console.log(name); // "Alice"

// What JavaScript actually sees (after hoisting):
var name; // hoisted to top, initialized to undefined
console.log(name); // undefined
name = "Alice";
console.log(name); // "Alice"`,
        explanation: 'var is hoisted and initialized to undefined, so no error occurs — just undefined.',
      },
      {
        title: 'let/const TDZ in action',
        language: 'javascript',
        code: `// ReferenceError: Cannot access 'age' before initialization
console.log(age);
let age = 25;

// But this works fine:
let score = 100;
console.log(score); // 100

// TDZ in a block:
{
  console.log(value); // ReferenceError! TDZ starts here
  let value = 42;     // TDZ ends here
  console.log(value); // 42
}`,
        explanation: 'let/const are hoisted but not initialized. Accessing them in the TDZ throws ReferenceError.',
      },
      {
        title: 'Function declaration vs expression hoisting',
        language: 'javascript',
        code: `// Function DECLARATION — fully hoisted
greet(); // "Hello!" — works before declaration
function greet() {
  console.log("Hello!");
}

// Function EXPRESSION with var — only var is hoisted
sayHi(); // TypeError: sayHi is not a function
var sayHi = function() {
  console.log("Hi!");
};

// Function EXPRESSION with let — TDZ
sayBye(); // ReferenceError: Cannot access 'sayBye' before initialization
let sayBye = function() {
  console.log("Bye!");
};`,
        explanation: 'Function declarations are fully hoisted. Function expressions follow the variable hoisting rules.',
      },
      {
        title: 'Tricky hoisting with var in loops',
        language: 'javascript',
        code: `// What does this print?
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// Prints: 3, 3, 3
// Because var is function-scoped, all callbacks share the same 'i'
// By the time they run, the loop has finished and i = 3

// Fix 1: Use let (block-scoped)
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 0);
}
// Prints: 0, 1, 2

// Fix 2: IIFE (old approach)
for (var k = 0; k < 3; k++) {
  ((k) => {
    setTimeout(() => console.log(k), 0);
  })(k);
}
// Prints: 0, 1, 2`,
        explanation: 'var is function-scoped so all loop iterations share the same variable. let creates a new binding per iteration.',
      },
      {
        title: 'What is the output? (interview question style)',
        language: 'javascript',
        code: `var x = 1;

function outer() {
  console.log(x); // What prints here?
  var x = 2;
  console.log(x); // What prints here?
}

outer();
console.log(x); // What prints here?

// Answers:
// Line 4: undefined (var x inside outer() is hoisted to top of outer)
// Line 5: 2
// Line 8: 1 (global x is unchanged)`,
        explanation: 'The var x inside outer() shadows the global x and is hoisted within the function scope.',
      },
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between hoisting of var, let, and const?',
        answer: `All three are hoisted, but differently:
- **var** is hoisted to the top of its function scope and initialized to \`undefined\`. You can access it before declaration without an error — you just get \`undefined\`.
- **let** and **const** are hoisted to the top of their block scope but are NOT initialized. Accessing them before declaration throws a \`ReferenceError\`. This period before initialization is called the **Temporal Dead Zone (TDZ)**.
- **const** additionally requires initialization at the point of declaration and cannot be reassigned.

The TDZ for \`let\` and \`const\` is intentional — it prevents the confusing behavior of accessing a variable before it logically exists.`,
        difficulty: 'medium',
      },
      {
        question: 'Explain the two phases of execution context creation.',
        answer: `Every execution context (global or function) is created in two phases:

**1. Creation Phase:**
- The scope chain is established
- The \`this\` binding is determined
- Variable declarations are processed (hoisting): \`var\` gets hoisted and set to \`undefined\`, function declarations are fully hoisted, \`let\`/\`const\` enter the TDZ

**2. Execution Phase:**
- Code runs line by line
- Variable assignments happen here
- Functions are invoked, each creating their own execution context and being pushed onto the call stack

Understanding this explains why you can call a function declaration before its definition in code, but not a function expression.`,
        difficulty: 'medium',
      },
      {
        question: 'What will this code output and why?\n\nconsole.log(typeof foo);\nconsole.log(typeof bar);\nvar foo = "hello";\nlet bar = "world";',
        answer: `- \`typeof foo\` → **"undefined"** — \`var foo\` is hoisted and initialized to \`undefined\` before execution reaches that line. \`typeof\` on \`undefined\` returns the string "undefined".
- \`typeof bar\` → **ReferenceError** — Wait, actually \`typeof\` is special! Normally \`let\` in the TDZ throws ReferenceError, but \`typeof\` on a TDZ variable also throws a ReferenceError (unlike \`typeof undeclaredVar\` which returns "undefined").

So the output is:
1. "undefined"
2. ReferenceError: Cannot access 'bar' before initialization

This is a subtle distinction — \`typeof\` does NOT protect you from TDZ errors the way it protects you from undeclared variables.`,
        difficulty: 'hard',
      },
    ],
    gotchas: [
      {
        title: 'typeof does not protect against TDZ',
        description: 'typeof on an undeclared variable returns "undefined" safely, but typeof on a let/const variable in TDZ throws a ReferenceError.',
        example: `console.log(typeof undeclared); // "undefined" (safe)
console.log(typeof tdzVar); // ReferenceError!
let tdzVar = 5;`,
      },
      {
        title: 'var inside blocks is NOT block-scoped',
        description: 'Unlike let/const, var inside if/for/while blocks leaks to the enclosing function scope.',
        example: `if (true) {
  var leaked = "I leaked!";
  let blocked = "I stay here";
}
console.log(leaked); // "I leaked!"
console.log(blocked); // ReferenceError`,
      },
    ],
  },
  {
    id: 'closures',
    moduleId: 'javascript',
    title: 'Closures',
    description: 'One of the most powerful and frequently tested JavaScript concepts',
    estimatedTime: '40 min',
    sections: [
      {
        title: 'What is a Closure?',
        content: `A **closure** is the combination of a function and the **lexical environment** (scope) in which it was declared. A closure gives a function access to its outer function's variables even after the outer function has returned.

In simpler terms: a closure is created when an inner function "remembers" the variables from its outer scope, even when the inner function is executed outside of that outer scope.

Every function in JavaScript is a closure — they all have access to variables from their outer scope. But we typically say "closure" when we're talking about a function that *retains* access to a scope that has already been exited.`,
      },
      {
        title: 'Lexical Scope Chain',
        content: `**Lexical scope** means that the scope of a variable is determined by where it is written in the source code, not where/how the function is called. JavaScript uses lexical scoping.

When a function is created, it gets a reference to its outer scope. When it looks up a variable, it first checks its local scope, then each outer scope up the chain until it reaches global scope. This chain of scopes is called the **scope chain**.

Closures work because inner functions keep a reference to the scope in which they were defined — not a snapshot, but a live reference to the actual variable bindings.`,
      },
      {
        title: 'Practical Uses of Closures',
        content: `**1. Data Privacy / Module Pattern:**
Closures let you create "private" variables that can only be accessed through exposed functions.

**2. Function Factories:**
Create specialized versions of functions.

**3. Partial Application / Currying:**
Pre-fill some arguments to a function.

**4. Memoization:**
Cache expensive function results.

**5. Event Handlers:**
Access variables from the scope where a handler was registered.`,
      },
      {
        title: 'Memory Implications',
        content: `Closures keep the outer scope alive in memory as long as the closure itself is alive. This can cause **memory leaks** if closures are created unintentionally or held longer than needed.

Common pitfall: DOM event listeners that close over large objects. If the listener is never removed, the closed-over data stays in memory.

**Fix:** Remove event listeners when components unmount, be careful about what large variables your closures capture, and use WeakRef/WeakMap when appropriate.`,
      },
    ],
    codeExamples: [
      {
        title: 'Basic closure',
        language: 'javascript',
        code: `function makeCounter() {
  let count = 0; // This variable is "closed over"

  return function() {
    count++;
    return count;
  };
}

const counter = makeCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3

// count is not accessible from outside!
// console.log(count); // ReferenceError

const counter2 = makeCounter(); // Independent counter
console.log(counter2()); // 1 (fresh count)`,
        explanation: 'count lives in makeCounter\'s scope. The returned function closes over it, keeping it alive and private.',
      },
      {
        title: 'Closure for data privacy (Module pattern)',
        language: 'javascript',
        code: `function createBankAccount(initialBalance) {
  let balance = initialBalance; // private!

  return {
    deposit(amount) {
      balance += amount;
      return balance;
    },
    withdraw(amount) {
      if (amount > balance) throw new Error('Insufficient funds');
      balance -= amount;
      return balance;
    },
    getBalance() {
      return balance;
    }
  };
}

const account = createBankAccount(100);
console.log(account.getBalance()); // 100
account.deposit(50);
console.log(account.getBalance()); // 150
// account.balance // undefined — truly private`,
        explanation: 'balance is private to the closure. Only the exposed methods can access or modify it.',
      },
      {
        title: 'Function factory',
        language: 'javascript',
        code: `function multiplier(factor) {
  return (number) => number * factor; // closes over 'factor'
}

const double = multiplier(2);
const triple = multiplier(3);
const tenX = multiplier(10);

console.log(double(5));  // 10
console.log(triple(5)); // 15
console.log(tenX(5));   // 50

// Real-world use: creating validators
function createValidator(min, max) {
  return (value) => {
    if (value < min) return \`Value must be at least \${min}\`;
    if (value > max) return \`Value must be at most \${max}\`;
    return null; // valid
  };
}

const validateAge = createValidator(0, 120);
const validateScore = createValidator(0, 100);

console.log(validateAge(25));  // null (valid)
console.log(validateAge(-1)); // "Value must be at least 0"
console.log(validateScore(105)); // "Value must be at most 100"`,
        explanation: 'Factory functions use closures to "bake in" configuration values.',
      },
      {
        title: 'The classic var-in-loop closure bug',
        language: 'javascript',
        code: `// BROKEN: All callbacks share the same 'i' (var is function-scoped)
const funcs = [];
for (var i = 0; i < 5; i++) {
  funcs.push(() => console.log(i));
}
funcs.forEach(f => f()); // 5 5 5 5 5

// FIX 1: Use let (creates new binding per iteration)
const funcs2 = [];
for (let j = 0; j < 5; j++) {
  funcs2.push(() => console.log(j));
}
funcs2.forEach(f => f()); // 0 1 2 3 4

// FIX 2: IIFE to capture current value
const funcs3 = [];
for (var k = 0; k < 5; k++) {
  funcs3.push(((k) => () => console.log(k))(k));
}
funcs3.forEach(f => f()); // 0 1 2 3 4`,
        explanation: 'With var, all closures share the same variable binding. let creates a new binding per loop iteration.',
      },
      {
        title: 'Memoization with closures',
        language: 'javascript',
        code: `function memoize(fn) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      console.log('Cache hit!');
      return cache.get(key);
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

function slowFibonacci(n) {
  if (n <= 1) return n;
  return slowFibonacci(n - 1) + slowFibonacci(n - 2);
}

const fastFib = memoize(slowFibonacci);
console.log(fastFib(40)); // Computed (slow first time)
console.log(fastFib(40)); // Cache hit! (instant)`,
        explanation: 'cache lives in the memoize closure, persisting between calls to the returned function.',
      },
      {
        title: 'Partial application',
        language: 'javascript',
        code: `function partial(fn, ...presetArgs) {
  return function(...laterArgs) {
    return fn(...presetArgs, ...laterArgs);
  };
}

function add(a, b, c) {
  return a + b + c;
}

const add5 = partial(add, 5);       // a=5 baked in
const add5and10 = partial(add, 5, 10); // a=5, b=10 baked in

console.log(add5(3, 2));    // 10 (5 + 3 + 2)
console.log(add5and10(7)); // 22 (5 + 10 + 7)

// Practical example: logging with prefix
function log(level, message) {
  console.log(\`[\${level}] \${message}\`);
}

const logError = partial(log, 'ERROR');
const logInfo = partial(log, 'INFO');

logError('Database connection failed'); // [ERROR] Database connection failed
logInfo('Server started on port 3000'); // [INFO] Server started on port 3000`,
        explanation: 'Partial application pre-fills arguments using closures, creating specialized versions of functions.',
      },
    ],
    interviewQuestions: [
      {
        question: 'What is a closure? Can you give a practical real-world use case?',
        answer: `A closure is when a function retains access to variables from its outer (lexical) scope, even after that outer function has returned.

Practical use cases:
1. **Data privacy** — the counter/bank account pattern where internal state is hidden
2. **Function factories** — creating customized functions (multiplier, validators)
3. **React hooks** — useState, useEffect all rely on closures to remember state between renders
4. **Event handlers** — accessing component data in a DOM event callback
5. **setTimeout/async** — accessing variables when the callback eventually fires

In React specifically, closures are everywhere: when you write \`() => setCount(count + 1)\`, you're creating a closure over \`count\`.`,
        difficulty: 'medium',
      },
      {
        question: 'What will this print and why?\n\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 1000);\n}',
        answer: `It prints **3, 3, 3** after 1 second.

**Why:** \`var\` is function-scoped (or global here), so all three arrow functions close over the **same** variable \`i\`. The \`for\` loop completes (incrementing \`i\` to 3) before any timeout fires. When the callbacks execute, they all read the current value of \`i\`, which is 3.

**Fix:** Replace \`var\` with \`let\`. Because \`let\` is block-scoped, each iteration of the loop creates a **new binding** for \`i\`. Each callback closes over its own copy.

\`\`\`js
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1000);
}
// Prints: 0, 1, 2
\`\`\``,
        difficulty: 'medium',
      },
      {
        question: 'How can closures cause memory leaks?',
        answer: `Closures keep the outer scope alive as long as the closure itself is alive. This becomes a memory leak when:

1. **DOM event listeners** closed over large data structures that are never cleaned up
2. **Long-lived timers** (setInterval) that hold references to state
3. **React:** useEffect with event listeners that don't return a cleanup function

Example:
\`\`\`js
function addHandler() {
  const largeData = new Array(1000000).fill('data');
  element.addEventListener('click', () => {
    console.log(largeData.length); // closes over largeData
  });
  // largeData stays in memory as long as the listener is attached!
}
\`\`\`

Fix: Remove event listeners when no longer needed, use WeakRef for caches, and always return cleanup functions from useEffect.`,
        difficulty: 'hard',
      },
      {
        question: 'What is the difference between a closure and a regular function?',
        answer: `Technically, every function in JavaScript is a closure — they all maintain a reference to their outer scope chain. But in practice, we say "closure" to describe a function that **meaningfully accesses** variables from an outer scope that has already finished executing.

A "regular function" typically refers to a pure function that only uses its local variables and parameters. A closure specifically preserves and accesses outer scope state.

The key distinction is: **does the function reference variables that outlive the function invocation where they were defined?** If yes, it's a closure in the practical sense.`,
        difficulty: 'easy',
      },
      {
        question: 'How do closures relate to React hooks?',
        answer: `React hooks rely heavily on closures:

1. **useState:** When you write \`const [count, setCount] = useState(0)\`, the \`setCount\` function closes over the state update mechanism.

2. **useEffect:** The callback you pass closes over any variables from the component's render scope. This is why stale closures are a common bug — if your effect captures \`count\` at render time, but \`count\` changes, your effect has a "stale" value.

3. **useCallback/useMemo:** These are explicitly about controlling when closures get re-created to preserve referential stability.

The "stale closure" problem:
\`\`\`js
useEffect(() => {
  const timer = setInterval(() => {
    console.log(count); // stale! always logs initial value
  }, 1000);
  return () => clearInterval(timer);
}, []); // empty deps = only runs once, closes over initial count
\`\`\`

Fix: Add \`count\` to the deps array, or use the functional update form \`setCount(prev => prev + 1)\`.`,
        difficulty: 'hard',
      },
    ],
    gotchas: [
      {
        title: 'Stale closures in React useEffect',
        description: 'If a useEffect callback closes over a variable but that variable isn\'t in the dependency array, the callback will see the stale (old) value.',
        example: `const [count, setCount] = useState(0);
useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1); // BUG: 'count' is stale, always 0+1=1
  }, 1000);
  return () => clearInterval(id);
}, []); // missing count in deps

// Fix:
setCount(prev => prev + 1); // use functional update, no closure needed`,
      },
      {
        title: 'Closures in loops with async operations',
        description: 'All iterations of a var-loop share the same binding, causing unexpected behavior in async callbacks.',
      },
    ],
  },
  {
    id: 'this-keyword',
    moduleId: 'javascript',
    title: 'The `this` Keyword',
    description: 'Understanding how this is dynamically bound depending on call context',
    estimatedTime: '35 min',
    sections: [
      {
        title: 'How this is Determined',
        content: `\`this\` is not determined by where a function is defined, but by **how it is called**. There are 4 rules (in order of precedence):

1. **new binding:** When called with \`new\`, \`this\` is the newly created object
2. **explicit binding:** When called with \`call\`, \`apply\`, or \`bind\`, \`this\` is explicitly set
3. **implicit binding:** When called as a method (\`obj.method()\`), \`this\` is the object before the dot
4. **default binding:** When called as a plain function, \`this\` is the global object (or \`undefined\` in strict mode)

Arrow functions are the exception: they don't have their own \`this\`. They inherit \`this\` from the surrounding lexical scope.`,
      },
      {
        title: 'this in Arrow Functions vs Regular Functions',
        content: `**Regular functions** have their own \`this\` binding determined at call time.

**Arrow functions** do NOT have their own \`this\`. Instead they lexically inherit \`this\` from the enclosing non-arrow function scope.

This makes arrow functions ideal for callbacks inside class methods or object methods where you need to preserve the outer \`this\`.`,
      },
      {
        title: 'call, apply, and bind',
        content: `All three explicitly set \`this\`:

- **call(thisArg, arg1, arg2, ...)** — calls immediately, arguments passed individually
- **apply(thisArg, [arg1, arg2, ...])** — calls immediately, arguments passed as array
- **bind(thisArg, arg1, ...)** — returns a new function with \`this\` permanently bound (partial application too)`,
      },
    ],
    codeExamples: [
      {
        title: 'this in different contexts',
        language: 'javascript',
        code: `// 1. Global context
function showThis() {
  console.log(this);
}
showThis(); // window (browser) or global (Node) — or undefined in strict mode

// 2. Object method
const obj = {
  name: 'Alice',
  greet() {
    console.log(this.name); // 'Alice' — this = obj
  }
};
obj.greet(); // Alice

// 3. Detached method — 'this' is lost!
const greetFn = obj.greet;
greetFn(); // undefined (strict) or error — 'this' is now global

// 4. Arrow function in object — inherits outer 'this'
const obj2 = {
  name: 'Bob',
  greet: () => {
    console.log(this.name); // undefined! Arrow inherits global 'this'
  }
};
obj2.greet(); // undefined`,
        explanation: 'this depends on HOW the function is called, not where it is defined. Detaching a method loses the this binding.',
      },
      {
        title: 'call, apply, bind',
        language: 'javascript',
        code: `function introduce(greeting, punctuation) {
  console.log(\`\${greeting}, I'm \${this.name}\${punctuation}\`);
}

const alice = { name: 'Alice' };
const bob = { name: 'Bob' };

// call: immediate, individual args
introduce.call(alice, 'Hello', '!'); // "Hello, I'm Alice!"
introduce.call(bob, 'Hi', '.'); // "Hi, I'm Bob."

// apply: immediate, array of args
introduce.apply(alice, ['Hey', '?']); // "Hey, I'm Alice?"

// bind: returns new function, args can be pre-filled
const aliceIntro = introduce.bind(alice, 'Greetings');
aliceIntro('!!!'); // "Greetings, I'm Alice!!!"

// Bind for setTimeout fix (classic pattern)
class Timer {
  constructor() {
    this.seconds = 0;
  }
  start() {
    // Without bind: 'this' would be undefined or global
    setInterval(this.tick.bind(this), 1000);
  }
  tick() {
    this.seconds++;
    console.log(this.seconds);
  }
}`,
        explanation: 'call/apply/bind give you explicit control over what this refers to.',
      },
      {
        title: 'Arrow functions solve this problems in classes',
        language: 'javascript',
        code: `class Button {
  constructor(label) {
    this.label = label;
  }

  // BAD: regular function loses 'this' in callback
  setupBadHandler() {
    document.querySelector('button').addEventListener('click', function() {
      console.log(this.label); // undefined! 'this' is the button element
    });
  }

  // GOOD: arrow function inherits 'this' from class instance
  setupGoodHandler() {
    document.querySelector('button').addEventListener('click', () => {
      console.log(this.label); // 'this' is the Button instance
    });
  }

  // ALSO GOOD: class field arrow function
  handleClick = () => {
    console.log(this.label); // always bound to instance
  }
}`,
        explanation: 'Arrow functions in class methods/event handlers preserve the class instance as this.',
      },
      {
        title: 'this with new keyword',
        language: 'javascript',
        code: `function Person(name, age) {
  this.name = name;
  this.age = age;
  // 'this' is the newly created object
}

const alice = new Person('Alice', 30);
console.log(alice.name); // 'Alice'
console.log(alice.age);  // 30

// What new actually does:
function simulateNew(Constructor, ...args) {
  // 1. Create new empty object
  const obj = Object.create(Constructor.prototype);
  // 2. Call constructor with 'this' = new object
  const result = Constructor.apply(obj, args);
  // 3. Return the new object (unless constructor returns object)
  return result instanceof Object ? result : obj;
}`,
        explanation: 'new creates a fresh object, sets this to it, runs the constructor, then returns the object.',
      },
      {
        title: 'Tricky this — what will print?',
        language: 'javascript',
        code: `const obj = {
  value: 42,
  getValue: function() {
    return this.value;
  },
  getValueArrow: () => {
    return this.value; // 'this' is the outer scope (global/undefined)
  },
  getValueNested: function() {
    const helper = function() {
      return this.value; // lost 'this'!
    };
    return helper();
  },
  getValueNestedFixed: function() {
    const helper = () => {
      return this.value; // arrow inherits 'this' from getValueNestedFixed
    };
    return helper();
  }
};

console.log(obj.getValue());            // 42
console.log(obj.getValueArrow());       // undefined
console.log(obj.getValueNested());      // undefined (strict) / TypeError
console.log(obj.getValueNestedFixed()); // 42`,
        explanation: 'Arrow functions in nested callbacks are the clean solution to losing this.',
      },
      {
        title: 'this in event handlers',
        language: 'javascript',
        code: `class Accordion {
  constructor(element) {
    this.element = element;
    this.isOpen = false;

    // 'this' in event handler is the DOM element, not the class!
    // Fix: bind or arrow function
    this.element.addEventListener('click', this.toggle.bind(this));

    // Or use class field arrow function:
    // this.element.addEventListener('click', this.toggle);
  }

  toggle() {
    this.isOpen = !this.isOpen;
    this.element.classList.toggle('open', this.isOpen);
  }

  // Class field arrow: 'this' is always bound to instance
  toggle = () => {
    this.isOpen = !this.isOpen;
    this.element.classList.toggle('open', this.isOpen);
  }
}`,
        explanation: 'DOM event handlers set this to the element. Use bind or class field arrows to keep the class instance.',
      },
    ],
    interviewQuestions: [
      {
        question: 'What are the 4 rules for determining what "this" refers to?',
        answer: `In order of precedence (highest to lowest):

1. **new binding:** \`new Foo()\` — \`this\` is the newly created object
2. **Explicit binding:** \`fn.call(obj)\`, \`fn.apply(obj)\`, \`fn.bind(obj)\` — \`this\` is \`obj\`
3. **Implicit binding:** \`obj.method()\` — \`this\` is \`obj\` (the thing before the dot)
4. **Default binding:** \`fn()\` — \`this\` is the global object in non-strict mode, \`undefined\` in strict mode

**Exception:** Arrow functions don't have their own \`this\`. They inherit \`this\` from their lexical scope (the enclosing function at definition time).`,
        difficulty: 'medium',
      },
      {
        question: 'Why do arrow functions not have their own "this"?',
        answer: `Arrow functions were specifically designed to solve the problem of losing \`this\` in callbacks. Before arrow functions, developers had to use \`self = this\` tricks or \`.bind(this)\`.

Arrow functions capture \`this\` from the **lexical scope** — the \`this\` value of the enclosing non-arrow function at the time the arrow function is defined. This \`this\` is fixed and cannot be overridden by \`call\`, \`apply\`, or \`bind\`.

This makes them perfect for:
- Event handler callbacks in class methods
- Array method callbacks (\`forEach\`, \`map\`) that need to access class properties
- setTimeout/setInterval callbacks

But it makes them unsuitable for:
- Object methods (they can't reference the object with \`this\`)
- Constructor functions
- Prototype methods (where you want each instance to be \`this\`)`,
        difficulty: 'medium',
      },
      {
        question: 'What is the difference between call, apply, and bind?',
        answer: `All three explicitly set \`this\`, but they differ in when/how they execute:

- **\`call(thisArg, arg1, arg2, ...)\`**: Invokes the function immediately. Arguments are passed individually as a comma-separated list.
- **\`apply(thisArg, [arg1, arg2, ...])\`**: Invokes the function immediately. Arguments are passed as a single array. Useful when you already have args in an array.
- **\`bind(thisArg, arg1, ...)\`**: Does NOT invoke the function. Returns a new function with \`this\` permanently bound. Optional pre-filled arguments (partial application).

Memory trick: **A**pply takes **A**rrays, **C**all takes a **C**omma-separated list, **B**ind returns a **B**ound function.`,
        difficulty: 'easy',
      },
      {
        question: 'What is the output?\n\nconst obj = { name: "test" };\nconst fn = function() { console.log(this.name); };\nconst arrow = () => console.log(this.name);\n\nfn.call(obj);\narrow.call(obj);',
        answer: `- \`fn.call(obj)\` → **"test"** — Regular functions respond to \`call\`. \`this\` is set to \`obj\`.
- \`arrow.call(obj)\` → **undefined** (or whatever the global \`this.name\` is) — Arrow functions IGNORE \`call\`. Their \`this\` is lexically bound at creation time and cannot be overridden.

This is the key difference: you cannot override \`this\` in an arrow function using \`call\`, \`apply\`, or \`bind\`. They silently ignore the \`thisArg\`.`,
        difficulty: 'hard',
      },
      {
        question: 'How would you fix the "this" problem in a class method used as an event handler?',
        answer: `There are 3 common approaches:

**1. Bind in constructor:**
\`\`\`js
constructor() {
  this.handleClick = this.handleClick.bind(this);
}
\`\`\`

**2. Class field arrow function (most modern, recommended):**
\`\`\`js
class MyComponent {
  handleClick = () => {
    // 'this' always refers to the instance
    console.log(this.state);
  }
}
\`\`\`

**3. Inline arrow function (slight perf overhead — new function each render in React):**
\`\`\`js
<button onClick={() => this.handleClick()}>
\`\`\`

In modern React (functional components), this isn't an issue because you use \`const handleClick = () => {...}\` and hooks instead of classes.`,
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'event-loop',
    moduleId: 'javascript',
    title: 'Event Loop & Asynchronous JavaScript',
    description: 'The most frequently asked JavaScript topic — understand exactly how async works',
    estimatedTime: '60 min',
    sections: [
      {
        title: 'The JavaScript Runtime',
        content: `JavaScript is **single-threaded** — it has one call stack and executes one thing at a time. So how does it handle async operations without blocking?

The answer is the **event loop** — a mechanism that coordinates the call stack with async tasks.

**Components:**
1. **Call Stack:** LIFO structure where functions execute. One at a time.
2. **Web APIs / Node APIs:** Browser/Node provides APIs for async operations (setTimeout, fetch, DOM events). These run outside JS.
3. **Callback Queue (Macrotask Queue):** Where callbacks from Web APIs wait (setTimeout, setInterval, I/O, MessageChannel).
4. **Microtask Queue:** Higher priority queue for Promise callbacks (.then, .catch, .finally) and MutationObserver, queueMicrotask.
5. **Event Loop:** Continuously checks: if call stack is empty, first drain ALL microtasks, then process ONE macrotask, then repeat.`,
      },
      {
        title: 'Execution Order Rule',
        content: `**The golden rule:**
1. Run all synchronous code (fill the call stack, drain it)
2. Process ALL microtasks (Promise callbacks) — drain the queue completely, including any microtasks added by microtasks
3. Process ONE macrotask (setTimeout, setInterval callback)
4. Go back to step 2 (process all new microtasks)
5. Process next macrotask
6. Repeat

This means: **Microtasks always run before the next macrotask, no matter how many are added.**

**Macrotasks:** setTimeout, setInterval, setImmediate (Node), I/O, UI rendering
**Microtasks:** Promise.then/catch/finally, async/await, queueMicrotask, MutationObserver`,
      },
      {
        title: 'requestAnimationFrame',
        content: `\`requestAnimationFrame\` (rAF) runs **before** the next paint but **after** the current task and microtasks. It's technically not a macro or micro task — it runs in the "render steps" between tasks.

Order per frame: tasks → microtasks → **rAF callbacks** → render/paint → tasks...

Use rAF for animations and DOM measurements to stay in sync with the browser's 60fps rendering cycle.`,
      },
    ],
    codeExamples: [
      {
        title: 'Basic event loop order',
        language: 'javascript',
        code: `console.log('1 - sync');

setTimeout(() => console.log('2 - setTimeout (macrotask)'), 0);

Promise.resolve().then(() => console.log('3 - Promise (microtask)'));

console.log('4 - sync');

// Output:
// 1 - sync
// 4 - sync
// 3 - Promise (microtask)    <-- microtask before macrotask!
// 2 - setTimeout (macrotask)

// Why? Execution order:
// 1. Sync: log 1, schedule setTimeout, schedule Promise.then, log 4
// 2. Call stack empty → drain microtasks: log 3
// 3. Event loop picks macrotask: log 2`,
        explanation: 'Microtasks (Promises) always run before macrotasks (setTimeout), even with setTimeout(0).',
      },
      {
        title: 'Nested microtasks — they all run before any macrotask',
        language: 'javascript',
        code: `setTimeout(() => console.log('A - macrotask 1'), 0);

Promise.resolve()
  .then(() => {
    console.log('B - microtask 1');
    // Adding another microtask from within a microtask!
    Promise.resolve().then(() => console.log('C - microtask 2'));
  })
  .then(() => console.log('D - microtask 3'));

setTimeout(() => console.log('E - macrotask 2'), 0);

// Output:
// B - microtask 1
// C - microtask 2
// D - microtask 3
// A - macrotask 1
// E - macrotask 2

// Key insight: ALL microtasks (including newly added ones)
// run before any macrotask!`,
        explanation: 'Microtasks added during microtask processing are processed in the same microtask queue drain — before any macrotask.',
      },
      {
        title: 'async/await and the event loop',
        language: 'javascript',
        code: `async function fetchData() {
  console.log('B - inside async, before await');
  const result = await Promise.resolve('data'); // suspends here
  console.log('D - after await:', result); // resumes as microtask
}

console.log('A - sync start');
fetchData();
console.log('C - sync continues after calling async fn');

// Output:
// A - sync start
// B - inside async, before await
// C - sync continues after calling async fn
// D - after await: data

// async/await desugars to:
// fetchData returns a Promise
// Code after 'await' is a .then() callback
// So 'D' runs as a microtask after the call stack clears`,
        explanation: 'await suspends the async function and schedules the rest as a microtask, letting synchronous code continue.',
      },
      {
        title: 'Complex output question — can you get all 8?',
        language: 'javascript',
        code: `console.log('1');

setTimeout(() => {
  console.log('2');
  Promise.resolve().then(() => console.log('3'));
}, 0);

Promise.resolve()
  .then(() => {
    console.log('4');
    setTimeout(() => console.log('5'), 0);
  })
  .then(() => console.log('6'));

setTimeout(() => console.log('7'), 0);

console.log('8');

// Answer: 1, 8, 4, 6, 2, 3, 7, 5
//
// Step by step:
// Sync: log 1, schedule T1(log2+promise), schedule M1(log4+T3), schedule T2(log7), log 8
// Microtasks: M1 → log 4, schedule T3(log5) | then M2 → log 6
// Macrotask T1: log 2, schedule M3(log3)
//   Microtasks: M3 → log 3
// Macrotask T2: log 7
// Macrotask T3: log 5`,
        explanation: 'Trace through the event loop carefully: sync first, then microtasks, then macrotask, then microtasks again.',
      },
      {
        title: 'setTimeout blocking - why setTimeout(fn, 0) isnt instant',
        language: 'javascript',
        code: `const start = Date.now();

// This BLOCKS the call stack for ~500ms
while (Date.now() - start < 500) {} // busy loop

setTimeout(() => {
  // This fires ~500ms late because the event loop was blocked
  console.log('fired at:', Date.now() - start, 'ms');
  // Prints something like: fired at: 501 ms (NOT 0ms)
}, 0);

console.log('sync after while loop');

// Lesson: setTimeout(fn, 0) means "as soon as possible"
// not "right now" — it waits for the call stack to be empty
// AND for all microtasks to drain`,
        explanation: 'setTimeout(0) fires as soon as the call stack is empty, not immediately. Long synchronous tasks delay it.',
      },
      {
        title: 'Promise vs setTimeout microtask queue',
        language: 'javascript',
        code: `// queueMicrotask lets you manually schedule microtasks
console.log('start');

queueMicrotask(() => console.log('microtask 1'));
setTimeout(() => console.log('macrotask'), 0);
queueMicrotask(() => console.log('microtask 2'));

console.log('end');

// Output:
// start
// end
// microtask 1  ← microtasks drain first
// microtask 2  ← both microtasks before macrotask
// macrotask`,
        explanation: 'queueMicrotask schedules directly into the microtask queue, just like Promise.then.',
      },
      {
        title: 'Async iteration — for await with the event loop',
        language: 'javascript',
        code: `async function processItems() {
  const items = [1, 2, 3];

  console.log('start');

  for (const item of items) {
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log('processed:', item);
  }

  console.log('done');
}

processItems();
console.log('sync after processItems()');

// Output:
// start
// sync after processItems()  ← sync continues
// processed: 1 (after ~100ms)
// processed: 2 (after ~200ms)
// processed: 3 (after ~300ms)
// done`,
        explanation: 'for-await loops pause at each await, allowing the event loop to process other tasks in between.',
      },
      {
        title: 'The difference between microtasks and macrotasks matters for UI',
        language: 'javascript',
        code: `// Scheduling many microtasks CAN starve the render/macro tasks!
function floodMicrotasks() {
  function recurse() {
    queueMicrotask(recurse); // infinite microtasks!
  }
  queueMicrotask(recurse);
}
// Don't call this ^ — it will freeze the page

// This is why React batches state updates — so they don't
// trigger thousands of synchronous microtasks

// Safe pattern: use macrotasks to yield to the browser
async function yieldToMain() {
  return new Promise(resolve => setTimeout(resolve, 0));
}

async function longTask() {
  for (const chunk of bigArray) {
    process(chunk);
    await yieldToMain(); // yield back to browser each iteration
  }
}`,
        explanation: 'Flooding microtasks can block rendering. Yielding with setTimeout(0) allows the browser to paint between chunks.',
      },
    ],
    interviewQuestions: [
      {
        question: 'Explain the JavaScript event loop.',
        answer: `JavaScript is single-threaded, running one task at a time via the call stack. The event loop enables async behavior by coordinating three things:

**Call Stack:** Where synchronous code executes. Functions push/pop as they're called/returned.

**Web APIs / Node APIs:** Async operations (setTimeout, fetch, DOM events) are handed off to the browser/Node environment. When they complete, callbacks are queued.

**Task Queues:**
- **Microtask Queue** (high priority): Promise callbacks, queueMicrotask
- **Macrotask Queue** (lower priority): setTimeout, setInterval, I/O

**The loop:**
1. Execute all synchronous code
2. Drain ALL microtasks (process every queued microtask, including newly added ones)
3. Execute ONE macrotask
4. Repeat from step 2

This explains why \`Promise.then\` callbacks run before \`setTimeout\` callbacks even with \`setTimeout(0)\`.`,
        difficulty: 'hard',
      },
      {
        question: 'What is the difference between the microtask queue and the macrotask queue?',
        answer: `**Microtask Queue:**
- Higher priority
- Drained completely before any macrotask runs
- Sources: Promise.then/catch/finally, async/await, queueMicrotask, MutationObserver
- Can "starve" the event loop if microtasks keep adding more microtasks

**Macrotask Queue (Task Queue):**
- Lower priority
- Only ONE macrotask is processed per event loop iteration
- Sources: setTimeout, setInterval, setImmediate (Node), I/O callbacks, MessageChannel
- After each macrotask, all pending microtasks run

**Practical implication:** If you need something to run "after DOM updates" but before the next paint, use a microtask. If you need to yield to the browser and allow painting, use a macrotask (setTimeout(fn, 0)).`,
        difficulty: 'medium',
      },
      {
        question: 'What will this output? console.log(1); setTimeout(() => console.log(2), 0); Promise.resolve().then(() => console.log(3)); console.log(4);',
        answer: `Output: **1, 4, 3, 2**

Step-by-step:
1. \`console.log(1)\` — synchronous, executes immediately → prints 1
2. \`setTimeout(..., 0)\` — registers callback in macrotask queue, continues
3. \`Promise.resolve().then(...)\` — schedules microtask
4. \`console.log(4)\` — synchronous → prints 4
5. Call stack empty → event loop checks microtask queue → prints 3
6. Microtask queue empty → event loop takes one macrotask → prints 2

Key point: Promises (microtasks) always run before setTimeout (macrotasks), even with delay=0.`,
        difficulty: 'medium',
      },
      {
        question: 'Why doesn\'t setTimeout(fn, 0) run immediately?',
        answer: `\`setTimeout(fn, 0)\` means "schedule this callback to run after the current synchronous code and all microtasks finish."

It doesn't run immediately because:
1. The callback is placed in the **macrotask queue**, not executed directly
2. The current synchronous code must complete first
3. ALL pending microtasks must drain first
4. Only then does the event loop pick up the setTimeout callback

Additionally, browsers enforce a minimum delay of ~4ms for nested setTimeouts or when the page is in the background. So \`setTimeout(fn, 0)\` can actually fire after 4ms+.

\`setTimeout(fn, 0)\` is commonly used to "defer" work — pushing it to after current rendering/processing is complete.`,
        difficulty: 'medium',
      },
      {
        question: 'How does async/await relate to the event loop?',
        answer: `\`async/await\` is syntactic sugar over Promises. Under the hood:

\`\`\`js
async function foo() {
  const x = await bar();
  console.log(x);
}
\`\`\`

Is equivalent to:
\`\`\`js
function foo() {
  return bar().then(x => {
    console.log(x);
  });
}
\`\`\`

When JavaScript hits \`await\`, it:
1. Evaluates the awaited expression
2. Suspends the async function (removes it from call stack)
3. Schedules the rest of the function as a microtask for when the Promise resolves
4. Returns control to the caller

This is why code after an \`await\` in an async function runs as a microtask — it obeys the same microtask queue rules as Promise.then.`,
        difficulty: 'hard',
      },
    ],
    gotchas: [
      {
        title: 'Microtasks can starve the main thread',
        description: 'If microtasks keep scheduling more microtasks, macrotasks (including rendering) never get a chance to run.',
        example: `// DANGEROUS: infinite microtask loop
function recurse() {
  Promise.resolve().then(recurse);
}
recurse(); // freezes the page — macrotasks and rendering starve`,
      },
      {
        title: 'setTimeout minimum delay is ~4ms, not 0',
        description: 'Browsers enforce a minimum 4ms delay for nested timeouts or background tabs. setTimeout(fn, 0) is not truly instant.',
      },
    ],
  },
  {
    id: 'promises',
    moduleId: 'javascript',
    title: 'Promises & Async/Await',
    description: 'Mastering async patterns, error handling, and Promise combinators',
    estimatedTime: '50 min',
    sections: [
      {
        title: 'Promise States',
        content: `A Promise is an object representing the eventual completion or failure of an asynchronous operation. It has three states:

- **Pending:** Initial state, neither fulfilled nor rejected
- **Fulfilled:** The operation completed successfully (resolved with a value)
- **Rejected:** The operation failed (rejected with a reason/error)

Once a Promise settles (fulfilled or rejected), it **never changes state** — it's immutable. You can attach \`.then()\` handlers at any time, even after the Promise has already settled, and they'll fire in the next microtask.`,
      },
      {
        title: 'Promise Combinators',
        content: `| Method | Resolves when | Rejects when |
|--------|--------------|-------------|
| \`Promise.all(arr)\` | ALL resolve | ANY rejects (fast-fail) |
| \`Promise.allSettled(arr)\` | ALL settle (resolve or reject) | Never rejects |
| \`Promise.race(arr)\` | FIRST settles | FIRST settles with rejection |
| \`Promise.any(arr)\` | FIRST resolves | ALL reject (AggregateError) |

Use **\`Promise.all\`** for parallel operations where all must succeed.
Use **\`Promise.allSettled\`** when you want results of all, even failures.
Use **\`Promise.race\`** for timeouts or "first wins" scenarios.
Use **\`Promise.any\`** when you want the first success (fallback URLs, etc.).`,
      },
      {
        title: 'Error Handling: .catch vs try/catch',
        content: `**With .then/.catch:**
\`\`\`js
fetchData()
  .then(data => process(data))
  .catch(err => console.error(err));
\`\`\`

**With async/await:**
\`\`\`js
try {
  const data = await fetchData();
  process(data);
} catch (err) {
  console.error(err);
}
\`\`\`

**Common mistake:** Not catching errors. Unhandled rejections can crash Node processes and show errors in browsers. Always handle errors.

**Important:** \`async/await\` without try/catch means errors become unhandled promise rejections.`,
      },
      {
        title: 'Sequential vs Parallel Execution',
        content: `**Sequential** (one at a time): Each await waits before starting the next.
\`\`\`js
const a = await fetchA(); // waits for A
const b = await fetchB(); // waits for B — total: A+B time
\`\`\`

**Parallel** (concurrent): Start all operations at once.
\`\`\`js
const [a, b] = await Promise.all([fetchA(), fetchB()]); // total: max(A,B) time
\`\`\`

Use parallel when operations are independent. Use sequential when each operation depends on the previous.`,
      },
    ],
    codeExamples: [
      {
        title: 'Creating and consuming promises',
        language: 'javascript',
        code: `// Creating a promise
function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) {
        resolve({ id, name: 'Alice' });
      } else {
        reject(new Error('Invalid user ID'));
      }
    }, 1000);
  });
}

// Consuming with .then/.catch
fetchUser(1)
  .then(user => console.log('Got user:', user))
  .catch(err => console.error('Error:', err.message))
  .finally(() => console.log('Done'));

// Consuming with async/await
async function main() {
  try {
    const user = await fetchUser(1);
    console.log('Got user:', user);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    console.log('Done');
  }
}`,
        explanation: 'Promises can be consumed with .then chains or async/await. Both support .finally for cleanup.',
      },
      {
        title: 'Promise.all — parallel with all-or-nothing',
        language: 'javascript',
        code: `async function loadDashboard(userId) {
  try {
    // Start all fetches in parallel — total time = slowest request
    const [user, posts, notifications] = await Promise.all([
      fetchUser(userId),
      fetchUserPosts(userId),
      fetchNotifications(userId),
    ]);

    return { user, posts, notifications };
  } catch (err) {
    // If ANY of the three fail, we land here
    console.error('Dashboard load failed:', err);
    throw err;
  }
}

// Compare to sequential (bad for independent requests):
async function loadDashboardSlow(userId) {
  const user = await fetchUser(userId);          // wait 300ms
  const posts = await fetchUserPosts(userId);     // wait 200ms
  const notifications = await fetchNotifications(userId); // wait 100ms
  // Total: 600ms vs 300ms with Promise.all!
}`,
        explanation: 'Promise.all runs operations in parallel. Sequential awaits are slower when operations are independent.',
      },
      {
        title: 'Promise.allSettled — get all results, even failures',
        language: 'javascript',
        code: `const urls = [
  'https://api.example.com/users',
  'https://api.broken.com/data',   // This will fail
  'https://api.example.com/posts',
];

const results = await Promise.allSettled(
  urls.map(url => fetch(url).then(r => r.json()))
);

results.forEach((result, index) => {
  if (result.status === 'fulfilled') {
    console.log(\`URL \${index}: success\`, result.value);
  } else {
    console.log(\`URL \${index}: failed\`, result.reason.message);
  }
});

// Output:
// URL 0: success { ... }
// URL 1: failed  "Network error"
// URL 2: success { ... }

// Unlike Promise.all, we get ALL results even if some fail`,
        explanation: 'allSettled never rejects — it gives you an array of {status, value/reason} for each promise.',
      },
      {
        title: 'Promise.race — timeout pattern',
        language: 'javascript',
        code: `function timeout(ms) {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error(\`Timeout after \${ms}ms\`)), ms)
  );
}

async function fetchWithTimeout(url, ms = 5000) {
  return Promise.race([
    fetch(url),
    timeout(ms)
  ]);
}

// Usage
try {
  const response = await fetchWithTimeout('/api/data', 3000);
  const data = await response.json();
  console.log(data);
} catch (err) {
  if (err.message.startsWith('Timeout')) {
    console.log('Request timed out');
  } else {
    console.log('Request failed:', err);
  }
}`,
        explanation: 'Promise.race resolves/rejects with the first promise to settle. Perfect for implementing timeouts.',
      },
      {
        title: 'Promise.any — first success wins',
        language: 'javascript',
        code: `// Try multiple CDN mirrors, use the fastest one
const cdnUrls = [
  'https://cdn1.example.com/script.js',
  'https://cdn2.example.com/script.js',
  'https://cdn3.example.com/script.js',
];

try {
  const response = await Promise.any(cdnUrls.map(url => fetch(url)));
  console.log('Loaded from:', response.url);
} catch (err) {
  // AggregateError: all CDNs failed
  console.error('All CDNs failed:', err.errors);
}

// Promise.any vs Promise.race:
// race: first to settle (including rejection)
// any: first to RESOLVE (ignores rejections until all reject)`,
        explanation: 'Promise.any resolves with the first successful promise, ignoring rejections. Rejects only if ALL reject.',
      },
      {
        title: 'Error handling edge cases',
        language: 'javascript',
        code: `// MISTAKE 1: forgetting to catch
async function badCode() {
  const data = await fetch('/api'); // If this throws, unhandled rejection!
  return data.json();
}

// MISTAKE 2: catch in wrong place
async function alsoWrong() {
  const promise = fetch('/api'); // fire request
  try {
    return await promise;
  } catch(e) {} // swallows error silently — bad!
}

// CORRECT: always handle errors
async function goodCode() {
  try {
    const response = await fetch('/api');
    if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
    return response.json();
  } catch (err) {
    console.error('Failed:', err);
    throw err; // re-throw if caller needs to know
  }
}

// MISTAKE 3: async in forEach (not awaited!)
async function processAll(items) {
  items.forEach(async (item) => {  // BAD: forEach doesn't await!
    await processItem(item);
  });
  console.log('done?'); // fires before items are processed!
}

// FIX: use for...of or Promise.all
async function processAllFixed(items) {
  for (const item of items) {
    await processItem(item);
  }
  console.log('done'); // actually done now
}`,
        explanation: 'Async/await has several non-obvious error handling and concurrency pitfalls.',
      },
    ],
    interviewQuestions: [
      {
        question: 'What are the differences between Promise.all, Promise.allSettled, Promise.race, and Promise.any?',
        answer: `**Promise.all(promises):**
- Resolves when ALL promises resolve → returns array of values
- Rejects immediately when ANY promise rejects (fast-fail) → other promises still run but results are discarded
- Use when: all operations must succeed (load user + posts + settings)

**Promise.allSettled(promises):**
- Always resolves (never rejects) when ALL promises have settled
- Returns array of \`{status: 'fulfilled', value}\` or \`{status: 'rejected', reason}\`
- Use when: you want all results regardless of failures (loading multiple independent resources)

**Promise.race(promises):**
- Resolves/rejects with the FIRST promise to settle (good or bad)
- Use when: you need a timeout, or "whichever is fastest" and don't care about failures

**Promise.any(promises):**
- Resolves with the FIRST promise to resolve (ignores rejections)
- Rejects with AggregateError only if ALL promises reject
- Use when: you want the first success (multiple fallback URLs, A/B testing)`,
        difficulty: 'medium',
      },
      {
        question: 'What is the difference between sequential and parallel promise execution, and when would you use each?',
        answer: `**Sequential execution:**
\`\`\`js
const a = await stepA(); // wait for A
const b = await stepB(a); // wait for B using A's result
\`\`\`
Use when: B depends on A's result, or order matters, or you're rate-limiting API calls.

**Parallel execution:**
\`\`\`js
const [a, b] = await Promise.all([stepA(), stepB()]);
\`\`\`
Use when: operations are independent and can run simultaneously. Much faster.

**Common mistake — accidentally sequential:**
\`\`\`js
// SLOW: These still run sequentially because we await each individually
const pA = await fetchA(); // starts, waits
const pB = await fetchB(); // starts, waits
\`\`\`

**Correct parallel:**
\`\`\`js
// FAST: Both start immediately, await resolves when both done
const pA = fetchA(); // starts (no await)
const pB = fetchB(); // starts (no await)
const [a, b] = await Promise.all([pA, pB]); // wait for both
\`\`\``,
        difficulty: 'medium',
      },
      {
        question: 'How do you handle errors in async/await?',
        answer: `Multiple approaches:

**1. try/catch (most common):**
\`\`\`js
try {
  const data = await fetchData();
  return process(data);
} catch (err) {
  if (err instanceof NetworkError) handleNetworkError(err);
  else throw err; // re-throw unexpected errors
}
\`\`\`

**2. .catch on the awaited promise:**
\`\`\`js
const data = await fetchData().catch(err => null); // null on failure
if (!data) return handleError();
\`\`\`

**3. Wrapper utility:**
\`\`\`js
async function safeAwait(promise) {
  try {
    return [null, await promise];
  } catch (err) {
    return [err, null];
  }
}
const [err, data] = await safeAwait(fetchData());
\`\`\`

**Always** handle errors — unhandled promise rejections crash Node processes and log errors in browsers. Never silently swallow errors with empty catch blocks.`,
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'es6-features',
    moduleId: 'javascript',
    title: 'ES6+ Features Deep Dive',
    description: 'Modern JavaScript features you must know cold for interviews',
    estimatedTime: '45 min',
    sections: [
      {
        title: 'Destructuring',
        content: `Destructuring lets you extract values from arrays or properties from objects into distinct variables.

**Array destructuring:** position-based extraction
**Object destructuring:** property name-based extraction

Features:
- **Default values** — \`const { x = 0 } = obj\`
- **Renaming** — \`const { oldName: newName } = obj\`
- **Nested** — \`const { a: { b } } = obj\`
- **Rest** — \`const { a, ...rest } = obj\`
- **Skip elements** — \`const [, second] = arr\`
- **Swap variables** — \`[a, b] = [b, a]\``,
      },
      {
        title: 'Spread and Rest Operators',
        content: `Both use \`...\` syntax but in opposite contexts:

**Spread:** Takes an iterable/object and "spreads" it out
- In function calls: \`fn(...arr)\`
- In array literals: \`[...arr1, ...arr2]\`
- In object literals: \`{...obj1, ...obj2}\`

**Rest:** Collects remaining elements into an array/object
- In function parameters: \`function fn(first, ...rest)\`
- In destructuring: \`const [first, ...others] = arr\`

Spread creates shallow copies — nested objects are still shared references.`,
      },
      {
        title: 'Optional Chaining and Nullish Coalescing',
        content: `**Optional chaining (?.):** Safely access nested properties without checking each level
- \`obj?.prop\` — returns \`undefined\` instead of throwing if obj is null/undefined
- \`obj?.method()\` — safely calls method
- \`arr?.[0]\` — safely access array index

**Nullish coalescing (??):** Provide a default only for null/undefined (not other falsy values)
- \`value ?? default\` — uses default only if value is \`null\` or \`undefined\`
- Unlike \`||\`, it doesn't trigger for \`0\`, \`""\`, or \`false\``,
      },
      {
        title: 'Map, Set, WeakMap, WeakSet',
        content: `**Map:** Key-value pairs where keys can be ANY type (vs Object which only allows strings/symbols as keys). Maintains insertion order. Has a \`.size\` property.

**Set:** Collection of unique values. Auto-deduplicates. Useful for removing duplicates from arrays.

**WeakMap:** Like Map but keys must be objects, and they're held weakly (won't prevent garbage collection). Cannot be iterated. Used for private data associated with objects without causing memory leaks.

**WeakSet:** Like Set but values must be objects, held weakly. Used for tracking object membership without preventing GC.`,
      },
    ],
    codeExamples: [
      {
        title: 'Destructuring — all the patterns',
        language: 'javascript',
        code: `// Array destructuring
const [first, second, ...rest] = [1, 2, 3, 4, 5];
console.log(first, second, rest); // 1 2 [3, 4, 5]

// Skip elements
const [, , third] = [1, 2, 3];
console.log(third); // 3

// Swap without temp variable
let a = 1, b = 2;
[a, b] = [b, a];
console.log(a, b); // 2 1

// Object destructuring with rename and default
const { name: firstName = 'Anonymous', age = 0 } = { name: 'Alice' };
console.log(firstName, age); // Alice 0

// Nested object destructuring
const { address: { city, country = 'Unknown' } } = {
  address: { city: 'London' }
};
console.log(city, country); // London Unknown

// Function parameter destructuring
function greet({ name, greeting = 'Hello' }) {
  console.log(\`\${greeting}, \${name}!\`);
}
greet({ name: 'Bob' }); // Hello, Bob!
greet({ name: 'Eve', greeting: 'Hi' }); // Hi, Eve!`,
        explanation: 'Destructuring patterns can be combined and nested. Default values prevent undefined issues.',
      },
      {
        title: 'Optional chaining and nullish coalescing',
        language: 'javascript',
        code: `const user = {
  profile: {
    name: 'Alice',
    address: null,
  },
  getFullName: () => 'Alice Smith',
};

// Optional chaining
console.log(user?.profile?.name);          // 'Alice'
console.log(user?.profile?.address?.city); // undefined (no error!)
console.log(user?.settings?.theme);        // undefined

// Optional method call
console.log(user?.getFullName?.());        // 'Alice Smith'
console.log(user?.notAMethod?.());         // undefined (no error)

// Nullish coalescing vs OR
const score = 0;
console.log(score || 'No score');          // 'No score' (WRONG! 0 is falsy)
console.log(score ?? 'No score');          // 0 (CORRECT! 0 is not null/undefined)

const settings = null;
console.log(settings?.theme ?? 'dark');    // 'dark' (null → use default)

// Combining both
const username = user?.profile?.displayName ?? user?.profile?.name ?? 'Guest';
console.log(username); // 'Alice'`,
        explanation: '?. prevents null/undefined errors in deep property access. ?? provides defaults only for null/undefined.',
      },
      {
        title: 'Map and Set practical uses',
        language: 'javascript',
        code: `// Set — deduplicate array
const nums = [1, 2, 2, 3, 3, 3, 4];
const unique = [...new Set(nums)];
console.log(unique); // [1, 2, 3, 4]

// Set — tracking membership (O(1) lookup vs O(n) array.includes)
const visited = new Set();
function visit(url) {
  if (visited.has(url)) return;
  visited.add(url);
  // process url
}

// Map — object keys can be anything
const elementData = new Map();
const btn = document.querySelector('button');
elementData.set(btn, { clicks: 0, created: Date.now() });
elementData.get(btn).clicks++;

// Map — grouping (Object.groupBy alternative)
const people = [
  { name: 'Alice', dept: 'Engineering' },
  { name: 'Bob', dept: 'Design' },
  { name: 'Carol', dept: 'Engineering' },
];

const byDept = new Map();
for (const person of people) {
  if (!byDept.has(person.dept)) byDept.set(person.dept, []);
  byDept.get(person.dept).push(person);
}
console.log(byDept.get('Engineering')); // [Alice, Carol]

// Map iteration (maintains insertion order)
for (const [dept, members] of byDept) {
  console.log(dept, members.length);
}`,
        explanation: 'Set deduplicates and provides O(1) membership checks. Map allows object/function keys and maintains order.',
      },
      {
        title: 'Generators — basic understanding',
        language: 'javascript',
        code: `// Generator function: uses function* and yield
function* counter(start = 0) {
  while (true) {
    yield start++;
  }
}

const gen = counter(1);
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2
console.log(gen.next().value); // 3
// Generator pauses at each yield, resumes on .next()

// Practical: infinite sequences
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

const fib = fibonacci();
const first10 = Array.from({ length: 10 }, () => fib.next().value);
console.log(first10); // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

// Generators are iterables — can use for...of
function* range(start, end, step = 1) {
  for (let i = start; i < end; i += step) {
    yield i;
  }
}

console.log([...range(0, 10, 2)]); // [0, 2, 4, 6, 8]`,
        explanation: 'Generators produce values lazily, pausing execution at each yield. Great for infinite sequences and iterators.',
      },
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between ?? (nullish coalescing) and || (logical OR) for default values?',
        answer: `Both provide fallback values, but they differ in what they consider "missing":

**\`||\` (OR):** Returns right side if left side is ANY falsy value (\`false\`, \`0\`, \`""\`, \`null\`, \`undefined\`, \`NaN\`)

**\`??\` (nullish coalescing):** Returns right side ONLY if left side is \`null\` or \`undefined\`

\`\`\`js
const count = 0;
count || 10;  // 10 — WRONG! 0 is a valid count
count ?? 10;  // 0  — CORRECT! 0 is not null/undefined

const name = '';
name || 'Anonymous';  // 'Anonymous' — might not be desired
name ?? 'Anonymous';  // '' — empty string is valid

const flag = false;
flag || true;  // true — loses original false
flag ?? true;  // false — false is not null/undefined
\`\`\`

Use \`??\` when 0, '', or false are valid values. Use \`||\` when you want to treat all falsy as "missing".`,
        difficulty: 'easy',
      },
      {
        question: 'When would you use a WeakMap instead of a regular Map?',
        answer: `Use **WeakMap** when:
1. You need to associate data with objects without preventing garbage collection
2. The data should be cleaned up automatically when the object is collected

**Example — private class data:**
\`\`\`js
const _private = new WeakMap();
class Person {
  constructor(name, secret) {
    _private.set(this, { secret });
    this.name = name;
  }
  getSecret() { return _private.get(this).secret; }
}
// When person is GC'd, the WeakMap entry is automatically removed
\`\`\`

**Example — caching DOM element data:**
\`\`\`js
const cache = new WeakMap();
function getComputedSize(element) {
  if (cache.has(element)) return cache.get(element);
  const size = element.getBoundingClientRect();
  cache.set(element, size);
  return size;
}
// When element is removed from DOM and GC'd, cache entry disappears
\`\`\`

You CANNOT iterate a WeakMap or check its size — this is intentional. It's purely for associating data with an object's lifetime.`,
        difficulty: 'hard',
      },
    ],
  },
  {
    id: 'array-object-methods',
    moduleId: 'javascript',
    title: 'Array & Object Methods',
    description: 'Every important array and object method with real data transformation examples',
    estimatedTime: '40 min',
    sections: [
      {
        title: 'The Big Array Methods',
        content: `**Transformation:** map, flatMap, flat
**Filtering:** filter
**Reduction:** reduce
**Search:** find, findIndex, indexOf, includes
**Testing:** some, every
**Sorting:** sort (mutates!), toSorted (non-mutating)
**Other mutating:** push, pop, shift, unshift, splice, reverse
**Non-mutating:** slice, concat, join, at

Most important for interviews: **map, filter, reduce** — know them deeply, including chaining them.`,
      },
      {
        title: 'Object Methods',
        content: `**Keys/Values/Entries:**
- \`Object.keys(obj)\` → array of own enumerable property names
- \`Object.values(obj)\` → array of values
- \`Object.entries(obj)\` → array of [key, value] pairs
- \`Object.fromEntries(entries)\` → object from entries (inverse of entries)

**Merging/Copying:**
- \`Object.assign(target, ...sources)\` — shallow merge, mutates target
- Spread \`{...obj1, ...obj2}\` — shallow merge, new object

**Other:**
- \`Object.freeze(obj)\` — prevents mutations (shallow)
- \`Object.create(proto)\` — creates object with specified prototype
- \`structuredClone(obj)\` — deep clone (modern browsers)`,
      },
    ],
    codeExamples: [
      {
        title: 'map, filter, reduce — chained',
        language: 'javascript',
        code: `const orders = [
  { id: 1, product: 'Laptop', price: 999, quantity: 1, status: 'completed' },
  { id: 2, product: 'Mouse', price: 29, quantity: 3, status: 'pending' },
  { id: 3, product: 'Keyboard', price: 79, quantity: 2, status: 'completed' },
  { id: 4, product: 'Monitor', price: 349, quantity: 1, status: 'cancelled' },
];

// Total revenue from completed orders
const revenue = orders
  .filter(o => o.status === 'completed')
  .map(o => o.price * o.quantity)
  .reduce((sum, amount) => sum + amount, 0);

console.log(revenue); // 999*1 + 79*2 = 1157

// Group by status using reduce
const grouped = orders.reduce((acc, order) => {
  if (!acc[order.status]) acc[order.status] = [];
  acc[order.status].push(order);
  return acc;
}, {});
console.log(Object.keys(grouped)); // ['completed', 'pending', 'cancelled']

// Build a lookup map
const orderById = orders.reduce((map, order) => {
  map[order.id] = order;
  return map;
}, {});
console.log(orderById[2].product); // 'Mouse'`,
        explanation: 'Real-world data transformation: filter, transform, aggregate. reduce is the Swiss Army knife.',
      },
      {
        title: 'flatMap and flat',
        language: 'javascript',
        code: `// flat — flatten nested arrays
const nested = [1, [2, 3], [4, [5, 6]]];
console.log(nested.flat());    // [1, 2, 3, 4, [5, 6]] — depth 1
console.log(nested.flat(2));   // [1, 2, 3, 4, 5, 6]   — depth 2
console.log(nested.flat(Infinity)); // fully flatten

// flatMap — map + flat(1) in one pass (more performant)
const sentences = ['Hello World', 'Foo Bar Baz'];
const words = sentences.flatMap(s => s.split(' '));
console.log(words); // ['Hello', 'World', 'Foo', 'Bar', 'Baz']

// flatMap to filter and transform at once
const users = [
  { name: 'Alice', tags: ['admin', 'user'] },
  { name: 'Bob', tags: [] },
  { name: 'Carol', tags: ['user'] },
];

const allTags = users.flatMap(u => u.tags);
console.log(allTags); // ['admin', 'user', 'user']

// Use flatMap to conditionally include elements
const items = [1, -2, 3, -4, 5];
const positiveDoubled = items.flatMap(n => n > 0 ? [n * 2] : []);
console.log(positiveDoubled); // [2, 6, 10]`,
        explanation: 'flatMap is map + flatten(1) in one efficient pass. Great for one-to-many transformations.',
      },
      {
        title: 'Object.entries, Object.fromEntries — transform objects',
        language: 'javascript',
        code: `const prices = { apple: 1.5, banana: 0.8, cherry: 3.0 };

// Apply 10% discount to all prices
const discounted = Object.fromEntries(
  Object.entries(prices).map(([key, value]) => [key, value * 0.9])
);
console.log(discounted); // { apple: 1.35, banana: 0.72, cherry: 2.7 }

// Filter object properties
const expensive = Object.fromEntries(
  Object.entries(prices).filter(([, price]) => price > 1)
);
console.log(expensive); // { apple: 1.5, cherry: 3.0 }

// Invert an object (swap keys and values)
const codeToName = { US: 'United States', GB: 'Great Britain' };
const nameToCode = Object.fromEntries(
  Object.entries(codeToName).map(([k, v]) => [v, k])
);
console.log(nameToCode); // { 'United States': 'US', 'Great Britain': 'GB' }

// Convert Map to plain object
const map = new Map([['a', 1], ['b', 2]]);
const obj = Object.fromEntries(map);
console.log(obj); // { a: 1, b: 2 }`,
        explanation: 'entries + fromEntries is the idiom for transforming objects. Think of it as map/filter for objects.',
      },
      {
        title: 'Deep clone and immutable patterns',
        language: 'javascript',
        code: `// Shallow copy — nested objects are still shared!
const original = { a: 1, nested: { b: 2 } };
const shallow = { ...original };

shallow.nested.b = 99; // mutates original too!
console.log(original.nested.b); // 99 (!) — shared reference

// structuredClone — true deep clone (modern)
const deep = structuredClone(original);
deep.nested.b = 100;
console.log(original.nested.b); // 99 (unchanged) ✓

// structuredClone handles: arrays, dates, maps, sets, nested objects
// Does NOT handle: functions, class instances, DOM nodes, undefined values

// Immutable update patterns (used in React/Redux state):
const state = {
  user: { name: 'Alice', age: 30 },
  settings: { theme: 'dark', lang: 'en' },
};

// Update nested property immutably
const newState = {
  ...state,
  user: {
    ...state.user,
    age: 31, // only update age
  },
};

console.log(state.user.age);    // 30 (unchanged)
console.log(newState.user.age); // 31`,
        explanation: 'Spread is shallow copy. Use structuredClone for deep copies. Nested immutable updates use spread at each level.',
      },
      {
        title: 'Practice: Transform this data',
        language: 'javascript',
        code: `// Input: array of employee objects
const employees = [
  { id: 1, name: 'Alice', dept: 'Eng', salary: 90000, yearsExp: 5 },
  { id: 2, name: 'Bob', dept: 'Design', salary: 75000, yearsExp: 3 },
  { id: 3, name: 'Carol', dept: 'Eng', salary: 110000, yearsExp: 8 },
  { id: 4, name: 'Dave', dept: 'Design', salary: 80000, yearsExp: 4 },
  { id: 5, name: 'Eve', dept: 'Eng', salary: 95000, yearsExp: 6 },
];

// 1. Average salary per department
const avgByDept = Object.fromEntries(
  Object.entries(
    employees.reduce((acc, emp) => {
      if (!acc[emp.dept]) acc[emp.dept] = { total: 0, count: 0 };
      acc[emp.dept].total += emp.salary;
      acc[emp.dept].count++;
      return acc;
    }, {})
  ).map(([dept, { total, count }]) => [dept, total / count])
);
// { Eng: 98333.33, Design: 77500 }

// 2. Top earner per department
const topEarners = employees.reduce((acc, emp) => {
  if (!acc[emp.dept] || emp.salary > acc[emp.dept].salary) {
    acc[emp.dept] = emp;
  }
  return acc;
}, {});
// { Eng: Carol, Design: Dave }

// 3. All names sorted by salary descending
const ranked = [...employees]
  .sort((a, b) => b.salary - a.salary)
  .map(e => e.name);
// ['Carol', 'Eve', 'Alice', 'Dave', 'Bob']`,
        explanation: 'Real-world data transformation interview challenges with solutions.',
      },
    ],
    interviewQuestions: [
      {
        question: 'Explain how reduce works. Implement a groupBy function using reduce.',
        answer: `\`reduce(callback, initialValue)\` processes an array left-to-right, maintaining an accumulator. The callback receives \`(accumulator, currentValue, index, array)\` and returns the new accumulator value.

**groupBy implementation:**
\`\`\`js
function groupBy(array, keyFn) {
  return array.reduce((groups, item) => {
    const key = typeof keyFn === 'function' ? keyFn(item) : item[keyFn];
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
    return groups;
  }, {});
}

const people = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Carol', age: 25 },
];

groupBy(people, 'age');
// { 25: [Alice, Carol], 30: [Bob] }

groupBy(people, p => p.age >= 30 ? 'senior' : 'junior');
// { junior: [Alice, Carol], senior: [Bob] }
\`\`\``,
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'type-coercion',
    moduleId: 'javascript',
    title: 'Type Coercion & Equality',
    description: 'The quirky parts of JavaScript equality and type conversion',
    estimatedTime: '30 min',
    sections: [
      {
        title: 'Abstract vs Strict Equality',
        content: `**Strict equality (\`===\`):** Checks both value AND type. No coercion. Always use this.

**Abstract equality (\`==\`):** Checks value after type coercion. Follows complex rules:

1. If same type, same as \`===\`
2. \`null == undefined\` is \`true\` (and nothing else equals null/undefined with ==)
3. Number vs String → convert string to number
4. Boolean vs anything → convert boolean to number first
5. Object vs primitive → call valueOf/toString on the object

**Rule:** Always use \`===\` unless you specifically want \`null == undefined\` to be true.`,
      },
      {
        title: 'Truthy and Falsy Values',
        content: `**Falsy values** (only 8 in JavaScript):
- \`false\`
- \`0\` (and \`-0\` and \`0n\`)
- \`""\` (empty string)
- \`null\`
- \`undefined\`
- \`NaN\`

**Everything else is truthy**, including:
- \`"0"\` (string "0")
- \`[]\` (empty array)
- \`{}\` (empty object)
- \`"false"\` (string "false")
- \`Infinity\``,
      },
    ],
    codeExamples: [
      {
        title: 'The notorious == coercion examples',
        language: 'javascript',
        code: `// True or false? (All use ==)
console.log([] == false);   // true  — [] → "" → 0, false → 0
console.log([] == ![]);     // true  — ![] is false, then [] == false
console.log({} == false);   // false — {} → "[object Object]", not 0
console.log("" == 0);       // true  — "" → 0
console.log(null == 0);     // false — null only equals undefined
console.log(null == undefined); // true — special case
console.log(null == false); // false — null only equals undefined
console.log(NaN == NaN);    // false — NaN is not equal to itself!

// With ===
console.log([] === false);  // false
console.log("" === 0);      // false
console.log(null === undefined); // false

// Checking for null AND undefined with ==
function process(value) {
  if (value == null) { // catches both null and undefined
    return 'no value';
  }
  return value;
}`,
        explanation: '== has confusing coercion rules. === is predictable. The only safe use of == is null == undefined.',
      },
      {
        title: 'Truthy/falsy gotchas',
        language: 'javascript',
        code: `// These are ALL truthy!
if ([]) console.log('empty array is truthy');     // ✓
if ({}) console.log('empty object is truthy');    // ✓
if ('0') console.log('string "0" is truthy');     // ✓
if ('false') console.log('string false is truthy'); // ✓

// Common React bug: rendering 0
function Counter({ count }) {
  return (
    <div>
      {count && <span>{count}</span>}  // BUG: renders "0" literally when count=0!
      {count > 0 && <span>{count}</span>}  // FIX: explicit comparison
      {count ? <span>{count}</span> : null}  // FIX: ternary
    </div>
  );
}

// Safe boolean coercion
const hasItems = Boolean([]); // true
const hasItems2 = !![]; // true

const isZero = !0; // true
const isNotZero = !!0; // false`,
        explanation: '[] and {} are truthy! The count && ... JSX pattern causes bugs when count is 0.',
      },
    ],
    interviewQuestions: [
      {
        question: 'What is the output of [] == false and why?',
        answer: `The result is \`true\`.

Here's the coercion chain:
1. \`false\` is boolean → convert to number → \`0\`
2. Now comparing \`[] == 0\`
3. \`[]\` is object → convert to primitive → call \`valueOf()\` → \`[]\` (not primitive) → call \`toString()\` → \`""\`
4. Now comparing \`"" == 0\`
5. \`""\` is string → convert to number → \`0\`
6. Now comparing \`0 == 0\` → \`true\`

This is exactly why you should use \`===\` — with strict equality \`[] === false\` is \`false\` as expected.`,
        difficulty: 'hard',
      },
    ],
  },
  {
    id: 'scope',
    moduleId: 'javascript',
    title: 'Scope & Variable Declarations',
    description: 'Block scope, function scope, module scope, and the IIFE pattern',
    estimatedTime: '35 min',
    sections: [
      {
        title: 'Types of Scope',
        content: `**Global scope:** Variables declared outside any function or block. Accessible everywhere. Avoid polluting global scope.

**Function scope:** Variables declared with \`var\` inside a function are local to that function.

**Block scope:** Variables declared with \`let\`/\`const\` inside \`{}\` are local to that block.

**Module scope:** Variables in ES modules are scoped to the module, not global. This is why modules are preferred over scripts.

**Lexical scope:** JavaScript uses lexical (static) scoping — scope is determined by where code is written, not where it's called.`,
      },
      {
        title: 'var vs let vs const — Complete Comparison',
        content: `| Feature | var | let | const |
|---------|-----|-----|-------|
| Scope | Function/Global | Block | Block |
| Hoisting | Yes, initialized to \`undefined\` | Yes, TDZ | Yes, TDZ |
| Re-declaration | Yes | No | No |
| Re-assignment | Yes | Yes | No |
| Creates global property | Yes (in global scope) | No | No |

**Best practice:** Default to \`const\`. Use \`let\` when you need to reassign. Never use \`var\`.`,
      },
      {
        title: 'IIFE Pattern',
        content: `An **IIFE** (Immediately Invoked Function Expression) is a function that runs immediately after being defined.

\`\`\`js
(function() {
  // code here runs immediately
  var private = 'not leaked to global scope';
})();
\`\`\`

**Why it existed:** Before ES modules and \`let\`/\`const\`, IIFEs were used to create a private scope and avoid polluting the global namespace. Libraries like jQuery used this pattern.

**Today:** ES modules provide module scope. \`let\`/\`const\` provide block scope. IIFEs are rarely needed in modern code but still appear in legacy codebases and sometimes for async initialization.`,
      },
    ],
    codeExamples: [
      {
        title: 'var vs let scope difference',
        language: 'javascript',
        code: `// var: function-scoped
function varExample() {
  if (true) {
    var x = 10; // scoped to varExample
  }
  console.log(x); // 10 — var leaks out of if block
}

// let: block-scoped
function letExample() {
  if (true) {
    let y = 10; // scoped to if block
  }
  console.log(y); // ReferenceError: y is not defined
}

// Variable shadowing
let value = 'outer';
{
  let value = 'inner'; // new binding, shadows outer
  console.log(value); // 'inner'
}
console.log(value); // 'outer' — outer is unchanged

// Module-level var creates global property (bad!)
var globalLeak = 'leaked'; // in a script tag
console.log(window.globalLeak); // 'leaked' — on window!

let notLeaked = 'safe';
console.log(window.notLeaked); // undefined`,
        explanation: 'var escapes blocks but not functions. let/const are block-scoped. Module scope prevents global leaks.',
      },
      {
        title: 'IIFE patterns',
        language: 'javascript',
        code: `// Classic IIFE
(function() {
  var privateVar = 'hidden';
  console.log(privateVar); // 'hidden'
})();

// Arrow IIFE
(() => {
  const setup = 'done';
})();

// Async IIFE (useful for top-level await in older environments)
(async () => {
  const data = await fetchSomething();
  console.log(data);
})();

// IIFE returning a value
const counter = (function() {
  let count = 0;
  return {
    increment: () => ++count,
    getCount: () => count,
  };
})();
counter.increment();
counter.increment();
console.log(counter.getCount()); // 2`,
        explanation: 'IIFEs create private scope. The async IIFE pattern is still useful for top-level await in CommonJS.',
      },
    ],
    interviewQuestions: [
      {
        question: 'What is variable shadowing and can it cause bugs?',
        answer: `Variable shadowing occurs when a variable in an inner scope has the same name as one in an outer scope. The inner declaration "shadows" (hides) the outer one within its scope.

\`\`\`js
const message = 'outer';
function inner() {
  const message = 'inner'; // shadows outer
  console.log(message); // 'inner'
}
console.log(message); // 'outer' — unchanged
\`\`\`

**Yes, it can cause bugs:**
1. Accidentally reusing a common name like \`i\`, \`value\`, \`data\`
2. Thinking you're modifying the outer variable but actually creating a new one
3. In loops: shadowing the loop variable can break logic

**TypeScript and ESLint have \`no-shadow\` rule** to catch this. However, shadowing is sometimes intentional and fine — like when a function parameter has the same name as a module-level constant that doesn't apply within the function.`,
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'prototypes',
    moduleId: 'javascript',
    title: 'Prototypes & Inheritance',
    description: 'Understanding the prototype chain, Object.create, and how ES6 classes work under the hood',
    estimatedTime: '40 min',
    sections: [
      {
        title: 'The Prototype Chain',
        content: `Every JavaScript object has a hidden property \`[[Prototype]]\` (accessible as \`__proto__\`) that points to another object — its prototype. When you access a property on an object, JavaScript:

1. Looks for the property on the object itself
2. If not found, looks at the prototype object
3. Continues up the chain until it reaches \`null\` (Object.prototype's prototype)

This chain of prototypes is called the **prototype chain**.

All objects created via literal syntax have \`Object.prototype\` as their ultimate prototype, which provides methods like \`toString\`, \`hasOwnProperty\`, etc.`,
      },
      {
        title: '__proto__ vs prototype',
        content: `These two are commonly confused:

**\`__proto__\`:** The actual prototype link of an object instance. Every object has this. Points to the object's prototype.

**\`.prototype\`:** A property that exists ONLY on functions. It's the object that will become the \`__proto__\` of instances created via \`new\`.

\`\`\`js
function Dog() {}
const rex = new Dog();

Dog.prototype === rex.__proto__; // true
\`\`\`

**Object.getPrototypeOf(obj)** is the modern, non-deprecated way to access the prototype (instead of \`__proto__\`).`,
      },
      {
        title: 'ES6 Classes are Syntactic Sugar',
        content: `ES6 classes look like other OOP languages but are fundamentally still prototype-based:

\`\`\`js
class Animal {
  constructor(name) { this.name = name; }
  speak() { console.log(this.name); }
}
// is equivalent to:
function Animal(name) { this.name = name; }
Animal.prototype.speak = function() { console.log(this.name); };
\`\`\`

Class methods are added to the prototype, not to each instance. This is efficient — all instances share the same method references.`,
      },
    ],
    codeExamples: [
      {
        title: 'Prototype chain visualization',
        language: 'javascript',
        code: `function Animal(name) {
  this.name = name; // own property
}
Animal.prototype.speak = function() { // shared via prototype
  return \`\${this.name} makes a sound\`;
};

function Dog(name, breed) {
  Animal.call(this, name); // call parent constructor
  this.breed = breed;
}
// Set up inheritance chain
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
  return \`\${this.name} barks!\`;
};

const rex = new Dog('Rex', 'Labrador');
console.log(rex.name);       // 'Rex' (own property)
console.log(rex.bark());     // 'Rex barks!' (from Dog.prototype)
console.log(rex.speak());    // 'Rex makes a sound' (from Animal.prototype)
console.log(rex.toString()); // '[object Object]' (from Object.prototype)

// Checking the chain
console.log(rex instanceof Dog);    // true
console.log(rex instanceof Animal); // true
console.log(Object.getPrototypeOf(rex) === Dog.prototype); // true`,
        explanation: 'Property lookup travels up the prototype chain. instanceof checks the chain for the constructor\'s prototype.',
      },
      {
        title: 'ES6 class equivalent',
        language: 'javascript',
        code: `class Animal {
  constructor(name) {
    this.name = name; // instance property
  }

  speak() { // goes on Animal.prototype
    return \`\${this.name} makes a sound\`;
  }

  static create(name) { // static method on Animal itself
    return new Animal(name);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // calls Animal constructor
    this.breed = breed;
  }

  bark() {
    return \`\${this.name} barks!\`;
  }

  speak() { // override
    return \`\${this.name} barks: Woof!\`; // call super.speak() if needed
  }
}

const rex = new Dog('Rex', 'Lab');
console.log(rex.bark());  // Rex barks!
console.log(rex.speak()); // Rex barks: Woof!

// Under the hood — same prototype chain!
console.log(Object.getPrototypeOf(Dog.prototype) === Animal.prototype); // true`,
        explanation: 'ES6 classes are syntactic sugar. Methods go on the prototype. extends sets up the prototype chain.',
      },
      {
        title: 'Object.create for prototypal inheritance',
        language: 'javascript',
        code: `// Object.create(proto) creates an object with proto as its prototype
const animal = {
  init(name) {
    this.name = name;
    return this;
  },
  speak() {
    return \`\${this.name} speaks\`;
  }
};

const dog = Object.create(animal); // dog.__proto__ === animal
dog.bark = function() {
  return \`\${this.name} barks\`;
};

const rex = Object.create(dog).init('Rex');
console.log(rex.bark());  // Rex barks (from dog)
console.log(rex.speak()); // Rex speaks (from animal)

// Object.create(null) creates object with NO prototype
const pure = Object.create(null);
pure.key = 'value';
// pure.hasOwnProperty — TypeError! No Object.prototype
// Useful for truly clean dictionaries/maps`,
        explanation: 'Object.create explicitly sets the prototype. Object.create(null) makes a clean object with no built-in properties.',
      },
    ],
    interviewQuestions: [
      {
        question: 'Explain the prototype chain. How does property lookup work?',
        answer: `Every JavaScript object has an internal \`[[Prototype]]\` link (accessible via \`Object.getPrototypeOf()\`). When you access a property, JavaScript:

1. Checks the object's own properties
2. If not found, follows \`[[Prototype]]\` to the prototype object and checks there
3. Continues up the chain until it finds the property or reaches \`null\`

\`\`\`
rex → Dog.prototype → Animal.prototype → Object.prototype → null
\`\`\`

This is how \`rex.toString()\` works — \`toString\` isn't on \`rex\` or \`Dog.prototype\` or \`Animal.prototype\`, but it IS on \`Object.prototype\`.

The prototype chain enables **inheritance** without copying — all instances share prototype methods, saving memory. When you add a method to \`Array.prototype\`, EVERY array gets that method.`,
        difficulty: 'medium',
      },
      {
        question: 'How do ES6 classes relate to prototypes?',
        answer: `ES6 classes are **syntactic sugar** over prototype-based inheritance. They don't add new inheritance mechanics — they just provide a cleaner syntax.

\`\`\`js
class Foo {
  greet() { return 'hello'; }
}
// Is exactly equivalent to:
function Foo() {}
Foo.prototype.greet = function() { return 'hello'; };
\`\`\`

Key details:
- Class methods go on the **prototype**, not on each instance (unlike class fields)
- \`extends\` sets up \`Object.setPrototypeOf(Sub.prototype, Super.prototype)\`
- \`super()\` calls the parent constructor
- Class declarations are NOT hoisted (unlike function declarations)
- Classes are always in strict mode

The prototype chain is identical whether you use class syntax or function prototypes. \`instanceof\` works the same way.`,
        difficulty: 'medium',
      },
    ],
  },
];
