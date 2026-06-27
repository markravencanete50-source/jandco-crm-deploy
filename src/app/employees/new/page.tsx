'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useEmployees } from '@/features/employees/hooks/useEmployees';
import { EmployeeForm } from '@/features/employees/components/EmployeeForm';
import { getFullName } from '@/types/employee';

export default function NewEmployeePage() {
  const { allEmployees, add } = useEmployees();

  const managers = useMemo(
    () =>
      allEmployees
        .filter((e) => e.status === 'active')
        .map((e) => ({ id: e.id, name: getFullName(e) })),
    [allEmployees]
  );

  return (
    <div className="emp-page">
      <div className="emp-page__header">
        <div>
          <Link href="/employees" className="emp-page__back-link">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M9 2L3 7l6 5" />
            </svg>
            Back to employees
          </Link>
          <h1 className="emp-page__title">Add employee</h1>
          <p className="emp-page__subtitle">Create a new employee record.</p>
        </div>
      </div>

      <EmployeeForm managers={managers} onSubmit={add} submitLabel="Create employee" />
    </div>
  );
}
