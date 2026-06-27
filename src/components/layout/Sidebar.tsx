'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useShell } from '@/context/ShellContext';
import { NAV_GROUPS } from '@/config/nav';
import { NavIcon } from './NavIcon';

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useShell();
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || (href !== '/dashboard' && pathname.startsWith(href));

  return (
    <aside
      className={`sidebar ${sidebarCollapsed ? 'sidebar--collapsed' : ''}`}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="sidebar__logo">
        <div className="sidebar__logo-mark">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <rect width="22" height="22" rx="6" fill="var(--accent)" />
            <path d="M6 11h10M11 6l5 5-5 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {!sidebarCollapsed && (
          <span className="sidebar__logo-name">NexusCRM</span>
        )}
        <button
          className="sidebar__collapse-btn"
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            style={{ transform: sidebarCollapsed ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }}
          >
            <path d="M10 12L6 8l4-4" />
          </svg>
        </button>
      </div>

      {/* Nav Groups */}
      <nav className="sidebar__nav">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="sidebar__group">
            {!sidebarCollapsed && (
              <p className="sidebar__group-label">{group.label}</p>
            )}
            <ul className="sidebar__list" role="list">
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className={`sidebar__item ${active ? 'sidebar__item--active' : ''}`}
                      title={sidebarCollapsed ? item.label : undefined}
                      aria-current={active ? 'page' : undefined}
                    >
                      <NavIcon id={item.icon} size={18} className="sidebar__item-icon" />
                      {!sidebarCollapsed && (
                        <span className="sidebar__item-label">{item.label}</span>
                      )}
                      {!sidebarCollapsed && item.badge !== undefined && (
                        <span className="sidebar__badge">{item.badge}</span>
                      )}
                      {sidebarCollapsed && item.badge !== undefined && (
                        <span className="sidebar__badge sidebar__badge--dot" aria-hidden="true" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User Footer */}
      <div className="sidebar__footer">
        <div className="sidebar__avatar">JD</div>
        {!sidebarCollapsed && (
          <div className="sidebar__user-info">
            <p className="sidebar__user-name">James Dawson</p>
            <p className="sidebar__user-role">Sales Director</p>
          </div>
        )}
      </div>
    </aside>
  );
}
