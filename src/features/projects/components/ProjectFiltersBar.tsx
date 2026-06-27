'use client';
import { type ChangeEvent } from 'react';
import type { ProjectFilters } from '@/types/project';

interface Props {
  filters: ProjectFilters;
  onChange: (f: ProjectFilters) => void;
  view: 'board' | 'table';
  onViewChange: (v: 'board' | 'table') => void;
  totalCount: number;
  filteredCount: number;
}

export function ProjectFiltersBar({
  filters,
  onChange,
  view,
  onViewChange,
  totalCount,
  filteredCount,
}: Props) {
  const set = (k: keyof ProjectFilters, v: string) =>
    onChange({ ...filters, [k]: v || undefined });

  const sel = (k: keyof ProjectFilters) =>
    (e: ChangeEvent<HTMLSelectElement>) => set(k, e.target.value);

  const hasFilters =
    filters.search ||
    (filters.status && filters.status !== 'all') ||
    (filters.priority && filters.priority !== 'all') ||
    (filters.health && filters.health !== 'all') ||
    (filters.category && filters.category !== 'all');

  return (
    <div className="prj-filters">
      <div className="prj-filters__left">
        {/* Search */}
        <div className="prj-filters__search-wrap">
          <svg className="prj-filters__search-icon" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
          <input
            className="prj-filters__search"
            placeholder="Search projects…"
            value={filters.search ?? ''}
            onChange={(e) => set('search', e.target.value)}
          />
        </div>

        {/* Status */}
        <select
          className="prj-filters__select"
          value={filters.status ?? 'all'}
          onChange={sel('status')}
        >
          <option value="all">All Statuses</option>
          <option value="planning">Planning</option>
          <option value="active">Active</option>
          <option value="on-hold">On Hold</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        {/* Priority */}
        <select
          className="prj-filters__select"
          value={filters.priority ?? 'all'}
          onChange={sel('priority')}
        >
          <option value="all">All Priorities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        {/* Health */}
        <select
          className="prj-filters__select"
          value={filters.health ?? 'all'}
          onChange={sel('health')}
        >
          <option value="all">All Health</option>
          <option value="on-track">On Track</option>
          <option value="at-risk">At Risk</option>
          <option value="off-track">Off Track</option>
        </select>

        {/* Category */}
        <select
          className="prj-filters__select"
          value={filters.category ?? 'all'}
          onChange={sel('category')}
        >
          <option value="all">All Categories</option>
          <option value="client">Client</option>
          <option value="internal">Internal</option>
          <option value="product">Product</option>
          <option value="marketing">Marketing</option>
          <option value="infrastructure">Infrastructure</option>
          <option value="research">Research</option>
          <option value="other">Other</option>
        </select>

        {hasFilters && (
          <button
            className="prj-filters__clear"
            onClick={() => onChange({})}
          >
            Clear
          </button>
        )}
      </div>

      <div className="prj-filters__right">
        <span className="prj-filters__count">
          {filteredCount === totalCount
            ? `${totalCount} projects`
            : `${filteredCount} of ${totalCount}`}
        </span>

        {/* View toggle */}
        <div className="prj-filters__view-toggle">
          <button
            className={`prj-filters__view-btn${view === 'board' ? ' prj-filters__view-btn--active' : ''}`}
            onClick={() => onViewChange('board')}
            title="Board view"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <rect x="1" y="1" width="4" height="14" rx="1" />
              <rect x="6" y="1" width="4" height="14" rx="1" />
              <rect x="11" y="1" width="4" height="14" rx="1" />
            </svg>
          </button>
          <button
            className={`prj-filters__view-btn${view === 'table' ? ' prj-filters__view-btn--active' : ''}`}
            onClick={() => onViewChange('table')}
            title="Table view"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <rect x="1" y="1" width="14" height="3" rx="1" />
              <rect x="1" y="6" width="14" height="3" rx="1" />
              <rect x="1" y="11" width="14" height="3" rx="1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
