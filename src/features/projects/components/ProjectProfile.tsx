'use client';
import { useState } from 'react';
import type { Project, ProjectComment } from '@/types/project';
import { ProjectStatusBadge } from './ProjectStatusBadge';
import { PriorityBadge, HealthBadge } from './ProjectBadges';
import { ProgressBar } from './ProgressBar';
import { MilestonesPanel } from './MilestonesPanel';
import { CommentsPanel } from './CommentsPanel';

type Tab = 'overview' | 'milestones' | 'team' | 'activity';

interface Props {
  project: Project;
  comments: ProjectComment[];
  onProjectUpdate: (p: Project) => void;
  currentUserId?: string;
}

export function ProjectProfile({
  project,
  comments,
  onProjectUpdate,
  currentUserId,
}: Props) {
  const [tab, setTab] = useState<Tab>('overview');

  const completedMilestones = project.milestones.filter(
    (m) => m.status === 'completed',
  ).length;

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
    });

  return (
    <div className="prj-profile">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="prj-profile__header">
        <div className="prj-profile__header-main">
          <div className="prj-profile__code">{project.projectCode}</div>
          <h1 className="prj-profile__name">{project.name}</h1>
          {project.description && (
            <p className="prj-profile__desc">{project.description}</p>
          )}
          <div className="prj-profile__badges">
            <ProjectStatusBadge status={project.status} />
            <PriorityBadge priority={project.priority} />
            <HealthBadge health={project.health} />
          </div>
        </div>

        <div className="prj-profile__header-stats">
          <div className="prj-profile__stat">
            <span className="prj-profile__stat-label">Completion</span>
            <span className="prj-profile__stat-value">{project.completionPct}%</span>
            <ProgressBar value={project.completionPct} size="md" />
          </div>
          <div className="prj-profile__stat">
            <span className="prj-profile__stat-label">Milestones</span>
            <span className="prj-profile__stat-value">
              {completedMilestones} / {project.milestones.length}
            </span>
          </div>
          {project.budget && (
            <div className="prj-profile__stat">
              <span className="prj-profile__stat-label">Budget</span>
              <span className="prj-profile__stat-value">
                {project.budget.currency}{' '}
                {project.budget.total.toLocaleString()}
              </span>
              <ProgressBar
                value={Math.round(
                  (project.budget.spent / project.budget.total) * 100,
                )}
                size="sm"
                color="#f59e0b"
              />
              <span className="prj-profile__budget-sub">
                {project.budget.currency} {project.budget.spent.toLocaleString()} spent
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Tabs ───────────────────────────────────────── */}
      <div className="prj-profile__tabs">
        {(['overview', 'milestones', 'team', 'activity'] as Tab[]).map((t) => (
          <button
            key={t}
            className={`prj-profile__tab${tab === t ? ' prj-profile__tab--active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
            {t === 'milestones' && (
              <span className="prj-profile__tab-count">
                {project.milestones.length}
              </span>
            )}
            {t === 'team' && (
              <span className="prj-profile__tab-count">
                {project.members.length}
              </span>
            )}
            {t === 'activity' && (
              <span className="prj-profile__tab-count">{comments.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Tab content ────────────────────────────────── */}
      <div className="prj-profile__body">
        {tab === 'overview' && (
          <div className="prj-profile__overview">
            <div className="prj-profile__info-grid">
              <div className="prj-profile__info-item">
                <span className="prj-profile__info-label">Category</span>
                <span className="prj-profile__info-value">{project.category}</span>
              </div>
              <div className="prj-profile__info-item">
                <span className="prj-profile__info-label">Start Date</span>
                <span className="prj-profile__info-value">{fmt(project.startDate)}</span>
              </div>
              <div className="prj-profile__info-item">
                <span className="prj-profile__info-label">Target End Date</span>
                <span className="prj-profile__info-value">{fmt(project.targetEndDate)}</span>
              </div>
              {project.actualEndDate && (
                <div className="prj-profile__info-item">
                  <span className="prj-profile__info-label">Actual End Date</span>
                  <span className="prj-profile__info-value">
                    {fmt(project.actualEndDate)}
                  </span>
                </div>
              )}
              <div className="prj-profile__info-item">
                <span className="prj-profile__info-label">Created</span>
                <span className="prj-profile__info-value">
                  {fmt(project.createdAt)}
                </span>
              </div>
              <div className="prj-profile__info-item">
                <span className="prj-profile__info-label">Last Updated</span>
                <span className="prj-profile__info-value">
                  {fmt(project.updatedAt)}
                </span>
              </div>
            </div>

            {/* Quick milestone preview */}
            {project.milestones.length > 0 && (
              <div className="prj-profile__mini-milestones">
                <h4 className="prj-profile__section-heading">Upcoming Milestones</h4>
                {project.milestones
                  .filter((m) => m.status !== 'completed')
                  .slice(0, 3)
                  .map((m) => (
                    <div key={m.id} className="prj-profile__mini-ms">
                      <span className="prj-profile__mini-ms-title">{m.title}</span>
                      <span className="prj-profile__mini-ms-date">
                        {fmt(m.dueDate)}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {tab === 'milestones' && (
          <MilestonesPanel
            project={project}
            onProjectUpdate={onProjectUpdate}
          />
        )}

        {tab === 'team' && (
          <div className="prj-profile__team">
            {project.members.length === 0 ? (
              <div className="prj-profile__empty">No team members assigned.</div>
            ) : (
              project.members.map((m) => (
                <div key={m.employeeId} className="prj-profile__member">
                  <div className="prj-profile__member-avatar">
                    {m.employeeId[0]?.toUpperCase() ?? '?'}
                  </div>
                  <div className="prj-profile__member-info">
                    <span className="prj-profile__member-id">{m.employeeId}</span>
                    <span className="prj-profile__member-role">{m.role}</span>
                  </div>
                  <span className="prj-profile__member-joined">
                    Joined {fmt(m.joinedAt)}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'activity' && (
          <CommentsPanel
            projectId={project.id}
            comments={comments}
            currentUserId={currentUserId}
          />
        )}
      </div>
    </div>
  );
}
