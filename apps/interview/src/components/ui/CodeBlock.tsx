'use client';
import { useState, useMemo, useSyncExternalStore } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import { Copy, Check } from 'lucide-react';


import { useProgressStore } from '@/lib/store';
import { UI_TRANSLATIONS } from '@/lib/translations';
import { Play, Code, RotateCcw } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  explanation?: string;
  studyMode?: boolean;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export default function CodeBlock({
  code,
  language = 'javascript',
  title,
  explanation,
  studyMode = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [showExplanation, setShowExplanation] = useState(!studyMode);
  // A mount flag without the setState-in-effect the lint rule rejects.
  // The server snapshot is false and the client snapshot is true, so the first
  // client render matches the server exactly and React swaps to the highlighted
  // markup on the following pass. Nothing to subscribe to, hence the no-op.
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  // Runner States
  const [isEditing, setIsEditing] = useState(false);
  const [editedCode, setEditedCode] = useState(code);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [showConsole, setShowConsole] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  // Localization
  const activeLanguage = useProgressStore((state) => state.language || 'en');
  const t = UI_TRANSLATIONS[activeLanguage];

  // Normalize language aliases
  const lang = language === 'tsx' ? 'tsx' : language === 'typescript' ? 'typescript' : 'javascript';
  const isJavaScript = lang === 'javascript';

  // Highlighting is derived from the code, not state pushed by an effect.
  // Setting it inside useEffect meant every edit rendered once with the stale
  // markup and again with the new, and the first render after mount always
  // showed unhighlighted text. Prism runs during render on the client only;
  // `mounted` keeps the server pass and the first client pass identical so
  // there is no hydration mismatch.
  const highlighted = useMemo(() => {
    if (!mounted) return escapeHtml(editedCode);
    try {
      // Prism.languages is an index signature, so every lookup is
      // possibly-undefined, including the javascript fallback: a grammar only
      // exists once its component file has been imported. Falling through to
      // escaped plain text is the same outcome the catch already gives for a
      // grammar that fails mid-highlight.
      const grammar = Prism.languages[lang] ?? Prism.languages.javascript;
      return grammar ? Prism.highlight(editedCode, grammar, lang) : escapeHtml(editedCode);
    } catch {
      return escapeHtml(editedCode);
    }
  }, [editedCode, lang, mounted]);



  const handleCopy = async () => {
    await navigator.clipboard.writeText(editedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const runCode = () => {
    setIsRunning(true);
    setShowConsole(true);
    const logs: string[] = [];
    const customConsole = {
      log: (...args: unknown[]) => {
        logs.push(args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
      },
      error: (...args: unknown[]) => {
        logs.push('❌ ' + args.map(String).join(' '));
      },
      warn: (...args: unknown[]) => {
        logs.push('⚠️ ' + args.map(String).join(' '));
      }
    };
    try {
      const runner = new Function('console', editedCode);
      runner(customConsole);
    } catch (err) {
      // A thrown value is not required to be an Error, and user code in this
      // editor can throw anything at all.
      customConsole.error(err instanceof Error ? err.message : String(err));
    }
    setConsoleLogs(logs.length > 0 ? logs : ['(No console output)']);
    setIsRunning(false);
  };

  const handleReset = () => {
    setEditedCode(code);
    setConsoleLogs([]);
    setShowConsole(false);
    setIsEditing(false);
  };

  return (
    <div className="rounded-lg overflow-hidden border border-[var(--color-neutral-200)] my-4 text-left">
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[var(--color-neutral-50)] border-b border-[var(--color-neutral-200)] flex-wrap gap-2">
        <span className="text-sm font-medium text-[var(--color-neutral-700)]">{title || (isJavaScript ? (activeLanguage === 'ar' ? 'مسودة الكود' : 'JS Sandbox') : 'Code')}</span>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-[var(--color-neutral-400)] uppercase tracking-wide">{language}</span>
          
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-950)] hover:bg-[var(--color-neutral-100)] transition-colors"
          >
            {copied ? <Check size={12} className="text-[var(--color-success)]" /> : <Copy size={12} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>

          {/* Edit Button */}
          {isJavaScript && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                isEditing ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent-light)]' : 'text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-950)] hover:bg-[var(--color-neutral-100)]'
              }`}
            >
              <Code size={12} />
              {t.editCode}
            </button>
          )}

          {/* Run Button */}
          {isJavaScript && (
            <button
              onClick={runCode}
              disabled={isRunning}
              className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-[var(--color-success)]/20 text-[var(--color-success)] hover:bg-[var(--color-success)]/30 transition-colors font-medium"
            >
              <Play size={12} className="fill-[var(--color-success)]" />
              {isRunning ? t.running : t.runCode}
            </button>
          )}

          {/* Reset Button */}
          {isJavaScript && (editedCode !== code || isEditing) && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-2 py-1 rounded text-xs text-[var(--color-danger)] hover:text-[var(--color-neutral-950)] hover:bg-[var(--color-neutral-100)] transition-colors"
            >
              <RotateCcw size={12} />
              {t.resetCode}
            </button>
          )}
        </div>
      </div>

      {/* Code Editor / Highlighting Area */}
      <div className="overflow-x-auto bg-[var(--color-neutral-0)] relative">
        {isEditing ? (
          <textarea
            value={editedCode}
            onChange={(e) => setEditedCode(e.target.value)}
            className="w-full min-h-[150px] p-4 bg-[var(--color-neutral-0)] text-[var(--color-neutral-800)] font-mono text-sm leading-relaxed border-0 outline-none focus:ring-0 focus:outline-none resize-y"
            spellCheck={false}
            dir="ltr"
          />
        ) : (
          <pre className="p-4 text-sm leading-relaxed" dir="ltr">
            <code
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
          </pre>
        )}
      </div>

      {/* Sandboxed Console Output */}
      {showConsole && (
        <div className="border-t border-[var(--color-neutral-200)] bg-[var(--color-neutral-0)] p-4 font-mono text-xs text-[var(--color-neutral-700)]" dir="ltr">
          <div className="flex items-center justify-between text-[var(--color-neutral-400)] mb-2 border-b border-[var(--color-neutral-200)] pb-1">
            <span className="uppercase tracking-wide font-bold">{t.consoleOutput}</span>
            <button 
              onClick={() => setShowConsole(false)}
              className="text-[var(--color-neutral-400)] hover:text-[var(--color-neutral-950)]"
            >
              ✕
            </button>
          </div>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {consoleLogs.map((log, index) => (
              <div key={index} className="whitespace-pre-wrap leading-relaxed">{log}</div>
            ))}
          </div>
        </div>
      )}

      {/* Explanation panel */}
      {explanation && (
        <div className="border-t border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)]">
          {studyMode ? (
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="w-full px-4 py-2 text-left text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-light)] transition-colors"
            >
              {showExplanation ? t.showExplanation : t.hideExplanation}
            </button>
          ) : null}
          {showExplanation && (
            <p className="px-4 pb-3 text-sm text-[var(--color-neutral-600)] leading-relaxed pt-2">{explanation}</p>
          )}
        </div>
      )}
    </div>
  );
}
