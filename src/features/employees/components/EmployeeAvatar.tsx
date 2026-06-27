import React from 'react';
import type { Employee } from '@/types/employee';
import { getInitials } from '@/types/employee';

interface EmployeeAvatarProps {
  employee: Pick<Employee, 'firstName' | 'lastName' | 'avatarUrl'>;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SIZE_PX: Record<NonNullable<EmployeeAvatarProps['size']>, number> = {
  sm: 28,
  md: 36,
  lg: 56,
  xl: 88,
};

export function EmployeeAvatar({ employee, size = 'md' }: EmployeeAvatarProps) {
  const px = SIZE_PX[size];

  if (employee.avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={employee.avatarUrl}
        alt={`${employee.firstName} ${employee.lastName}`}
        className={`emp-avatar emp-avatar--${size}`}
        style={{ width: px, height: px }}
      />
    );
  }

  return (
    <div
      className={`emp-avatar emp-avatar--${size} emp-avatar--initials`}
      style={{ width: px, height: px }}
      aria-label={`${employee.firstName} ${employee.lastName}`}
    >
      {getInitials(employee)}
    </div>
  );
}
