'use client';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { InterviewQuestion } from '@/types';

interface InterviewQuestionProps {
  question: InterviewQuestion;
  studyMode?: boolean;
  index?: number;
}

function inlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="text-[var(--color-accent-light)] bg-[var(--color-neutral-50)] px-1 rounded text-xs">$1</code>');
}

function renderMarkdown(text: string): string {
  const lines = text.split('\n');
  const html: string[] = [];
  let inList = false;
  let inCode = false;
  let codeLang = '';
  const codeLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    // Indexed access is possibly-undefined under noUncheckedIndexedAccess even
    // though i is bounded by lines.length; an empty string parses identically.
    const line = lines[i] ?? '';

    // Fenced code block start
    if (!inCode && line.startsWith('```')) {
      if (inList) { html.push('</ul>'); inList = false; }
      inCode = true;
      codeLang = line.slice(3).trim();
      codeLines.length = 0;
      continue;
    }

    // Fenced code block end
    if (inCode && line.startsWith('```')) {
      inCode = false;
      const escaped = codeLines.join('\n')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      html.push(`<pre class="bg-[var(--color-neutral-50)] rounded p-3 my-2 overflow-x-auto text-xs text-[var(--color-neutral-800)] leading-relaxed"><code>${escaped}</code></pre>`);
      continue;
    }

    if (inCode) { codeLines.push(line); continue; }

    // Bullet list item
    if (line.match(/^- /)) {
      if (!inList) { html.push('<ul class="list-disc pl-5 my-2 space-y-1">'); inList = true; }
      html.push(`<li class="text-[var(--color-neutral-700)]">${inlineMarkdown(line.slice(2))}</li>`);
      continue;
    }

    // Close list before non-list line
    if (inList) { html.push('</ul>'); inList = false; }

    // Blank line
    if (line.trim() === '') continue;

    // Normal paragraph line
    html.push(`<p class="text-[var(--color-neutral-700)] leading-relaxed mb-1">${inlineMarkdown(line)}</p>`);
  }

  if (inList) html.push('</ul>');
  return html.join('');
}

const difficultyColors = {
  easy: 'bg-[var(--color-success)]/20 text-[var(--color-success)] border-[var(--color-success)]/30',
  medium: 'bg-[var(--color-warning)]/20 text-[var(--color-warning)] border-[var(--color-warning)]/30',
  hard: 'bg-[var(--color-danger)]/20 text-[var(--color-danger)] border-[var(--color-danger)]/30',
};

export default function InterviewQuestionCard({
  question,
  studyMode = false,
  index,
}: InterviewQuestionProps) {
  const [showAnswer, setShowAnswer] = useState(!studyMode);

  return (
    <div className="border border-[var(--color-neutral-200)] rounded-lg overflow-hidden my-3">
      <div className="px-4 py-3 bg-[var(--color-neutral-50)] flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          {index !== undefined && (
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-accent)] text-[var(--color-neutral-950)] text-xs font-bold flex items-center justify-center mt-0.5">
              {index + 1}
            </span>
          )}
          <p className="text-[var(--color-neutral-800)] font-medium leading-relaxed whitespace-pre-line">
            {question.question}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {question.difficulty && (
            <span
              className={`text-xs px-2 py-0.5 rounded border font-medium ${
                difficultyColors[question.difficulty]
              }`}
            >
              {question.difficulty}
            </span>
          )}
          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className="flex items-center gap-1 px-3 py-1 rounded text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-light)] hover:bg-[var(--color-accent-soft)] transition-colors"
          >
            {showAnswer ? (
              <>
                Hide <ChevronUp size={14} />
              </>
            ) : (
              <>
                Answer <ChevronDown size={14} />
              </>
            )}
          </button>
        </div>
      </div>
      {showAnswer && (
        <div className="px-4 py-4 bg-[var(--color-neutral-50)] border-t border-[var(--color-neutral-200)]">
          <div
            className="prose prose-invert prose-sm max-w-none
              prose-p:text-[var(--color-neutral-700)] prose-p:leading-relaxed prose-p:my-1
              prose-strong:text-[var(--color-neutral-950)]
              prose-code:text-[var(--color-accent-light)] prose-code:bg-[var(--color-neutral-50)] prose-code:px-1 prose-code:rounded
              prose-li:text-[var(--color-neutral-700)]
            "
            dangerouslySetInnerHTML={{ __html: renderMarkdown(question.answer) }}
          />
        </div>
      )}
    </div>
  );
}
