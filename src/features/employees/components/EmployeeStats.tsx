'use client';

import React, { useMemo } from 'react';
import type { Employee } from '@/types/employee';

interface EmployeeStatsProps {
  employees: Employee[];
}

export function EmployeeStats({ employees }: EmployeeStatsProps) {
  const stats = useMemo(() => {
    const total = employees.length;
    const active = employees.filter((e) => e.status === 'active').length;
    const onLeave = employees.filter((e) => e.status === 'on-leave').length;
    const departments = new Set(employees.map((e) => e.department)).size;

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const newHires = employees.filter((e) => new Date(e.hireDate) >= thirtyDaysAgo).length;

    return { total, active, onLeave, departments, newHires };
  }, [employees]);

  return (
    <div className="emp-stats">
      <div className="emp-stats__card">
        <div className="emp-stats__value">{stats.total}</div>
        <div className="emp-stats__label">Total employees</div>
      </div>
      <div className="emp-stats__card">
        <div className="emp-stats__value">{stats.active}</div>
        <div className="emp-stats__label">Active</div>
      </div>
      <div className="emp-stats__card">
        <div className="emp-stats__value">{stats.onLeave}</div>
        <div className="emp-stats__label">On leave</div>
      </div>
      <div className="emp-stats__card">
        <div className="emp-stats__value">{stats.departments}</div>
        <div className="emp-stats__label">Departments</div>
      </div>
      <div className="emp-stats__card">
        <div className="emp-stats__value">{stats.newHires}</div>
        <div className="emp-stats__label">New hires (30d)</div>
      </div>
    </div>
  );
}
