'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface TimerProps {
  durationSeconds?: number;
  onExpire?: () => void;
  autoStart?: boolean;
}

export default function Timer({ durationSeconds = 180, onExpire, autoStart = false }: TimerProps) {
  const [remaining, setRemaining] = useState(durationSeconds);
  const [running, setRunning] = useState(autoStart);

  // `active` is derived rather than stored. The clock previously flipped
  // `running` to false on reaching zero, which is a setState inside an effect:
  // it schedules an extra render before paint and the lint rule rejects it.
  // Deriving the state means the interval simply stops having anything to do.
  const active = running && remaining > 0;

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, [active]);

  // onExpire is a callback, not state, so firing it from an effect is fine.
  // The ref guards against firing twice for the same expiry — effects can rerun
  // when onExpire's identity changes, and the caller should not see duplicates.
  const hasExpired = useRef(false);
  useEffect(() => {
    if (remaining > 0) {
      hasExpired.current = false;
      return;
    }
    if (!hasExpired.current) {
      hasExpired.current = true;
      onExpire?.();
    }
  }, [remaining, onExpire]);

  const reset = useCallback(() => {
    setRemaining(durationSeconds);
    setRunning(false);
  }, [durationSeconds]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const percent = (remaining / durationSeconds) * 100;
  const urgent = remaining <= 30;

  return (
    <div className="flex items-center gap-3">
      <div className={`font-mono text-xl font-bold ${urgent ? 'text-[var(--color-danger)] animate-pulse' : 'text-[var(--color-neutral-800)]'}`}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      <div className="w-24 h-1.5 bg-[var(--color-neutral-100)] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${urgent ? 'bg-[var(--color-danger)]' : 'bg-[var(--color-accent)]'}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <button
        onClick={() => setRunning(!active)}
        className="p-1.5 rounded hover:bg-[var(--color-neutral-100)] text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-950)] transition-colors"
      >
        {active ? <Pause size={14} /> : <Play size={14} />}
      </button>
      <button
        onClick={reset}
        className="p-1.5 rounded hover:bg-[var(--color-neutral-100)] text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-950)] transition-colors"
      >
        <RotateCcw size={14} />
      </button>
    </div>
  );
}
