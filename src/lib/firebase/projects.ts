// ============================================================
// PHASE 6 — PROJECTS MODULE
// Firestore data access layer
// Assumes firebase is initialised at @/lib/firebase/config
// (established in Phase 1)
// ============================================================

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  type QuerySnapshot,
  type DocumentData,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type {
  Project,
  NewProjectInput,
  ProjectUpdateInput,
  Milestone,
  ProjectComment,
  ProjectStatus,
} from '@/types/project';

const COL = 'projects';
const COMMENTS_SUB = 'comments';

// ── Helpers ───────────────────────────────────────────────────

let _counter = 1000;
function nextProjectCode(): string {
  _counter += 1;
  return `PRJ-${String(_counter).padStart(4, '0')}`;
}

function toProject(id: string, data: DocumentData): Project {
  const ts = (v: unknown) =>
    v instanceof Timestamp ? v.toDate().toISOString() : (v as string) ?? '';
  return {
    ...(data as Omit<Project, 'id' | 'createdAt' | 'updatedAt'>),
    id,
    createdAt: ts(data.createdAt),
    updatedAt: ts(data.updatedAt),
  };
}

function toComment(id: string, data: DocumentData): ProjectComment {
  const ts = (v: unknown) =>
    v instanceof Timestamp ? v.toDate().toISOString() : (v as string) ?? '';
  return {
    ...(data as Omit<ProjectComment, 'id' | 'createdAt'>),
    id,
    createdAt: ts(data.createdAt),
  };
}

// ── Project CRUD ──────────────────────────────────────────────

export async function createProject(input: NewProjectInput): Promise<string> {
  const ref = await addDoc(collection(db, COL), {
    ...input,
    projectCode: nextProjectCode(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getProject(id: string): Promise<Project | null> {
  const snap = await getDoc(doc(db, COL, id));
  if (!snap.exists()) return null;
  return toProject(snap.id, snap.data());
}

export async function updateProject(
  id: string,
  input: ProjectUpdateInput,
): Promise<void> {
  await updateDoc(doc(db, COL, id), { ...input, updatedAt: serverTimestamp() });
}

export async function deleteProject(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}

export async function listProjects(): Promise<Project[]> {
  const snap: QuerySnapshot = await getDocs(
    query(collection(db, COL), orderBy('createdAt', 'desc')),
  );
  return snap.docs.map((d) => toProject(d.id, d.data()));
}

/** Real-time subscription — returns unsubscribe fn */
export function subscribeToProjects(
  cb: (projects: Project[]) => void,
): () => void {
  return onSnapshot(
    query(collection(db, COL), orderBy('createdAt', 'desc')),
    (snap) => cb(snap.docs.map((d) => toProject(d.id, d.data()))),
  );
}

/** Projects owned by a specific employee */
export async function getProjectsByOwner(ownerId: string): Promise<Project[]> {
  const snap = await getDocs(
    query(collection(db, COL), where('ownerId', '==', ownerId)),
  );
  return snap.docs.map((d) => toProject(d.id, d.data()));
}

/** Projects a member belongs to */
export async function getProjectsByMember(employeeId: string): Promise<Project[]> {
  // Firestore array-contains on objects requires the exact object shape;
  // instead we store a flat memberIds array for efficient querying.
  const snap = await getDocs(
    query(collection(db, COL), where('memberIds', 'array-contains', employeeId)),
  );
  return snap.docs.map((d) => toProject(d.id, d.data()));
}

// ── Milestones (embedded in project doc) ─────────────────────

export async function addMilestone(
  projectId: string,
  project: Project,
  milestone: Omit<Milestone, 'id'>,
): Promise<void> {
  const newMilestone: Milestone = {
    ...milestone,
    id: crypto.randomUUID(),
  };
  await updateDoc(doc(db, COL, projectId), {
    milestones: [...project.milestones, newMilestone],
    updatedAt: serverTimestamp(),
  });
}

export async function updateMilestone(
  projectId: string,
  project: Project,
  milestoneId: string,
  updates: Partial<Milestone>,
): Promise<void> {
  const milestones = project.milestones.map((m) =>
    m.id === milestoneId ? { ...m, ...updates } : m,
  );
  await updateDoc(doc(db, COL, projectId), {
    milestones,
    updatedAt: serverTimestamp(),
  });
}

export async function removeMilestone(
  projectId: string,
  project: Project,
  milestoneId: string,
): Promise<void> {
  await updateDoc(doc(db, COL, projectId), {
    milestones: project.milestones.filter((m) => m.id !== milestoneId),
    updatedAt: serverTimestamp(),
  });
}

// ── Comments (subcollection) ──────────────────────────────────

export async function addComment(
  projectId: string,
  comment: Omit<ProjectComment, 'id' | 'createdAt'>,
): Promise<string> {
  const ref = await addDoc(
    collection(db, COL, projectId, COMMENTS_SUB),
    { ...comment, createdAt: serverTimestamp() },
  );
  return ref.id;
}

export function subscribeToComments(
  projectId: string,
  cb: (comments: ProjectComment[]) => void,
): () => void {
  return onSnapshot(
    query(
      collection(db, COL, projectId, COMMENTS_SUB),
      orderBy('createdAt', 'asc'),
    ),
    (snap) => cb(snap.docs.map((d) => toComment(d.id, d.data()))),
  );
}

export async function deleteComment(
  projectId: string,
  commentId: string,
): Promise<void> {
  await deleteDoc(doc(db, COL, projectId, COMMENTS_SUB, commentId));
}

// ── Aggregation helpers ───────────────────────────────────────

export interface ProjectStats {
  total: number;
  byStatus: Record<ProjectStatus, number>;
  activeCount: number;
  completedCount: number;
  atRiskCount: number;
  avgCompletion: number;
}

export function computeProjectStats(projects: Project[]): ProjectStats {
  const byStatus = {
    planning: 0,
    active: 0,
    'on-hold': 0,
    completed: 0,
    cancelled: 0,
  } as Record<ProjectStatus, number>;
  let totalCompletion = 0;
  let atRiskCount = 0;

  for (const p of projects) {
    byStatus[p.status] = (byStatus[p.status] ?? 0) + 1;
    totalCompletion += p.completionPct;
    if (p.health === 'at-risk' || p.health === 'off-track') atRiskCount += 1;
  }

  return {
    total: projects.length,
    byStatus,
    activeCount: byStatus.active,
    completedCount: byStatus.completed,
    atRiskCount,
    avgCompletion: projects.length
      ? Math.round(totalCompletion / projects.length)
      : 0,
  };
}
