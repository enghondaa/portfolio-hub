'use client';
import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Shuffle, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { ALL_INTERVIEW_QUESTIONS } from '@/lib/content';
import { MODULES } from '@/lib/modules';
import Timer from '@/components/ui/Timer';
import { Dropdown } from '@/components/ui/Dropdown';
import { renderMarkdown } from '@/lib/markdown';
import { useProgressStore } from '@/lib/store';
import { UI_TRANSLATIONS, MODULE_TRANSLATIONS, TOPIC_TRANSLATIONS } from '@/lib/translations';

const MODULE_LABELS: Record<string, string> = Object.fromEntries(
  MODULES.map((m) => [m.id, m.title])
);

/**
 * Pick a random element, avoiding `exclude` where possible.
 *
 * Callers must pass a non-empty array. Every call site already guarantees that
 * (the question pool falls back to the full list when a filter empties it), so
 * the throw is unreachable rather than defensive — it exists because the
 * shared tsconfig enables noUncheckedIndexedAccess, which correctly treats
 * arr[0] as possibly undefined, and swallowing that with a fallback value
 * would hide a genuinely broken content file instead of reporting it.
 *
 * The retry is also bounded now. The original loop spun until it drew
 * something other than `exclude`, which never terminates if every element in
 * the array equals it.
 */
function pickRandom<T>(arr: T[], exclude?: T): T {
  const first = arr[0];
  if (first === undefined) {
    throw new Error('pickRandom was called with an empty array');
  }
  if (arr.length === 1) return first;

  for (let attempt = 0; attempt < 20; attempt++) {
    const candidate = arr[Math.floor(Math.random() * arr.length)];
    if (candidate !== undefined && candidate !== exclude) return candidate;
  }
  return first;
}

