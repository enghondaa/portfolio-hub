'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-react';
import { MODULES } from '@/lib/modules';
import { useProgressStore } from '@/lib/store';
import ProgressBar from '@/components/ui/ProgressBar';
import { UI_TRANSLATIONS, MODULE_TRANSLATIONS, TOPIC_TRANSLATIONS } from '@/lib/translations';

const MODULE_COLORS: Record<string, string> = {
  javascript: 'text-[var(--color-warning)]',
  react: 'text-[var(--color-accent-light)]',
  nextjs: 'text-[var(--color-neutral-950)]',
  typescript: 'text-[var(--color-accent)]',
  'system-design': 'text-[var(--color-accent-light)]',
  performance: 'text-[var(--color-success)]',
  testing: 'text-[var(--color-danger)]',
  behavioral: 'text-[var(--color-warning)]',
  'coding-challenges': 'text-[var(--color-accent-light)]',
  'graphql': 'text-[var(--color-accent-light)]',
  'git': 'text-[var(--color-warning)]',
};

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { completedTopics, getModuleProgress } = useProgressStore();
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    // Auto-expand current module
    const current = MODULES.find((m) =>
      MODULES.some((mod) => pathname.includes(mod.id) && mod.id === m.id)
    );
    return current ? { [current.id]: true } : {};
  });

  const toggle = (moduleId: string) => {
    setExpanded((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const language = useProgressStore((state) => state.language || 'en');
  const t = UI_TRANSLATIONS[language];
  const modTrans = language === 'ar' ? MODULE_TRANSLATIONS.ar : null;

  return (
    <nav className="w-64 shrink-0 h-full overflow-y-auto bg-[var(--color-neutral-0)] ltr:border-r rtl:border-l border-[var(--color-neutral-200)] print:hidden">
      <div className="p-4 border-b border-[var(--color-neutral-200)]">
        <Link href="/" className="flex items-center gap-2 group" onClick={onClose}>
          <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center text-[var(--color-neutral-950)] font-bold text-sm">
            FE
          </div>
          <div>
            <div className="font-bold text-[var(--color-neutral-950)] text-sm leading-none">
              {language === 'ar' ? 'التحضير للمقابلات' : 'Interview Prep'}
            </div>
            <div className="text-xs text-[var(--color-neutral-400)] mt-0.5">
              {language === 'ar' ? 'اتقان الواجهة الأمامية' : 'Frontend Mastery'}
            </div>
          </div>
        </Link>
      </div>

      <div className="p-3 border-b border-[var(--color-neutral-200)]">
        <Link
          href="/"
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
            pathname === '/' ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]' : 'text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-950)] hover:bg-[var(--color-neutral-50)]'
          }`}
          onClick={onClose}
        >
          <span>📊</span> {t.dashboard}
        </Link>
        <Link
          href="/study-plan"
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
            pathname === '/study-plan' ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]' : 'text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-950)] hover:bg-[var(--color-neutral-50)]'
          }`}
          onClick={onClose}
        >
          <span>📅</span> {t.dailyStudyPlan}
        </Link>
        <Link
          href="/mock-interview"
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
            pathname === '/mock-interview' ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]' : 'text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-950)] hover:bg-[var(--color-neutral-50)]'
          }`}
          onClick={onClose}
        >
          <span>🎯</span> {t.mockInterview}
        </Link>
      </div>

      <div className="p-3 space-y-1">
        {MODULES.map((module) => {
          const topicIds = module.topics.map((t) => t.id);
          const progress = getModuleProgress(module.id, topicIds);
          const isExpanded = expanded[module.id];
          const colorClass = MODULE_COLORS[module.id] ?? 'text-[var(--color-neutral-600)]';
          const moduleTitle = modTrans?.[module.id as keyof typeof modTrans] || module.title;

          return (
            <div key={module.id}>
              <button
                onClick={() => toggle(module.id)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-[var(--color-neutral-50)] transition-colors group"
              >
                <span className={`font-bold text-xs w-6 h-6 flex items-center justify-center rounded bg-[var(--color-neutral-50)] group-hover:bg-[var(--color-neutral-100)] ${colorClass}`}>
                  {module.icon}
                </span>
                <span className="flex-1 text-left rtl:text-right text-[var(--color-neutral-700)] truncate">{moduleTitle}</span>
                {progress > 0 && (
                  <span className="text-xs text-[var(--color-neutral-400)]">{progress}%</span>
                )}
                {/* The collapsed chevron is flipped in RTL: it points the way the
                    language reads, otherwise it points back out of the panel. */}
                {isExpanded ? (
                  <ChevronDown size={14} className="text-[var(--color-neutral-400)] shrink-0" />
                ) : (
                  <ChevronRight size={14} className="text-[var(--color-neutral-400)] shrink-0 rtl:-rotate-180" />
                )}
              </button>

              {isExpanded && (
                <div className="ms-4 mt-1 space-y-0.5 ltr:border-l rtl:border-r border-[var(--color-neutral-200)] ps-3">
                  {progress > 0 && (
                    <div className="px-2 py-1">
                      <ProgressBar value={progress} showPercent={false} size="sm" />
                    </div>
                  )}
                  {module.topics.map((topic) => {
                    const topicKey = `${module.id}/${topic.id}`;
                    const isActive = pathname === `/modules/${module.id}/${topic.id}`;
                    const isDone = completedTopics[topicKey];
                    const topicTitle = language === 'ar' && topic.id in TOPIC_TRANSLATIONS.ar
                      ? TOPIC_TRANSLATIONS.ar[topic.id as keyof typeof TOPIC_TRANSLATIONS.ar]
                      : topic.title;

                    return (
                      <Link
                        key={topic.id}
                        href={`/modules/${module.id}/${topic.id}`}
                        onClick={onClose}
                        className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors ${
                          isActive
                            ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
                            : 'text-[var(--color-neutral-400)] hover:text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-50)]'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 size={12} className="text-[var(--color-success)] shrink-0" />
                        ) : (
                          <div className="w-3 h-3 rounded-full border border-[var(--color-neutral-200)] shrink-0" />
                        )}
                        <span className="truncate">{topicTitle}</span>
                        <span className="ms-auto text-[var(--color-neutral-400)] shrink-0">
                          {language === 'ar' ? topic.estimatedTime.replace('min', 'دقيقة') : topic.estimatedTime}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
