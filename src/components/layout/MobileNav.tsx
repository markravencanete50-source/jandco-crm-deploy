'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useShell } from '@/context/ShellContext';
import { NAV_GROUPS } from '@/config/nav';
import { NavIcon } from './NavIcon';

export function MobileNav() {
  const { mobileNavOpen, closeMobileNav } = useShell();
  const pathname = usePathname();

  // Close on route change
  useEffect(() => {
    closeMobileNav();
  }, [pathname, closeMobileNav]);

  const isActive = (href: string) =>
    pathname === href || (href !== '/dashboard' && pathname.startsWith(href));

  if (!mobileNavOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="mobile-nav__backdrop"
        onClick={closeMobileNav}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="mobile-nav__drawer" role="dialog" aria-modal="true" aria-label="Navigation">
        {/* Header */}
        <div className="mobile-nav__header">
          <div className="sidebar__logo-mark">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect width="22" height="22" rx="6" fill="var(--accent)" />
              <path d="M6 11h10M11 6l5 5-5 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="sidebar__logo-name">NexusCRM</span>
          <button
            className="mobile-nav__close"
            onClick={closeMobileNav}
            aria-label="Close navigation"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 4l12 12M16 4L4 16" />
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="mobile-nav__nav">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="mobile-nav__group">
              <p className="sidebar__group-label">{group.label}</p>
              <ul className="sidebar__list" role="list">
                {group.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        className={`sidebar__item ${active ? 'sidebar__item--active' : ''}`}
                        aria-current={active ? 'page' : undefined}
                      >
                        <NavIcon id={item.icon} size={18} className="sidebar__item-icon" />
                        <span className="sidebar__item-label">{item.label}</span>
                        {item.badge !== undefined && (
                          <span className="sidebar__badge">{item.badge}</span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar__footer">
          <div className="sidebar__avatar">JD</div>
          <div className="sidebar__user-info">
            <p className="sidebar__user-name">James Dawson</p>
            <p className="sidebar__user-role">Sales Director</p>
          </div>
        </div>
      </div>
    </>
  );
}
