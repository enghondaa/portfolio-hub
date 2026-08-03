'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight } from 'lucide-react';
import { search } from '@/lib/search';
import type { SearchResult } from '@/types';

interface SearchModalProps {
  onClose: () => void;
}

export default function SearchModal({ onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (query.trim().length >= 2) {
      const res = search(query, 10);
      setResults(res);
      setSelectedIndex(0);
    } else {
      setResults([]);
    }
  }, [query]);

  const navigate = (result: SearchResult) => {
    router.push(`/modules/${result.moduleId}/${result.topicId}`);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      navigate(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const matchTypeIcon = (type: string) => {
    if (type === 'question') return '❓';
    if (type === 'title') return '📖';
    return '💡';
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-[var(--color-neutral-0)] rounded-xl border border-[var(--color-neutral-200)] shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--color-neutral-200)]">
          <Search size={18} className="text-[var(--color-neutral-600)] flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search topics, questions, code examples..."
            className="flex-1 bg-transparent text-[var(--color-neutral-950)] placeholder-[var(--color-neutral-400)] outline-none text-base"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-[var(--color-neutral-400)] hover:text-[var(--color-neutral-950)]">
              <X size={14} />
            </button>
          )}
          <kbd className="hidden sm:block px-2 py-0.5 text-xs text-[var(--color-neutral-400)] border border-[var(--color-neutral-200)] rounded">
            ESC
          </kbd>
        </div>

        {/* Results */}
        {results.length > 0 ? (
          <ul className="max-h-96 overflow-y-auto py-2">
            {results.map((result, index) => (
              <li key={`${result.moduleId}/${result.topicId}/${result.matchType}/${index}`}>
                <button
                  onClick={() => navigate(result)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    index === selectedIndex
                      ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent-light)]'
                      : 'text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-50)]'
                  }`}
                >
                  <span className="text-base flex-shrink-0">{matchTypeIcon(result.matchType)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{result.topicTitle}</div>
                    <div className="text-xs text-[var(--color-neutral-400)] truncate">
                      {result.moduleTitle} · {result.snippet}
                    </div>
                  </div>
                  <ArrowRight size={14} className="flex-shrink-0 text-[var(--color-neutral-400)]" />
                </button>
              </li>
            ))}
          </ul>
        ) : query.length >= 2 ? (
          <div className="px-4 py-8 text-center text-[var(--color-neutral-400)]">
            No results for "<span className="text-[var(--color-neutral-600)]">{query}</span>"
          </div>
        ) : (
          <div className="px-4 py-6 text-center text-[var(--color-neutral-400)] text-sm">
            Start typing to search across all topics and questions
          </div>
        )}

        {/* Footer hint */}
        <div className="px-4 py-2 border-t border-[var(--color-neutral-200)] flex gap-4 text-xs text-[var(--color-neutral-400)]">
          <span>↑↓ Navigate</span>
          <span>↵ Select</span>
          <span>ESC Close</span>
        </div>
      </div>
    </div>
  );
}
