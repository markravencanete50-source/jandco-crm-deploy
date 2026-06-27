'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Map path segments to human-readable labels
const SEGMENT_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  contacts: 'Contacts',
  companies: 'Companies',
  deals: 'Deals',
  leads: 'Leads',
  activities: 'Activities',
  pipeline: 'Pipeline',
  reports: 'Reports',
  emails: 'Emails',
  calendar: 'Calendar',
  documents: 'Documents',
  products: 'Products',
  settings: 'Settings',
  team: 'Team',
  integrations: 'Integrations',
  employees: 'Employees',
  projects: 'Projects',
  new: 'New',
  edit: 'Edit',
  import: 'Import',
  export: 'Export',
};

function humanize(segment: string): string {
  return (
    SEGMENT_LABELS[segment.toLowerCase()] ??
    segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

interface Crumb {
  label: string;
  href: string;
}

export function Breadcrumbs() {
  const pathname = usePathname();

  const segments = pathname.split('/').filter(Boolean);
  const crumbs: Crumb[] = segments.map((seg: string, i: number) => ({
    label: humanize(seg),
    href: '/' + segments.slice(0, i + 1).join('/'),
  }));

  if (crumbs.length <= 1) return null;

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol className="breadcrumbs__list">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li key={crumb.href} className="breadcrumbs__item">
              {!isLast ? (
                <>
                  <Link href={crumb.href} className="breadcrumbs__link">
                    {crumb.label}
                  </Link>
                  <span className="breadcrumbs__sep" aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                      <path d="M4 2l4 4-4 4" />
                    </svg>
                  </span>
                </>
              ) : (
                <span className="breadcrumbs__current" aria-current="page">
                  {crumb.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
