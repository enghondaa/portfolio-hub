interface ProgressBarProps {
  value: number; // 0–100
  label?: string;
  showPercent?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export default function ProgressBar({
  value,
  label,
  showPercent = true,
  size = 'md',
  color = 'bg-[var(--color-accent)]',
}: ProgressBarProps) {
  const heights = { sm: 'h-1.5', md: 'h-2', lg: 'h-3' };

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-sm text-[var(--color-neutral-600)]">{label}</span>}
          {showPercent && (
            <span className="text-sm font-medium text-[var(--color-neutral-700)]">{Math.round(value)}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-[var(--color-neutral-100)] rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className={`${heights[size]} ${color} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
