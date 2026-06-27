'use client';

import React from 'react';
import Link from 'next/link';
import type { Employee } from '@/types/employee';
import { getFullName } from '@/types/employee';
import { EmployeeAvatar } from './EmployeeAvatar';
import { StatusBadge } from './StatusBadge';
import { DepartmentBadge } from './DepartmentBadge';

interface EmployeeGridProps {
  employees: Employee[];
  loading: boolean;
}

export function EmployeeGrid({ employees, loading }: EmployeeGridProps) {
  if (loading) {
    return (
      <div className="emp-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="emp-grid-card emp-grid-card--skeleton">
            <div className="emp-skeleton emp-skeleton--avatar" />
            <div className="emp-skeleton emp-skeleton--line" />
            <div className="emp-skeleton emp-skeleton--line emp-skeleton--short" />
          </div>
        ))}
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="emp-empty">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.4">
          <circle cx="20" cy="14" r="6" />
          <path d="M8 34c0-6.627 5.373-12 12-12s12 5.373 12 12" />
        </svg>
        <p>No employees match your filters.</p>
      </div>
    );
  }

  return (
    <div className="emp-grid">
      {employees.map((emp) => (
        <Link key={emp.id} href={`/employees/${emp.id}`} className="emp-grid-card">
          <EmployeeAvatar employee={emp} size="lg" />
          <div className="emp-grid-card__name">{getFullName(emp)}</div>
          <div className="emp-grid-card__title">{emp.jobTitle}</div>
          <DepartmentBadge department={emp.department} />
          <div className="emp-grid-card__footer">
            <StatusBadge status={emp.status} />
          </div>
        </Link>
      ))}
    </div>
  );
}
