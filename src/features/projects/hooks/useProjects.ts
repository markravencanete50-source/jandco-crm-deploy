// ============================================================
// PHASE 6 — PROJECTS MODULE
// useProjects — live list hook with client-side filter + sort
// ============================================================
'use client';

import { useEffect, useMemo, useState } from 'react';
import { subscribeToProjects } from '@/lib/firebase/projects';
import type { Project, ProjectFilters, ProjectSort } from '@/types/project';

export function useProjects(
  filters?: ProjectFilters,
  sort?: ProjectSort,
) {
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeToProjects((data) => {
      setAllProjects(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const projects = useMemo(() => {
    let result = [...allProjects];

    if (filters) {
      const { search, status, priority, health, category, ownerId } = filters;
      if (search) {
        const q = search.toLowerCase();
        result = result.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.projectCode.toLowerCase().includes(q) ||
            (p.description ?? '').toLowerCase().includes(q),
        );
      }
      if (status && status !== 'all') result = result.filter((p) => p.status === status);
      if (priority && priority !== 'all') result = result.filter((p) => p.priority === priority);
      if (health && health !== 'all') result = result.filter((p) => p.health === health);
      if (category && category !== 'all') result = result.filter((p) => p.category === category);
      if (ownerId && ownerId !== 'all') result = result.filter((p) => p.ownerId === ownerId);
    }

    if (sort) {
      const { field, direction } = sort;
      const mul = direction === 'asc' ? 1 : -1;
      result.sort((a, b) => {
        let av: string | number = '';
        let bv: string | number = '';
        switch (field) {
          case 'name': av = a.name; bv = b.name; break;
          case 'status': av = a.status; bv = b.status; break;
          case 'priority': {
            const ord = { critical: 4, high: 3, medium: 2, low: 1 };
            av = ord[a.priority]; bv = ord[b.priority]; break;
          }
          case 'startDate': av = a.startDate; bv = b.startDate; break;
          case 'targetEndDate': av = a.targetEndDate; bv = b.targetEndDate; break;
          case 'completionPct': av = a.completionPct; bv = b.completionPct; break;
        }
        if (av < bv) return -1 * mul;
        if (av > bv) return 1 * mul;
        return 0;
      });
    }

    return result;
  }, [allProjects, filters, sort]);

  return { projects, allProjects, loading, error };
}
