'use client';

import type { TeamMember } from '../types';

interface TeamPerformanceProps {
  members: TeamMember[];
  loading?: boolean;
}

function formatGBP(n: number): string {
  if (n >= 1000) return `£${(n / 1000).toFixed(0)}K`;
  return `£${n}`;
}

export function TeamPerformance({ members, loading }: TeamPerformanceProps) {
  if (loading) {
    return (
      <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <div className="h-3 w-32 bg-[var(--color-border)] rounded animate-pulse mb-5" />
        <div className="space-y-4">
          {Array(4).fill(null).map((_, i) => (
            <div key={i}>
              <div className="flex justify-between mb-1.5">
                <div className="h-3 w-28 bg-[var(--color-border)] rounded animate-pulse" />
                <div className="h-3 w-16 bg-[var(--color-border)] rounded animate-pulse" />
              </div>
              <div className="h-2 w-full bg-[var(--color-border)] rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-muted)] mb-4">
        Team Performance
      </p>

      <div className="space-y-4">
        {members.map((member) => {
          const pct = Math.min((member.revenue / member.target) * 100, 100);
          const over = member.revenue >= member.target;

          return (
            <div key={member.id}>
              {/* Name row */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 flex items-center justify-center text-[8px] font-mono font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: member.color }}
                  >
                    {member.initials}
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-[var(--color-text)]">
                      {member.name}
                    </span>
                    <span className="ml-1.5 text-[9px] font-mono text-[var(--color-text-muted)] uppercase tracking-wide">
                      {member.role}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-mono text-[var(--color-text)] tabular-nums">
                    {formatGBP(member.revenue)}
                  </span>
                  <span className="text-[9px] font-mono text-[var(--color-text-muted)]">
                    /{formatGBP(member.target)}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full bg-[var(--color-bg)] border border-[var(--color-border)]">
                <div
                  className="h-full transition-all duration-700"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: over ? '#1C4532' : member.color,
                  }}
                />
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between mt-1">
                <span className="text-[9px] font-mono text-[var(--color-text-muted)]">
                  {member.deals} deals · {member.winRate}% win rate
                </span>
                <span
                  className="text-[9px] font-mono"
                  style={{ color: over ? '#1C4532' : '#C8693B' }}
                >
                  {pct.toFixed(0)}% of target
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
