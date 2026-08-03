'use client';
import Link from 'next/link';
import { useProgressStore } from '@/lib/store';
import { MODULES } from '@/lib/modules';
import { Clock, Star, CheckCircle2, AlertTriangle, Zap } from 'lucide-react';
import { UI_TRANSLATIONS, MODULE_TRANSLATIONS, TOPIC_TRANSLATIONS } from '@/lib/translations';

interface PlanTopic {
  moduleId: string;
  moduleTitle: string;
  topicId: string;
  topicTitle: string;
  estimatedTime: string;
  reason: string;
  priority: 'urgent' | 'review' | 'next';
}

function daysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
}

export default function StudyPlanPage() {
  const { completedTopics, confidenceRatings, lastStudied, language } = useProgressStore();
  const lang = language || 'en';
  const t = UI_TRANSLATIONS[lang];
  const modTrans = lang === 'ar' ? MODULE_TRANSLATIONS.ar : null;

  const plan: PlanTopic[] = [];

  for (const module of MODULES) {
    for (const topic of module.topics) {
      const key = `${module.id}/${topic.id}`;
      const done = completedTopics[key];
      const confidence = confidenceRatings[key] ?? 0;
      const lastDate = lastStudied[key];
      const days = lastDate ? daysSince(lastDate) : Infinity;

      const moduleTitle = modTrans?.[module.id as keyof typeof modTrans] || module.title;
      const topicTitle = lang === 'ar' && topic.id in TOPIC_TRANSLATIONS.ar
        ? TOPIC_TRANSLATIONS.ar[topic.id as keyof typeof TOPIC_TRANSLATIONS.ar]
        : topic.title;

      // Urgent: low confidence on completed topics
      if (done && confidence > 0 && confidence <= 2) {
        plan.push({
          moduleId: module.id,
          moduleTitle,
          topicId: topic.id,
          topicTitle,
          estimatedTime: topic.estimatedTime,
          reason: t.lowConfidenceNeedsReview.replace('{confidence}', String(confidence)),
          priority: 'urgent',
        });
      // Review: completed but not studied in 7+ days with medium confidence
      } else if (done && days >= 7 && confidence > 0 && confidence <= 3) {
        plan.push({
          moduleId: module.id,
          moduleTitle,
          topicId: topic.id,
          topicTitle,
          estimatedTime: topic.estimatedTime,
          reason: days === Infinity ? t.notReviewedAwhile : t.notReviewedIn.replace('{days}', String(days)),
          priority: 'review',
        });
      // Next: not yet started
      } else if (!done) {
        plan.push({
          moduleId: module.id,
          moduleTitle,
          topicId: topic.id,
          topicTitle,
          estimatedTime: topic.estimatedTime,
          reason: t.notYetStudied,
          priority: 'next',
        });
      }
    }
  }

  // Sort: urgent first, then review, then next (in module order)
  const priorityOrder = { urgent: 0, review: 1, next: 2 };
  plan.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  const urgent = plan.filter((p) => p.priority === 'urgent');
  const review = plan.filter((p) => p.priority === 'review');
  const next = plan.filter((p) => p.priority === 'next').slice(0, 10);

  const totalTopics = MODULES.reduce((s, m) => s + m.topics.length, 0);
  const completedCount = Object.values(completedTopics).filter(Boolean).length;

  const priorityConfig = {
    urgent: { label: t.needsAttentionLabel, icon: <AlertTriangle size={16} className="text-[var(--color-danger)]" />, color: 'border-[var(--color-danger)]/30 bg-[var(--color-danger)]/5', badge: 'bg-[var(--color-danger)]/20 text-[var(--color-danger)] border-[var(--color-danger)] dark:bg-[var(--color-danger)]/20 dark:text-[var(--color-danger)] dark:border-[var(--color-danger)]/30' },
    review: { label: t.dueForReviewLabel, icon: <Star size={16} className="text-[var(--color-warning)]" />, color: 'border-[var(--color-warning)]/30 bg-[var(--color-warning)]/5', badge: 'bg-[var(--color-warning)]/20 text-[var(--color-warning)] border-[var(--color-warning)] dark:bg-[var(--color-warning)]/20 dark:text-[var(--color-warning)] dark:border-[var(--color-warning)]/30' },
    next: { label: t.upNextLabel, icon: <Zap size={16} className="text-[var(--color-accent)]" />, color: 'border-[var(--color-accent)]/30 bg-[var(--color-accent-soft)]', badge: 'bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-[var(--color-accent-light)] dark:bg-[var(--color-accent-soft)] dark:text-[var(--color-accent-light)] dark:border-[var(--color-accent)]/30' },
  };

  function Section({ items, priority }: { items: PlanTopic[]; priority: 'urgent' | 'review' | 'next' }) {
    if (items.length === 0) return null;
    const cfg = priorityConfig[priority];
    return (
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-[var(--color-neutral-950)] mb-3 flex items-center gap-2">
          {cfg.icon}
          {cfg.label}
          <span className="text-sm font-normal text-[var(--color-neutral-400)]">({items.length})</span>
        </h2>
        <div className="space-y-2">
          {items.map((item) => (
            <Link
              key={`${item.moduleId}/${item.topicId}`}
              href={`/modules/${item.moduleId}/${item.topicId}`}
              className={`block p-4 rounded-xl border ${cfg.color} hover:brightness-110 transition-all group`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-medium text-[var(--color-neutral-950)] group-hover:text-[var(--color-accent-light)] transition-colors truncate text-left rtl:text-right">
                    {item.topicTitle}
                  </div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-xs text-[var(--color-neutral-400)]">{item.moduleTitle}</span>
                    <span className="flex items-center gap-1 text-xs text-[var(--color-neutral-400)]">
                      <Clock size={10} />
                      {lang === 'ar' ? item.estimatedTime.replace('min', 'دقيقة') : item.estimatedTime}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${cfg.badge}`}>
                      {item.reason}
                    </span>
                  </div>
                </div>
                {completedTopics[`${item.moduleId}/${item.topicId}`] && (
                  <CheckCircle2 size={16} className="text-[var(--color-success)] shrink-0" />
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8 text-left">
        <div className="text-sm text-[var(--color-neutral-400)] mb-2">
          <Link href="/" className="hover:text-[var(--color-neutral-700)]">{t.dashboard}</Link>
          {' / '}
          <span className="text-[var(--color-neutral-700)]">{t.dailyStudyPlan}</span>
        </div>
        <h1 className="text-3xl font-bold text-[var(--color-neutral-950)] mb-2">{t.dailyStudyPlan}</h1>
        <p className="text-[var(--color-neutral-600)]">
          {lang === 'ar' ? 'خطة مذاكرة مخصصة بناءً على تقييمات ثقتك وسجل دراستك للموضوعات.' : 'Personalized based on your confidence ratings and study history.'}
          {' '}{completedCount} / {totalTopics} {t.topics} {t.done}.
        </p>
      </div>

      {plan.length === 0 ? (
        <div className="p-8 text-center bg-[var(--color-neutral-50)] border border-[var(--color-neutral-200)] rounded-xl">
          <CheckCircle2 size={40} className="text-[var(--color-success)] mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-[var(--color-neutral-950)] mb-2">{t.allCaughtUp}</h2>
          <p className="text-[var(--color-neutral-400)] text-sm max-w-sm mx-auto">{t.allCaughtUpSubtitle}</p>
        </div>
      ) : (
        <>
          <Section items={urgent} priority="urgent" />
          <Section items={review} priority="review" />
          <Section items={next} priority="next" />
          {plan.filter((p) => p.priority === 'next').length > 10 && (
            <p className="text-sm text-[var(--color-neutral-400)] text-center">
              Showing top 10 upcoming topics. Complete these to see more.
            </p>
          )}
        </>
      )}
    </div>
  );
}
