// ============================================================
// PHASE 6 — PROJECTS MODULE
// useProject — single-record hook with comments subscription
// ============================================================
'use client';

import { useEffect, useState } from 'react';
import { getProject, subscribeToComments } from '@/lib/firebase/projects';
import type { Project, ProjectComment } from '@/types/project';

export function useProject(id: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [comments, setComments] = useState<ProjectComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getProject(id)
      .then((p) => {
        setProject(p);
        setLoading(false);
        if (!p) setError('Project not found');
      })
      .catch(() => {
        setError('Failed to load project');
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const unsub = subscribeToComments(id, setComments);
    return unsub;
  }, [id]);

  return { project, setProject, comments, loading, error };
}
