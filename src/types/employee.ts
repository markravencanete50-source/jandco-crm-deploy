// ============================================================
// PHASE 5 — EMPLOYEES MODULE
// Core data model
// ============================================================

export type EmployeeStatus = 'active' | 'on-leave' | 'suspended' | 'terminated';

export type EmploymentType = 'full-time' | 'part-time' | 'contractor' | 'intern';

export type Department =
  | 'engineering'
  | 'sales'
  | 'marketing'
  | 'support'
  | 'finance'
  | 'hr'
  | 'operations'
  | 'product'
  | 'design'
  | 'executive';

export interface EmployeeAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface CompensationRecord {
  id: string;
  effectiveDate: string; // ISO date
  baseSalary: number;
  currency: string;
  payFrequency: 'monthly' | 'biweekly' | 'weekly' | 'annual';
  note?: string;
}

export interface EmployeeDocument {
  id: string;
  name: string;
  type: 'contract' | 'id' | 'tax' | 'review' | 'other';
  url: string;
  uploadedAt: string; // ISO date
}

export interface TimeOffBalance {
  vacationDaysTotal: number;
  vacationDaysUsed: number;
  sickDaysTotal: number;
  sickDaysUsed: number;
}

/**
 * Core Employee record stored in Firestore collection `employees`.
 */
export interface Employee {
  id: string;
  employeeNumber: string; // e.g. "EMP-0042"

  // Identity
  firstName: string;
  lastName: string;
  preferredName?: string;
  avatarUrl?: string;
  email: string;
  phone?: string;
  dateOfBirth?: string; // ISO date

  // Role
  jobTitle: string;
  department: Department;
  employmentType: EmploymentType;
  status: EmployeeStatus;
  managerId?: string | null; // self-reference to another Employee.id
  hireDate: string; // ISO date
  terminationDate?: string | null;

  // Location
  location?: string; // office / site name
  address?: EmployeeAddress;
  remote?: boolean;

  // HR detail
  compensation?: CompensationRecord[];
  timeOff?: TimeOffBalance;
  emergencyContact?: EmergencyContact;
  documents?: EmployeeDocument[];
  skills?: string[];
  notes?: string;

  // System
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
  createdBy?: string;
}

/** Shape used when creating a new employee (before id/timestamps are assigned) */
export type NewEmployeeInput = Omit<
  Employee,
  'id' | 'createdAt' | 'updatedAt' | 'employeeNumber'
>;

/** Shape used for partial updates */
export type EmployeeUpdateInput = Partial<Omit<Employee, 'id' | 'createdAt'>>;

export interface EmployeeFilters {
  search?: string;
  department?: Department | 'all';
  status?: EmployeeStatus | 'all';
  employmentType?: EmploymentType | 'all';
  managerId?: string | 'all';
}

export type EmployeeSortField =
  | 'name'
  | 'department'
  | 'hireDate'
  | 'jobTitle'
  | 'status';

export interface EmployeeSort {
  field: EmployeeSortField;
  direction: 'asc' | 'desc';
}

// ── Display helpers / lookup tables ───────────────────────────

export const DEPARTMENT_LABELS: Record<Department, string> = {
  engineering: 'Engineering',
  sales: 'Sales',
  marketing: 'Marketing',
  support: 'Support',
  finance: 'Finance',
  hr: 'Human Resources',
  operations: 'Operations',
  product: 'Product',
  design: 'Design',
  executive: 'Executive',
};

export const STATUS_LABELS: Record<EmployeeStatus, string> = {
  active: 'Active',
  'on-leave': 'On Leave',
  suspended: 'Suspended',
  terminated: 'Terminated',
};

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  contractor: 'Contractor',
  intern: 'Intern',
};

export function getFullName(e: Pick<Employee, 'firstName' | 'lastName'>): string {
  return `${e.firstName} ${e.lastName}`.trim();
}

export function getInitials(e: Pick<Employee, 'firstName' | 'lastName'>): string {
  const a = e.firstName?.[0] ?? '';
  const b = e.lastName?.[0] ?? '';
  return (a + b).toUpperCase();
}
