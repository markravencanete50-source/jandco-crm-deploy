// ============================================================
// PHASE 5 — EMPLOYEES MODULE
// Firestore data access layer
//
// Assumes Phase 1 exported an initialized Firestore instance from
// '@/lib/firebase/config' as `db` (the standard Firebase v9+ modular
// pattern: `export const db = getFirestore(app)`).
// If your Phase 1 file exports it under a different name/path,
// just update the import below — nothing else in this file changes.
// ============================================================

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  type Unsubscribe,
  type QueryConstraint,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type {
  Employee,
  NewEmployeeInput,
  EmployeeUpdateInput,
  EmployeeFilters,
  Department,
  EmployeeStatus,
} from '@/types/employee';

const COLLECTION = 'employees';

function employeesRef() {
  return collection(db, COLLECTION);
}

/** Convert a Firestore doc into a typed Employee, normalizing timestamps. */
function toEmployee(id: string, data: Record<string, unknown>): Employee {
  const normalizeDate = (v: unknown): string => {
    if (v instanceof Timestamp) return v.toDate().toISOString();
    if (typeof v === 'string') return v;
    return new Date().toISOString();
  };

  return {
    ...(data as Omit<Employee, 'id'>),
    id,
    createdAt: normalizeDate(data.createdAt),
    updatedAt: normalizeDate(data.updatedAt),
  };
}

/** Generates the next sequential employee number, e.g. "EMP-0042". */
async function generateEmployeeNumber(): Promise<string> {
  const snapshot = await getDocs(employeesRef());
  const next = snapshot.size + 1;
  return `EMP-${String(next).padStart(4, '0')}`;
}

/** Fetch a single employee by id. Returns null if not found. */
export async function getEmployee(id: string): Promise<Employee | null> {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return toEmployee(snap.id, snap.data());
}

/** Fetch all employees, optionally filtered server-side by department/status. */
export async function listEmployees(filters?: EmployeeFilters): Promise<Employee[]> {
  const constraints: QueryConstraint[] = [];

  if (filters?.department && filters.department !== 'all') {
    constraints.push(where('department', '==', filters.department));
  }
  if (filters?.status && filters.status !== 'all') {
    constraints.push(where('status', '==', filters.status));
  }
  constraints.push(orderBy('lastName', 'asc'));

  const q = query(employeesRef(), ...constraints);
  const snap = await getDocs(q);
  let results = snap.docs.map((d) => toEmployee(d.id, d.data()));

  // Free-text search is done client-side since Firestore has no native
  // substring search across multiple fields.
  if (filters?.search) {
    const term = filters.search.toLowerCase();
    results = results.filter((e) =>
      [e.firstName, e.lastName, e.email, e.jobTitle, e.employeeNumber]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(term))
    );
  }

  if (filters?.managerId && filters.managerId !== 'all') {
    results = results.filter((e) => e.managerId === filters.managerId);
  }

  return results;
}

/** Real-time subscription to the employees collection. Returns an unsubscribe fn. */
export function subscribeToEmployees(
  onChange: (employees: Employee[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const q = query(employeesRef(), orderBy('lastName', 'asc'));
  return onSnapshot(
    q,
    (snap) => {
      onChange(snap.docs.map((d) => toEmployee(d.id, d.data())));
    },
    (err) => onError?.(err as Error)
  );
}

/** Create a new employee record. Auto-assigns employeeNumber + timestamps. */
export async function createEmployee(input: NewEmployeeInput): Promise<Employee> {
  const employeeNumber = await generateEmployeeNumber();
  const payload = {
    ...input,
    employeeNumber,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const ref = await addDoc(employeesRef(), payload);
  const created = await getDoc(ref);
  return toEmployee(created.id, created.data() as Record<string, unknown>);
}

/** Update an existing employee record (partial update). */
export async function updateEmployee(
  id: string,
  updates: EmployeeUpdateInput
): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

/** Soft-delete: marks the employee as terminated rather than removing the record. */
export async function offboardEmployee(id: string, terminationDate: string): Promise<void> {
  await updateEmployee(id, { status: 'terminated', terminationDate });
}

/** Hard delete — permanently removes the record. Use with caution. */
export async function deleteEmployee(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

/** Fetch employees reporting to a given manager (org chart helper). */
export async function getDirectReports(managerId: string): Promise<Employee[]> {
  const q = query(employeesRef(), where('managerId', '==', managerId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => toEmployee(d.id, d.data()));
}

/** Lightweight headcount aggregation by department, used by dashboard widgets. */
export async function getHeadcountByDepartment(): Promise<Record<Department, number>> {
  const snap = await getDocs(employeesRef());
  const counts: Partial<Record<Department, number>> = {};
  snap.docs.forEach((d) => {
    const dept = d.data().department as Department;
    counts[dept] = (counts[dept] ?? 0) + 1;
  });
  return counts as Record<Department, number>;
}

export async function getStatusBreakdown(): Promise<Record<EmployeeStatus, number>> {
  const snap = await getDocs(employeesRef());
  const counts: Partial<Record<EmployeeStatus, number>> = {};
  snap.docs.forEach((d) => {
    const status = d.data().status as EmployeeStatus;
    counts[status] = (counts[status] ?? 0) + 1;
  });
  return counts as Record<EmployeeStatus, number>;
}
