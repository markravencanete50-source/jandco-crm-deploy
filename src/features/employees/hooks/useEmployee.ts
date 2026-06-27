'use client';

import { useState, useEffect, useCallback } from 'react';
import { getEmployee, getDirectReports } from '@/lib/firebase/employees';
import type { Employee } from '@/types/employee';

interface UseEmployeeResult {
  employee: Employee | null;
  manager: Employee | null;
  directReports: Employee[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Fetches a single employee by id, along with their manager (if any)
 * and direct reports, for use in the employee profile view.
 */
export function useEmployee(id: string | null): UseEmployeeResult {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [manager, setManager] = useState<Employee | null>(null);
  const [directReports, setDirectReports] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!id) {
      setEmployee(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const emp = await getEmployee(id);
        if (cancelled) return;
        setEmployee(emp);

        if (emp?.managerId) {
          const mgr = await getEmployee(emp.managerId);
          if (!cancelled) setManager(mgr);
        } else {
          setManager(null);
        }

        const reports = await getDirectReports(id);
        if (!cancelled) setDirectReports(reports);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load employee.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id, tick]);

  return { employee, manager, directReports, loading, error, refetch };
}
