'use client';
import { use } from 'react';
import Link from 'next/link';
import { useProject } from '@/features/projects/hooks/useProject';
import { ProjectProfile } from '@/features/projects/components/ProjectProfile';
import type { Project } from '@/types/project';

interface Props {
  params: Promise<{ id: string }>;
}

export default function ProjectDetailPage({ params }: Props) {
  const { id } = use(params);
  const { project, setProject, comments, loading, error } = useProject(id);

  if (loading) {
    return (
      <div className="prj-page">
        <div className="prj-page__loading">Loading project…</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="prj-page">
        <div className="prj-page__error">{error ?? 'Project not found'}</div>
        <Link href="/projects" className="prj-page__back-link">
          ← Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="prj-page">
      <div className="prj-page__header">
        <Link href="/projects" className="prj-page__back-link">
          ← Back to Projects
        </Link>
        <Link href={`/projects/${id}/edit`} className="prj-page__edit-btn">
          Edit Project
        </Link>
      </div>

      <ProjectProfile
        project={project}
        comments={comments}
        onProjectUpdate={(p: Project) => setProject(p)}
      />
    </div>
  );
}
