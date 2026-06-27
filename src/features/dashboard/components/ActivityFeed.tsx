'use client';

import type { ActivityItem } from '../types';

interface ActivityFeedProps {
  items: ActivityItem[];
  loading?: boolean;
}

const ACTIVITY_ICONS: Record<ActivityItem['type'], string> = {
  deal_won:           '✓',
  deal_lost:          '✕',
  client_added:       '+',
  task_completed:     '◉',
  meeting_scheduled:  '◷',
  invoice_sent:       '▣',
};

const ACTIVITY_COLORS: Record<ActivityItem['type'], string> = {
  deal_won:           '#1C4532',
  deal_lost:          '#C8693B',
  client_added:       '#2563EB',
  task_completed:     '#6B7280',
  meeting_scheduled:  '#7C3AED',
  invoice_sent:       '#6B7280',
};

export function ActivityFeed({ items, loading }: ActivityFeedProps) {
  if (loading) {
    return (
      <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <div className="h-3 w-28 bg-[var(--color-border)] rounded animate-pulse mb-5" />
        <div className="space-y-4">
          {Array(5).fill(null).map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-[var(--color-border)] animate-pulse flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-[var(--color-border)] rounded animate-pulse w-3/4" />
                <div className="h-2.5 bg-[var(--color-border)] rounded animate-pulse w-1/2" />
              </div>
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
          Recent Activity
        </p>
        <button className="text-[10px] font-mono text-[var(--color-pine)] hover:underline">
          View all
        </button>
      </div>

      <div className="space-y-0">
        {items.map((item, i) => (
          <div
            key={item.id}
            className={`flex gap-3 py-3 ${i < items.length - 1 ? 'border-b border-[var(--color-border)]' : ''}`}
          >
            {/* Activity type icon */}
            <div
              className="w-6 h-6 flex items-center justify-center flex-shrink-0 text-[10px] font-mono font-bold mt-0.5"
              style={{
                color: ACTIVITY_COLORS[item.type],
                border: `1px solid ${ACTIVITY_COLORS[item.type]}`,
              }}
            >
              {ACTIVITY_ICONS[item.type]}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[11px] font-mono text-[var(--color-text)] leading-snug">
                    {item.description}
                  </p>
                  <p className="text-[10px] font-mono text-[var(--color-text-muted)] mt-0.5">
                    {item.user.name}
                    {item.meta && (
                      <span
                        className="ml-2 font-semibold"
                        style={{ color: ACTIVITY_COLORS[item.type] }}
                      >
                        {item.meta}
                      </span>
                    )}
                  </p>
                </div>
                <span className="text-[10px] font-mono text-[var(--color-text-muted)] whitespace-nowrap flex-shrink-0">
                  {item.relativeTime}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
