'use client';
import { useEffect } from 'react';

function inlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="text-[var(--color-accent-light)] bg-[var(--color-neutral-50)] px-1 rounded text-sm">$1</code>');
}

function renderMarkdown(text: string): string {
  const lines = text.split('\n');
  const html: string[] = [];
  let inList = false;
  let inCode = false;
  const codeLines: string[] = [];

  for (const line of lines) {
    if (!inCode && line.startsWith('```')) {
      if (inList) { html.push('</ul>'); inList = false; }
      inCode = true;
      codeLines.length = 0;
      continue;
    }
    if (inCode && line.startsWith('```')) {
      inCode = false;
      const escaped = codeLines.join('\n').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      html.push(`<pre class="bg-[var(--color-neutral-0)] border border-[var(--color-neutral-200)] rounded p-3 my-2 overflow-x-auto text-sm text-[var(--color-neutral-800)] leading-relaxed"><code>${escaped}</code></pre>`);
      continue;
    }
    if (inCode) { codeLines.push(line); continue; }

    // Table row
    if (line.startsWith('|')) {
      if (inList) { html.push('</ul>'); inList = false; }
      if (line.match(/^\|[-| ]+\|$/)) continue; // separator row
      const cells = line.split('|').filter(c => c.trim());
      html.push(`<tr>${cells.map(c => `<td class="px-3 py-2 border border-[var(--color-neutral-200)] text-[var(--color-neutral-700)]">${inlineMarkdown(c.trim())}</td>`).join('')}</tr>`);
      continue;
    }

    // Bullet
    if (line.match(/^- /)) {
      if (!inList) { html.push('<ul class="list-disc pl-5 my-2 space-y-1">'); inList = true; }
      html.push(`<li class="text-[var(--color-neutral-700)]">${inlineMarkdown(line.slice(2))}</li>`);
      continue;
    }

    if (inList) { html.push('</ul>'); inList = false; }
    if (line.trim() === '') continue;
    html.push(`<p class="text-[var(--color-neutral-700)] leading-relaxed mb-2">${inlineMarkdown(line)}</p>`);
  }

  if (inList) html.push('</ul>');
  return html.join('');
}
import Link from 'next/link';
import { Clock, CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';
import { useProgressStore } from '@/lib/store';
import CodeBlock from '@/components/ui/CodeBlock';
import InterviewQuestionCard from '@/components/ui/InterviewQuestion';
import ConfidenceRating from '@/components/ui/ConfidenceRating';
import type { TopicContent, TopicMeta } from '@/types';
import { getTopicContent } from '@/lib/content';
import { UI_TRANSLATIONS, TOPIC_TRANSLATIONS } from '@/lib/translations';

interface TopicPageProps {
  topic: TopicContent;
  prevTopic?: TopicMeta;
  nextTopic?: TopicMeta;
}

export default function TopicPage({ topic, prevTopic, nextTopic }: TopicPageProps) {
  const { completedTopics, toggleTopicComplete, studyMode, markStudied, language } = useProgressStore();
  const activeTopic = getTopicContent(topic.moduleId, topic.id, language) || topic;
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
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="flex items-center gap-1.5 text-sm text-[var(--color-neutral-400)]">
            <Clock size={14} />
            {language === 'ar' ? activeTopic.estimatedTime : activeTopic.estimatedTime}
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
