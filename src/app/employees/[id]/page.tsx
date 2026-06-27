'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEmployee } from '@/features/employees/hooks/useEmployee';
import { offboardEmployee } from '@/lib/firebase/employees';
import { EmployeeProfile } from '@/features/employees/components/EmployeeProfile';
import { OffboardModal } from '@/features/employees/components/OffboardModal';

export default function EmployeeDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { employee, manager, directReports, loading, error, refetch } = useEmployee(params.id);
  const [showOffboard, setShowOffboard] = useState(false);

  if (loading) {
    return (
      <div className="emp-page">
        <div className="emp-profile__skeleton">
          <div className="emp-skeleton emp-skeleton--avatar" />
          <div className="emp-skeleton emp-skeleton--line" />
          <div className="emp-skeleton emp-skeleton--line emp-skeleton--short" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="emp-page">
        <div className="emp-page__error">{error}</div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="emp-page">
        <div className="emp-empty">
          <p>Employee not found.</p>
          <Link href="/employees" className="emp-profile__link">Back to employees</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="emp-page">
      <Link href="/employees" className="emp-page__back-link">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M9 2L3 7l6 5" />
        </svg>
        Back to employees
      </Link>

      <EmployeeProfile
        employee={employee}
        manager={manager}
        directReports={directReports}
        onOffboard={() => setShowOffboard(true)}
      />

      {showOffboard && (
        <OffboardModal
          employeeName={`${employee.firstName} ${employee.lastName}`}
          onClose={() => setShowOffboard(false)}
          onConfirm={async (terminationDate) => {
            await offboardEmployee(employee.id, terminationDate);
            refetch();
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
