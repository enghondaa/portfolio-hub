'use client';
import { useState } from 'react';
import { Star } from 'lucide-react';
import { useProgressStore } from '@/lib/store';

interface ConfidenceRatingProps {
  topicKey: string; // e.g., "javascript/closures"
  compact?: boolean;
}

const LABELS_MAP = {
  en: ['', 'Just started', 'Getting it', 'Fairly confident', 'Very confident', 'Got it!'],
  ar: ['', 'بدأت للتو', 'أفهمه تدريجياً', 'واثق إلى حد ما', 'واثق جداً', 'أتقنته تماماً!']
};

export default function ConfidenceRating({ topicKey, compact = false }: ConfidenceRatingProps) {
  const { confidenceRatings, setConfidenceRating, language } = useProgressStore();
  const [hovered, setHovered] = useState(0);
  const current = confidenceRatings[topicKey] ?? 0;
  const lang = language || 'en';
  const labels = LABELS_MAP[lang];

  if (compact) {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={star <= current ? 'fill-[var(--color-warning)] text-[var(--color-warning)]' : 'text-[var(--color-neutral-400)]'}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-[var(--color-neutral-600)]">
        {lang === 'ar' ? 'قيم مستوى ثقتك في هذا الموضوع:' : 'Rate your confidence:'}
      </span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= (hovered || current);
          return (
            <button
              key={star}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setConfidenceRating(topicKey, star)}
              aria-label={`Rate ${star} star${star > 1 ? 's' : ''}: ${labels[star]}`}
              className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] rounded"
            >
              <Star
                size={24}
                className={`transition-colors ${
                  filled ? 'fill-[var(--color-warning)] text-[var(--color-warning)]' : 'text-[var(--color-neutral-400)] hover:text-[var(--color-warning)]'
                }`}
              />
            </button>
          );
        })}
        {(hovered || current) > 0 && (
          <span className="ms-2 text-sm text-[var(--color-neutral-600)]">{labels[hovered || current]}</span>
        )}
      </div>
    </div>
  );
}
