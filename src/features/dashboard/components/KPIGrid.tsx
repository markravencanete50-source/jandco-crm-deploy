'use client';

import type { KPIMetric } from '../types';

interface KPICardProps {
  metric: KPIMetric;
  loading?: boolean;
}

function TrendArrow({ trend, change }: { trend: KPIMetric['trend']; change: number }) {
  if (trend === 'flat') {
    return <span className="text-[var(--color-text-muted)] text-xs font-mono">—</span>;
  }

  const isUp = trend === 'up';
  const color = isUp ? 'text-[#1C4532]' : 'text-[#C8693B]';
  const arrow = isUp ? '↑' : '↓';
  const sign = isUp ? '+' : '';

  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-mono ${color}`}>
      {arrow} {sign}{change}%
    </span>
  );
}

export function KPICard({ metric, loading }: KPICardProps) {
  if (loading) {
    return (
      <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <div className="h-3 w-24 bg-[var(--color-border)] rounded animate-pulse mb-4" />
        <div className="h-8 w-32 bg-[var(--color-border)] rounded animate-pulse mb-3" />
        <div className="h-3 w-20 bg-[var(--color-border)] rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-5 group hover:border-[var(--color-pine)] transition-colors duration-150 relative overflow-hidden">
      {/* Left-edge accent bar — the kit's signature active/selected indicator */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[var(--color-pine)] opacity-0 group-hover:opacity-100 transition-opacity duration-150" />

      <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-muted)] mb-3">
        {metric.label}
      </p>

      <p className="text-3xl font-mono font-semibold text-[var(--color-text)] leading-none mb-3">
        {metric.value}
      </p>

      <div className="flex items-center gap-2">
        <TrendArrow trend={metric.trend} change={metric.change} />
        {metric.description && (
          <span className="text-[10px] font-mono text-[var(--color-text-muted)] uppercase tracking-wide">
            {metric.description}
          </span>
        )}
      </div>
    </div>
  );
}

export function KPIGrid({ metrics, loading }: { metrics: KPIMetric[]; loading?: boolean }) {
  const items = loading ? Array(6).fill(null) : metrics;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-px bg-[var(--color-border)]">
      {items.map((metric, i) => (
        <KPICard
          key={metric?.id ?? i}
          metric={metric ?? { id: String(i), label: '', value: '', change: 0, trend: 'flat' }}
          loading={loading || !metric}
        />
      ))}
    </div>
  );
}
