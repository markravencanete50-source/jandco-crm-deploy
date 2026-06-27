// ============================================================
// PHASE 6 — PROJECTS MODULE
// Core data model
// ============================================================

export type ProjectStatus =
  | 'planning'
  | 'active'
  | 'on-hold'
  | 'completed'
  | 'cancelled';

export type ProjectPriority = 'low' | 'medium' | 'high' | 'critical';

export type ProjectHealth = 'on-track' | 'at-risk' | 'off-track';

export type MilestoneStatus = 'pending' | 'in-progress' | 'completed' | 'overdue';

export type ProjectCategory =
  | 'internal'
  | 'client'
  | 'research'
  | 'infrastructure'
  | 'product'
  | 'marketing'
  | 'other';

export interface Milestone {
  id: string;
  title: string;
  dueDate: string; // ISO date
  status: MilestoneStatus;
  description?: string;
  assigneeId?: string; // Employee id
  completedAt?: string | null;
}

export interface ProjectMember {
  employeeId: string;
  role: 'lead' | 'contributor' | 'reviewer' | 'stakeholder';
  joinedAt: string; // ISO date
}

export interface ProjectComment {
  id: string;
  authorId: string; // Employee id
  body: string;
  createdAt: string; // ISO datetime
  updatedAt?: string;
  attachmentUrls?: string[];
}

export interface BudgetSnapshot {
  currency: string;
  total: number;
  spent: number;
  approved: number;
}

export interface ProjectTag {
  id: string;
  label: string;
  color: string; // hex
}

/**
 * Core Project record stored in Firestore collection `projects`.
 */
export interface Project {
  id: string;
  projectCode: string; // e.g. "PRJ-0012"

  // Core fields
  name: string;
  description?: string;
  category: ProjectCategory;
  status: ProjectStatus;
  priority: ProjectPriority;
  health: ProjectHealth;

  // Ownership
  ownerId: string; // Employee id — project lead
  clientId?: string | null; // Future: link to Companies/Contacts

  // Team
  members: ProjectMember[];

  // Timeline
  startDate: string; // ISO date
  targetEndDate: string; // ISO date
  actualEndDate?: string | null;

  // Progress
  completionPct: number; // 0–100

  // Budget
  budget?: BudgetSnapshot;

  // Structure
  milestones: Milestone[];
  tags?: ProjectTag[];
  attachmentUrls?: string[];

  // System
  createdAt: string; // ISO datetime
  updatedAt: string;
  createdBy?: string;
}

export type NewProjectInput = Omit<
  Project,
  'id' | 'createdAt' | 'updatedAt' | 'projectCode'
>;
export type ProjectUpdateInput = Partial<Omit<Project, 'id' | 'createdAt'>>;

export interface ProjectFilters {
  search?: string;
  status?: ProjectStatus | 'all';
  priority?: ProjectPriority | 'all';
  health?: ProjectHealth | 'all';
  category?: ProjectCategory | 'all';
  ownerId?: string | 'all';
}

export type ProjectSortField =
  | 'name'
  | 'status'
  | 'priority'
  | 'startDate'
  | 'targetEndDate'
  | 'completionPct';

export interface ProjectSort {
  field: ProjectSortField;
  direction: 'asc' | 'desc';
}

// ── Display helpers ───────────────────────────────────────────

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  planning: 'Planning',
  active: 'Active',
  'on-hold': 'On Hold',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const PRIORITY_LABELS: Record<ProjectPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

export const HEALTH_LABELS: Record<ProjectHealth, string> = {
  'on-track': 'On Track',
  'at-risk': 'At Risk',
  'off-track': 'Off Track',
};

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  internal: 'Internal',
  client: 'Client',
  research: 'Research',
  infrastructure: 'Infrastructure',
  product: 'Product',
  marketing: 'Marketing',
  other: 'Other',
};

export const MILESTONE_STATUS_LABELS: Record<MilestoneStatus, string> = {
  pending: 'Pending',
  'in-progress': 'In Progress',
  completed: 'Completed',
  overdue: 'Overdue',
};
