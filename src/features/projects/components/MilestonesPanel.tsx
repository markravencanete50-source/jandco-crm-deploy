'use client';
import { useState } from 'react';
import type { Project, Milestone, MilestoneStatus } from '@/types/project';
import { addMilestone, updateMilestone, removeMilestone } from '@/lib/firebase/projects';

const STATUS_COLOR: Record<MilestoneStatus, string> = {
  pending: '#6b7280',
  'in-progress': '#6366f1',
  completed: '#10b981',
  overdue: '#ef4444',
};

interface Props {
  project: Project;
  onProjectUpdate: (p: Project) => void;
}

export function MilestonesPanel({ project, onProjectUpdate }: Props) {
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleAdd() {
    if (!newTitle.trim() || !newDate) return;
    setSaving(true);
    const milestone: Omit<Milestone, 'id'> = {
      title: newTitle.trim(),
      dueDate: newDate,
      status: 'pending',
    };
    await addMilestone(project.id, project, milestone);
    const updated: Project = {
      ...project,
      milestones: [
        ...project.milestones,
        { ...milestone, id: crypto.randomUUID() },
      ],
    };
    onProjectUpdate(updated);
    setNewTitle('');
    setNewDate('');
    setAdding(false);
    setSaving(false);
  }

  async function toggleStatus(m: Milestone) {
    const next: MilestoneStatus =
      m.status === 'completed' ? 'pending' : 'completed';
    const updates: Partial<Milestone> = {
      status: next,
      completedAt: next === 'completed' ? new Date().toISOString() : null,
    };
    await updateMilestone(project.id, project, m.id, updates);
    const milestones = project.milestones.map((ms) =>
      ms.id === m.id ? { ...ms, ...updates } : ms,
    );
    onProjectUpdate({ ...project, milestones });
  }

  async function handleRemove(id: string) {
    await removeMilestone(project.id, project, id);
    onProjectUpdate({
      ...project,
      milestones: project.milestones.filter((m) => m.id !== id),
    });
  }

  const sorted = [...project.milestones].sort(
    (a, b) => a.dueDate.localeCompare(b.dueDate),
  );

  return (
    <div className="prj-milestones">
      <div className="prj-milestones__header">
        <span className="prj-milestones__title">
          Milestones
          <span className="prj-milestones__count">{project.milestones.length}</span>
        </span>
        <button
          className="prj-milestones__add-btn"
          onClick={() => setAdding(true)}
        >
          + Add
        </button>
      </div>

      {adding && (
        <div className="prj-milestones__new">
          <input
            className="prj-milestones__input"
            placeholder="Milestone title…"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            autoFocus
          />
          <input
            type="date"
            className="prj-milestones__input"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
          />
          <div className="prj-milestones__new-actions">
            <button
              className="prj-milestones__save-btn"
              onClick={handleAdd}
              disabled={saving || !newTitle.trim() || !newDate}
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              className="prj-milestones__cancel-btn"
              onClick={() => setAdding(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="prj-milestones__list">
        {sorted.length === 0 && !adding && (
          <div className="prj-milestones__empty">
            No milestones yet. Add one to track key dates.
          </div>
        )}
        {sorted.map((m) => (
          <div
            key={m.id}
            className={`prj-milestones__item${m.status === 'completed' ? ' prj-milestones__item--done' : ''}`}
          >
            <button
              className="prj-milestones__check"
              onClick={() => toggleStatus(m)}
              aria-label={m.status === 'completed' ? 'Mark pending' : 'Mark complete'}
            >
              {m.status === 'completed' ? (
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z" />
                </svg>
              ) : (
                <span className="prj-milestones__unchecked" />
              )}
            </button>

            <div className="prj-milestones__item-body">
              <span className="prj-milestones__item-title">{m.title}</span>
              <span className="prj-milestones__item-due">
                <span
                  className="prj-milestones__status-dot"
                  style={{ background: STATUS_COLOR[m.status] }}
                />
                {new Date(m.dueDate).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'short', year: 'numeric',
                })}
              </span>
            </div>

            <button
              className="prj-milestones__remove"
              onClick={() => handleRemove(m.id)}
              aria-label="Remove milestone"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
