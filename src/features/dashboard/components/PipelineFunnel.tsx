'use client';

import type { PipelineStage } from '../types';

interface PipelineFunnelProps {
  stages: PipelineStage[];
  loading?: boolean;
}

function formatGBP(n: number): string {
  if (n >= 1000000) return `£${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `£${(n / 1000).toFixed(0)}K`;
  return `£${n}`;
}

export function PipelineFunnel({ stages, loading }: PipelineFunnelProps) {
  if (loading) {
    return (
      <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <div className="h-3 w-28 bg-[var(--color-border)] rounded animate-pulse mb-6" />
        <div className="space-y-2">
          {[100, 76, 55, 49, 75].map((w, i) => (
            <div key={i} className="h-8 bg-[var(--color-border)] rounded animate-pulse" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-muted)] mb-4">
        Sales Pipeline
      </p>

      <div className="space-y-1.5">
        {stages.map((stage) => (
          <div key={stage.id} className="group">
            {/* Stage bar row */}
            <div className="flex items-center gap-3">
              {/* Bar */}
              <div className="flex-1 h-7 bg-[var(--color-bg)] border border-[var(--color-border)] overflow-hidden">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${stage.percentage}%`,
                    backgroundColor: stage.color,
                    opacity: 0.85,
                  }}
                />
              </div>

              {/* Value */}
              <div className="w-16 text-right">
                <span className="text-[11px] font-mono text-[var(--color-text)]">
                  {formatGBP(stage.value)}
                </span>
              </div>
            </div>

            {/* Stage label row */}
            <div className="flex items-center justify-between mt-0.5 px-0">
              <span className="text-[10px] font-mono uppercase tracking-wide text-[var(--color-text-muted)]">
                {stage.name}
              </span>
              <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
                {stage.count} deal{stage.count !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mt-4 pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
          Total Pipeline
        </span>
        <span className="text-sm font-mono font-semibold text-[var(--color-text)]">
          {formatGBP(stages.reduce((s, st) => s + st.value, 0))}
        </span>
      </div>
    </div>
  );
}
