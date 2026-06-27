'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import type {
  Employee,
  NewEmployeeInput,
  Department,
  EmploymentType,
  EmployeeStatus,
} from '@/types/employee';
import { DEPARTMENT_LABELS, EMPLOYMENT_TYPE_LABELS, STATUS_LABELS } from '@/types/employee';

interface EmployeeFormProps {
  initial?: Employee;
  managers: { id: string; name: string }[];
  onSubmit: (input: NewEmployeeInput) => Promise<unknown>;
  submitLabel?: string;
}

const EMPTY: NewEmployeeInput = {
  firstName: '',
  lastName: '',
  preferredName: '',
  email: '',
  phone: '',
  jobTitle: '',
  department: 'engineering',
  employmentType: 'full-time',
  status: 'active',
  managerId: null,
  hireDate: new Date().toISOString().slice(0, 10),
  location: '',
  remote: false,
  notes: '',
};

export function EmployeeForm({ initial, managers, onSubmit, submitLabel = 'Save employee' }: EmployeeFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<NewEmployeeInput>(
    initial
      ? {
          firstName: initial.firstName,
          lastName: initial.lastName,
          preferredName: initial.preferredName ?? '',
          email: initial.email,
          phone: initial.phone ?? '',
          jobTitle: initial.jobTitle,
          department: initial.department,
          employmentType: initial.employmentType,
          status: initial.status,
          managerId: initial.managerId ?? null,
          hireDate: initial.hireDate?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
          location: initial.location ?? '',
          remote: initial.remote ?? false,
          notes: initial.notes ?? '',
        }
      : EMPTY
  );
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function update<K extends keyof NewEmployeeInput>(key: K, value: NewEmployeeInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key as string]) {
      setErrors((e) => {
        const next = { ...e };
        delete next[key as string];
        return next;
      });
    }
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!form.firstName.trim()) next.firstName = 'First name is required.';
    if (!form.lastName.trim()) next.lastName = 'Last name is required.';
    if (!form.email.trim()) next.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (!form.jobTitle.trim()) next.jobTitle = 'Job title is required.';
    if (!form.hireDate) next.hireDate = 'Hire date is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const result = await onSubmit(form);
      const id = (result as Employee | undefined)?.id ?? initial?.id;
      if (id) router.push(`/employees/${id}`);
      else router.push('/employees');
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : 'Something went wrong. Try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="emp-form" onSubmit={handleSubmit}>
      {errors.form && <div className="emp-form__error-banner">{errors.form}</div>}

      <section className="emp-form__section">
        <h3 className="emp-form__section-title">Identity</h3>
        <div className="emp-form__grid">
          <div className="emp-form__field">
            <label htmlFor="firstName">First name</label>
            <input
              id="firstName"
              value={form.firstName}
              onChange={(e) => update('firstName', e.target.value)}
              className={errors.firstName ? 'emp-form__input--error' : ''}
            />
            {errors.firstName && <span className="emp-form__field-error">{errors.firstName}</span>}
          </div>
          <div className="emp-form__field">
            <label htmlFor="lastName">Last name</label>
            <input
              id="lastName"
              value={form.lastName}
              onChange={(e) => update('lastName', e.target.value)}
              className={errors.lastName ? 'emp-form__input--error' : ''}
            />
            {errors.lastName && <span className="emp-form__field-error">{errors.lastName}</span>}
          </div>
          <div className="emp-form__field">
            <label htmlFor="preferredName">Preferred name</label>
            <input
              id="preferredName"
              value={form.preferredName}
              onChange={(e) => update('preferredName', e.target.value)}
              placeholder="Optional"
            />
          </div>
          <div className="emp-form__field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              className={errors.email ? 'emp-form__input--error' : ''}
            />
            {errors.email && <span className="emp-form__field-error">{errors.email}</span>}
          </div>
          <div className="emp-form__field">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              placeholder="Optional"
            />
          </div>
        </div>
      </section>

      <section className="emp-form__section">
        <h3 className="emp-form__section-title">Role</h3>
        <div className="emp-form__grid">
          <div className="emp-form__field">
            <label htmlFor="jobTitle">Job title</label>
            <input
              id="jobTitle"
              value={form.jobTitle}
              onChange={(e) => update('jobTitle', e.target.value)}
              className={errors.jobTitle ? 'emp-form__input--error' : ''}
            />
            {errors.jobTitle && <span className="emp-form__field-error">{errors.jobTitle}</span>}
          </div>
          <div className="emp-form__field">
            <label htmlFor="department">Department</label>
            <select
              id="department"
              value={form.department}
              onChange={(e) => update('department', e.target.value as Department)}
            >
              {Object.entries(DEPARTMENT_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div className="emp-form__field">
            <label htmlFor="employmentType">Employment type</label>
            <select
              id="employmentType"
              value={form.employmentType}
              onChange={(e) => update('employmentType', e.target.value as EmploymentType)}
            >
              {Object.entries(EMPLOYMENT_TYPE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div className="emp-form__field">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={form.status}
              onChange={(e) => update('status', e.target.value as EmployeeStatus)}
            >
              {Object.entries(STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div className="emp-form__field">
            <label htmlFor="managerId">Manager</label>
            <select
              id="managerId"
              value={form.managerId ?? ''}
              onChange={(e) => update('managerId', e.target.value || null)}
            >
              <option value="">No manager</option>
              {managers.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
          <div className="emp-form__field">
            <label htmlFor="hireDate">Hire date</label>
            <input
              id="hireDate"
              type="date"
              value={form.hireDate}
              onChange={(e) => update('hireDate', e.target.value)}
              className={errors.hireDate ? 'emp-form__input--error' : ''}
            />
            {errors.hireDate && <span className="emp-form__field-error">{errors.hireDate}</span>}
          </div>
        </div>
      </section>

      <section className="emp-form__section">
        <h3 className="emp-form__section-title">Location</h3>
        <div className="emp-form__grid">
          <div className="emp-form__field">
            <label htmlFor="location">Office / site</label>
            <input
              id="location"
              value={form.location}
              onChange={(e) => update('location', e.target.value)}
              placeholder="e.g. San Francisco HQ"
            />
          </div>
          <div className="emp-form__field emp-form__field--checkbox">
            <label htmlFor="remote">
              <input
                id="remote"
                type="checkbox"
                checked={!!form.remote}
                onChange={(e) => update('remote', e.target.checked)}
              />
              Works remotely
            </label>
          </div>
        </div>
      </section>

      <section className="emp-form__section">
        <h3 className="emp-form__section-title">Notes</h3>
        <div className="emp-form__field">
          <textarea
            id="notes"
            rows={4}
            value={form.notes}
            onChange={(e) => update('notes', e.target.value)}
            placeholder="Any additional context about this employee..."
          />
        </div>
      </section>

      <div className="emp-form__actions">
        <button type="button" className="emp-form__cancel-btn" onClick={() => router.back()}>
          Cancel
        </button>
        <button type="submit" className="emp-form__submit-btn" disabled={submitting}>
          {submitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
