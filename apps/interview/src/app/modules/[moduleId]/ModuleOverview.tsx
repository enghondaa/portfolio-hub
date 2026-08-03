'use client';
import Link from 'next/link';
import { Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { useProgressStore } from '@/lib/store';
import ProgressBar from '@/components/ui/ProgressBar';
import ConfidenceRating from '@/components/ui/ConfidenceRating';
import type { ModuleInfo } from '@/types';

interface Props {
  module: ModuleInfo;
}

export default function ModuleOverview({ module }: Props) {
  const { completedTopics, confidenceRatings, getModuleProgress } = useProgressStore();
  const topicIds = module.topics.map((t) => t.id);
  const progress = getModuleProgress(module.id, topicIds);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="text-sm text-[var(--color-neutral-400)] mb-2">
          <Link href="/" className="hover:text-[var(--color-neutral-700)]">Dashboard</Link>
          {' / '}
          <span className="text-[var(--color-neutral-700)]">{module.title}</span>
        </div>
        <h1 className="text-3xl font-bold text-[var(--color-neutral-950)] mb-2">{module.title}</h1>
        <p className="text-[var(--color-neutral-600)] mb-4">{module.description}</p>
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-sm">
            <ProgressBar value={progress} label="Module Progress" />
          </div>
          <span className="text-sm text-[var(--color-neutral-400)]">
            {module.topics.filter((t) => completedTopics[`${module.id}/${t.id}`]).length} / {module.topics.length} completed
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {module.topics.map((topic, index) => {
          const topicKey = `${module.id}/${topic.id}`;
          const isDone = completedTopics[topicKey];
          const confidence = confidenceRatings[topicKey] ?? 0;

          return (
            <Link
              key={topic.id}
              href={`/modules/${module.id}/${topic.id}`}
              className="block p-4 bg-[var(--color-neutral-50)] border border-[var(--color-neutral-200)] rounded-xl hover:border-[var(--color-neutral-200)] hover:bg-[var(--color-neutral-50)] transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                  isDone ? 'bg-[var(--color-success)]/20 text-[var(--color-success)]' : 'bg-[var(--color-neutral-100)] text-[var(--color-neutral-600)]'
                }`}>
                  {isDone ? <CheckCircle2 size={16} className="fill-[var(--color-success)]" /> : index + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-[var(--color-neutral-950)] group-hover:text-[var(--color-accent-light)] transition-colors truncate">
                    {topic.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-[var(--color-neutral-400)]">
                      <Clock size={11} />
                      {topic.estimatedTime}
                    </span>
                    {confidence > 0 && (
                      <ConfidenceRating topicKey={topicKey} compact />
                    )}
                  </div>
                </div>

                <ArrowRight size={16} className="text-[var(--color-neutral-400)] group-hover:text-[var(--color-neutral-600)] shrink-0 transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
