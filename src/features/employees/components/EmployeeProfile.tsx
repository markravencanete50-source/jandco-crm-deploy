'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { Employee } from '@/types/employee';
import { getFullName } from '@/types/employee';
import { EmployeeAvatar } from './EmployeeAvatar';
import { StatusBadge } from './StatusBadge';
import { DepartmentBadge } from './DepartmentBadge';
import { EMPLOYMENT_TYPE_LABELS } from '@/types/employee';

interface EmployeeProfileProps {
  employee: Employee;
  manager: Employee | null;
  directReports: Employee[];
  onOffboard: () => void;
}

function formatDate(iso?: string | null): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

function tenure(hireDate: string): string {
  const start = new Date(hireDate);
  const now = new Date();
  let months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  if (months < 0) months = 0;
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  if (years === 0) return `${remMonths} mo`;
  if (remMonths === 0) return `${years} yr`;
  return `${years} yr ${remMonths} mo`;
}

export function EmployeeProfile({ employee, manager, directReports, onOffboard }: EmployeeProfileProps) {
  const [tab, setTab] = useState<'overview' | 'org' | 'documents'>('overview');

  return (
    <div className="emp-profile">
      <div className="emp-profile__header">
        <EmployeeAvatar employee={employee} size="xl" />
        <div className="emp-profile__header-info">
          <h1 className="emp-profile__name">{getFullName(employee)}</h1>
          <p className="emp-profile__title">{employee.jobTitle}</p>
          <div className="emp-profile__header-meta">
            <DepartmentBadge department={employee.department} />
            <StatusBadge status={employee.status} />
            <span className="emp-profile__id">{employee.employeeNumber}</span>
          </div>
        </div>
        <div className="emp-profile__header-actions">
          <Link href={`/employees/${employee.id}/edit`} className="emp-profile__edit-btn">
            Edit
          </Link>
          {employee.status !== 'terminated' && (
            <button className="emp-profile__offboard-btn" onClick={onOffboard}>
              Offboard
            </button>
          )}
        </div>
      </div>

      <div className="emp-profile__tabs" role="tablist">
        <button
          role="tab"
          aria-selected={tab === 'overview'}
          className={`emp-profile__tab ${tab === 'overview' ? 'emp-profile__tab--active' : ''}`}
          onClick={() => setTab('overview')}
        >
          Overview
        </button>
        <button
          role="tab"
          aria-selected={tab === 'org'}
          className={`emp-profile__tab ${tab === 'org' ? 'emp-profile__tab--active' : ''}`}
          onClick={() => setTab('org')}
        >
          Org chart {directReports.length > 0 && `(${directReports.length})`}
        </button>
        <button
          role="tab"
          aria-selected={tab === 'documents'}
          className={`emp-profile__tab ${tab === 'documents' ? 'emp-profile__tab--active' : ''}`}
          onClick={() => setTab('documents')}
        >
          Documents {employee.documents?.length ? `(${employee.documents.length})` : ''}
        </button>
      </div>

      {tab === 'overview' && (
        <div className="emp-profile__panel">
          <div className="emp-profile__card-grid">
            <div className="emp-profile__card">
              <h4>Contact</h4>
              <dl className="emp-profile__dl">
                <dt>Email</dt>
                <dd><a href={`mailto:${employee.email}`}>{employee.email}</a></dd>
                <dt>Phone</dt>
                <dd>{employee.phone || '—'}</dd>
                <dt>Location</dt>
                <dd>{employee.location || '—'}{employee.remote ? ' · Remote' : ''}</dd>
              </dl>
            </div>

            <div className="emp-profile__card">
              <h4>Employment</h4>
              <dl className="emp-profile__dl">
                <dt>Type</dt>
                <dd>{EMPLOYMENT_TYPE_LABELS[employee.employmentType]}</dd>
                <dt>Hire date</dt>
                <dd>{formatDate(employee.hireDate)}</dd>
                <dt>Tenure</dt>
                <dd>{tenure(employee.hireDate)}</dd>
                {employee.terminationDate && (
                  <>
                    <dt>Termination date</dt>
                    <dd>{formatDate(employee.terminationDate)}</dd>
                  </>
                )}
              </dl>
            </div>

            <div className="emp-profile__card">
              <h4>Reporting</h4>
              <dl className="emp-profile__dl">
                <dt>Manager</dt>
                <dd>
                  {manager ? (
                    <Link href={`/employees/${manager.id}`} className="emp-profile__link">
                      {getFullName(manager)}
                    </Link>
                  ) : (
                    '—'
                  )}
                </dd>
                <dt>Direct reports</dt>
                <dd>{directReports.length}</dd>
              </dl>
            </div>

            {employee.timeOff && (
              <div className="emp-profile__card">
                <h4>Time off</h4>
                <dl className="emp-profile__dl">
                  <dt>Vacation</dt>
                  <dd>{employee.timeOff.vacationDaysUsed} / {employee.timeOff.vacationDaysTotal} days used</dd>
                  <dt>Sick</dt>
                  <dd>{employee.timeOff.sickDaysUsed} / {employee.timeOff.sickDaysTotal} days used</dd>
                </dl>
              </div>
            )}
          </div>

          {employee.notes && (
            <div className="emp-profile__notes">
              <h4>Notes</h4>
              <p>{employee.notes}</p>
            </div>
          )}
        </div>
      )}

      {tab === 'org' && (
        <div className="emp-profile__panel">
          {manager && (
            <div className="emp-org-section">
              <h4>Reports to</h4>
              <Link href={`/employees/${manager.id}`} className="emp-org-card">
                <EmployeeAvatar employee={manager} size="md" />
                <div>
                  <div className="emp-org-card__name">{getFullName(manager)}</div>
                  <div className="emp-org-card__title">{manager.jobTitle}</div>
                </div>
              </Link>
            </div>
          )}

          <div className="emp-org-section">
            <h4>Direct reports</h4>
            {directReports.length === 0 ? (
              <p className="emp-profile__empty-note">No direct reports.</p>
            ) : (
              <div className="emp-org-grid">
                {directReports.map((r) => (
                  <Link key={r.id} href={`/employees/${r.id}`} className="emp-org-card">
                    <EmployeeAvatar employee={r} size="md" />
                    <div>
                      <div className="emp-org-card__name">{getFullName(r)}</div>
                      <div className="emp-org-card__title">{r.jobTitle}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'documents' && (
        <div className="emp-profile__panel">
          {!employee.documents || employee.documents.length === 0 ? (
            <p className="emp-profile__empty-note">No documents on file.</p>
          ) : (
            <ul className="emp-doc-list">
              {employee.documents.map((doc) => (
                <li key={doc.id} className="emp-doc-item">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 2h6l3 3v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" />
                    <path d="M11 2v3h3" />
                  </svg>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer">{doc.name}</a>
                  <span className="emp-doc-item__date">{formatDate(doc.uploadedAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
