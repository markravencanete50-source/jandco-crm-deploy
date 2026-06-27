'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useShell } from '@/context/ShellContext';
import { Breadcrumbs } from './Breadcrumbs';

export function Topbar() {
  const {
    openMobileNav,
    openCommandPalette,
    openNotifications,
    unreadCount,
  } = useShell();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="topbar">
      {/* Left: hamburger (mobile) + breadcrumbs */}
      <div className="topbar__left">
        <button
          className="topbar__hamburger"
          onClick={openMobileNav}
          aria-label="Open navigation"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M3 5h14M3 10h14M3 15h14" />
          </svg>
        </button>
        <Breadcrumbs />
      </div>

      {/* Right: search, notifications, user */}
      <div className="topbar__right">
        {/* Search / Command Palette trigger */}
        <button
          className="topbar__search"
          onClick={openCommandPalette}
          aria-label="Open command palette (⌘K)"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
            <circle cx="7" cy="7" r="4.5" />
            <path d="M10.5 10.5L14 14" />
          </svg>
          <span className="topbar__search-text">Search...</span>
          <kbd className="topbar__kbd">⌘K</kbd>
        </button>

        {/* Notifications */}
        <button
          className="topbar__icon-btn"
          onClick={openNotifications}
          aria-label={`Notifications${unreadCount ? ` — ${unreadCount} unread` : ''}`}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 2a5.5 5.5 0 0 1 5.5 5.5c0 3 1 4 1.5 5H2c.5-1 1.5-2 1.5-5A5.5 5.5 0 0 1 9 2z" />
            <path d="M7 15a2 2 0 0 0 4 0" />
          </svg>
          {unreadCount > 0 && (
            <span className="topbar__badge" aria-hidden="true">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Help */}
        <a
          href="/help"
          className="topbar__icon-btn"
          aria-label="Help"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="9" r="7" />
            <path d="M6.5 7a2.5 2.5 0 0 1 5 .833C11.5 9.5 9 10 9 11.5" />
            <circle cx="9" cy="14" r=".75" fill="currentColor" />
          </svg>
        </a>

        {/* User avatar + menu */}
        <div className="topbar__user" ref={userMenuRef}>
          <button
            className="topbar__avatar"
            onClick={() => setUserMenuOpen((v: boolean) => !v)}
            aria-label="User menu"
            aria-expanded={userMenuOpen}
          >
            JD
          </button>
          {userMenuOpen && (
            <div className="topbar__user-menu" role="menu">
              <div className="topbar__user-info">
                <p className="topbar__user-name">James Dawson</p>
                <p className="topbar__user-email">james@nexuscrm.io</p>
              </div>
              <hr className="topbar__menu-divider" />
              <Link href="/settings/profile" className="topbar__menu-item" role="menuitem" onClick={() => setUserMenuOpen(false)}>
                Profile
              </Link>
              <Link href="/settings" className="topbar__menu-item" role="menuitem" onClick={() => setUserMenuOpen(false)}>
                Settings
              </Link>
              <Link href="/settings/billing" className="topbar__menu-item" role="menuitem" onClick={() => setUserMenuOpen(false)}>
                Billing
              </Link>
              <hr className="topbar__menu-divider" />
              <button className="topbar__menu-item topbar__menu-item--danger" role="menuitem">
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
