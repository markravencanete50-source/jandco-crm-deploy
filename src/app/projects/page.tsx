'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useProjects } from '@/features/projects/hooks/useProjects';
import { computeProjectStats } from '@/lib/firebase/projects';
import { ProjectStatCards } from '@/features/projects/components/ProjectStatCards';
import { ProjectFiltersBar } from '@/features/projects/components/ProjectFiltersBar';
import { ProjectBoard } from '@/features/projects/components/ProjectBoard';
import { ProjectTable } from '@/features/projects/components/ProjectTable';
import type { ProjectFilters, ProjectSort, ProjectSortField } from '@/types/project';

export default function ProjectsPage() {
  const [filters, setFilters] = useState<ProjectFilters>({});
  const [sort, setSort] = useState<ProjectSort>({ field: 'targetEndDate', direction: 'asc' });
  const [view, setView] = useState<'board' | 'table'>('board');

  const { projects, allProjects, loading, error } = useProjects(filters, sort);

  const stats = useMemo(() => computeProjectStats(allProjects), [allProjects]);

  function handleSort(field: ProjectSortField) {
    setSort((s) =>
      s.field === field
        ? { field, direction: s.direction === 'asc' ? 'desc' : 'asc' }
        : { field, direction: 'asc' },
    );
  }

  return (
    <div className="prj-page">
      {/* Header */}
      <div className="prj-page__header">
        <div>
          <h1 className="prj-page__title">Projects</h1>
          <p className="prj-page__subtitle">
            Track project status, milestones, and team assignments
          </p>
        </div>
        <Link href="/projects/new" className="prj-page__new-btn">
          + New Project
        </Link>
      </div>

      {/* Stats */}
      {!loading && <ProjectStatCards stats={stats} />}

      {/* Filters */}
      <ProjectFiltersBar
        filters={filters}
        onChange={setFilters}
        view={view}
        onViewChange={setView}
        totalCount={allProjects.length}
        filteredCount={projects.length}
      />

      {/* Content */}
      {loading && (
        <div className="prj-page__loading">Loading projects…</div>
      )}

      {error && (
        <div className="prj-page__error">{error}</div>
      )}

      {!loading && !error && view === 'board' && (
        <ProjectBoard projects={projects} />
      )}

      {!loading && !error && view === 'table' && (
        <ProjectTable projects={projects} sort={sort} onSort={handleSort} />
      )}
    </div>
  );
}
