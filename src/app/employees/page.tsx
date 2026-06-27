'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEmployees } from '@/features/employees/hooks/useEmployees';
import { EmployeeStats } from '@/features/employees/components/EmployeeStats';
import { EmployeeFiltersBar } from '@/features/employees/components/EmployeeFiltersBar';
import { EmployeeTable } from '@/features/employees/components/EmployeeTable';
import { EmployeeGrid } from '@/features/employees/components/EmployeeGrid';

export default function EmployeesPage() {
  const router = useRouter();
  const {
    employees,
    allEmployees,
    totalCount,
    loading,
    error,
    filters,
    setFilters,
    sort,
    setSort,
  } = useEmployees();
  const [view, setView] = useState<'table' | 'grid'>('table');

  return (
    <div className="emp-page">
      <div className="emp-page__header">
        <div>
          <h1 className="emp-page__title">Employees</h1>
          <p className="emp-page__subtitle">Manage your organization&apos;s people, roles, and reporting structure.</p>
        </div>
      </div>

      <EmployeeStats employees={allEmployees} />

      <EmployeeFiltersBar
        filters={filters}
        onChange={setFilters}
        totalCount={totalCount}
        filteredCount={employees.length}
        view={view}
        onViewChange={setView}
        onAddNew={() => router.push('/employees/new')}
      />

      {error && <div className="emp-page__error">{error}</div>}

      {view === 'table' ? (
        <EmployeeTable employees={employees} sort={sort} onSortChange={setSort} loading={loading} />
      ) : (
        <EmployeeGrid employees={employees} loading={loading} />
      )}
    </div>
  );
}
