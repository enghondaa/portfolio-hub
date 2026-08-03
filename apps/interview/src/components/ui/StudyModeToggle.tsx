'use client';
import { Eye, EyeOff } from 'lucide-react';
import { useProgressStore } from '@/lib/store';

export default function StudyModeToggle() {
  const { studyMode, toggleStudyMode } = useProgressStore();

  return (
    <button
      onClick={toggleStudyMode}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
        studyMode
          ? 'bg-[var(--color-accent)] text-[var(--color-neutral-950)] hover:bg-[var(--color-accent-light)]'
          : 'bg-[var(--color-neutral-100)] text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-100)]'
      }`}
      title={studyMode ? 'Study mode ON — answers hidden' : 'Study mode OFF — answers visible'}
    >
      {studyMode ? <EyeOff size={14} /> : <Eye size={14} />}
      {studyMode ? 'Study Mode' : 'Study Mode'}
    </button>
  );
}
