'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  subscribeToEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  offboardEmployee,
} from '@/lib/firebase/employees';
import type {
  Employee,
  EmployeeFilters,
  EmployeeSort,
  NewEmployeeInput,
  EmployeeUpdateInput,
} from '@/types/employee';
import { getFullName } from '@/types/employee';

interface UseEmployeesResult {
  employees: Employee[];
  allEmployees: Employee[];
  totalCount: number;
  loading: boolean;
  error: string | null;
  filters: EmployeeFilters;
  setFilters: (f: EmployeeFilters) => void;
  sort: EmployeeSort;
  setSort: (s: EmployeeSort) => void;
  add: (input: NewEmployeeInput) => Promise<Employee>;
  update: (id: string, updates: EmployeeUpdateInput) => Promise<void>;
  remove: (id: string) => Promise<void>;
  offboard: (id: string, terminationDate: string) => Promise<void>;
  refetchCount: number;
}

const DEFAULT_FILTERS: EmployeeFilters = {
  search: '',
  department: 'all',
  status: 'all',
  employmentType: 'all',
};

const DEFAULT_SORT: EmployeeSort = { field: 'name', direction: 'asc' };

/**
 * Subscribes to the live employees collection and applies client-side
 * filtering + sorting. Mutations (add/update/remove) optimistically
 * rely on the onSnapshot listener to reflect changes — no manual
 * refetch needed.
 */
export function useEmployees(initialFilters?: Partial<EmployeeFilters>): UseEmployeesResult {
  const [all, setAll] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<EmployeeFilters>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });
  const [sort, setSort] = useState<EmployeeSort>(DEFAULT_SORT);
  const [refetchCount, setRefetchCount] = useState(0);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToEmployees(
      (employees) => {
        setAll(employees);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message || 'Failed to load employees.');
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const employees = useMemo(() => {
    let result = [...all];

    if (filters.department && filters.department !== 'all') {
      result = result.filter((e) => e.department === filters.department);
    }
    if (filters.status && filters.status !== 'all') {
      result = result.filter((e) => e.status === filters.status);
    }
    if (filters.employmentType && filters.employmentType !== 'all') {
      result = result.filter((e) => e.employmentType === filters.employmentType);
    }
    if (filters.search) {
      const term = filters.search.toLowerCase();
      result = result.filter((e) =>
        [getFullName(e), e.email, e.jobTitle, e.employeeNumber]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(term))
      );
    }

    result.sort((a, b) => {
      const dir = sort.direction === 'asc' ? 1 : -1;
      switch (sort.field) {
        case 'name':
          return getFullName(a).localeCompare(getFullName(b)) * dir;
        case 'department':
          return a.department.localeCompare(b.department) * dir;
        case 'jobTitle':
          return a.jobTitle.localeCompare(b.jobTitle) * dir;
        case 'status':
          return a.status.localeCompare(b.status) * dir;
        case 'hireDate':
          return (new Date(a.hireDate).getTime() - new Date(b.hireDate).getTime()) * dir;
        default:
          return 0;
      }
    });

    return result;
  }, [all, filters, sort]);

  const add = useCallback(async (input: NewEmployeeInput) => {
    return createEmployee(input);
  }, []);

  const update = useCallback(async (id: string, updates: EmployeeUpdateInput) => {
    await updateEmployee(id, updates);
  }, []);

  const remove = useCallback(async (id: string) => {
    await deleteEmployee(id);
  }, []);

  const offboard = useCallback(async (id: string, terminationDate: string) => {
    await offboardEmployee(id, terminationDate);
  }, []);

  return {
    employees,
    allEmployees: all,
    totalCount: all.length,
    loading,
    error,
    filters,
    setFilters,
    sort,
    setSort,
    add,
    update,
    remove,
    offboard,
    refetchCount,
  };
}
