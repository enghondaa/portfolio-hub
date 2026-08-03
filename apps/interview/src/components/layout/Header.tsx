'use client';
import { useState, useEffect } from 'react';
import { Menu, Search, Shuffle, Printer, Sun, Moon } from 'lucide-react';
import SearchModal from './SearchModal';
import StudyModeToggle from '@/components/ui/StudyModeToggle';
import { ALL_INTERVIEW_QUESTIONS } from '@/lib/content/index';
import { useRouter } from 'next/navigation';
import { useProgressStore } from '@/lib/store';
import { UI_TRANSLATIONS } from '@/lib/translations';

interface HeaderProps {
  onMenuClick?: () => void;
  showMenu?: boolean;
}

export default function Header({ onMenuClick, showMenu = false }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const router = useRouter();
  const { language, setLanguage } = useProgressStore();
  const t = UI_TRANSLATIONS[language || 'en'];

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      setIsDark(true);
    }
  };

  // Cmd+K / Ctrl+K to open search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const handleRandomQuestion = () => {
    // Indexed access is possibly-undefined under noUncheckedIndexedAccess.
    // Doing nothing on an empty pool is the right behaviour here: navigating to
    // /modules/undefined/undefined would be worse than the button appearing
    // inert, and the pool is only empty if the content files failed to load.
    const question = ALL_INTERVIEW_QUESTIONS[
      Math.floor(Math.random() * ALL_INTERVIEW_QUESTIONS.length)
    ];
    if (!question) return;
    router.push(`/modules/${question.moduleId}/${question.topicId}#interview-questions`);
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between h-14 px-4 bg-[var(--color-neutral-0)] backdrop-blur border-b border-[var(--color-neutral-200)] print:hidden">
        <div className="flex items-center gap-3">
          {showMenu && (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-1.5 rounded hover:bg-[var(--color-neutral-50)] text-[var(--color-neutral-600)]"
            >
              <Menu size={20} />
            </button>
          )}
          <h1 className="text-sm font-semibold text-[var(--color-neutral-600)] hidden sm:block">
            {language === 'ar' ? 'منصة التحضير للمقابلات البرمجية للواجهات الأمامية' : 'Frontend Interview Prep'}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <button
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="px-2.5 py-1.5 rounded-lg bg-[var(--color-neutral-50)] text-[var(--color-accent)] hover:text-[var(--color-accent-light)] hover:bg-[var(--color-neutral-100)] transition-colors text-xs font-bold"
          >
            {language === 'ar' ? 'English' : 'العربية'}
          </button>

          {/* Search button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-neutral-50)] text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-950)] hover:bg-[var(--color-neutral-100)] transition-colors text-sm"
          >
            <Search size={14} />
            <span className="hidden sm:inline">{t.search}</span>
            <kbd className="hidden sm:block text-xs text-[var(--color-neutral-400)] ml-1">⌘K</kbd>
          </button>

          {/* Random Question */}
          <button
            onClick={handleRandomQuestion}
            title={t.randomQ}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-neutral-50)] text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-950)] hover:bg-[var(--color-neutral-100)] transition-colors text-sm"
          >
            <Shuffle size={14} />
            <span className="hidden sm:inline">{t.randomQ}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={isDark ? t.themeLight : t.themeDark}
            className="p-1.5 rounded-lg bg-[var(--color-neutral-50)] text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-950)] hover:bg-[var(--color-neutral-100)] transition-colors"
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {/* Study Mode Toggle */}
          <StudyModeToggle />

          {/* Print */}
          <button
            onClick={() => window.print()}
            title="Print this page"
            className="p-1.5 rounded-lg bg-[var(--color-neutral-50)] text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-950)] hover:bg-[var(--color-neutral-100)] transition-colors"
          >
            <Printer size={14} />
          </button>
        </div>
      </header>

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </>
  );
}