export default function MockInterviewPage() {
  const { language } = useProgressStore();
  const lang = language || 'en';
  const t = UI_TRANSLATIONS[lang];
  const modTrans = lang === 'ar' ? MODULE_TRANSLATIONS.ar : null;

  const [current, setCurrent] = useState(() => pickRandom(ALL_INTERVIEW_QUESTIONS));
  const [revealed, setRevealed] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [sessionCount, setSessionCount] = useState(1);
  const [filterModule, setFilterModule] = useState<string>('all');

  const filteredQuestions =
    filterModule === 'all'
      ? ALL_INTERVIEW_QUESTIONS
      : ALL_INTERVIEW_QUESTIONS.filter((q) => q.moduleId === filterModule);

  const nextQuestion = useCallback(() => {
    const pool = filteredQuestions.length > 0 ? filteredQuestions : ALL_INTERVIEW_QUESTIONS;
    setCurrent((prev) => pickRandom(pool, prev));
    setRevealed(false);
    setTimerKey((k) => k + 1);
    setSessionCount((c) => c + 1);
  }, [filteredQuestions]);

  const difficultyColorMap: Record<string, string> = {
    easy: 'text-[var(--color-success)] bg-[var(--color-success)]/10 border-[var(--color-success)]/30',
    medium: 'text-[var(--color-warning)] bg-[var(--color-warning)]/10 border-[var(--color-warning)]/30',
    hard: 'text-[var(--color-danger)] bg-[var(--color-danger)]/10 border-[var(--color-danger)]/30',
  };
  const difficultyColor = current.difficulty
    ? (difficultyColorMap[current.difficulty] ?? 'text-[var(--color-neutral-600)] bg-[var(--color-neutral-100)] border-[var(--color-neutral-200)]')
    : 'text-[var(--color-neutral-600)] bg-[var(--color-neutral-100)] border-[var(--color-neutral-200)]';

  const localizedModuleLabel = (moduleId: string) => {
    return modTrans?.[moduleId as keyof typeof modTrans] || MODULE_LABELS[moduleId] || moduleId;
  };

  const currentTopicTitle = current.topicId && lang === 'ar' && current.topicId in TOPIC_TRANSLATIONS.ar
    ? TOPIC_TRANSLATIONS.ar[current.topicId as keyof typeof TOPIC_TRANSLATIONS.ar]
    : current.topicTitle;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8 text-left">
        <div className="text-sm text-[var(--color-neutral-400)] mb-2">
          <Link href="/" className="hover:text-[var(--color-neutral-700)]">{t.dashboard}</Link>
          {' / '}
          <span className="text-[var(--color-neutral-700)]">{t.mockInterview}</span>
        </div>
        <h1 className="text-3xl font-bold text-[var(--color-neutral-950)] mb-2">{t.mockInterview}</h1>
        <p className="text-[var(--color-neutral-600)]">{t.mockInterviewSubtitle}</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* A native <select> renders its option list through the operating
            system, so on this dark surface the popup came out white with a
            cramped arrow and no way to theme it. Same reason the Task Board
            has its own listbox. */}
        <div className="w-72">
          <Dropdown
            label={t.allModulesCount.replace('{count}', String(ALL_INTERVIEW_QUESTIONS.length))}
            value={filterModule}
            onChange={setFilterModule}
            options={[
              {
                value: 'all',
                label: t.allModulesCount.replace('{count}', String(ALL_INTERVIEW_QUESTIONS.length)),
              },
              ...MODULES.map((m) => {
                const count = ALL_INTERVIEW_QUESTIONS.filter((q) => q.moduleId === m.id).length;
                const title = modTrans?.[m.id as keyof typeof modTrans] || m.title;
                return { value: m.id, label: `${title} (${count})` };
              }),
            ]}
          />
        </div>
        <span className="text-xs text-[var(--color-neutral-400)]">
          {t.questionHash.replace('{count}', String(sessionCount))}
        </span>
      </div>

      {/* Timer */}
      <div className="mb-6">
        <Timer key={timerKey} durationSeconds={180} onExpire={() => setRevealed(true)} />
      </div>

      {/* Question card */}
      <div className="p-6 bg-[var(--color-neutral-50)] border border-[var(--color-neutral-200)] rounded-xl mb-4 text-left">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${difficultyColor}`}>
              {current.difficulty}
            </span>
            <span className="text-xs text-[var(--color-neutral-400)] px-2 py-0.5 bg-[var(--color-neutral-100)] rounded-full">
              {localizedModuleLabel(current.moduleId)}
            </span>
            {currentTopicTitle && (
              <span className="text-xs text-[var(--color-neutral-400)]">— {currentTopicTitle}</span>
            )}
          </div>
          <Link
            href={`/modules/${current.moduleId}/${current.topicId}#interview-questions`}
            className="shrink-0 text-xs text-[var(--color-neutral-400)] hover:text-[var(--color-neutral-700)] flex items-center gap-1"
          >
            <ExternalLink size={12} />
            {t.viewTopic}
          </Link>
        </div>

        <p className="text-lg text-[var(--color-neutral-950)] leading-relaxed">{current.question}</p>
      </div>

      {/* Answer reveal */}
      <div className="mb-6 text-left">
        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            className="w-full py-3 bg-[var(--color-accent-soft)] border border-[var(--color-accent)]/40 text-[var(--color-accent-light)] rounded-xl hover:bg-[var(--color-accent-soft)] transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <ChevronDown size={16} />
            {t.revealAnswer}
          </button>
        ) : (
          <div className="p-5 bg-[var(--color-neutral-50)] border border-[var(--color-neutral-200)] rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-[var(--color-neutral-600)] flex items-center gap-1">
                <ChevronUp size={14} />
                {t.answer}
              </span>
            </div>
            <div
              className="leading-relaxed"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(current.answer) }}
            />
          </div>
        )}
      </div>

      {/* Next button */}
      <button
        onClick={nextQuestion}
        className="w-full py-3 bg-[var(--color-neutral-100)] hover:bg-[var(--color-neutral-100)] text-[var(--color-neutral-950)] rounded-xl transition-colors flex items-center justify-center gap-2 font-medium"
      >
        <Shuffle size={16} />
        {t.nextQuestion}
      </button>
    </div>
  );
}
