import React from 'react';
import type { NavItemId } from '@/config/nav';

interface NavIconProps {
  id: NavItemId;
  size?: number;
  className?: string;
}

const icons: Record<NavItemId, (size: number) => React.ReactNode> = {
  dashboard: (s) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="7" height="7" rx="1.5" />
      <rect x="11" y="2" width="7" height="7" rx="1.5" />
      <rect x="2" y="11" width="7" height="7" rx="1.5" />
      <rect x="11" y="11" width="7" height="7" rx="1.5" />
    </svg>
  ),
  contacts: (s) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="7" r="3.5" />
      <path d="M3 17c0-3.314 3.134-6 7-6s7 2.686 7 6" />
    </svg>
  ),
  companies: (s) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="11" height="12" rx="1.5" />
      <path d="M7 6V4a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v14" />
      <path d="M5 10h3M5 13h3M5 16h3" />
    </svg>
  ),
  deals: (s) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2L2 7l8 5 8-5-8-5z" />
      <path d="M2 12l8 5 8-5" />
    </svg>
  ),
  leads: (s) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" />
      <path d="M12 3h5v5" />
      <path d="M17 3L9 11" />
    </svg>
  ),
  activities: (s) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2,10 6,14 13,6" />
      <path d="M18 6h-3M18 10h-5M18 14h-3" />
    </svg>
  ),
  pipeline: (s) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h14M3 10h10M3 14h6" />
      <circle cx="16" cy="14" r="2.5" />
    </svg>
  ),
  reports: (s) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 17V9M8 17V5M12 17v-6M16 17v-9" />
    </svg>
  ),
  emails: (s) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="16" height="12" rx="1.5" />
      <path d="M2 7l8 5 8-5" />
    </svg>
  ),
  calendar: (s) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="16" height="14" rx="1.5" />
      <path d="M2 8h16M6 2v4M14 2v4" />
    </svg>
  ),
  documents: (s) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 2h7l4 4v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" />
      <path d="M12 2v4h4" />
      <path d="M7 10h6M7 13h4" />
    </svg>
  ),
  products: (s) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2l7 4v8l-7 4-7-4V6l7-4z" />
      <path d="M10 10l7-4M10 10v8M10 10L3 6" />
    </svg>
  ),
  settings: (s) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="2.5" />
      <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42" />
    </svg>
  ),
  team: (s) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="7" r="3" />
      <circle cx="14" cy="7" r="2.5" />
      <path d="M1 17c0-3 2.686-5 6-5s6 2 6 5" />
      <path d="M15 12c2 0 4 1.5 4 4" />
    </svg>
  ),
  employees: (s) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="6" height="6" rx="3" />
      <rect x="11" y="3" width="6" height="6" rx="3" />
      <path d="M2 17c0-2.8 2.239-5 5-5h0c2.761 0 5 2.2 5 5" />
      <path d="M10 12.2c2.5.3 4 2.2 4 4.8" />
    </svg>
  ),
  integrations: (s) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5" cy="10" r="2.5" />
      <circle cx="15" cy="5" r="2.5" />
      <circle cx="15" cy="15" r="2.5" />
      <path d="M7.5 10l5-3.5M7.5 10l5 3.5" />
    </svg>
  ),
  projects: (s) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="7" height="7" rx="1.5" />
      <rect x="11" y="3" width="7" height="7" rx="1.5" />
      <rect x="2" y="12" width="7" height="5" rx="1.5" />
      <rect x="11" y="12" width="7" height="5" rx="1.5" />
    </svg>
  ),
};

export function NavIcon({ id, size = 18, className }: NavIconProps) {
  const renderIcon = icons[id];
  if (!renderIcon) return null;
  return (
    <span className={className} aria-hidden="true">
      {renderIcon(size)}
    </span>
  );
}
