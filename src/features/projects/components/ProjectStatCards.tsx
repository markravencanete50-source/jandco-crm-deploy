'use client';
import type { ProjectStats } from '@/lib/firebase/projects';

interface Props { stats: ProjectStats; }

export function ProjectStatCards({ stats }: Props) {
  const cards = [
    { label: 'Total Projects', value: stats.total, color: '#6366f1' },
    { label: 'Active', value: stats.activeCount, color: '#10b981' },
    { label: 'Completed', value: stats.completedCount, color: '#3b82f6' },
    { label: 'At Risk', value: stats.atRiskCount, color: '#ef4444' },
    { label: 'Avg Completion', value: `${stats.avgCompletion}%`, color: '#f59e0b' },
  ];

  return (
    <div className="prj-stats">
      {cards.map((c) => (
        <div key={c.label} className="prj-stats__card">
          <div
            className="prj-stats__dot"
            style={{ background: c.color }}
          />
          <div className="prj-stats__value">{c.value}</div>
          <div className="prj-stats__label">{c.label}</div>
        </div>
      ))}
    </div>
  );
}
