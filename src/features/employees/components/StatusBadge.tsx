import React from 'react';
import type { EmployeeStatus } from '@/types/employee';
import { STATUS_LABELS } from '@/types/employee';

interface StatusBadgeProps {
  status: EmployeeStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`status-badge status-badge--${status}`}>
      <span className="status-badge__dot" aria-hidden="true" />
      {STATUS_LABELS[status]}
    </span>
  );
}
