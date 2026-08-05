'use client';
import Link from 'next/link';
import { useProgressStore } from '@/lib/store';
import { MODULES } from '@/lib/modules';
import ProgressBar from '@/components/ui/ProgressBar';
import { CheckCircle2, Clock, Star, ArrowRight, TrendingDown } from 'lucide-react';
import type { ModuleId } from '@/types';

/**
 * Keyed by ModuleId rather than string. A string-keyed Record makes every
 * lookup possibly-undefined under noUncheckedIndexedAccess, which would force
 * a fallback at the call site and quietly render an unstyled card if a module
 * were ever added without a colour. Keying on the union instead makes the map
 * exhaustive: a missing entry is a compile error, and the lookup below needs
 * no guard because the key is always present.
 */
const MODULE_COLORS: Record<ModuleId, { border: string; bg: string; text: string }> = {
  javascript:         { border: 'border-[var(--color-warning)]/30',  bg: 'bg-[var(--color-warning)]/10',  text: 'text-[var(--color-warning)]' },
  react:              { border: 'border-[var(--color-accent-light)]/30',    bg: 'bg-[var(--color-accent-soft)]',    text: 'text-[var(--color-accent-light)]' },
  nextjs:             { border: 'border-[var(--color-neutral-200)]',   bg: 'bg-[var(--color-neutral-100)]',   text: 'text-[var(--color-neutral-700)]' },
  typescript:         { border: 'border-[var(--color-accent)]/30',    bg: 'bg-[var(--color-accent-soft)]',    text: 'text-[var(--color-accent)]' },
  'system-design':    { border: 'border-[var(--color-accent-light)]/30',  bg: 'bg-[var(--color-accent-soft)]',  text: 'text-[var(--color-accent-light)]' },
  performance:        { border: 'border-[var(--color-success)]/30',   bg: 'bg-[var(--color-success)]/10',   text: 'text-[var(--color-success)]' },
  testing:            { border: 'border-[var(--color-danger)]/30',     bg: 'bg-[var(--color-danger)]/10',     text: 'text-[var(--color-danger)]' },
  behavioral:         { border: 'border-[var(--color-warning)]/30',  bg: 'bg-[var(--color-warning)]/10',  text: 'text-[var(--color-warning)]' },
  'coding-challenges':{ border: 'border-[var(--color-accent-light)]/30',    bg: 'bg-[var(--color-accent-soft)]',    text: 'text-[var(--color-accent-light)]' },
  'graphql':          { border: 'border-[var(--color-accent-light)]/30',    bg: 'bg-[var(--color-accent-soft)]',    text: 'text-[var(--color-accent-light)]' },
  'rapid-fire':       { border: 'border-[var(--color-accent)]/30',    bg: 'bg-[var(--color-accent-soft)]',    text: 'text-[var(--color-accent)]' },
  'git':              { border: 'border-[var(--color-warning)]/30',  bg: 'bg-[var(--color-warning)]/10',  text: 'text-[var(--color-warning)]' },
};

import { UI_TRANSLATIONS, MODULE_TRANSLATIONS, TOPIC_TRANSLATIONS } from '@/lib/translations';

function formatTimeAgo(date: Date, lang: 'en' | 'ar' = 'en'): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return lang === 'ar' ? 'الآن' : 'just now';
  if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    return lang === 'ar' ? `منذ ${mins} د` : `${mins}m ago`;
  }
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return lang === 'ar' ? `منذ ${hours} س` : `${hours}h ago`;
  }
  const days = Math.floor(seconds / 86400);
  return lang === 'ar' ? `منذ ${days} ي` : `${days}d ago`;
}

function StatCard({ label, value, sub, icon }: { label: string; value: string; sub: string; icon: React.ReactNode }) {
  return (
    <div className="p-4 bg-[var(--color-neutral-50)] rounded-xl border border-[var(--color-neutral-200)]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-[var(--color-neutral-400)] uppercase tracking-wide">{label}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold text-[var(--color-neutral-950)]">{value}</div>
      <div className="text-xs text-[var(--color-neutral-400)] mt-1">{sub}</div>
    </div>
  );
}

