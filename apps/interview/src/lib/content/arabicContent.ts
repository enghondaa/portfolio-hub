import type { TopicContent } from '@/types';

/**
 * المحتوى العربي — لهجة مصرية، والمصطلحات التقنية بالإنجليزي زي ما بتتقال في
 * الشغل. مقصود إن closure تفضل closure مش "إغلاق"، لأن ده اللي هتسمعه في
 * الانترفيو وده اللي هتقوله.
 *
 * مهم: النسخة دي مش ترجمة للمحتوى الإنجليزي. المراجعة التقنية لقت أخطاء في
 * النسخة الإنجليزية — أشهرها إن الـ class declarations مش hoisted (غلط، هي
 * hoisted وبتقع في الـ TDZ)، وإن strict و sloppy mode متبدلين. المكتوب هنا هو
 * الصح، فلو لقيت اختلاف بين العربي والإنجليزي، العربي هو المعتمد لحد ما
 * الإنجليزي يتصلح.
 */
export const arabicContent: TopicContent[] = [
  {
    id: 'execution-context',
    moduleId: 'javascript',
    title: 'Execution Context والـ Hoisting',
    description:
      'إزاي الـ JavaScript engine بيجهّز الكود قبل ما ينفّذه، وليه بتقدر تنادي function قبل ما تكتبها بس مش متغير.',
    estimatedTime: '45 دقيقة',
    sections: [
      {
        title: 'إيه هو الـ Execution Context أصلًا',
        content: `كل مرة الكود بتاعك بيشتغل، الـ engine بيعمل حاجة اسمها **execution context** — دي البيئة اللي الكود بينفّذ جواها.

فيه تلات أنواع:

- **Global context** — بيتعمل مرة واحدة أول ما الملف يشتغل
- **Function context** — بيتعمل كل مرة تنادي function، وبيتشال لما ترجع
- **Eval context** — موجود للأمانة العلمية بس، متستخدمهوش

اللي بيربك الناس إن كل context بيتعمل على **مرحلتين**، مش مرحلة واحدة.`,
      },
      {
        title: 'المرحلتين: التجهيز والتنفيذ',
        content: `**مرحلة التجهيز (Creation Phase)** — الـ engine بيمر على الكود قبل ما ينفّذ أي سطر، وبيسجّل كل الأسماء اللي معرّفة فيه. ده اللي بنسميه **hoisting**.

في المرحلة دي:

- الـ \`var\` بيتسجّل وقيمته \`undefined\`
- الـ \`let\` و \`const\` **بيتسجّلوا برضو** بس من غير قيمة — دي منطقة اسمها **Temporal Dead Zone**
- الـ function declarations بتتسجّل كاملة بجسمها
- الـ class declarations بتتسجّل زي \`let\` بالظبط — في الـ TDZ

**مرحلة التنفيذ (Execution Phase)** — دلوقتي بس الكود بيتنفّذ سطر سطر والقيم بتتحط.

النقطة المهمة اللي كتير بيغلط فيها: **مش إن \`let\` مش بيتعمله hoisting.** بيتعمله. الفرق إنه بيتسجّل من غير قيمة، فلو حاولت توصله قبل السطر بتاعه هيرمي error.`,
      },
      {
        title: 'إزاي تعرف الفرق من رسالة الـ error',
        content: `دي أسرع طريقة تثبت بيها كلامك في انترفيو:

- \`ReferenceError: Cannot access 'x' before initialization\` → الاسم **متسجّل** بس لسه مالوش قيمة. ده TDZ. يعني \`let\` أو \`const\` أو \`class\`.
- \`ReferenceError: x is not defined\` → الاسم مش متسجّل خالص. ده اسم مش موجود.

فلو حد قالك "الـ classes مش بيتعملها hoisting"، جرّب \`new A(); class A {}\` — هتلاقي الرسالة الأولى مش التانية. يعني هي hoisted.`,
      },
    ],
    codeExamples: [
      {
        title: 'var في مرحلة التجهيز',
        language: 'javascript',
        code: `console.log(x); // undefined — مش error
var x = 5;
console.log(x); // 5

// اللي الـ engine شايفه فعليًا:
// var x;           ← التجهيز: الاسم اتسجّل وقيمته undefined
// console.log(x);  ← التنفيذ
// x = 5;
// console.log(x);`,
        explanation:
          'الـ var بيدي undefined مش error، وده اللي بيخلي الباجات بتاعته صعبة تلاقيها — الكود بيكمّل شغل بقيمة غلط بدل ما يقف.',
      },
      {
        title: 'الـ Temporal Dead Zone',
        language: 'javascript',
        code: `console.log(a); // ReferenceError: Cannot access 'a' before initialization
let a = 5;

// الرسالة نفسها هي الدليل إن a اتسجّلت.
// لو مكنتش اتسجّلت كانت الرسالة: a is not defined

// والـ class نفس الحكاية بالظبط:
new Person(); // ReferenceError: Cannot access 'Person' before initialization
class Person {}

// لكن الـ function declaration شغالة عادي:
greet(); // "أهلاً" — بتشتغل
function greet() { console.log('أهلاً'); }`,
        explanation:
          'دي أهم نقطة في الموضوع ده: let و const و class كلهم hoisted، بس في الـ TDZ. الـ function declaration هي الوحيدة اللي بتتسجّل كاملة.',
      },
      {
        title: 'function declaration مقابل function expression',
        language: 'javascript',
        code: `// declaration — بتتسجّل كاملة، تقدر تناديها فوق
sayHi(); // شغالة
function sayHi() { console.log('hi'); }

// expression — الاسم بس هو اللي بيتسجّل، والقيمة لأ
sayBye(); // TypeError: sayBye is not a function
var sayBye = function () { console.log('bye'); };

// ليه TypeError مش ReferenceError؟
// لإن var sayBye اتسجّل وقيمته undefined،
// وإنت بتحاول تنادي undefined كأنها function.

// وبالـ let بقى:
sayLater(); // ReferenceError: Cannot access 'sayLater' before initialization
let sayLater = function () {};`,
        explanation:
          'نوع الـ error بيقولك بالظبط إيه اللي حصل. TypeError يعني الاسم موجود بس قيمته مش function. ReferenceError يعني الاسم نفسه مش متاح.',
      },
    ],
    interviewQuestions: [
      {
        question: 'إيه هو الـ hoisting بالظبط؟',
        difficulty: 'easy',
        answer: `الـ **hoisting** هو إن الـ engine بيسجّل كل الأسماء المعرّفة في الـ scope قبل ما ينفّذ أي سطر.

مش معناه إن الكود بيتنقل لفوق — الكود مكانه ما اتغيّرش. اللي بيحصل إن فيه مرحلة تجهيز بتمسح الـ scope وتسجّل الأسماء.

والفرق بين الأنواع:

- \`var\` → بيتسجّل بقيمة \`undefined\`
- \`let\` / \`const\` / \`class\` → بيتسجّلوا من غير قيمة، وأي محاولة توصلهم قبل سطرهم بترمي error (TDZ)
- \`function\` declaration → بتتسجّل كاملة، فتقدر تناديها فوق

النقطة اللي بتفرّق: **الكل بيتعمله hoisting.** السؤال مش "مين بيتعمله hoisting" السؤال "مين بيتسجّل بقيمة ومين لأ".`,
      },
      {
        question: 'ليه \`let\` بيدي error و \`var\` بيدي undefined؟',
        difficulty: 'medium',
        answer: `لإن ده كان قرار تصميم مقصود في ES6.

الـ \`var\` بيديك \`undefined\`، فالكود بيكمّل شغل بقيمة غلط. الباج بيظهر بعدين في مكان تاني خالص، وتقعد تدوّر.

الـ \`let\` بيرمي error في اللحظة نفسها. الـ **Temporal Dead Zone** هي الفترة من أول الـ scope لحد سطر التعريف، وأي وصول جواها بيقف على طول.

الفلسفة: **تفشل بصوت عالي وبدري، أحسن من تفشل بصمت ومتأخر.**

وحاجة كمان تستاهل تعرفها: حتى \`typeof\` مش بينفع في الـ TDZ. عادي \`typeof\` بيدي \`"undefined"\` لأي اسم مش موجود من غير ما يرمي، لكن جوه TDZ بيرمي:

\`\`\`javascript
typeof notDefinedAnywhere; // "undefined" — مفيش مشكلة
typeof inTDZ;              // ReferenceError
let inTDZ = 1;
\`\`\``,
      },
      {
        question: 'الـ class declarations بيتعملها hoisting ولا لأ؟',
        difficulty: 'hard',
        answer: `**أيوه بيتعملها hoisting**، بس زي \`let\` بالظبط — بتتسجّل في الـ TDZ من غير قيمة.

كتير بيقولوا "الـ classes مش hoisted" وده غلط. الدليل في رسالة الـ error نفسها:

\`\`\`javascript
new Person(); // ReferenceError: Cannot access 'Person' before initialization
class Person {}
\`\`\`

"Cannot access before initialization" دي بصمة الـ TDZ. لو الاسم مكنش متسجّل أصلًا كانت الرسالة \`Person is not defined\`.

فالإجابة الدقيقة: **الـ classes hoisted بس مش initialized**، على عكس الـ function declarations اللي بتتسجّل جاهزة للاستخدام.

ودي فرصة كمان تقول إن ده جزء من فروق أوسع بين الـ class والـ function — الـ class body دايمًا strict mode، والـ methods بتاعتها non-enumerable، ومينفعش تناديها من غير \`new\`.`,
      },
    ],
    gotchas: [
      {
        title: 'الـ var مالوش block scope',
        description:
          'الـ var بيتعمله hoisting لأقرب function مش لأقرب بلوك. فلو عرّفته جوه if أو for، هيبقى متاح بره البلوك ده عادي — وده مصدر باجات كتير في اللوبات.',
        example: `function test() {
  if (true) { var x = 1; let y = 2; }
  console.log(x); // 1 — طلع بره الـ if
  console.log(y); // ReferenceError — ملتزم بالبلوك
}`,
      },
      {
        title: 'الـ function declaration جوه بلوك',
        description:
          'في strict mode الـ function declaration جوه بلوك بتبقى محدودة بالبلوك. في sloppy mode السلوك مختلف حسب المتصفح. الأأمن إنك تستخدم function expression مع let لو محتاج تعريف جوه بلوك.',
      },
    ],
  },
  {
    id: 'closures',
    moduleId: 'javascript',
    title: 'الـ Closures',
    description:
      'إزاي الـ function بتفضل شايلة الـ scope اللي اتولدت فيه، وليه ده أهم مفهوم في الـ JavaScript.',
    estimatedTime: '40 دقيقة',
    sections: [
      {
        title: 'الفكرة في سطر',
        content: `الـ **closure** هي إن الـ function بتفضل واصلة للمتغيرات اللي كانت حواليها وقت ما اتعرّفت، حتى بعد ما الـ function اللي جواها خلصت ورجعت.

مش بتاخد **نسخة** من القيم. بتفضل ماسكة **المتغير نفسه**. دي أهم نقطة والناس بتغلط فيها كتير.`,
      },
      {
        title: 'ليه ده مهم',
        content: `الـ closures هي اللي بتخلي الحاجات دي ممكنة:

- **بيانات مخفية** — متغير محدش يقدر يوصله غير الـ functions اللي إنت سامح لها
- **Function factories** — function بتطلّع functions متظبطة
- **الـ hooks في React** — \`useState\` كله شغال بـ closures
- **debounce و throttle** — بيحتاجوا يفتكروا الـ timer بين النداءات

ولإنها ماسكة المتغير مش نسخة منه، أي تغيير في المتغير بيبان جوه الـ closure على طول.`,
      },
    ],
    codeExamples: [
      {
        title: 'closure بتمسك المتغير مش نسخته',
        language: 'javascript',
        code: `function counter() {
  let count = 0;
  return {
    increment() { count++; return count; },
    get() { return count; },
  };
}

const c = counter();
c.increment(); // 1
c.increment(); // 2
c.get();       // 2

// count مش موجود بره خالص:
console.log(c.count); // undefined
// الطريقة الوحيدة توصله هي الـ methods اللي رجعت`,
        explanation:
          'التلات functions بيشاركوا نفس الـ count. لو كانوا بياخدوا نسخة، كل واحد كان هيبقى عنده رقم لوحده.',
      },
      {
        title: 'مشكلة الـ var في اللوب',
        language: 'javascript',
        code: `// المشكلة الكلاسيكية:
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// بيطبع: 3 3 3

// ليه؟ فيه i واحد بس (var مالوش block scope).
// لما الـ timeouts اشتغلت، اللوب كان خلص و i بقى 3.
// التلات closures ماسكين نفس المتغير.

// الحل: let بتعمل binding جديد كل لفة
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// بيطبع: 0 1 2

// والحل القديم قبل ES6 — IIFE بتعمل scope جديد:
for (var j = 0; j < 3; j++) {
  (function (captured) {
    setTimeout(() => console.log(captured), 100);
  })(j);
}`,
        explanation:
          'ده أشهر سؤال closure في الانترفيوهات. المفتاح إنك تقول "فيه متغير واحد مشترك" مش "الـ closure بتاخد القيمة الغلط".',
      },
      {
        title: 'debounce — closure شغالة في حاجة حقيقية',
        language: 'javascript',
        code: `function debounce(fn, delay) {
  let timer; // الـ closure بتفتكره بين النداءات
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

const search = debounce((q) => console.log('بيدور على:', q), 300);
search('a'); search('ab'); search('abc');
// بيطبع مرة واحدة بس: "بيدور على: abc"`,
        explanation:
          'من غير closure كنت هتحتاج تخزّن الـ timer في متغير عام أو على الـ function نفسها. الـ closure بتخليه خاص وآمن.',
      },
    ],
    interviewQuestions: [
      {
        question: 'إيه هي الـ closure؟',
        difficulty: 'easy',
        answer: `الـ **closure** هي function مع الـ scope اللي اتعرّفت فيه. لما الـ function ترجع من function تانية، بتفضل واصلة لمتغيرات الأم حتى بعد ما الأم خلصت.

الجملة اللي بتفرق: **الـ closure بتمسك المتغير نفسه، مش نسخة من قيمته.**

فلو المتغير اتغيّر، الـ closure هتشوف القيمة الجديدة. ده اللي بيفسّر مشكلة \`var\` في اللوب وبيفسّر الـ stale closure في React.`,
      },
      {
        question: 'إيه اللي هيتطبع هنا وليه؟',
        difficulty: 'medium',
        answer: `\`\`\`javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
\`\`\`

بيطبع **3 3 3**.

السبب: \`var\` مالوش block scope، فـ \`i\` واحد بس على مستوى الـ function كلها. الـ \`setTimeout\` بيأجّل الـ callbacks لبعد ما الـ call stack يفضى، واللوب بيخلص قبلها و \`i\` بيبقى 3.

التلات callbacks ماسكين **نفس المتغير**، فكلهم بيقروا 3.

بـ \`let\` بيطبع **0 1 2**، لإن \`let\` بتعمل binding جديد لكل لفة في اللوب، فكل closure بتمسك متغير مختلف.`,
      },
      {
        question: 'الـ closures بتسبب memory leaks؟',
        difficulty: 'hard',
        answer: `مش بطبيعتها، لأ. بس ممكن تطوّل عمر حاجات أكتر من اللازم.

الـ closure بتمنع الـ garbage collector إنه ينضّف المتغيرات اللي بتستخدمها. ده مطلوب — لولاه مكنتش الـ closure هتشتغل. المشكلة بتيجي لما تمسك حاجة تقيلة من غير داعي:

\`\`\`javascript
function setup() {
  const hugeArray = new Array(1_000_000).fill('data');
  const id = hugeArray[0];
  return () => console.log(id); // ماسك id بس... نظريًا
}
\`\`\`

المحركات الحديثة بتعمل optimization وبتمسك اللي اتستخدم فعلًا، بس ده مش مضمون في كل الحالات وبيتكسر بسهولة (مثلًا لو فيه \`eval\` في الـ scope).

الحالة الحقيقية اللي بتسرّب: **event listener مش متشال**. الـ listener بيمسك closure، والـ closure بتمسك الـ scope، فالكل بيفضل عايش:

\`\`\`javascript
element.addEventListener('click', handler);
// لازم: element.removeEventListener('click', handler)
\`\`\`

وده بالظبط سبب وجود دالة الـ cleanup في \`useEffect\`.`,
      },
    ],
    gotchas: [
      {
        title: 'الـ stale closure في React',
        description:
          'الـ effect اللي dependency array بتاعته فاضية بيمسك أول قيمة للـ state وبيفضل شايفها للأبد. الحل إنك تستخدم صيغة الـ function في الـ setter عشان تقرا آخر قيمة.',
        example: `useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1);      // ماسك count الأولانية — هيفضل 1
    setCount(c => c + 1);     // بيقرا آخر قيمة — ده الصح
  }, 1000);
  return () => clearInterval(id);
}, []);`,
      },
    ],
  },
  {
    id: 'this-keyword',
    moduleId: 'javascript',
    title: 'الكلمة المفتاحية this',
    description:
      'إزاي بتتحدد قيمة this، وليه بتضيع لما تفصل الـ method عن الـ object بتاعها.',
    estimatedTime: '35 دقيقة',
    sections: [
      {
        title: 'القاعدة الأساسية',
        content: `قيمة \`this\` **مش بتتحدد وقت ما تكتب الـ function**. بتتحدد وقت ما **تناديها**، وبتعتمد على إزاي ناديتها.

الترتيب من الأقوى للأضعف:

1. \`new Foo()\` → \`this\` هو الـ object الجديد
2. \`fn.call(obj)\` أو \`.apply\` أو \`.bind\` → \`this\` هو اللي إنت حددته
3. \`obj.fn()\` → \`this\` هو \`obj\`
4. \`fn()\` لوحدها → حسب الـ mode (تحت)
5. الـ **arrow function** → ملهاش \`this\` خاص بيها أصلًا، بتاخده من المكان اللي اتكتبت فيه`,
      },
      {
        title: 'strict مقابل sloppy — دي بتتقال غلط كتير',
        content: `لما تنادي function عادية لوحدها من غير object:

- في **strict mode** → \`this\` بتبقى \`undefined\`. فأي \`this.something\` **بترمي TypeError**.
- في **sloppy mode** → \`this\` بتبقى الـ global object (\`window\` في المتصفح). فبتشتغل وبتديك قيمة أو \`undefined\`.

خد بالك من الاتجاه ده كويس، لإن كتير بيقولوه بالعكس.

والمهم عمليًا: **إنت شغال strict في 99% من الوقت.** أي ES module، أي جسم class، وأي كود متعمله bundle في React — كلهم strict. يعني السيناريو الافتراضي عندك هو اللي بيرمي.`,
      },
      {
        title: 'الـ arrow functions',
        content: `الـ arrow function **مالهاش \`this\` بتاعها**. لما تكتب \`this\` جواها، الـ engine بيدوّر عليها في الـ scope اللي بره، زي أي متغير عادي.

وعشان كده:

- \`.call\` و \`.apply\` و \`.bind\` **مبيأثروش** على arrow function
- مينفعش تستخدمها كـ constructor مع \`new\`
- مثالية للـ callbacks جوه method، لإنها بتحافظ على \`this\` بتاع الـ method`,
      },
    ],
    codeExamples: [
      {
        title: 'this بتضيع لما تفصل الـ method',
        language: 'javascript',
        code: `const user = {
  name: 'محمد',
  greet() { return \`أهلاً \${this.name}\`; },
};

user.greet(); // "أهلاً محمد" — this هو user

const fn = user.greet;
fn();
// في strict mode: TypeError — this هي undefined
// في sloppy mode: "أهلاً undefined" — this هي window

// نفس المشكلة بتحصل لما تبعت الـ method كـ callback:
setTimeout(user.greet, 100);       // بتضيع
setTimeout(() => user.greet(), 100); // شغالة — النداء لسه على user
setTimeout(user.greet.bind(user), 100); // شغالة برضو`,
        explanation:
          'الـ method مش "بتاعة" الـ object. هي مجرد function مخزّنة في property، و this بتتحدد وقت النداء مش وقت التعريف.',
      },
      {
        title: 'الـ arrow في class',
        language: 'javascript',
        code: `class Counter {
  count = 0;

  // method عادية — this بتعتمد على النداء
  incrementMethod() { this.count++; }

  // class field بـ arrow — this متثبتة على الـ instance
  incrementArrow = () => { this.count++; };
}

const c = new Counter();
const a = c.incrementMethod;
const b = c.incrementArrow;

a(); // TypeError — this هي undefined
b(); // شغالة — الـ arrow ماسكة this بتاعة الـ instance

// عشان كده الـ arrow class fields منتشرة في React:
// <button onClick={this.handleClick}> بتشتغل من غير bind`,
        explanation:
          'الـ arrow field بتتحط على الـ instance نفسه وقت الإنشاء، والـ this جواها بتشاور على الـ instance مهما ناديتها إزاي.',
      },
    ],
    interviewQuestions: [
      {
        question: 'إزاي بتتحدد قيمة this؟',
        difficulty: 'medium',
        answer: `بتتحدد **وقت النداء**، مش وقت التعريف. والترتيب:

1. **\`new\`** → object جديد
2. **\`call\` / \`apply\` / \`bind\`** → اللي إنت حددته
3. **\`obj.fn()\`** → الـ object اللي على شمال النقطة
4. **\`fn()\` لوحدها** → \`undefined\` في strict، الـ global object في sloppy
5. **arrow function** → مش بتشارك في اللعبة دي أصلًا، بتاخد \`this\` من الـ scope اللي بره

النقطة اللي بتفرّق: **نفس الـ function ممكن تديك \`this\` مختلفة حسب إزاي ناديتها.** عشان كده الـ method بتضيع لما تفصلها.`,
      },
      {
        question: 'ليه الـ this بتضيع لما تبعت method كـ callback؟',
        difficulty: 'medium',
        answer: `لإن اللي بينادي الـ callback بينادي القيمة نفسها، مش عن طريق الـ object.

\`\`\`javascript
setTimeout(user.greet, 100);
\`\`\`

اللي بيحصل إن \`user.greet\` بتتقيّم لقيمة الـ function، والقيمة دي بتتبعت لـ \`setTimeout\`. لما الوقت ييجي، \`setTimeout\` بينادي الـ function لوحدها — مفيش \`user.\` قدامها.

فالقاعدة رقم 3 (\`obj.fn()\`) مش بتنطبق، والقاعدة رقم 4 هي اللي بتشتغل.

التلات حلول:

\`\`\`javascript
setTimeout(() => user.greet(), 100);      // arrow بتحافظ على النداء كامل
setTimeout(user.greet.bind(user), 100);   // bind بتثبّت this
// أو تخلي greet نفسها arrow class field
\`\`\``,
      },
      {
        question: 'إيه اللي هيحصل هنا؟',
        difficulty: 'hard',
        answer: `\`\`\`javascript
const obj = {
  value: 42,
  regular() { return this.value; },
  arrow: () => this.value,
};
obj.regular(); // ؟
obj.arrow();   // ؟
\`\`\`

\`obj.regular()\` بترجّع **42** — عادي، \`this\` هي \`obj\`.

\`obj.arrow()\` بتعتمد على مكان الملف:

- في **ES module** → الـ \`this\` بره هي \`undefined\`، فبترمي **TypeError**
- في **script عادي في المتصفح** → \`this\` هي \`window\`، فبترجّع \`undefined\` (مش error)

النقطة المهمة: **الـ arrow في object literal مبتاخدش الـ object.** الـ object literal مش بيعمل scope. الـ arrow بتاخد \`this\` من الـ scope اللي محيط بالـ object كله.

ودي غلطة شائعة — الناس بتفتكر إن الـ arrow هتمسك الـ object لإنها مكتوبة جواه.`,
      },
    ],
    gotchas: [
      {
        title: 'الـ bind مبتشتغلش على arrow',
        description:
          'الـ arrow function ملهاش this خاص، فـ bind و call و apply بيتجاهلوها تمامًا. لو حاولت تعمل bind لـ arrow، الكود هيشتغل من غير error بس من غير أي تأثير.',
        example: `const arrow = () => this.name;
const bound = arrow.bind({ name: 'أحمد' });
bound(); // مش هترجّع "أحمد" — الـ bind اتجاهلت`,
      },
      {
        title: 'متكتبش method و arrow field بنفس الاسم',
        description:
          'الـ class field بيتحط على الـ instance قبل ما جسم الـ constructor يشتغل، فبيغطّي الـ method اللي على الـ prototype نهائيًا. لو عملت الاتنين بنفس الاسم، الـ method مش هتشتغل أبدًا ومش هتعرف ليه.',
      },
    ],
  },
  {
    id: 'event-loop',
    moduleId: 'javascript',
    title: 'الـ Event Loop والـ Async',
    description:
      'إزاي الـ JavaScript بتعمل حاجات كتير في نفس الوقت وهي thread واحد، وليه الـ promise بتسبق الـ setTimeout.',
    estimatedTime: '60 دقيقة',
    sections: [
      {
        title: 'المكوّنات',
        content: `الـ JavaScript **thread واحد** — بتنفّذ حاجة واحدة في المرة. اللي بيخليها تشيل شغل async هو النظام اللي حواليها:

- **Call Stack** — اللي بينفّذ دلوقتي
- **Web APIs** — التايمرات والشبكة والـ DOM events، دول بره الـ engine
- **Macrotask Queue** — \`setTimeout\`، \`setInterval\`، الـ I/O، الـ events
- **Microtask Queue** — الـ promises، \`queueMicrotask\`، \`MutationObserver\`
- **Event Loop** — بيراقب الـ stack ويسحب الشغل لما يفضى

القاعدة الحاكمة: لما الـ stack يفضى، الـ event loop بيفضّي **كل** الـ microtasks، بعدين بياخد **task واحدة بس** من الـ macrotasks، وبعدها يفضّي الـ microtasks تاني. وهكذا.`,
      },
      {
        title: 'الرندرة مش macrotask',
        content: `دي نقطة بتتقال غلط كتير.

تحديث الشاشة (**rendering**) مش نوع من الـ tasks. هو **خطوة منفصلة** في دورة الـ event loop بتحصل بعد ما الـ task تخلص وبعد ما الـ microtasks تفضى.

وعشان كده \`requestAnimationFrame\` موجودة أصلًا — هي الطريقة اللي تعلّق بيها شغل على الخطوة دي بالتحديد.

فلو حد سألك "الرندرة بتحصل فين بالنسبة للـ tasks؟" الإجابة: بعد الـ task وبعد تفضية الـ microtasks، مش كـ task في الطابور.`,
      },
      {
        title: 'في Node فيه طابور زيادة',
        content: `\`process.nextTick\` مش نفس \`Promise.then\`. الـ nextTick queue بتتفضى **قبل** طابور الـ promises.

الترتيب في Node:

1. \`process.nextTick\`
2. الـ promise microtasks (\`.then\`، \`await\`، \`queueMicrotask\`)
3. الـ macrotasks (\`setTimeout\`)
4. \`setImmediate\` (مرحلة الـ check)

ده بيتسأل كتير في أي انترفيو فيه Node.`,
      },
    ],
    codeExamples: [
      {
        title: 'ترتيب التنفيذ — السؤال الكلاسيكي',
        language: 'javascript',
        code: `console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve().then(() => {
  console.log('3');
  return Promise.resolve();
}).then(() => console.log('4'));

queueMicrotask(() => console.log('5'));

console.log('6');

// الترتيب: 1 6 3 5 4 2
//
// 1 و 6  → كود متزامن، بيتنفّذ على طول
// 3      → أول microtask
// 5      → تاني microtask (اتحطت قبل ما 4 تتجدول)
// 4      → اتحطت في الطابور بعد ما 3 خلصت
// 2      → macrotask، آخر واحد`,
        explanation:
          'المفتاح: كل الـ microtasks بتتفضى قبل أي macrotask. حتى لو الـ setTimeout مكتوب فوق.',
      },
      {
        title: 'الـ stack لما يتقفل',
        language: 'javascript',
        code: `const start = Date.now();

// التايمر بيتجدول الأول عشان القياس يبقى عادل
setTimeout(() => {
  console.log('التايمر اشتغل بعد:', Date.now() - start, 'ms');
}, 100);

// لوب بيقفل الـ thread نص ثانية
while (Date.now() - start < 500) {}

// بيطبع حوالي 500ms مش 100ms.
// التايمر كان جاهز من بدري، بس الـ event loop
// مش بيقدر يشيله لحد ما الـ stack يفضى.`,
        explanation:
          'التايمر بيضمن حد أدنى للتأخير، مش وقت مضبوط. لو الـ thread مقفول، التايمر بيستنى.',
      },
      {
        title: 'الفرق بين Node والمتصفح',
        language: 'javascript',
        code: `// في Node:
process.nextTick(() => console.log('nextTick'));
Promise.resolve().then(() => console.log('promise'));
queueMicrotask(() => console.log('microtask'));
setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));

// nextTick → promise → microtask → timeout → immediate
//
// process.nextTick ليها طابور لوحدها بتتفضى قبل الـ promises.
// وعشان كده استخدامها بكتر ممكن يجوّع باقي الطوابير.`,
      },
    ],
    interviewQuestions: [
      {
        question: 'اشرح الـ event loop',
        difficulty: 'medium',
        answer: `الـ JavaScript thread واحد، فالـ **event loop** هو اللي بيخليها تشيل شغل async من غير ما تقف.

الدورة:

1. نفّذ الكود المتزامن لحد ما الـ **call stack** يفضى
2. فضّي **كل** الـ microtask queue (promises، \`queueMicrotask\`)
3. لو فيه شغل رندرة، اعمله
4. خد **task واحدة** من الـ macrotask queue (\`setTimeout\`، events، I/O)
5. ارجع للخطوة 2

النقطة اللي بتفرّق: **الـ microtasks بتتفضى بالكامل، والـ macrotasks واحدة في المرة.** ده اللي بيخلي الـ promise دايمًا تسبق الـ \`setTimeout(fn, 0)\`.

وحاجة كمان: الرندرة مش task في الطابور، هي خطوة منفصلة في الدورة — وعشان كده \`requestAnimationFrame\` مش نفس \`setTimeout\`.`,
      },
      {
        question: 'إيه الفرق بين microtask و macrotask؟',
        difficulty: 'medium',
        answer: `**Microtasks** — \`Promise.then\`، \`await\`، \`queueMicrotask\`، \`MutationObserver\`.
**Macrotasks** — \`setTimeout\`، \`setInterval\`، \`setImmediate\` (Node)، الـ I/O، الـ DOM events.

الفرق في الأولوية والكمية:

- الـ event loop بيفضّي **الطابور كله** من الـ microtasks بعد كل task
- وبياخد **واحدة بس** من الـ macrotasks في كل دورة

يعني الـ microtask دايمًا بتسبق أي macrotask متجدولة، حتى لو المacrotask اتجدولت قبلها.

والوش التاني للعملة: لو microtask بتضيف microtask جديدة كل مرة، الطابور مش بيفضى أبدًا والصفحة بتتجمّد. الـ macrotasks معندهاش المشكلة دي لإن الـ loop بياخد واحدة بس.`,
      },
      {
        question: 'هل \`setTimeout(fn, 0)\` بيشتغل بعد 4ms؟',
        difficulty: 'hard',
        answer: `مش دايمًا — وده اللي بيتقال غلط.

الـ **4ms clamp** بيتطبّق بس لما تكون التايمرات **متداخلة أكتر من 5 مستويات** (setTimeout جوه setTimeout جوه setTimeout... ). أول \`setTimeout(fn, 0)\` مش بيتقصّ لـ 4ms.

وفيه حاجة تانية مختلفة خالص: التابات اللي في الخلفية بيتعملها throttle لحوالي **ثانية كاملة**، مش 4ms. دي آلية منفصلة.

والأهم من الاتنين: الرقم اللي بتديه هو **حد أدنى للتأخير مش موعد**. لو الـ call stack مشغول، التايمر بيستنى مهما كان الرقم. \`setTimeout(fn, 0)\` معناها "نفّذها في أقرب دورة بعد ما الـ stack يفضى والـ microtasks تخلص".`,
      },
    ],
    gotchas: [
      {
        title: 'microtask بتولّد نفسها بتقفل الصفحة',
        description:
          'لإن الـ event loop بيفضّي الطابور بالكامل، أي microtask بتضيف واحدة جديدة كل مرة بتمنع الرندرة والـ events نهائيًا. الـ setTimeout مبيعملش كده.',
        example: `function loop() { Promise.resolve().then(loop); }
loop(); // الصفحة اتجمّدت

function ok() { setTimeout(ok, 0); }
ok(); // شغالة، والصفحة بتستجيب`,
      },
      {
        title: 'الـ async/await مش مجرد اختصار لـ then',
        description:
          'لو الـ function رمت error بشكل متزامن، الـ async version بترجّع promise مرفوضة، لكن النسخة المكتوبة بـ then بترمي في مكان النداء نفسه. والـ async function دايمًا بترجّع promise مهما كان اللي جواها.',
      },
    ],
  },
];
