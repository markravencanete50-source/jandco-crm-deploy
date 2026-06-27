'use client';

import React from 'react';
import Link from 'next/link';
import type { Employee, EmployeeSort, EmployeeSortField } from '@/types/employee';
import { getFullName } from '@/types/employee';
import { EmployeeAvatar } from './EmployeeAvatar';
import { StatusBadge } from './StatusBadge';
import { DepartmentBadge } from './DepartmentBadge';

interface EmployeeTableProps {
  employees: Employee[];
  sort: EmployeeSort;
  onSortChange: (sort: EmployeeSort) => void;
  loading: boolean;
}

const COLUMNS: { field: EmployeeSortField; label: string }[] = [
  { field: 'name', label: 'Name' },
  { field: 'jobTitle', label: 'Title' },
  { field: 'department', label: 'Department' },
  { field: 'status', label: 'Status' },
  { field: 'hireDate', label: 'Hire date' },
];

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

export function EmployeeTable({ employees, sort, onSortChange, loading }: EmployeeTableProps) {
  const handleSort = (field: EmployeeSortField) => {
    if (sort.field === field) {
      onSortChange({ field, direction: sort.direction === 'asc' ? 'desc' : 'asc' });
    } else {
      onSortChange({ field, direction: 'asc' });
    }
  };

  if (loading) {
    return (
      <div className="emp-table-wrap">
        <table className="emp-table">
          <tbody>
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={i} className="emp-table__skeleton-row">
                <td colSpan={6}>
                  <div className="emp-skeleton" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
    <div className="emp-table-wrap">
      <table className="emp-table">
        <thead>
          <tr>
            <th className="emp-table__th-checkbox" />
            {COLUMNS.map((col) => (
              <th key={col.field}>
                <button
                  className="emp-table__sort-btn"
                  onClick={() => handleSort(col.field)}
                  aria-label={`Sort by ${col.label}`}
                >
                  {col.label}
                  {sort.field === col.field && (
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 11 11"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      className={sort.direction === 'desc' ? 'emp-table__sort-icon--desc' : ''}
                    >
                      <path d="M5.5 9V2M2 5.5l3.5-3.5L9 5.5" />
                    </svg>
                  )}
                </button>
              </th>
            ))}
            <th />
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id} className="emp-table__row">
              <td className="emp-table__th-checkbox" />
              <td>
                <Link href={`/employees/${emp.id}`} className="emp-table__name-cell">
                  <EmployeeAvatar employee={emp} size="sm" />
                  <div>
                    <div className="emp-table__name">{getFullName(emp)}</div>
                    <div className="emp-table__email">{emp.email}</div>
                  </div>
                </Link>
              </td>
              <td className="emp-table__title">{emp.jobTitle}</td>
              <td><DepartmentBadge department={emp.department} /></td>
              <td><StatusBadge status={emp.status} /></td>
              <td className="emp-table__date">{formatDate(emp.hireDate)}</td>
              <td>
                <Link href={`/employees/${emp.id}`} className="emp-table__row-action" aria-label="View profile">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                    <path d="M6 3l5 5-5 5" />
                  </svg>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
