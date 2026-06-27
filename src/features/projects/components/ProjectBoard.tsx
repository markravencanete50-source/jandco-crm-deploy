'use client';
import Link from 'next/link';
import type { Project, ProjectStatus } from '@/types/project';
import { STATUS_LABELS } from '@/types/project';
import { ProjectStatusBadge } from './ProjectStatusBadge';
import { PriorityBadge, HealthBadge } from './ProjectBadges';
import { ProgressBar } from './ProgressBar';

const BOARD_COLUMNS: ProjectStatus[] = [
  'planning',
  'active',
  'on-hold',
  'completed',
  'cancelled',
];

const COL_ACCENT: Record<ProjectStatus, string> = {
  planning: '#6366f1',
  active: '#10b981',
  'on-hold': '#f59e0b',
  completed: '#3b82f6',
  cancelled: '#6b7280',
};

interface Props { projects: Project[]; }

export function ProjectBoard({ projects }: Props) {
  const byStatus = BOARD_COLUMNS.reduce<Record<ProjectStatus, Project[]>>(
    (acc, s) => {
      acc[s] = projects.filter((p) => p.status === s);
      return acc;
    },
    {} as Record<ProjectStatus, Project[]>,
  );

  return (
    <div className="prj-board">
      {BOARD_COLUMNS.map((status) => {
        const cols = byStatus[status];
        return (
          <div key={status} className="prj-board__col">
            <div className="prj-board__col-header">
              <span
                className="prj-board__col-dot"
                style={{ background: COL_ACCENT[status] }}
              />
              <span className="prj-board__col-label">
                {STATUS_LABELS[status]}
              </span>
              <span className="prj-board__col-count">{cols.length}</span>
            </div>

            <div className="prj-board__cards">
              {cols.length === 0 && (
                <div className="prj-board__empty">No projects</div>
              )}
              {cols.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="prj-card"
                  style={{ borderTopColor: COL_ACCENT[status] }}
                >
                  <div className="prj-card__code">{p.projectCode}</div>
                  <div className="prj-card__name">{p.name}</div>

                  {p.description && (
                    <div className="prj-card__desc">{p.description}</div>
                  )}

                  <div className="prj-card__badges">
                    <PriorityBadge priority={p.priority} size="sm" />
                    <HealthBadge health={p.health} size="sm" />
                  </div>

                  <div className="prj-card__progress">
                    <ProgressBar value={p.completionPct} size="sm" showLabel />
                  </div>

                  <div className="prj-card__footer">
                    <span className="prj-card__due">
                      Due {new Date(p.targetEndDate).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: '2-digit',
                      })}
                    </span>
                    <span className="prj-card__members">
                      {p.members.length} member{p.members.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
