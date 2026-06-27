'use client';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProject } from '@/features/projects/hooks/useProject';
import { ProjectForm } from '@/features/projects/components/ProjectForm';
import { updateProject } from '@/lib/firebase/projects';
import type { ProjectUpdateInput } from '@/types/project';

interface Props {
  params: Promise<{ id: string }>;
}

export default function ProjectEditPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const { project, loading, error } = useProject(id);

  if (loading) {
    return (
      <div className="prj-page">
        <div className="prj-page__loading">Loading…</div>
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

  async function handleSubmit(data: Partial<ProjectUpdateInput>) {
    await updateProject(id, data);
    router.push(`/projects/${id}`);
  }

  return (
    <div className="prj-page">
      <div className="prj-page__header">
        <div>
          <Link href={`/projects/${id}`} className="prj-page__back-link">
            ← Back to Project
          </Link>
          <h1 className="prj-page__title">Edit Project</h1>
          <p className="prj-page__subtitle">{project.projectCode} — {project.name}</p>
        </div>
      </div>

      <div className="prj-page__form-wrap">
        <ProjectForm
          initial={project}
          onSubmit={handleSubmit}
          onCancel={() => router.push(`/projects/${id}`)}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
