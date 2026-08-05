import type { TopicContent } from '@/types';

/**
 * الأسئلة الأكثر تكرارًا — إجابات مختصرة ومركّزة.
 *
 * الموديولات التانية بتشرح المواضيع بعمق. الموديول ده للمراجعة السريعة قبل
 * الانترفيو: سؤال وإجابة، من غير مقدمات.
 *
 * مكتوب بالمصري والمصطلحات بالإنجليزي. والإجابات متكتوبة من الأول مش مترجمة،
 * فالتصحيحات اللي في المراجعة التقنية متطبّقة هنا.
 */
export const rapidFireContent: TopicContent[] = [
  {
    id: 'js-essentials',
    moduleId: 'rapid-fire',
    title: 'أساسيات JavaScript المتكررة',
    description:
      'الأسئلة اللي بتيجي في كل انترفيو فرونت إند تقريبًا: الـ delegation، الـ currying، النسخ، المقارنات، وإدارة الذاكرة.',
    estimatedTime: '50 دقيقة',
    sections: [
      {
        title: 'إزاي تستخدم الصفحة دي',
        content: `دي مراجعة سريعة. كل سؤال إجابته مختصرة وفيها **الجملة اللي بتفرّق** — الحتة اللي لو قلتها بيبان إنك فاهم مش حافظ.

لو محتاج الشرح الكامل لأي موضوع، هتلاقيه في الموديول بتاعه.`,
      },
    ],
    codeExamples: [
      {
        title: 'Event Delegation',
        language: 'javascript',
        code: `// بدل listener لكل زرار:
document.querySelectorAll('.btn').forEach(b =>
  b.addEventListener('click', handle)
); // 100 زرار = 100 listener

// listener واحد على الأب:
document.querySelector('#list').addEventListener('click', (e) => {
  const btn = e.target.closest('.btn');
  if (!btn) return;          // الكليك مكانش على زرار
  handle(btn.dataset.id);
});

// الميزة التانية: الزراير اللي بتتضاف بعدين بتشتغل لوحدها،
// من غير ما تعمل bind من تاني.`,
        explanation:
          'شغّال بسبب الـ bubbling: الحدث بيطلع من العنصر لأبوه لجدّه. closest بيلاقي أقرب عنصر مطابق، ولو مفيش بنخرج.',
      },
      {
        title: 'Currying وHigher-Order Functions',
        language: 'javascript',
        code: `// higher-order function = بتاخد function أو بترجّع function
const withLog = (fn) => (...args) => {
  console.log('نداء بـ:', args);
  return fn(...args);
};

// currying = تحويل f(a,b,c) لـ f(a)(b)(c)
const add = (a) => (b) => (c) => a + b + c;
add(1)(2)(3); // 6

// الفايدة العملية: تثبيت أول argument
const multiply = (factor) => (n) => n * factor;
const double = multiply(2);
[1, 2, 3].map(double); // [2, 4, 6]`,
        explanation:
          'الـ currying شغّال بالـ closures — كل مستوى ماسك الـ argument بتاعه. الفايدة إنك تعمل نسخة متخصصة من function عامة.',
      },
      {
        title: 'النسخ السطحي والعميق',
        language: 'javascript',
        code: `const original = { name: 'أحمد', address: { city: 'القاهرة' } };

// سطحي — المستوى الأول بس
const shallow = { ...original };
shallow.address.city = 'الجيزة';
original.address.city; // 'الجيزة' — اتغيّرت معاه

// عميق — الطريقة الحديثة
const deep = structuredClone(original);
deep.address.city = 'أسوان';
original.address.city; // 'الجيزة' — سليمة

// الطريقة القديمة ومشاكلها:
JSON.parse(JSON.stringify(original));
// بتضيّع: Date (بتبقى string)، undefined، الـ functions،
// وبترمي على الـ circular references`,
        explanation:
          'structuredClone بيشيل الـ Date والـ Map والـ Set والـ circular refs. بيرمي على الـ functions والـ DOM nodes، وبينسخ الـ class instances بس بيضيّع الـ prototype فبترجع object عادي.',
      },
      {
        title: 'Debounce مقابل Throttle',
        language: 'javascript',
        code: `// debounce — استنى لحد ما الحركة تهدى
function debounce(fn, ms) {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

// throttle — نفّذ مرة كل فترة مهما حصل
function throttle(fn, ms) {
  let last = 0;
  return (...a) => {
    const now = Date.now();
    if (now - last >= ms) { last = now; fn(...a); }
  };
}

// debounce: بحث، تغيير حجم الشاشة، الحفظ التلقائي
// throttle: scroll، حركة الماوس، infinite scroll`,
        explanation:
          'الفرق في سطر: الـ debounce بيهتم بآخر حدث، والـ throttle بيهتم بمعدل ثابت. لو عايز تعرف "خلص كتابة؟" استخدم debounce. لو عايز "متعملش أكتر من كذا في الثانية" استخدم throttle.',
      },
    ],
    interviewQuestions: [
      {
        question: 'إيه هو الـ Event Delegation وليه بنستخدمه؟',
        difficulty: 'easy',
        answer: `تحط **listener واحد على العنصر الأب** بدل listener على كل ابن، وتعتمد على إن الحدث بيعمل **bubbling** لفوق.

جوه الـ handler بتشوف \`event.target\` عشان تعرف مين اتضغط، وبتستخدم \`closest()\` عشان توصل لأقرب عنصر يهمك.

فايدتين:

1. **ذاكرة أقل** — listener واحد بدل مية
2. **بيشتغل على العناصر الجديدة** — أي عنصر يتضاف للـ DOM بعدين بيشتغل من غير ما تعمل bind تاني

الجملة اللي بتفرّق: **ده هو نفس المبدأ اللي React شغالة بيه.** React بتحط listeners على الـ root container مش على كل عنصر، وبتعمل delegation جواها.`,
      },
      {
        question: 'إيه الفرق بين `==` و `===`؟',
        difficulty: 'easy',
        answer: `\`===\` بيقارن **من غير تحويل نوع**. لو النوعين مختلفين، النتيجة \`false\` على طول.

\`==\` بيحاول **يحوّل** الأول وبعدين يقارن. والتحويل ده ليه قواعد معقّدة:

\`\`\`javascript
0 == '0'      // true  — الـ string اتحوّل لرقم
0 == []       // true  — [] بقت '' بقت 0
'0' == []     // false — [] بقت '' و '0' مش ''
null == undefined  // true  — حالة خاصة
null == 0     // false — null مبيتحوّلش لرقم
NaN == NaN    // false — NaN مش بتساوي نفسها
\`\`\`

**القاعدة العملية:** استخدم \`===\` دايمًا. الاستثناء الوحيد المقبول هو \`x == null\` لإنها بتمسك \`null\` و \`undefined\` مع بعض.

ولو حد ضغط عليك: فيه استثناء تاني نادر، \`document.all == null\` بترجّع \`true\` — ده سلوك متسايب في المواصفات عشان مواقع قديمة.`,
      },
      {
        question: 'إيه الفرق بين النسخ السطحي والعميق؟',
        difficulty: 'medium',
        answer: `**السطحي (shallow)** بينسخ المستوى الأول بس. أي object جوه بيفضل نفس الـ reference، فلو غيّرته بيتغيّر في الاتنين.

\`\`\`javascript
const copy = { ...original };        // سطحي
const copy = Object.assign({}, o);   // سطحي برضو
\`\`\`

**العميق (deep)** بينسخ كل المستويات. النسختين مستقلين تمامًا.

\`\`\`javascript
structuredClone(original);  // المدعوم رسميًا
\`\`\`

\`structuredClone\` بيشيل الـ \`Date\` والـ \`Map\` والـ \`Set\` والـ \`RegExp\` و **الـ circular references**. بيرمي على الـ functions والـ DOM nodes والـ Symbols. وبينسخ الـ class instances بس بيضيّع الـ prototype — فبترجع object عادي مش instance.

الطريقة القديمة \`JSON.parse(JSON.stringify(x))\` بتضيّع الـ \`Date\` (بتبقى string) والـ \`undefined\` والـ functions، وبترمي على الـ circular references.

**ليه ده مهم في React:** الـ state لازم يتعامل كـ immutable. لو عملت spread سطحي وغيّرت object جوه، React مش هتشوف تغيير في الـ reference بتاع المستوى الأول وممكن متعملش re-render.`,
      },
      {
        question: 'إيه الفرق بين `??` و `||`؟',
        difficulty: 'medium',
        answer: `\`||\` بيرجّع الطرف اليمين لو الشمال **falsy**. والـ falsy فيها: \`0\` و \`''\` و \`false\` و \`NaN\` و \`null\` و \`undefined\`.

\`??\` بيرجّع اليمين لو الشمال **\`null\` أو \`undefined\` بس**، ومش بيهتم بباقي الـ falsy.

الفرق ده بيبان في القيم الصالحة اللي بتصادف إنها falsy:

\`\`\`javascript
const count = 0;
count || 10;   // 10  ← غلط، الصفر قيمة صحيحة
count ?? 10;   // 0   ← صح

const name = '';
name || 'ضيف';  // 'ضيف'
name ?? 'ضيف';  // ''   ← الـ string الفاضي قيمة صحيحة
\`\`\`

**القاعدة:** لو بتحط قيمة افتراضية لحاجة ممكن تكون \`0\` أو \`''\` أو \`false\` بشكل مشروع، استخدم \`??\`.

ملحوظة: مينفعش تخلط \`??\` مع \`||\` أو \`&&\` في نفس التعبير من غير أقواس — ده SyntaxError مقصود عشان الترتيب ميبقاش غامض.`,
      },
      {
        question: 'اشرح `call` و `apply` و `bind`',
        difficulty: 'medium',
        answer: `التلاتة بيحددوا قيمة \`this\` يدويًا.

- **\`call(thisArg, a, b)\`** — بينفّذ فورًا، الـ arguments واحدة واحدة
- **\`apply(thisArg, [a, b])\`** — بينفّذ فورًا، الـ arguments في array
- **\`bind(thisArg, a)\`** — **مبينفّذش**، بيرجّع function جديدة متثبّت فيها \`this\`

\`\`\`javascript
function greet(greeting) { return \`\${greeting} \${this.name}\`; }
const user = { name: 'محمد' };

greet.call(user, 'أهلاً');    // "أهلاً محمد"
greet.apply(user, ['أهلاً']); // نفس النتيجة
const bound = greet.bind(user);
bound('أهلاً');                // "أهلاً محمد"
\`\`\`

حاجتين بيتسألوا عليهم:

1. **الـ bind مبيتلغيش.** لو عملت bind على function اتعملها bind قبل كده، أول bind هو اللي بيفضل.
2. **مبيشتغلوش على الـ arrow functions** خالص، لإن الـ arrow ملهاش \`this\` بتاعها.

وبعد ES6 الـ spread خلّت \`apply\` شبه مستغنى عنها: \`fn(...args)\` بتعمل نفس الحاجة.`,
      },
      {
        question: 'إيه الفرق بين `map` و `filter` و `reduce` و `forEach` و `find`؟',
        difficulty: 'easy',
        answer: `- **\`map\`** → array **جديدة بنفس الطول**، كل عنصر متحوّل
- **\`filter\`** → array جديدة فيها العناصر اللي عدّت الشرط بس
- **\`reduce\`** → **قيمة واحدة** (رقم، object، array، أي حاجة)
- **\`forEach\`** → **بترجّع \`undefined\`**، بتستخدمها للتأثيرات الجانبية بس
- **\`find\`** → **أول عنصر** يطابق الشرط، أو \`undefined\`

نقطتين بيغلط فيهم الناس:

**\`forEach\` مينفعش تخرج منها.** مفيش \`break\` ولا \`return\` بيوقفها. لو محتاج تخرج بدري استخدم \`for...of\` أو \`some\`.

**التلاتة الأولانيين immutable** — بيرجّعوا حاجة جديدة ومبيغيّروش الأصل. عشان كده بيتحبوا في React.

و\`reduce\` هي الأعم — تقدر تعمل بيها \`map\` و \`filter\` لو حبيت، بس الكود بيبقى أوحش.`,
      },
      {
        question: 'إزاي الـ garbage collection شغالة في JavaScript؟',
        difficulty: 'hard',
        answer: `المحركات الحديثة بتستخدم خوارزمية **mark-and-sweep**.

الفكرة: فيه مجموعة جذور (**roots**) — الـ global object، والـ call stack الحالي. الـ GC بيبدأ منها ويعلّم كل حاجة يقدر يوصلها. أي حاجة متعلّمتش، بيمسحها.

**مش counting للـ references.** ده مهم لإن الـ reference counting بيفشل مع الحلقات المغلقة:

\`\`\`javascript
let a = {}; let b = {};
a.ref = b; b.ref = a;   // كل واحد بيشاور على التاني
a = null; b = null;     // مفيش جذر بيوصلهم
// الـ mark-and-sweep بينضّفهم عادي
\`\`\`

**التسريبات الحقيقية** بتيجي من حاجات لسه موصولة بجذر وإنت ناسيها:

- **event listeners** مش متشالة
- **timers** (\`setInterval\`) مش متلغية
- **references عامة** بتكبر ومحدش بينضّفها
- **DOM nodes** متشالة من الصفحة بس لسه فيه متغير ماسكها

الـ \`WeakMap\` و \`WeakSet\` بيحلوا الحالة الأخيرة: بيمسكوا الـ keys **بشكل ضعيف**، فلو مفيش حد تاني ماسك الـ object، الـ GC بينضّفه والـ entry بتختفي لوحدها.`,
      },
      {
        question: 'إيه الفرق بين Promises و async/await؟',
        difficulty: 'medium',
        answer: `**نفس الآلية، صياغة مختلفة.** الـ \`async/await\` مبني فوق الـ promises.

\`\`\`javascript
// promises
fetchUser().then(u => fetchPosts(u.id)).then(p => render(p)).catch(handle);

// async/await
try {
  const u = await fetchUser();
  const p = await fetchPosts(u.id);
  render(p);
} catch (e) { handle(e); }
\`\`\`

الـ \`await\` أوضح خصوصًا في الحاجات المتسلسلة، والـ \`try/catch\` بتمسك الأخطاء بشكل طبيعي.

تلات حاجات تخلي بالك منهم:

1. **الـ async function دايمًا بترجّع promise**، حتى لو رجّعت رقم عادي.
2. **الـ await المتتالي بيبقى تسلسلي.** لو الطلبات مستقلة استخدم \`Promise.all\` عشان تشتغل مع بعض.
3. **مش اختصار مباشر لـ \`.then\`.** لو الـ function رمت error **بشكل متزامن**، النسخة الـ async بترجّع promise مرفوضة، لكن النسخة المكتوبة بـ \`.then\` بترمي في مكان النداء نفسه.

ولسه محتاج الـ combinators: \`Promise.all\` (كلهم أو فشل)، \`allSettled\` (النتايج كلها مهما حصل)، \`race\` (أول واحد يخلص)، \`any\` (أول واحد ينجح).`,
      },
    ],
    gotchas: [
      {
        title: 'الـ forEach مبتستناش الـ await',
        description:
          'لو حطيت async callback جوه forEach، الـ loop بيكمّل من غير ما يستنى. استخدم for...of لو عايز تسلسل، أو Promise.all مع map لو عايز توازي.',
        example: `// غلط — بيخلص قبل ما الطلبات تنتهي
items.forEach(async (i) => { await save(i); });

// صح — بالترتيب
for (const i of items) { await save(i); }

// صح — مع بعض
await Promise.all(items.map(i => save(i)));`,
      },
    ],
  },
  {
    id: 'react-essentials',
    moduleId: 'rapid-fire',
    title: 'أساسيات React المتكررة',
    description:
      'الـ rendering والـ memoization والـ refs والـ hooks — الأسئلة اللي بتفصل اللي اشتغل React فعلًا عن اللي قرا عنها.',
    estimatedTime: '55 دقيقة',
    sections: [
      {
        title: 'المفهوم اللي كل الباقي بيتفرّع منه',
        content: `معظم أسئلة React بترجع لسؤال واحد: **إمتى الكومبوننت بيعمل re-render؟**

بيحصل لتلات أسباب بس:

1. الـ **state** بتاعه اتغيّر
2. الـ **أب** عمل re-render
3. **context** هو مشترك فيه اتغيّر

مش لإن الـ props اتغيّرت — الأب لما يعمل render بيعيد رندرة كل الأبناء بغض النظر عن الـ props. \`React.memo\` هي اللي بتغيّر السلوك ده.`,
      },
    ],
    codeExamples: [
      {
        title: 'useMemo و useCallback و memo — مين بيعمل إيه',
        language: 'jsx',
        code: `// useMemo — بيحفظ قيمة
const sorted = useMemo(() => items.sort(compare), [items]);

// useCallback — بيحفظ function (نفس الـ reference)
const handleClick = useCallback((id) => select(id), []);

// React.memo — بيمنع الـ re-render الجاي من الأب
const Row = React.memo(function Row({ item, onClick }) { ... });

// التلاتة بيشتغلوا مع بعض:
// من غير useCallback، الـ handleClick بتبقى reference جديدة كل render،
// فـ memo بتشوف prop اتغيّرت وبتعمل render برضو — يعني memo بقت بلا فايدة.`,
        explanation:
          'الغلطة الشائعة: memo لوحدها من غير useCallback/useMemo على الـ props بتاعة الـ objects والـ functions. ساعتها memo بتقارن وبتلاقي اختلاف كل مرة.',
      },
      {
        title: 'useEffect مقابل useLayoutEffect',
        language: 'jsx',
        code: `useEffect(() => {
  // بيشتغل بعد ما المتصفح يرسم
  // المستخدم ممكن يشوف الحالة القديمة لفريم
}, []);

useLayoutEffect(() => {
  // بيشتغل بعد تعديل الـ DOM وقبل الرسم
  // المستخدم عمره ما هيشوف الحالة الوسيطة
  const { height } = ref.current.getBoundingClientRect();
  setHeight(height);
}, []);

// القاعدة: استخدم useEffect دايمًا،
// إلا لو بتقيس الـ DOM وبتغيّر على أساس القياس —
// ساعتها useLayoutEffect بيمنع الرفرفة.`,
        explanation:
          'الـ useLayoutEffect بيقفل الرسم، فاستخدامه في شغل تقيل بيبطّء الصفحة. وفي SSR بيدي warning لإن مفيش layout أصلًا على السيرفر.',
      },
      {
        title: 'CSR و SSR و SSG و ISR',
        language: 'jsx',
        code: `// SSG — بيتبني وقت الـ build، أسرع حاجة
export default async function Page() {
  const posts = await fetch(url, { cache: 'force-cache' }).then(r => r.json());
  return <List posts={posts} />;
}

// ISR — SSG بس بيتجدد كل فترة
const posts = await fetch(url, { next: { revalidate: 60 } }).then(r => r.json());

// SSR — بيتبني مع كل طلب
const posts = await fetch(url, { cache: 'no-store' }).then(r => r.json());

// CSR — بيتجاب في المتصفح
'use client';
useEffect(() => { fetch(url).then(...) }, []);`,
        explanation:
          'مهم: من Next.js 15 الـ fetch بقى uncached بشكل افتراضي. الكود القديم اللي بيقول force-cache هو الافتراضي بقى قديم.',
      },
    ],
    interviewQuestions: [
      {
        question: 'إيه هو الـ Virtual DOM وليه React بتستخدمه؟',
        difficulty: 'medium',
        answer: `الـ **Virtual DOM** هو تمثيل للواجهة كـ objects في الذاكرة. React بتقارن الشجرة الجديدة بالقديمة (**reconciliation**) وبتطبّق الفرق على الـ DOM الحقيقي.

**والإجابة اللي بتفرّق:** الـ Virtual DOM **مش أسرع** من تعديل الـ DOM يدويًا بشكل مظبوط. هو أبطأ — إنت بتبني شجرة في الذاكرة، وبتقارنها، **وبعدين** بتعمل التعديلات على أي حال.

اللي بتكسبه منه حاجة تانية خالص:

- **نموذج تصريحي** — بتوصف الواجهة كدالة في الـ state، ومش بتزامن الـ DOM بإيدك
- **تجميع التعديلات** — كل التغييرات بتتطبّق في مرة واحدة، فالمتصفح بيعمل layout مرة واحدة
- **فصل عن الـ DOM** — نفس الـ reconciler بيشغّل React Native والـ server rendering

اللي بيبطّء فعلًا هو الـ **layout والـ repaint**، وده بيحصل بنفس التكلفة سواء React أو كود يدوي هو اللي عمل التعديل.

اللي بيقول "الـ DOM بطيء والـ Virtual DOM بيحل ده" بيدي الإجابة الشائعة الغلط.`,
      },
      {
        question: 'إيه هو React Fiber؟',
        difficulty: 'hard',
        answer: `الـ **Fiber** هي معمارية الـ reconciler اللي اتكتبت من الأول في React 16 سنة 2017.

قبلها كان الـ reconciler بيمشي على الشجرة **recursion** على الـ call stack — وده مينفعش توقفه في النص. لو الشجرة كبيرة، الـ thread بيتقفل لحد ما تخلص.

الـ Fiber حوّلت ده لـ **linked list من عقد fiber** مخزّنة في الذاكرة مش على الـ stack، فبقى ممكن تمشي عليها **على أجزاء**، وتوقف، وترجع، وترمي الشغل وتبدأ من تاني.

**النقطة اللي بتفرّق، وكتير بيغلط فيها:** الـ Fiber **خلّت ده ممكن، بس مشغّلتوش**. React 16 و 17 فضلوا بيرندروا بشكل متزامن ومش قابل للمقاطعة.

وحتى في React 18 مع \`createRoot\`، **التحديث العادي لسه بيتنفّذ لحد ما يخلص**. اللي بيبقى قابل للمقاطعة بجد هو التحديثات المعلّمة كـ **transitions** (\`startTransition\`، \`useDeferredValue\`) وشغل الـ Suspense.

فالإجابة الكاملة: Fiber هي البنية التحتية، والـ concurrent features في React 18 هي اللي فعّلتها، وهي opt-in لكل تحديث على حدة.`,
      },
      {
        question: 'إمتى الكومبوننت بيعمل re-render؟',
        difficulty: 'medium',
        answer: `تلات أسباب بس:

1. الـ **state** بتاعه اتغيّر (\`useState\` / \`useReducer\`)
2. الـ **أب** عمل re-render
3. **context** بيستهلكه اتغيّرت قيمته

**مش** لإن الـ props اتغيّرت. الأب لما يرندر، الأبناء بيرندروا سواء الـ props اتغيّرت أو لأ. \`React.memo\` هي اللي بتضيف المقارنة دي.

وحاجة مهمة عن \`React.memo\`: **بتمنع النوع التاني بس.** الكومبوننت اللي متغلّف بـ memo لسه بيرندر لو:

- الـ state بتاعه اتغيّر
- **context بيستهلكه اتغيّر** ← دي اللي بتلخبط الناس

و\`memo\` بتبقى بلا فايدة تمامًا لو الأب بيبعت object أو array أو function متعملة inline، لإن دي reference جديدة كل render. عشان كده بتتقرن بـ \`useCallback\` و \`useMemo\`، أو بنمط تمرير الـ \`children\`.`,
      },
      {
        question: 'إيه الفرق بين Controlled و Uncontrolled components؟',
        difficulty: 'easy',
        answer: `**Controlled** — الـ React state هو مصدر الحقيقة. القيمة جاية من الـ state وكل تغيير بيعدي على \`onChange\`.

\`\`\`jsx
const [name, setName] = useState('');
<input value={name} onChange={e => setName(e.target.value)} />
\`\`\`

بيديك: تحقق فوري، تعطيل شرطي، تنسيق أثناء الكتابة. وبيكلّفك: re-render مع كل حرف.

**Uncontrolled** — الـ DOM ماسك القيمة، وإنت بتقراها بـ ref وقت الحاجة.

\`\`\`jsx
const ref = useRef();
<input ref={ref} defaultValue="" />
// وقت الـ submit: ref.current.value
\`\`\`

أخف وأبسط، بس التحقق الفوري بيبقى أصعب.

النقطة العملية: **React Hook Form بتستخدم الطريقة التانية**، وعشان كده أداءها أحسن في الفورمات الكبيرة — الكتابة مش بتعمل re-render للفورم كله.

وحاجة تستاهل: متبدّلش بين الاتنين على نفس العنصر. لو بدأت بـ \`value={undefined}\` وبعدين بقت string، React بتدي warning عن التحوّل من uncontrolled لـ controlled.`,
      },
      {
        question: 'إيه هو `useRef` وإمتى تستخدمه؟',
        difficulty: 'easy',
        answer: `الـ \`useRef\` بيرجّع object ثابت فيه خاصية \`.current\` بتفضل موجودة بين الـ renders. التغيير فيه **مش بيسبب re-render**.

استخدامين رئيسيين:

1. **الوصول لعناصر الـ DOM** — \`<input ref={inputRef} />\` وبعدين \`inputRef.current.focus()\`
2. **تخزين قيم متغيّرة مش بتأثر على الواجهة** — الـ timer IDs، القيمة السابقة، عدّاد للـ renders

الفرق عن الـ state في جملة: **الـ state بيرندر، الـ ref لأ.**

القاعدة: لو القيمة بتظهر على الشاشة، خليها state. لو محتاجها بس بينك وبين نفسك، خليها ref.

وحاجة جديدة في React 19: الـ **callback ref بقت ترجّع دالة تنظيف**. لو رجّعت واحدة، React بتشغّلها وقت الفصل ومش بتنادي الـ ref بـ \`null\` زي الأول.`,
      },
      {
        question: 'Context API ولا Redux Toolkit؟',
        difficulty: 'medium',
        answer: `الـ **Context مش أداة إدارة state**. هو أداة **حقن** — بيوصّل قيمة لعمق الشجرة من غير prop drilling. مفيهوش لا reducers ولا middleware ولا devtools.

**مشكلة الأداء:** أي كومبوننت بيستهلك الـ context بيعمل re-render لما القيمة تتغيّر، حتى لو الجزء اللي بيستخدمه هو منها متغيّرش. ومفيش selectors.

**استخدم Context لـ:** الثيم، اللغة، المستخدم الحالي — حاجات بتتغيّر نادرًا.

**استخدم Redux Toolkit لـ:** state معقد ومشترك وبيتغيّر كتير، لما تحتاج تتبّع التغييرات، أو middleware، أو devtools بتوريك كل action.

وفيه اختيار تالت الناس بتنساه: **Zustand** أو **Jotai** — بيدوك selectors وأداء أحسن من Context بحجم أصغر بكتير من Redux. ولو الـ state بتاعك أصلًا بيانات سيرفر، **TanStack Query** بيحل المشكلة من جذرها لإن معظم الـ global state في التطبيقات هو كاش لبيانات سيرفر.`,
      },
      {
        question: 'إيه الفرق بين `createRoot` و `ReactDOM.render`؟',
        difficulty: 'medium',
        answer: `\`ReactDOM.render\` هو الـ API القديم (legacy mode). \`createRoot\` هو اللي بيفعّل React 18.

\`\`\`javascript
// قديم
ReactDOM.render(<App />, container);

// جديد
createRoot(container).render(<App />);
\`\`\`

**النقطة المهمة:** تركيب React 18 لوحده **مش كفاية**. لو لسه بتستخدم \`ReactDOM.render\`، التطبيق بيشتغل في legacy mode وبتفقد:

- **الـ automatic batching** — التحديثات جوه الـ promises والـ timeouts مش هتتجمّع
- **الـ concurrent features** — \`useTransition\` و \`useDeferredValue\` و Suspense للبيانات
- **الـ streaming SSR**

يعني الـ automatic batching اللي الناس بتقول عليه "ميزة React 18" هو فعليًا **ميزة الـ root الجديد** مش ميزة النسخة.

و\`ReactDOM.render\` **اتشال خالص في React 19** — مبقاش deprecated، بقى غير موجود.`,
      },
      {
        question: 'إزاي تعمل Protected Routes؟',
        difficulty: 'medium',
        answer: `الفكرة: تتحقق من الجلسة قبل ما تعرض الصفحة، وتحوّل لصفحة الدخول لو مفيش.

**في React عادي (react-router):**

\`\`\`jsx
function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
\`\`\`

الـ \`replace\` مهمة عشان زرار الرجوع ميرجعش للصفحة المحمية.

**في Next.js App Router:** التحقق بيبقى على السيرفر في الـ layout أو الصفحة:

\`\`\`jsx
const session = await getSession();
if (!session) redirect('/login');
\`\`\`

**والنقطة الأمنية اللي لازم تقولها:** لو اعتمدت على الـ middleware لوحده، الإجابة ناقصة. الإرشاد الحالي من Next.js بعد ثغرة \`CVE-2025-29927\` واضح: **الـ middleware للتحويل المتفائل بس**، والتصريح الحقيقي لازم يتعاد في الطبقة اللي بتلمس البيانات فعلًا — الـ Server Component أو الـ Server Action أو الـ Route Handler.

وأي حماية في الـ client هي **تجربة استخدام مش أمان**. الـ API لازم يتحقق بنفسه مهما حصل.`,
      },
    ],
    gotchas: [
      {
        title: 'الـ startTransition مش بتأجّل الحسبة',
        description:
          'الدالة اللي بتبعتها لـ startTransition بتشتغل فورًا وبشكل متزامن. اللي بيبقى قابل للمقاطعة هو الـ render الناتج عن تغيير الـ state مش الكود نفسه. لو الحسبة هي البطء، الـ transition مش هتنفع.',
        example: `startTransition(() => {
  // دي بتشتغل حالًا وبتقفل الـ thread زي ما هي
  const result = heavyFilter(items);
  setResults(result); // ده اللي بقى غير عاجل
});`,
      },
      {
        title: 'الـ StrictMode بتشغّل الـ effects مرتين — في React 18 بس',
        description:
          'React 18 بتحاكي mount ثم unmount ثم mount تاني في وضع التطوير عشان تكشف الـ effects اللي تنظيفها ناقص. React 17 مكنتش بتعمل ده للـ effects. الفرق ده هو السؤال نفسه.',
      },
    ],
  },
  {
    id: 'next-essentials',
    moduleId: 'rapid-fire',
    title: 'أساسيات Next.js والباقي',
    description:
      'استراتيجيات الرندرة، الـ routers، الـ lazy loading، والأسئلة اللي فضلت من القايمة.',
    estimatedTime: '55 دقيقة',
    sections: [
      {
        title: 'ملحوظة عن الإصدارات',
        content: `Next.js بتتغيّر بسرعة، وأكتر حاجة بتوقّع الناس في الانترفيو هي إنهم بيقولوا سلوك اتغيّر من سنة.

أهم اتنين لازم تعرفهم:

- **الـ \`fetch\` بقى uncached بشكل افتراضي من Next 15.** قبل كده كان بيتكاش لوحده. لو قلت العكس، اللي قدامك هيعرف إنك مستخدمتش الفريموورك من مدة.
- **الـ \`cookies()\` و \`headers()\` و \`params\` و \`searchParams\` بقوا async من Next 15**، ولازم \`await\`. والوصول المتزامن **اتشال خالص في Next 16**.`,
      },
    ],
    codeExamples: [
      {
        title: 'lazy loading مع Suspense',
        language: 'jsx',
        code: `// في React عادي
const Chart = lazy(() => import('./Chart'));

<Suspense fallback={<Skeleton />}>
  <Chart />
</Suspense>

// في Next.js الأداة المناسبة هي next/dynamic
const Chart = dynamic(() => import('./Chart'), {
  loading: () => <Skeleton />,
  ssr: false,  // لو الكومبوننت محتاج window
});

// وفي App Router، ملف loading.tsx
// بيتحوّل لـ Suspense boundary تلقائيًا حوالين الصفحة`,
        explanation:
          'الـ React.lazy بيشتغل جوه Client Components بس. في Next الأفضل next/dynamic لإنها بتفهم الـ SSR وبتديك خيار توقفه.',
      },
      {
        title: 'custom hook — الشكل الصح',
        language: 'jsx',
        code: `function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);  // التنظيف بيلغي القديم
  }, [value, delay]);

  return debounced;
}

// الاستخدام:
const query = useDebounce(input, 300);
useEffect(() => { search(query); }, [query]);`,
        explanation:
          'الـ custom hook مجرد function اسمها بيبدأ بـ use وبتنادي hooks تانية. مفيش سحر — الاسم هو اللي بيخلي الـ lint rules تشتغل عليها.',
      },
    ],
    interviewQuestions: [
      {
        question: 'إيه الفرق بين CSR و SSR و SSG و ISR؟',
        difficulty: 'medium',
        answer: `الفرق في **إمتى الـ HTML بيتعمل**:

- **CSR** — المتصفح بيستلم صفحة شبه فاضية وبيبني كل حاجة بالـ JavaScript. أبطأ أول تحميل، وأسوأ للـ SEO.
- **SSR** — السيرفر بيبني الـ HTML **مع كل طلب**. البيانات دايمًا طازة، بس كل زيارة بتكلّف حساب.
- **SSG** — الـ HTML بيتبني **وقت الـ build** مرة واحدة. أسرع حاجة ممكنة، بس المحتوى ثابت لحد الـ build الجاي.
- **ISR** — SSG بس الصفحة بتتجدد في الخلفية كل فترة. بتاخد سرعة الـ static مع محتوى بيتحدّث.

في App Router الاختيار بيتحدد من الـ \`fetch\`:

\`\`\`javascript
fetch(url)                                  // SSR — uncached افتراضيًا من Next 15
fetch(url, { cache: 'force-cache' })        // SSG
fetch(url, { next: { revalidate: 60 } })    // ISR
\`\`\`

**القاعدة العملية:** ابدأ بـ static، وارفع لـ ISR لو المحتوى بيتغيّر، وSSR لو لازم يبقى شخصي أو لحظي، وCSR للحاجات اللي بعد تسجيل الدخول ومحدش محتاج يفهرسها.`,
      },
      {
        question: 'إيه الفرق بين App Router و Pages Router؟',
        difficulty: 'medium',
        answer: `**Pages Router** هو النظام القديم — كل ملف في \`pages/\` بيبقى route، وجلب البيانات بيتم من \`getServerSideProps\` و \`getStaticProps\`، وكل كومبوننت client component.

**App Router** هو الجديد (من Next 13) — مجلد \`app/\` بملفات ليها معنى: \`page.tsx\` و \`layout.tsx\` و \`loading.tsx\` و \`error.tsx\`.

الفروق اللي بتفرّق فعلًا:

1. **Server Components افتراضيًا** — الكومبوننت مبيتبعتش للمتصفح إلا لو كتبت \`'use client'\`. ده بيقلل الـ bundle بشكل حقيقي.
2. **جلب البيانات جوه الكومبوننت** بـ \`async/await\` بدل دوال منفصلة على مستوى الصفحة.
3. **Layouts متداخلة بتحافظ على حالتها** بين التنقلات. الـ Pages Router كان ليه \`_app\` واحد بس.
4. **Streaming و Suspense** — \`loading.tsx\` بيبعت جزء من الصفحة قبل ما البيانات تخلص.

**الاتنين بيشتغلوا مع بعض في نفس المشروع**، فالانتقال ممكن يبقى تدريجي. والـ Pages Router لسه مدعوم مش deprecated، بس المميزات الجديدة كلها بتنزل في App Router.`,
      },
      {
        question: 'إيه الفرق بين `useEffect` و `useLayoutEffect`؟',
        difficulty: 'medium',
        answer: `التوقيت بالنسبة للرسم.

- **\`useEffect\`** بيشتغل **بعد** ما المتصفح يرسم. غير متزامن، مبيأخّرش ظهور الصفحة.
- **\`useLayoutEffect\`** بيشتغل بعد تعديل الـ DOM و**قبل** الرسم. متزامن، بيأخّر الرسم لحد ما يخلص.

**استخدم \`useEffect\` دايمًا** إلا في حالة واحدة: لما **تقيس** الـ DOM وتغيّر على أساس القياس. ساعتها الـ \`useEffect\` بيخلي المستخدم يشوف الحالة القديمة لفريم واحد — رفرفة مرئية.

\`\`\`jsx
useLayoutEffect(() => {
  const { height } = ref.current.getBoundingClientRect();
  setHeight(height);  // من غيرها المستخدم هيشوف القفزة
}, []);
\`\`\`

تحذيرين:

1. **بيقفل الرسم**، فأي شغل تقيل جواه بيبطّء الصفحة فعليًا.
2. **بيدي warning في SSR** لإن مفيش layout على السيرفر أصلًا يتقاس.`,
      },
      {
        question: 'إيه الفرق بين `useMemo` و `useCallback` و `React.memo`؟',
        difficulty: 'medium',
        answer: `- **\`useMemo\`** بيحفظ **قيمة** — نتيجة حسبة تقيلة
- **\`useCallback\`** بيحفظ **function** — نفس الـ reference بين الـ renders
- **\`React.memo\`** بيغلّف **كومبوننت** ويمنع الـ re-render الجاي من الأب

\`useCallback(fn, deps)\` هي حرفيًا \`useMemo(() => fn, deps)\`.

**التلاتة بيشتغلوا مع بعض، وده اللي الناس بتفوّته:**

\`\`\`jsx
const Row = React.memo(RowComponent);

// من غير useCallback، ده بيبوّظ الـ memo:
<Row onClick={() => select(id)} />   // reference جديدة كل render
\`\`\`

الـ \`memo\` بتقارن الـ props مقارنة سطحية، فبتلاقي function مختلفة كل مرة وبترندر برضو. يعني الـ memo بقت تكلفة من غير فايدة.

**ومتستخدمهمش في كل حاجة.** كل واحد منهم بيكلّف ذاكرة ومقارنة. لو الحسبة رخيصة، الـ memo أغلى منها. القاعدة: قيس الأول بالـ Profiler، وبعدين حسّن.

وفي **React Compiler** (وصل 1.0) الكلام ده كله بيتعمل أوتوماتيك، والكتابة اليدوية بتقل.`,
      },
      {
        question: 'إيه هو الـ Custom Hook وإمتى تعمل واحد؟',
        difficulty: 'easy',
        answer: `**function عادية اسمها بيبدأ بـ \`use\` وبتنادي hooks تانية جواها.** مفيش أي سحر — الاسم هو اللي بيخلي الـ ESLint rules تتحقق من قواعد الـ hooks جواها.

الغرض: **مشاركة المنطق مش الواجهة.**

\`\`\`jsx
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
\`\`\`

**النقطة المهمة:** كل كومبوننت بينادي الـ hook بياخد **نسخة مستقلة من الـ state**. مفيش مشاركة بين الكومبوننتات — لو محتاج state مشترك، ده شغل الـ context أو مكتبة state.

اعمل custom hook لما تلاقي نفس المنطق (effect + state + تنظيف) متكرر في أكتر من مكان. ده اللي حل مشكلة الـ HOCs والـ render props اللي كانت بتعمل شجرة عميقة.`,
      },
      {
        question: 'إيه الفرق بين Debouncing و Throttling؟',
        difficulty: 'medium',
        answer: `الاتنين بيقللوا معدل تنفيذ function، بس بمنطق مختلف:

- **Debounce** — استنى لحد ما الحركة **تهدى**، وبعدين نفّذ مرة واحدة. لو الأحداث فضلت جاية، مبينفّذش خالص.
- **Throttle** — نفّذ **مرة كل فترة ثابتة** مهما كان عدد الأحداث.

\`\`\`javascript
// debounce: بيلغي المؤقت القديم كل مرة
function debounce(fn, ms) {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

// throttle: بيتجاهل النداءات لحد ما الفترة تعدي
function throttle(fn, ms) {
  let last = 0;
  return (...a) => {
    if (Date.now() - last >= ms) { last = Date.now(); fn(...a); }
  };
}
\`\`\`

**إمتى تستخدم إيه:**

- **debounce** → البحث أثناء الكتابة، تغيير حجم الشاشة، الحفظ التلقائي. المهم آخر قيمة.
- **throttle** → الـ scroll، حركة الماوس، الـ infinite scroll. المهم تحديث منتظم.

الجملة اللي بتفرّق: **الـ debounce بيهتم بآخر حدث، الـ throttle بيهتم بالمعدل.**`,
      },
      {
        question: 'إيه هي الـ Higher-Order Functions والـ Currying؟',
        difficulty: 'medium',
        answer: `**Higher-order function** = function بتاخد function كـ argument، أو بترجّع function، أو الاتنين.

إنت بتستخدمها كل يوم: \`map\` و \`filter\` و \`reduce\` و \`addEventListener\` و \`setTimeout\` كلهم HOFs.

\`\`\`javascript
const withLog = (fn) => (...args) => {
  console.log('نداء بـ:', args);
  return fn(...args);
};
\`\`\`

**Currying** = تحويل function بتاخد كذا argument لسلسلة functions كل واحدة بتاخد واحد:

\`\`\`javascript
// من f(a, b, c)
const add = (a, b, c) => a + b + c;
// لـ f(a)(b)(c)
const curried = (a) => (b) => (c) => a + b + c;
curried(1)(2)(3); // 6
\`\`\`

**الفايدة العملية: التطبيق الجزئي.** بتثبّت أول argument وتطلّع نسخة متخصصة:

\`\`\`javascript
const multiply = (factor) => (n) => n * factor;
const double = multiply(2);
[1, 2, 3].map(double); // [2, 4, 6]
\`\`\`

الآلية اللي بتخلي ده يشتغل هي **الـ closures** — كل مستوى ماسك الـ argument بتاعه.`,
      },
      {
        question: 'إيه هو الـ Type Coercion؟',
        difficulty: 'medium',
        answer: `تحويل الـ engine للأنواع تلقائيًا لما تقارن أو تجمع حاجات من أنواع مختلفة.

**الضمني (implicit)** — بيحصل لوحده:

\`\`\`javascript
'5' + 3      // '53'  ← الـ + مع string بيعمل concatenation
'5' - 3      // 2     ← الـ - رياضي بس، فبيحوّل لأرقام
[] + {}      // '[object Object]'
1 + true     // 2     ← true بقت 1
\`\`\`

**الصريح (explicit)** — إنت اللي بتعمله: \`Number(x)\` و \`String(x)\` و \`Boolean(x)\`.

**القيم الـ falsy تمانية:** \`false\`، \`0\`، \`-0\`، \`0n\`، \`''\`، \`null\`، \`undefined\`، \`NaN\`. أي حاجة تانية truthy — بما فيها \`[]\` و \`{}\` و \`'0'\` و \`'false'\`.

(وفيه تاسعة غريبة: \`document.all\` falsy، وده سلوك متسايب عمدًا في المواصفات عشان مواقع قديمة.)

**أدوات المقارنة الدقيقة:**

\`\`\`javascript
Number.isNaN(x)   // مبيحوّلش — على عكس isNaN القديمة
Object.is(NaN, NaN)  // true  ← الوحيدة اللي بتمسك دي
Object.is(0, -0)     // false ← والوحيدة اللي بتفرّق دي
\`\`\`

**القاعدة:** استخدم \`===\` وحوّل بإيدك. الـ coercion الضمني مصدر باجات مش ميزة.`,
      },
      {
        question: 'اشرح دورة حياة الرندرة في React',
        difficulty: 'hard',
        answer: `فيه **مرحلتين**:

**1. مرحلة الرندرة (Render)** — React بتنادي الكومبوننتات وتبني شجرة العناصر، وتقارنها بالقديمة (**reconciliation**) عشان تعرف إيه اللي اتغيّر.

المرحلة دي **نقية** — مفيش تأثيرات جانبية، ومفيش لمس للـ DOM. وممكن React **تقاطعها وترميها وتبدأ من تاني**، بس ده بيحصل بس في التحديثات المعلّمة كـ transitions.

**2. مرحلة الالتزام (Commit)** — React بتطبّق التغييرات على الـ DOM الحقيقي. المرحلة دي **متزامنة ومينفعش تتقاطع**.

الترتيب جواها:

1. تعديلات الـ DOM
2. \`useLayoutEffect\` + تحديث الـ refs
3. المتصفح **بيرسم**
4. \`useEffect\`

وعشان كده \`useLayoutEffect\` بيمنع الرفرفة — هو بيشتغل قبل الخطوة 3.

**الـ StrictMode** بتخلي التطوير يحاكي mount ثم unmount ثم mount، فالـ effect بيشتغل وينضّف ويشتغل تاني. الغرض إنها تكشف الـ effects اللي تنظيفها ناقص. **وده سلوك React 18 مع \`createRoot\`** — React 17 مكنتش بتعمله للـ effects.`,
      },
    ],
    gotchas: [
      {
        title: 'الـ ssr: false مينفعش في Server Component',
        description:
          'خيار ssr: false في next/dynamic بيشتغل بس جوه Client Component. لو استخدمته في Server Component هيرمي error، لإن السيرفر مش بيرندر الـ client boundaries بالطريقة دي.',
      },
      {
        title: 'الـ loading.tsx بيغلّف الصفحة كلها',
        description:
          'ملف loading.tsx بيتحوّل لـ Suspense boundary حوالين الـ page بالكامل. لو عايز أجزاء تظهر قبل التانية، حط <Suspense> بإيدك حوالين الأجزاء البطيئة بس.',
      },
    ],
  },
];
