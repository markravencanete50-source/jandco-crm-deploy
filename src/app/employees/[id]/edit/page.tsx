'use client';

import React, { useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useEmployee } from '@/features/employees/hooks/useEmployee';
import { useEmployees } from '@/features/employees/hooks/useEmployees';
import { updateEmployee } from '@/lib/firebase/employees';
import { EmployeeForm } from '@/features/employees/components/EmployeeForm';
import { getFullName } from '@/types/employee';
import type { NewEmployeeInput } from '@/types/employee';

export default function EditEmployeePage() {
  const params = useParams<{ id: string }>();
  const { employee, loading, error } = useEmployee(params.id);
  const { allEmployees } = useEmployees();

  const managers = useMemo(
    () =>
      allEmployees
        .filter((e) => e.status === 'active' && e.id !== params.id)
        .map((e) => ({ id: e.id, name: getFullName(e) })),
    [allEmployees, params.id]
  );

  if (loading) {
    return (
      <div className="emp-page">
        <div className="emp-profile__skeleton">
          <div className="emp-skeleton emp-skeleton--line" />
          <div className="emp-skeleton emp-skeleton--line" />
        </div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="emp-page">
        <div className="emp-page__error">{error ?? 'Employee not found.'}</div>
      </div>
    );
  }

  return (
    <div className="emp-page">
      <Link href={`/employees/${employee.id}`} className="emp-page__back-link">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M9 2L3 7l6 5" />
        </svg>
        Back to profile
      </Link>
      <h1 className="emp-page__title">Edit {getFullName(employee)}</h1>

      <EmployeeForm
        initial={employee}
        managers={managers}
        submitLabel="Save changes"
        onSubmit={async (input: NewEmployeeInput) => {
          await updateEmployee(employee.id, input);
          return employee;
        }}
      />
    </div>
  );
}
