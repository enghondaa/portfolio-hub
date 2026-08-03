import type { TopicContent } from '@/types';

export const arabicContent: TopicContent[] = [
  {
    id: 'react-18-19',
    moduleId: 'react',
    title: 'ميزات وإصدارات React 18/19 الحديثة',
    description: 'الرندرة المتزامنة (Concurrent Rendering)، مكونات الخادم (Server Components)، المترجم التلقائي (React Compiler)، وخطاف use() الجديد.',
    estimatedTime: '45 دقيقة',
    sections: [
      {
        title: 'ميزات الرندرة المتزامنة (Concurrent Features) في React 18',
        content: `مكتبة **React 18** قدمت مفهوم الـ **Concurrent Rendering** (الرندرة المتزامنة) وده معناه ببساطة إن ريأكت مبقاش شغال بطريقة "كل شيء أو لا شيء" بل يقدر يوقف رندرة معينة في النص لو ظهر تحديث أهم (زي كتابة المستخدم في Input).

**الميزات الأساسية:**
- **Automatic Batching:** ريأكت بيجمع كل تغييرات الحالة (setState) مع بعض ويرندر مرة واحدة، حتى لو التغييرات دي جوة كود غير متزامن زي (setTimeout أو Promises).
- **Transitions:** تقدر تعلم على تحديثات معينة إنها مش مستعجلة باستخدام \`startTransition\`.
- **Suspense:** بيعرض واجهة بديلة (زي لودينج) لحد ما البيانات أو الكود يجهز.
- **\`useTransition\`:** عشان تعرف لو فيه تحديث معلق (pending) وتتحكم في شكل الـ UI.
- **\`useDeferredValue\`:** لتأجيل تحديث قيمة معينة لتقليل التهنيج في المكونات البطيئة.

**طريقة التشغيل الجديدة (Root API):**
\`\`\`js
// الطريقة القديمة في React 17
ReactDOM.render(<App />, container);

// الطريقة الجديدة في React 18+ (اللي بتفعل ميزات الـ Concurrent)
const root = ReactDOM.createRoot(container);
root.render(<App />);
\`\`\``
      },
      {
        title: 'مكونات الخادم (React Server Components - RSC)',
        content: `**مكونات الخادم (RSC)** هي مكونات بترندر بالكامل على السيرفر وبتبعت للمتصفح HTML جاهز بدون أي كود جافا سكريبت خاص بالمكون ده.

**المميزات الأساسية:**
- **حجم ملفات أصغر (Zero JS Bundle):** مش بتبعت كود المكون للمتصفح، فالموقع بيحمل أسرع.
- **اتصال مباشر بقاعدة البيانات:** تقدر تكلم الداتابيز أو تقرأ ملفات من السيرفر علطول جوة المكون بدون عمل API.
- **أمان أعلى:** الأكواد الحساسة والـ Tokens مش بتوصل للعميل.

**القيود:**
- متقدرش تستخدم خطافات الحالة (زي \`useState\` أو \`useEffect\`).
- متقدرش تستخدم أحداث المتصفح (زي \`onClick\`).
- متقدرش تستخدم الـ Web APIs (زي \`window\` أو \`document\`).

**حدود المكونات (use client):**
عشان تعمل تفاعل (Interactivity) جوة ريأكت، بتكتب \`'use client'\` في أول الملف، وده بيعرف ريأكت إن المكون ده واللي جواه هما مكونات عميل (Client Components) ينفع تستخدم فيهم الـ hooks والأحداث بشكل طبيعي.`
      },
      {
        title: 'مترجم ريأكت الجديد (React Compiler) في React 19',
        content: `**مترجم ريأكت (React Compiler)** (اللي كان معروف باسم React Forget) هو أداة بتشتغل وقت الـ build وبتعمل ميموزيشن (Memoization) تلقائي للمكونات والقيم.

**ليه ده يهمنا؟**
قبل كده، كنا بنضطر نستخدم \`useMemo\` و \`useCallback\` و \`React.memo\` يدويًا عشان نمنع إعادة رندرة المكونات بشكل غير ضروري. المترجم الجديد بيفهم الكود لوحده وبيقوم بالمهمة دي بدالك!

**النتيجة:** بتكتب كود ريأكت عادي وبسيط، وهو بيهتم بالأداء والتحسين لوحده بدون تعقيد.`
      }
    ],
    codeExamples: [
      {
        title: 'المثال العملي للـ useTransition في الحفاظ على استجابة الـ UI',
        language: 'typescript',
        code: `import { useState, useTransition } from 'react';

const ITEMS = Array.from({ length: 10000 }, (_, i) => \`العنصر رقم \${i}\`);

function FilterList() {
  const [filter, setFilter] = useState('');
  const [filtered, setFiltered] = useState(ITEMS);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // تحديث مستعجل: يظهر للمستخدم الحروف اللي بيكتبها فوراً
    setFilter(value);

    // تحديث غير مستعجل: فلترة 10 آلاف عنصر (ممكن تأجيله ثواني)
    startTransition(() => {
      const result = ITEMS.filter(item =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setFiltered(result);
    });
  };

  return (
    <div className="p-4">
      <input 
        value={filter} 
        onChange={handleChange} 
        placeholder="ابحث هنا..." 
        className="border p-2 rounded w-full"
      />
      {isPending && <span className="text-yellow-500 block mt-2">جاري التحديث...</span>}
      <ul style={{ opacity: isPending ? 0.5 : 1 }} className="mt-4 space-y-1">
        {filtered.slice(0, 10).map(item => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}`,
        explanation: 'الـ startTransition بيخلي ريأكت يفهم إن عملية الفلترة دي مش عاجلة وممكن يوقفها ويرجع لها تاني لو المستخدم كتب حرف جديد بسرعة، وبكده الـ input مش بيهنج أثناء الكتابة.'
      },
      {
        title: 'مكونات الخادم ومكونات العميل (Server vs Client Components)',
        language: 'typescript',
        code: `// app/page.tsx — مكون خادم (الافتراضي في Next.js App Router)
import { db } from '@/lib/database';
import ClientCounter from './ClientCounter'; // استيراد مكون عميل تفاعلي

export default async function Page() {
  // جلب البيانات مباشرة من السيرفر بدون عمل API!
  const posts = await db.post.findMany();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">المدونة</h1>
      {/* تمرير البيانات للمكون التفاعلي */}
      <ClientCounter initialCount={posts.length} />
      <ul className="mt-4">
        {posts.map(post => (
          <li key={post.id} className="py-2 border-b">{post.title}</li>
        ))}
      </ul>
    </main>
  );
}

// app/ClientCounter.tsx — مكون عميل تفاعلي
'use client'; // هذا السطر يحدد حدود الـ Client Component

import { useState } from 'react'; // الخطافات تعمل هنا فقط

export default function ClientCounter({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount);
  return (
    <button 
      onClick={() => setCount(c => c + 1)}
      className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
    >
      عدد المقالات: {count} (اضغط لزيادة العداد)
    </button>
  );
}`,
        explanation: 'مكونات الخادم تجلب البيانات مباشرة. مكونات العميل تضيف التفاعل. أفضل نمط هو جلب البيانات في السيرفر وتمريرها للعميل كـ props.'
      }
    ],
    interviewQuestions: [
      {
        question: 'ليه الـ useEffect بيشتغل مرتين مع إني حاطط dependency array فاضية في React 18؟',
        answer: `سؤال بيتكرر كتير جداً وأغلب الناس أول ما بتشوفه بتفتكر إن فيه bug في الكود بتاعها!

اللي بيحصل ببساطة إن **React 18** في الـ **development mode** وجوة **StrictMode** بيعمل mount للكومبوننت، وبعدين unmount، وبعدين mount تاني!

**ليه ريأكت بيعمل الحركة الغريبة دي؟**
ريأكت بيعمل كده عشان يكشفلك لو الـ effect بتاعك ناسي الـ **cleanup function** أو بيسبب تسريب للذاكرة (Memory Leak).

**مثال للتوضيح:**
لو بتعمل تايمر (\`setInterval\`) أو اشتراك (\`subscription\`) أو بتجيب بيانات (\`fetch\`)، ريأكت بيتأكد إنك لما تمسح المكون، هتنظف الحاجات دي عشان متفضلش شغالة في الخلفية.

**كيفية الحل الصحيح:**
الحل مش إنك تشيل الـ StrictMode (لأنه مفيد جداً في كشف الأخطاء)، بل الحل الصحيح هو إنك ترجع دايماً دالة تنظيف (cleanup function) من الـ effect بتاعك:

\`\`\`js
useEffect(() => {
  const timer = setInterval(() => {
    console.log("شغال!");
  }, 1000);

  // دالة التنظيف (Cleanup Function)
  return () => {
    clearInterval(timer); // بتمسح التايمر لما المكون يختفي
  };
}, []);
\`\`\`

**ملاحظة هامة:**
في الـ **production mode** ده مش بيحصل أصلاً! المكون بيرندر مرة واحدة عادي جداً. الخلاصة: لو الـ useEffect بتاعك بيبوظ لما يتنده مرتين، دي علامة واضحة إن المشكلة في الكود بتاعك مش في ريأكت!`,
        difficulty: 'medium'
      },
      {
        question: 'ما هي مكونات الخادم (RSC) ومتى يجب استخدامها؟',
        answer: `مكونات الخادم (React Server Components) هي مكونات يتم تشغيلها بالكامل على السيرفر فقط ولا يتم إرسال كود الجافا سكريبت الخاص بها للمتصفح.

**متى تستخدم مكونات الخادم (RSC):**
- عند جلب البيانات من قواعد البيانات أو الـ APIs الخارجية (مباشرة دون كتابة طبقة API إضافية).
- عند الوصول إلى موارد السيرفر الحساسة (زي الملفات أو متغيرات البيئة السرية).
- لتقليل حجم كود الجافا سكريبت المرسل للمتصفح (Bundle Size).
- لزيادة سرعة التحميل الأولي للموقع.

**متى تتجنبها وتستخدم مكونات العميل (Client Components):**
- عندما تحتاج إلى تفاعل فوري مع المستخدم (زي الأحداث \`onClick\` أو كتابة البيانات في الفورم).
- عندما تحتاج إلى استخدام خطافات الحالة والمزامنة (\`useState\`, \`useEffect\`, \`useReducer\`).
- للتعامل مع الـ Web APIs الخاصة بالمتصفح (زي \`window\`, \`document\`, \`localStorage\`).`,
        difficulty: 'hard'
      }
    ],
    gotchas: [
      {
        title: 'تهنيج المتصفح مع StrictMode في التطوير',
        description: 'في بيئة التطوير، يتم تشغيل كل تأثير (Effect) مرتين متتاليتين. إذا لم تكن هناك دالة تنظيف (cleanup) لإلغاء طلبات الشبكة أو التايمر، فقد يؤدي ذلك إلى تكرار غير متوقع في جلب البيانات أو تهنيج الصفحة.',
        example: `useEffect(() => {
  // بدون تنظيف: هذا الحدث سيضاف مرتين في بيئة التطوير!
  window.addEventListener('resize', handleResize);
  
  // الحل الصحيح هو إضافة Cleanup:
  return () => window.removeEventListener('resize', handleResize);
}, []);`
      }
    ]
  },
  {
    id: 'execution-context',
    moduleId: 'javascript',
    title: 'سياق التنفيذ والرفع (Execution Context & Hoisting)',
    description: 'فهم كيف تهيئ جافا سكريبت البيئة المناسبة قبل البدء في تشغيل الكود الخاص بك.',
    estimatedTime: '45 دقيقة',
    sections: [
      {
        title: 'ما هو سياق التنفيذ (Execution Context)؟',
        content: `**سياق التنفيذ (Execution Context)** هو البيئة أو "الغلاف" اللي جافا سكريبت بتجهزه عشان تشغل الكود جواه. تقدر تتخيله كصندوق بيحتوي على المتغيرات والدوال المتاحة للكود الحالي.

جافا سكريبت فيها 3 أنواع من سياقات التنفيذ:
1. **Global Execution Context (GEC):** ده السياق الرئيسي اللي بيتعمل أول ما الملف يشتغل. بيكون فيه كائن الـ \`window\` (في المتصفح) أو \`global\` (في Node.js) وبتكون قيمة الكلمة المفتاحية \`this\` بتشير للكائن ده.
2. **Function Execution Context (FEC):** سياق خاص بيتعمل في كل مرة بيتم فيها استدعاء (نداء) دالة جديدة. كل استدعاء لدالة بيعمل سياق تنفيذ جديد وخاص بيها.
3. **Eval Execution Context:** سياق بيتعمل لو الكود اتنفذ جوة دالة \`eval()\` (وده نادر الاستخدام ومكروه لأسباب أمنية).

**مكدس الاستدعاء (Call Stack):**
هو المكان اللي بيترتب فيه سياقات التنفيذ. أول ما الكود يبدأ، الـ GEC بيدخل في الـ stack. لما دالة تتنده، الـ FEC بتاعها بيتحط فوق الـ stack. ولما تخلص تنفيذ وتخرج (Return)، الـ FEC بتاعها بيتشال من الـ stack.`
      },
      {
        title: 'مرحلة الإنشاء مقابل مرحلة التنفيذ (Creation vs Execution)',
        content: `سياق التنفيذ بيمر بمرحلتين أساسيتين:

**1. مرحلة الإنشاء (Creation Phase):**
في المرحلة دي، محرك جافا سكريبت بيمسح الكود ضوئياً قبل ما يشغله وبيعمل الآتي:
- بينشئ كائن المتغيرات (\`Variable Object\`).
- بيحضر سلسلة النطاقات (\`Scope Chain\`).
- بيحدد قيمة \`this\`.
- بيعمل عملية **الرفع (Hoisting)**:
  - المتغيرات المعرفة بـ \`var\` بيحجز مكانها ويديها قيمة مبدئية \`undefined\`.
  - الدوال المعرفة بطريقة الإعلان (Function Declarations) بيحجز مكانها ويرفع كودها بالكامل.
  - المتغيرات المعرفة بـ \`let\` و \`const\` بتترفع بس مش بتاخد قيمة مبدئية وبتفضل غير مقروءة (منطقة الموت المؤقت - TDZ).

**2. مرحلة التنفيذ (Execution Phase):**
في المرحلة دي الكود بيبدأ يشتغل سطر بسطر. بيتم تعيين القيم الحقيقية للمتغيرات وتنفيذ الدوال.`
      },
      {
        title: 'الرفع: الفرق بين var و let و const',
        content: `**الرفع مع var:**
لو عرفت متغير بـ \`var\` وحاولت تقراه قبل السطر اللي متعرف فيه، مش هيطلعلك خطأ، هيطلعلك \`undefined\` لأن المتغير بيترفع للقمة وبياخد قيمة \`undefined\` تلقائياً في مرحلة الإنشاء.

**الرفع مع let و const:**
المتغيرات دي بتترفع برضه، بس مش بتاخد أي قيمة مبدئية. لو حاولت تقراها قبل ما يتم تعريفها، هيطلعلك خطأ \`ReferenceError\`. الفترة دي (من بداية النطاق لحد سطر التعريف) بنسميها **منطقة الموت المؤقت (Temporal Dead Zone - TDZ)**.

**الرفع مع الدوال (Functions):**
- **Function Declarations:** بتترفع بالكامل (الاسم والبدن)، يعني تقدر تنده الدالة قبل سطر كتابتها وتشتغل معاك عادي.
- **Function Expressions:** بتتعامل معاملة المتغيرات العادية (\`var\` أو \`let\` أو \`const\`) يعني متقدرش تندهها قبل سطر تعريفها.`
      }
    ],
    codeExamples: [
      {
        title: 'فخ الرفع الشهير مع var',
        language: 'javascript',
        code: `console.log(name); // undefined (مش خطأ!)
var name = "أحمد";
console.log(name); // "أحمد"

// اللي محرك جافا سكريبت بيشوفه فعلياً بعد الرفع:
var name; // بيترفع فوق وبياخد قيمة مبدئية undefined
console.log(name); // undefined
name = "أحمد"; // التعيين بيفضل في مكانه الأصلي
console.log(name); // "أحمد"`,
        explanation: 'المتغيرات المعرفة بـ var بيتم حجز مكانها وتلقينها قيمة undefined قبل البدء الفعلي لتشغيل الكود.'
      },
      {
        title: 'منطقة الموت المؤقت (TDZ) مع let و const',
        language: 'javascript',
        code: `// ReferenceError: Cannot access 'age' before initialization
console.log(age); 
let age = 25; // السطر ده هو نهاية منطقة الموت المؤقت لـ age

{
  // نطاق بلوك جديد
  // console.log(score); // خطأ ReferenceError! الـ TDZ بتبدأ هنا
  let score = 100; // الـ TDZ بتنتهي هنا
  console.log(score); // 100
}`,
        explanation: 'المتغيرات المعرفة بـ let و const تقع في الـ TDZ ولا يمكن الوصول إليها قبل سطر التصريح عنها.'
      }
    ],
    interviewQuestions: [
      {
        question: 'ما هي منطقة الموت المؤقت (Temporal Dead Zone) في جافا سكريبت؟',
        answer: `منطقة الموت المؤقت (TDZ) هي الفترة الزمنية والمساحة البرمجية التي تقع بين بداية النطاق (Block Scope) وبين السطر الذي يتم فيه الإعلان عن المتغير وتهيئته باستخدام \`let\` أو \`const\`.

خلال هذه المنطقة، يكون المتغير قد تم حجز مكان له بالفعل بواسطة المحرك (تم رفعه)، ولكن لا يسمح للكود بقراءته أو الكتابة فيه. محاولة قراءة المتغير هنا تؤدي فوراً إلى خطأ \`ReferenceError\`.

الهدف من الـ TDZ هو حمايتنا كمطورين من استخدام المتغيرات قبل تهيئتها بالقيم الصحيحة، وتفادي السلوك الصامت والمربك للمتغير المعرف بـ \`var\` الذي يعطي \`undefined\`.`,
        difficulty: 'medium'
      }
    ]
  }
];
