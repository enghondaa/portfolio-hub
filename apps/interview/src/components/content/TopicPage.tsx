'use client';
import { useEffect } from 'react';
import { renderMarkdown } from '@/lib/markdown';

import Link from 'next/link';
import { Clock, CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';
import { useProgressStore } from '@/lib/store';
import CodeBlock from '@/components/ui/CodeBlock';
import InterviewQuestionCard from '@/components/ui/InterviewQuestion';
import ConfidenceRating from '@/components/ui/ConfidenceRating';
import type { TopicContent, TopicMeta } from '@/types';
import { getTopicContent, hasArabicContent } from '@/lib/content';
import { UI_TRANSLATIONS, TOPIC_TRANSLATIONS } from '@/lib/translations';

interface TopicPageProps {
  topic: TopicContent;
  prevTopic?: TopicMeta;
  nextTopic?: TopicMeta;
}

export default function TopicPage({ topic, prevTopic, nextTopic }: TopicPageProps) {
  const { completedTopics, toggleTopicComplete, studyMode, markStudied, language } = useProgressStore();
  const activeTopic = getTopicContent(topic.moduleId, topic.id, language) || topic;

  // Arabic falls back to English per-topic. Saying so beats leaving the reader
  // to wonder whether the language toggle is broken.
  const showingEnglishFallback = language === 'ar' && !hasArabicContent(topic.moduleId, topic.id);
  const topicKey = `${activeTopic.moduleId}/${activeTopic.id}`;
  const isDone = completedTopics[topicKey];

  useEffect(() => {
    markStudied(topicKey);
  }, [topicKey, markStudied]);

  const t = UI_TRANSLATIONS[language || 'en'];

  const prevTitle = prevTopic ? (language === 'ar' && prevTopic.id in TOPIC_TRANSLATIONS.ar
    ? TOPIC_TRANSLATIONS.ar[prevTopic.id as keyof typeof TOPIC_TRANSLATIONS.ar]
    : prevTopic.title) : '';
  const nextTitle = nextTopic ? (language === 'ar' && nextTopic.id in TOPIC_TRANSLATIONS.ar
    ? TOPIC_TRANSLATIONS.ar[nextTopic.id as keyof typeof TOPIC_TRANSLATIONS.ar]
    : nextTopic.title) : '';

  return (
    <article className="max-w-4xl mx-auto px-4 py-8 print:px-0">
      {showingEnglishFallback && (
        <div className="mb-6 rounded-xl border border-[var(--color-warning)]/30 bg-[var(--color-warning)]/10 px-4 py-3 text-sm text-[var(--color-neutral-700)]">
          الموضوع ده لسه متترجمش. المحتوى تحت بالإنجليزي.
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="flex items-center gap-1.5 text-sm text-[var(--color-neutral-400)]">
            <Clock size={14} />
            {activeTopic.estimatedTime}
          </span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-bold text-[var(--color-neutral-950)] leading-tight">{activeTopic.title}</h1>
          <button
            onClick={() => toggleTopicComplete(topicKey)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isDone
                ? 'bg-[var(--color-success)]/20 text-[var(--color-success)] hover:bg-[var(--color-success)]/30'
                : 'bg-[var(--color-neutral-100)] text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-950)] hover:bg-[var(--color-neutral-100)]'
            }`}
          >
            <CheckCircle2 size={16} className={isDone ? 'fill-[var(--color-success)]' : ''} />
            {isDone ? t.completed : t.markComplete}
          </button>
        </div>
        <p className="mt-2 text-[var(--color-neutral-600)] text-lg">{activeTopic.description}</p>
      </div>

      {/* Sections */}
      {activeTopic.sections.map((section, i) => (
        <section key={i} className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--color-neutral-950)] mb-3 pb-2 border-b border-[var(--color-neutral-200)]">
            {section.title}
          </h2>
          <div
            className="prose prose-invert prose-slate max-w-none
              prose-p:text-[var(--color-neutral-700)] prose-p:leading-relaxed
              prose-h3:text-white prose-h4:text-[var(--color-neutral-800)]
              prose-code:text-[var(--color-accent-light)] prose-code:bg-[var(--color-neutral-50)] prose-code:px-1 prose-code:rounded prose-code:text-sm
              prose-pre:bg-[var(--color-neutral-0)] prose-pre:border prose-pre:border-[var(--color-neutral-200)]
              prose-strong:text-[var(--color-neutral-950)]
              prose-li:text-[var(--color-neutral-700)]
              prose-table:text-[var(--color-neutral-700)]
              prose-th:text-[var(--color-neutral-950)] prose-th:border-[var(--color-neutral-200)]
              prose-td:border-[var(--color-neutral-200)]
            "
            dangerouslySetInnerHTML={{ __html: renderMarkdown(section.content) }}
          />
        </section>
      ))}

      {/* Code Examples */}
      {activeTopic.codeExamples.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--color-neutral-950)] mb-4 pb-2 border-b border-[var(--color-neutral-200)]">
            {language === 'ar' ? 'أمثلة برمجية توضيحية' : 'Code Examples'}
          </h2>
          {activeTopic.codeExamples.map((example, i) => (
            <CodeBlock
              key={i}
              code={example.code}
              language={example.language}
              title={example.title}
              explanation={example.explanation}
              studyMode={studyMode}
            />
          ))}
        </section>
      )}

      {/* Gotchas */}
      {activeTopic.gotchas && activeTopic.gotchas.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--color-neutral-950)] mb-4 pb-2 border-b border-[var(--color-neutral-200)]">
            {t.gotchasHeading}
          </h2>
          <div className="space-y-3">
            {activeTopic.gotchas.map((gotcha, i) => (
              <div key={i} className="border border-[var(--color-warning)]/30 bg-[var(--color-warning)]/5 rounded-lg p-4">
                <h3 className="font-semibold text-[var(--color-warning)] mb-1">{gotcha.title}</h3>
                <p className="text-[var(--color-neutral-700)] text-sm">{gotcha.description}</p>
                {gotcha.example && (
                  <CodeBlock code={gotcha.example} language="javascript" />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Interview Questions */}
      {activeTopic.interviewQuestions.length > 0 && (
        <section id="interview-questions" className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--color-neutral-950)] mb-4 pb-2 border-b border-[var(--color-neutral-200)]">
            {t.questionsHeading}
          </h2>
          {activeTopic.interviewQuestions.map((q, i) => (
            <InterviewQuestionCard
              key={i}
              question={q}
              studyMode={studyMode}
              index={i}
            />
          ))}
        </section>
      )}

      {/* Confidence Rating */}
      <section className="mb-8 p-4 bg-[var(--color-neutral-50)] rounded-lg border border-[var(--color-neutral-200)]">
        <ConfidenceRating topicKey={topicKey} />
      </section>

      {/* Navigation */}
      <nav className="flex justify-between items-center pt-6 border-t border-[var(--color-neutral-200)] print:hidden">
        {prevTopic ? (
          <Link
            href={`/modules/${prevTopic.moduleId}/${prevTopic.id}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-neutral-50)] text-[var(--color-neutral-700)] hover:text-[var(--color-neutral-950)] hover:bg-[var(--color-neutral-100)] transition-colors text-sm"
          >
            {language === 'ar' ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
            <span className="max-w-32 truncate">{prevTitle}</span>
          </Link>
        ) : (
          <div />
        )}
        {nextTopic ? (
          <Link
            href={`/modules/${nextTopic.moduleId}/${nextTopic.id}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-neutral-50)] text-[var(--color-neutral-700)] hover:text-[var(--color-neutral-950)] hover:bg-[var(--color-neutral-100)] transition-colors text-sm"
          >
            <span className="max-w-32 truncate">{nextTitle}</span>
            {language === 'ar' ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </article>
  );
}
