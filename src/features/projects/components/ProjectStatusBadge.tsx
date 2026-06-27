'use client';
import type { ProjectStatus } from '@/types/project';
import { STATUS_LABELS } from '@/types/project';

const COLOR: Record<ProjectStatus, string> = {
  planning: '#6366f1',
  active: '#10b981',
  'on-hold': '#f59e0b',
  completed: '#3b82f6',
  cancelled: '#6b7280',
};

interface Props { status: ProjectStatus; size?: 'sm' | 'md'; }

export function ProjectStatusBadge({ status, size = 'md' }: Props) {
  const color = COLOR[status];
  const pad = size === 'sm' ? '.2rem .5rem' : '.25rem .625rem';
  const fs = size === 'sm' ? '.7rem' : '.75rem';
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '.35rem',
        padding: pad,
        borderRadius: '999px',
        fontSize: fs,
        fontWeight: 600,
        color,
        background: `${color}1a`,
        border: `1px solid ${color}40`,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: color,
          flexShrink: 0,
        }}
      />
      {STATUS_LABELS[status]}
    </span>
  );
}
