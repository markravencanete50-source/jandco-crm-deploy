'use client';

import React from 'react';
import type { EmployeeFilters, Department, EmployeeStatus, EmploymentType } from '@/types/employee';
import { DEPARTMENT_LABELS, STATUS_LABELS, EMPLOYMENT_TYPE_LABELS } from '@/types/employee';

interface EmployeeFiltersBarProps {
  filters: EmployeeFilters;
  onChange: (filters: EmployeeFilters) => void;
  totalCount: number;
  filteredCount: number;
  view: 'table' | 'grid';
  onViewChange: (view: 'table' | 'grid') => void;
  onAddNew: () => void;
}

export function EmployeeFiltersBar({
  filters,
  onChange,
  totalCount,
  filteredCount,
  view,
  onViewChange,
  onAddNew,
}: EmployeeFiltersBarProps) {
  return (
    <div className="emp-filters">
      <div className="emp-filters__row">
        <div className="emp-filters__search">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
            <circle cx="7" cy="7" r="4.5" />
            <path d="M10.5 10.5L14 14" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, email, title, or ID..."
            value={filters.search ?? ''}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="emp-filters__search-input"
            aria-label="Search employees"
          />
        </div>

        <select
          className="emp-filters__select"
          value={filters.department ?? 'all'}
          onChange={(e) => onChange({ ...filters, department: e.target.value as Department | 'all' })}
          aria-label="Filter by department"
        >
          <option value="all">All departments</option>
          {Object.entries(DEPARTMENT_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>

        <select
          className="emp-filters__select"
          value={filters.status ?? 'all'}
          onChange={(e) => onChange({ ...filters, status: e.target.value as EmployeeStatus | 'all' })}
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          {Object.entries(STATUS_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>

        <select
          className="emp-filters__select"
          value={filters.employmentType ?? 'all'}
          onChange={(e) => onChange({ ...filters, employmentType: e.target.value as EmploymentType | 'all' })}
          aria-label="Filter by employment type"
        >
          <option value="all">All types</option>
          {Object.entries(EMPLOYMENT_TYPE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>

        <div className="emp-filters__view-toggle" role="group" aria-label="View mode">
          <button
            className={`emp-filters__view-btn ${view === 'table' ? 'emp-filters__view-btn--active' : ''}`}
            onClick={() => onViewChange('table')}
            aria-pressed={view === 'table'}
            aria-label="Table view"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <rect x="2" y="3" width="12" height="2.5" rx="0.5" />
              <rect x="2" y="7" width="12" height="2.5" rx="0.5" />
              <rect x="2" y="11" width="12" height="2.5" rx="0.5" />
            </svg>
          </button>
          <button
            className={`emp-filters__view-btn ${view === 'grid' ? 'emp-filters__view-btn--active' : ''}`}
            onClick={() => onViewChange('grid')}
            aria-pressed={view === 'grid'}
            aria-label="Grid view"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <rect x="2" y="2" width="5" height="5" rx="1" />
              <rect x="9" y="2" width="5" height="5" rx="1" />
              <rect x="2" y="9" width="5" height="5" rx="1" />
              <rect x="9" y="9" width="5" height="5" rx="1" />
            </svg>
          </button>
        </div>

        <button className="emp-filters__add-btn" onClick={onAddNew}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M7.5 2v11M2 7.5h11" />
          </svg>
          Add employee
        </button>
      </div>

      <div className="emp-filters__meta">
        Showing <strong>{filteredCount}</strong> of <strong>{totalCount}</strong> employees
      </div>
    </div>
  );
}
