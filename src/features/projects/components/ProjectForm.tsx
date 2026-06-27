'use client';
import { useState, type FormEvent } from 'react';
import type { Project, NewProjectInput, ProjectStatus, ProjectPriority, ProjectHealth, ProjectCategory } from '@/types/project';

type FormData = {
  name: string;
  description: string;
  category: ProjectCategory;
  status: ProjectStatus;
  priority: ProjectPriority;
  health: ProjectHealth;
  ownerId: string;
  startDate: string;
  targetEndDate: string;
  completionPct: number;
  budgetTotal: string;
  budgetCurrency: string;
};

const DEFAULTS: FormData = {
  name: '',
  description: '',
  category: 'internal',
  status: 'planning',
  priority: 'medium',
  health: 'on-track',
  ownerId: '',
  startDate: '',
  targetEndDate: '',
  completionPct: 0,
  budgetTotal: '',
  budgetCurrency: 'USD',
};

function toFormData(p: Project): FormData {
  return {
    name: p.name,
    description: p.description ?? '',
    category: p.category,
    status: p.status,
    priority: p.priority,
    health: p.health,
    ownerId: p.ownerId,
    startDate: p.startDate,
    targetEndDate: p.targetEndDate,
    completionPct: p.completionPct,
    budgetTotal: p.budget?.total?.toString() ?? '',
    budgetCurrency: p.budget?.currency ?? 'USD',
  };
}

interface Props {
  initial?: Project;
  onSubmit: (data: Partial<NewProjectInput>) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export function ProjectForm({ initial, onSubmit, onCancel, submitLabel = 'Save Project' }: Props) {
  const [form, setForm] = useState<FormData>(initial ? toFormData(initial) : DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof FormData, v: string | number) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setError('Project name is required'); return; }
    if (!form.startDate) { setError('Start date is required'); return; }
    if (!form.targetEndDate) { setError('Target end date is required'); return; }
    setSaving(true);
    setError(null);
    try {
      const payload: Partial<NewProjectInput> = {
        name: form.name.trim(),
        description: form.description || undefined,
        category: form.category,
        status: form.status,
        priority: form.priority,
        health: form.health,
        ownerId: form.ownerId,
        startDate: form.startDate,
        targetEndDate: form.targetEndDate,
        completionPct: Number(form.completionPct),
        members: initial?.members ?? [],
        milestones: initial?.milestones ?? [],
        budget: form.budgetTotal
          ? {
              currency: form.budgetCurrency,
              total: parseFloat(form.budgetTotal),
              spent: initial?.budget?.spent ?? 0,
              approved: initial?.budget?.approved ?? parseFloat(form.budgetTotal),
            }
          : undefined,
      };
      await onSubmit(payload);
    } catch {
      setError('Failed to save project. Please try again.');
      setSaving(false);
    }
  }

  return (
    <form className="prj-form" onSubmit={handleSubmit}>
      {error && <div className="prj-form__error">{error}</div>}

      {/* ── Basics ─────────────────────────────────────── */}
      <section className="prj-form__section">
        <h3 className="prj-form__section-title">Basic Information</h3>

        <div className="prj-form__field prj-form__field--full">
          <label className="prj-form__label">Project Name *</label>
          <input
            className="prj-form__input"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="e.g. Q3 Website Redesign"
          />
        </div>

        <div className="prj-form__field prj-form__field--full">
          <label className="prj-form__label">Description</label>
          <textarea
            className="prj-form__input prj-form__textarea"
            rows={3}
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Brief overview of the project goals…"
          />
        </div>

        <div className="prj-form__row">
          <div className="prj-form__field">
            <label className="prj-form__label">Category</label>
            <select className="prj-form__select" value={form.category} onChange={(e) => set('category', e.target.value as ProjectCategory)}>
              <option value="internal">Internal</option>
              <option value="client">Client</option>
              <option value="product">Product</option>
              <option value="marketing">Marketing</option>
              <option value="infrastructure">Infrastructure</option>
              <option value="research">Research</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="prj-form__field">
            <label className="prj-form__label">Status</label>
            <select className="prj-form__select" value={form.status} onChange={(e) => set('status', e.target.value as ProjectStatus)}>
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="on-hold">On Hold</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="prj-form__field">
            <label className="prj-form__label">Priority</label>
            <select className="prj-form__select" value={form.priority} onChange={(e) => set('priority', e.target.value as ProjectPriority)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div className="prj-form__field">
            <label className="prj-form__label">Health</label>
            <select className="prj-form__select" value={form.health} onChange={(e) => set('health', e.target.value as ProjectHealth)}>
              <option value="on-track">On Track</option>
              <option value="at-risk">At Risk</option>
              <option value="off-track">Off Track</option>
            </select>
          </div>
        </div>
      </section>

      {/* ── Timeline ───────────────────────────────────── */}
      <section className="prj-form__section">
        <h3 className="prj-form__section-title">Timeline</h3>

        <div className="prj-form__row">
          <div className="prj-form__field">
            <label className="prj-form__label">Start Date *</label>
            <input
              type="date"
              className="prj-form__input"
              value={form.startDate}
              onChange={(e) => set('startDate', e.target.value)}
            />
          </div>

          <div className="prj-form__field">
            <label className="prj-form__label">Target End Date *</label>
            <input
              type="date"
              className="prj-form__input"
              value={form.targetEndDate}
              onChange={(e) => set('targetEndDate', e.target.value)}
            />
          </div>

          <div className="prj-form__field">
            <label className="prj-form__label">Completion %</label>
            <input
              type="number"
              min={0}
              max={100}
              className="prj-form__input"
              value={form.completionPct}
              onChange={(e) => set('completionPct', e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* ── Budget ─────────────────────────────────────── */}
      <section className="prj-form__section">
        <h3 className="prj-form__section-title">Budget (Optional)</h3>

        <div className="prj-form__row">
          <div className="prj-form__field" style={{ maxWidth: 120 }}>
            <label className="prj-form__label">Currency</label>
            <select className="prj-form__select" value={form.budgetCurrency} onChange={(e) => set('budgetCurrency', e.target.value)}>
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
              <option value="EUR">EUR</option>
              <option value="PHP">PHP</option>
              <option value="AUD">AUD</option>
            </select>
          </div>

          <div className="prj-form__field">
            <label className="prj-form__label">Total Budget</label>
            <input
              type="number"
              min={0}
              className="prj-form__input"
              placeholder="0"
              value={form.budgetTotal}
              onChange={(e) => set('budgetTotal', e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* ── Actions ────────────────────────────────────── */}
      <div className="prj-form__actions">
        <button type="button" className="prj-form__btn prj-form__btn--cancel" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="prj-form__btn prj-form__btn--submit" disabled={saving}>
          {saving ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
