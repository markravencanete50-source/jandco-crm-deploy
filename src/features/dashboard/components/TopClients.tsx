'use client';

import type { TopClient } from '../types';

interface TopClientsProps {
  clients: TopClient[];
  loading?: boolean;
}

const STATUS_LABELS: Record<TopClient['status'], string> = {
  active:   'Active',
  at_risk:  'At Risk',
  churned:  'Churned',
};

const STATUS_COLORS: Record<TopClient['status'], string> = {
  active:  '#1C4532',
  at_risk: '#C8693B',
  churned: '#6B7280',
};

function formatGBP(n: number): string {
  if (n >= 1000) return `£${(n / 1000).toFixed(1)}K`;
  return `£${n}`;
}

export function TopClients({ clients, loading }: TopClientsProps) {
  if (loading) {
    return (
      <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <div className="h-3 w-24 bg-[var(--color-border)] rounded animate-pulse mb-5" />
        <div className="space-y-3">
          {Array(5).fill(null).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-[var(--color-border)] animate-pulse" />
              <div className="flex-1 h-3 bg-[var(--color-border)] rounded animate-pulse" />
              <div className="w-16 h-3 bg-[var(--color-border)] rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
          Top Clients
        </p>
        <button className="text-[10px] font-mono text-[var(--color-pine)] hover:underline">
          View all
        </button>
      </div>

      {/* Table header */}
      <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 pb-2 border-b border-[var(--color-border)] mb-1">
        {['Client', 'Revenue', 'Deals', 'Status'].map((h) => (
          <span key={h} className="text-[9px] font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
            {h}
          </span>
        ))}
      </div>

      {/* Rows */}
      {clients.map((client, i) => (
        <div
          key={client.id}
          className={`grid grid-cols-[1fr_auto_auto_auto] gap-3 items-center py-2.5 ${
            i < clients.length - 1 ? 'border-b border-[var(--color-border)]' : ''
          } group hover:bg-[var(--color-bg)] transition-colors cursor-pointer`}
        >
          {/* Name + industry */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-6 h-6 flex-shrink-0 flex items-center justify-center text-[9px] font-mono font-bold text-white"
              style={{ backgroundColor: client.color }}
            >
              {client.initials}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-mono text-[var(--color-text)] truncate leading-none">
                {client.name}
              </p>
              <p className="text-[9px] font-mono text-[var(--color-text-muted)] mt-0.5 uppercase tracking-wide">
                {client.industry}
              </p>
            </div>
          </div>

          {/* Revenue */}
          <span className="text-[11px] font-mono text-[var(--color-text)] tabular-nums">
            {formatGBP(client.revenue)}
          </span>

          {/* Deals */}
          <span className="text-[11px] font-mono text-[var(--color-text-muted)] tabular-nums text-center">
            {client.deals}
          </span>

          {/* Status badge */}
          <span
            className="text-[9px] font-mono uppercase tracking-wide px-1.5 py-0.5 border"
            style={{
              color: STATUS_COLORS[client.status],
              borderColor: STATUS_COLORS[client.status],
            }}
          >
            {STATUS_LABELS[client.status]}
          </span>
        </div>
      ))}
    </div>
  );
}