export default function DashboardPage() {
  const { completedTopics, confidenceRatings, lastStudied, getModuleProgress, language } = useProgressStore();
  const lang = language || 'en';
  const t = UI_TRANSLATIONS[lang];
  const modTrans = lang === 'ar' ? MODULE_TRANSLATIONS.ar : null;

  const totalTopics = MODULES.reduce((sum, m) => sum + m.topics.length, 0);
  const completedCount = Object.values(completedTopics).filter(Boolean).length;
  const overallProgress = Math.round((completedCount / totalTopics) * 100);

  const ratedTopics = Object.entries(confidenceRatings);
  const weakAreas = ratedTopics.filter(([, r]) => r <= 2).map(([key]) => key);
  const avgConfidence =
    ratedTopics.length
      ? Math.round((ratedTopics.reduce((s, [, r]) => s + r, 0) / ratedTopics.length) * 10) / 10
      : 0;

  const recentTopics = Object.entries(lastStudied)
    .sort(([, a], [, b]) => new Date(b).getTime() - new Date(a).getTime())
    .slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-neutral-950)] mb-2">{t.studyDashboard}</h1>
        <p className="text-[var(--color-neutral-600)]">{t.dashboardSubtitle}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label={t.overallProgress} value={`${overallProgress}%`} sub={`${completedCount} / ${totalTopics} ${t.topics}`} icon={<CheckCircle2 size={20} className="text-[var(--color-success)]" />} />
        <StatCard label={t.topicsCompleted} value={String(completedCount)} sub={`${totalTopics - completedCount} ${t.remaining}`} icon={<CheckCircle2 size={20} className="text-[var(--color-accent)]" />} />
        <StatCard label={t.avgConfidence} value={avgConfidence > 0 ? `${avgConfidence}/5` : '—'} sub={`${ratedTopics.length} ${t.topicsRated}`} icon={<Star size={20} className="text-[var(--color-warning)]" />} />
        <StatCard label={t.weakAreas} value={String(weakAreas.length)} sub={t.confidenceLow} icon={<TrendingDown size={20} className="text-[var(--color-danger)]" />} />
      </div>

      {/* Overall progress bar */}
      <div className="mb-8 p-4 bg-[var(--color-neutral-50)] rounded-xl border border-[var(--color-neutral-200)]">
        <div className="flex justify-between mb-2">
          <span className="font-medium text-[var(--color-neutral-950)]">{t.overallProgress}</span>
          <span className="text-[var(--color-neutral-600)] text-sm">{completedCount} / {totalTopics} {t.topics}</span>
        </div>
        <ProgressBar value={overallProgress} showPercent={false} size="lg" />
      </div>

      {/* Weak areas */}
      {weakAreas.length > 0 && (
        <div className="mb-8 p-4 bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/30 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown size={16} className="text-[var(--color-danger)]" />
            <span className="font-medium text-[var(--color-danger)]">{t.needsAttention}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {weakAreas.slice(0, 8).map((key) => {
              // key is "moduleId/topicId". Destructuring an array yields
              // possibly-undefined entries under noUncheckedIndexedAccess, and the
              // topic guard below narrows `topic` without narrowing either id. A
              // malformed key should drop the row rather than render a link to
              // /modules/undefined/undefined.
              const [moduleId, topicId] = key.split('/');
              if (!moduleId || !topicId) return null;
              const mod = MODULES.find((m) => m.id === moduleId);
              const topic = mod?.topics.find((t) => t.id === topicId);
              if (!topic) return null;
              const topicTitle = lang === 'ar' && topicId in TOPIC_TRANSLATIONS.ar
                ? TOPIC_TRANSLATIONS.ar[topicId as keyof typeof TOPIC_TRANSLATIONS.ar]
                : topic.title;
              return (
                <Link key={key} href={`/modules/${moduleId}/${topicId}`} className="text-sm px-3 py-1 bg-[var(--color-danger)]/20 text-[var(--color-danger)] rounded-full hover:bg-[var(--color-danger)]/30 transition-colors">
                  {topicTitle}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Module Grid */}
      <h2 className="text-xl font-semibold text-[var(--color-neutral-950)] mb-4">{t.allModules}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        {MODULES.map((module) => {
          const topicIds = module.topics.map((t) => t.id);
          const progress = getModuleProgress(module.id, topicIds);
          const colors = MODULE_COLORS[module.id];
          const doneCount = module.topics.filter((t) => completedTopics[`${module.id}/${t.id}`]).length;

          const moduleTitle = modTrans?.[module.id as keyof typeof modTrans] || module.title;
          const moduleDesc = modTrans?.[(module.id + '-desc') as keyof typeof modTrans] || module.description;

          return (
            <Link key={module.id} href={`/modules/${module.id}`} className={`block p-5 rounded-xl border ${colors.border} ${colors.bg} hover:brightness-110 transition-all hover:-translate-y-0.5 group`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className={`text-2xl font-bold ${colors.text}`}>{module.icon}</span>
                  <h3 className="font-semibold text-[var(--color-neutral-950)] mt-1">{moduleTitle}</h3>
                </div>
                <ArrowRight size={16} className={`${colors.text} opacity-0 group-hover:opacity-100 transition-opacity mt-1 rtl:-rotate-180`} />
              </div>
              <p className="text-[var(--color-neutral-400)] text-sm mb-4 line-clamp-2">{moduleDesc}</p>
              <ProgressBar value={progress} showPercent={false} size="sm" />
              <div className="flex justify-between mt-2 text-xs text-[var(--color-neutral-400)]">
                <span>{module.topics.length} {t.topics}</span>
                <span>{doneCount} / {module.topics.length} {t.done}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recently studied */}
      {recentTopics.length > 0 && (
        <div className="p-5 bg-[var(--color-neutral-50)] rounded-xl border border-[var(--color-neutral-200)]">
          <h2 className="font-semibold text-[var(--color-neutral-950)] mb-3 flex items-center gap-2">
            <Clock size={16} className="text-[var(--color-neutral-600)]" />
            {t.recentlyStudied}
          </h2>
          <div className="space-y-1">
            {recentTopics.map(([key, dateStr]) => {
              // key is "moduleId/topicId". Destructuring an array yields
              // possibly-undefined entries under noUncheckedIndexedAccess, and the
              // topic guard below narrows `topic` without narrowing either id. A
              // malformed key should drop the row rather than render a link to
              // /modules/undefined/undefined.
              const [moduleId, topicId] = key.split('/');
              if (!moduleId || !topicId) return null;
              const mod = MODULES.find((m) => m.id === moduleId);
              const topic = mod?.topics.find((t) => t.id === topicId);
              if (!topic || !mod) return null;

              const moduleTitle = modTrans?.[mod.id as keyof typeof modTrans] || mod.title;
              const topicTitle = lang === 'ar' && topicId in TOPIC_TRANSLATIONS.ar
                ? TOPIC_TRANSLATIONS.ar[topicId as keyof typeof TOPIC_TRANSLATIONS.ar]
                : topic.title;

              return (
                <Link key={key} href={`/modules/${moduleId}/${topicId}`} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[var(--color-neutral-100)] transition-colors group">
                  <div>
                    <div className="text-sm text-[var(--color-neutral-700)] group-hover:text-[var(--color-neutral-950)]">{topicTitle}</div>
                    <div className="text-xs text-[var(--color-neutral-400)]">{moduleTitle}</div>
                  </div>
                  <span className="text-xs text-[var(--color-neutral-400)]">{formatTimeAgo(new Date(dateStr), lang)}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
