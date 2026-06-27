'use client';
import type { ProjectPriority, ProjectHealth } from '@/types/project';
import { PRIORITY_LABELS, HEALTH_LABELS } from '@/types/project';

// ── Priority ─────────────────────────────────────────────────

const PRIORITY_COLOR: Record<ProjectPriority, string> = {
  low: '#6b7280',
  medium: '#3b82f6',
  high: '#f59e0b',
  critical: '#ef4444',
};

interface PriorityProps { priority: ProjectPriority; size?: 'sm' | 'md'; }

export function PriorityBadge({ priority, size = 'md' }: PriorityProps) {
  const color = PRIORITY_COLOR[priority];
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
      {priority === 'critical' && (
        <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 3.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4.5zm0 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
        </svg>
      )}
      {PRIORITY_LABELS[priority]}
    </span>
  );
}

// ── Health ────────────────────────────────────────────────────

const HEALTH_COLOR: Record<ProjectHealth, string> = {
  'on-track': '#10b981',
  'at-risk': '#f59e0b',
  'off-track': '#ef4444',
};

interface HealthProps { health: ProjectHealth; size?: 'sm' | 'md'; }

export function HealthBadge({ health, size = 'md' }: HealthProps) {
  const color = HEALTH_COLOR[health];
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
      {HEALTH_LABELS[health]}
    </span>
  );
}
