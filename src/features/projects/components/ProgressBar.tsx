'use client';

interface Props {
  value: number; // 0–100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  color?: string;
}

export function ProgressBar({ value, size = 'md', showLabel = false, color }: Props) {
  const clamped = Math.min(100, Math.max(0, value));
  const heights: Record<string, number> = { sm: 4, md: 6, lg: 8 };
  const h = heights[size] ?? 6;

  const barColor =
    color ??
    (clamped >= 75 ? '#10b981' : clamped >= 40 ? '#6366f1' : '#f59e0b');

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
      <div
        style={{
          flex: 1,
          height: h,
          background: 'rgba(255,255,255,.08)',
          borderRadius: 999,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${clamped}%`,
            height: '100%',
            background: barColor,
            borderRadius: 999,
            transition: 'width 400ms ease',
          }}
        />
      </div>
      {showLabel && (
        <span
          style={{
            fontSize: '.75rem',
            fontWeight: 600,
            color: 'var(--text-secondary, #9ca3b0)',
            minWidth: '2.5rem',
            textAlign: 'right',
          }}
        >
          {clamped}%
        </span>
      )}
    </div>
  );
}
