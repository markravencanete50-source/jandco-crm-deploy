'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createProject } from '@/lib/firebase/projects';
import { ProjectForm } from '@/features/projects/components/ProjectForm';
import type { NewProjectInput } from '@/types/project';

export default function NewProjectPage() {
  const router = useRouter();

  async function handleSubmit(data: Partial<NewProjectInput>) {
    const id = await createProject(data as NewProjectInput);
    router.push(`/projects/${id}`);
  }

  return (
    <div className="prj-page">
      <div className="prj-page__header">
        <div>
          <Link href="/projects" className="prj-page__back-link">
            ← Back to Projects
          </Link>
          <h1 className="prj-page__title">New Project</h1>
          <p className="prj-page__subtitle">
            Create a new project to track work, milestones, and team progress
          </p>
        </div>
      </div>

      <div className="prj-page__form-wrap">
        <ProjectForm
          onSubmit={handleSubmit}
          onCancel={() => router.push('/projects')}
          submitLabel="Create Project"
        />
      </div>
    </div>
  );
}
