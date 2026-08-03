'use client';
import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface TimerProps {
  durationSeconds?: number;
  onExpire?: () => void;
  autoStart?: boolean;
}

export default function Timer({ durationSeconds = 180, onExpire, autoStart = false }: TimerProps) {
  const [remaining, setRemaining] = useState(durationSeconds);
  const [running, setRunning] = useState(autoStart);

  useEffect(() => {
    if (!running) return;
    if (remaining <= 0) {
      setRunning(false);
      onExpire?.();
      return;
    }
    const id = setInterval(() => setRemaining((r) => r - 1), 1000);
    return () => clearInterval(id);
  }, [running, remaining, onExpire]);

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
        onClick={() => setRunning(!running)}
        className="p-1.5 rounded hover:bg-[var(--color-neutral-100)] text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-950)] transition-colors"
      >
        {running ? <Pause size={14} /> : <Play size={14} />}
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
