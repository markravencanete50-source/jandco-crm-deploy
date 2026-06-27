'use client';

import type { UpcomingTask } from '../types';

interface UpcomingTasksProps {
  tasks: UpcomingTask[];
  loading?: boolean;
}

const PRIORITY_COLORS: Record<UpcomingTask['priority'], string> = {
  high:   '#C8693B',
  medium: '#2563EB',
  low:    '#6B7280',
};

const TYPE_ICONS: Record<UpcomingTask['type'], string> = {
  call:       '☎',
  meeting:    '◷',
  proposal:   '▣',
  follow_up:  '↩',
  demo:       '▶',
};

export function UpcomingTasks({ tasks, loading }: UpcomingTasksProps) {
  if (loading) {
    return (
      <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <div className="h-3 w-28 bg-[var(--color-border)] rounded animate-pulse mb-5" />
        <div className="space-y-3">
          {Array(5).fill(null).map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-5 h-5 bg-[var(--color-border)] rounded animate-pulse flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-[var(--color-border)] rounded animate-pulse w-2/3" />
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
          Upcoming Tasks
        </p>
        <button className="text-[10px] font-mono text-[var(--color-pine)] hover:underline">
          Add task
        </button>
      </div>

      <div className="space-y-0">
        {tasks.map((task, i) => (
          <div
            key={task.id}
            className={`flex items-start gap-3 py-2.5 group cursor-pointer ${
              i < tasks.length - 1 ? 'border-b border-[var(--color-border)]' : ''
            }`}
          >
            {/* Priority dot */}
            <div
              className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
              style={{ backgroundColor: PRIORITY_COLORS[task.priority] }}
            />

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[11px] font-mono text-[var(--color-text)] leading-snug">
                    {task.title}
                  </p>
                  <p className="text-[10px] font-mono text-[var(--color-text-muted)] mt-0.5">
                    <span className="mr-1">{TYPE_ICONS[task.type]}</span>
                    {task.client}
                  </p>
                </div>
                <span
                  className="text-[9px] font-mono whitespace-nowrap flex-shrink-0"
                  style={{
                    color: task.due.startsWith('Today')
                      ? PRIORITY_COLORS.high
                      : 'var(--color-text-muted)',
                  }}
                >
                  {task.due}
                </span>
              </div>
            </div>

            {/* Checkbox */}
            <button className="w-4 h-4 border border-[var(--color-border)] flex-shrink-0 mt-0.5 group-hover:border-[var(--color-pine)] transition-colors" />
          </div>
        ))}
      </div>
    </div>
  );
}
