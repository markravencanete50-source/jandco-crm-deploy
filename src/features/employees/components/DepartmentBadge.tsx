import React from 'react';
import type { Department } from '@/types/employee';
import { DEPARTMENT_LABELS } from '@/types/employee';

interface DepartmentBadgeProps {
  department: Department;
}

export function DepartmentBadge({ department }: DepartmentBadgeProps) {
  return (
    <span className={`dept-badge dept-badge--${department}`}>
      {DEPARTMENT_LABELS[department]}
    </span>
  );
}
