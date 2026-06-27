'use client';

import React from 'react';
import Link from 'next/link';
import { useShell, AppNotification, NotificationPriority } from '@/context/ShellContext';

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const PRIORITY_DOT: Record<NotificationPriority, string> = {
  info: 'notif__dot--info',
  success: 'notif__dot--success',
  warning: 'notif__dot--warning',
  error: 'notif__dot--error',
};

interface NotifItemProps {
  n: AppNotification;
  onRead: (id: string) => void;
}

function NotifItem({ n, onRead }: NotifItemProps) {
  const inner = (
    <div
      className={`notif__item ${n.read ? 'notif__item--read' : ''}`}
      onClick={() => onRead(n.id)}
    >
      <span className={`notif__dot ${PRIORITY_DOT[n.priority]}`} aria-hidden="true" />
      <div className="notif__body">
        <p className="notif__title">{n.title}</p>
        <p className="notif__text">{n.body}</p>
        <p className="notif__time">{timeAgo(n.timestamp)}</p>
      </div>
    </div>
  );

  if (n.href) {
    return <Link href={n.href} style={{ textDecoration: 'none' }}>{inner}</Link>;
  }
  return inner;
}

export function NotificationsPanel() {
  const {
    notificationsOpen,
    closeNotifications,
    notifications,
    unreadCount,
    markAllRead,
    markRead,
  } = useShell();

  if (!notificationsOpen) return null;

  return (
    <>
      <div className="notif__backdrop" onClick={closeNotifications} aria-hidden="true" />
      <div className="notif__panel" role="dialog" aria-modal="true" aria-label="Notifications">
        {/* Header */}
        <div className="notif__header">
          <div>
            <h2 className="notif__heading">Notifications</h2>
            {unreadCount > 0 && (
              <span className="notif__count">{unreadCount} unread</span>
            )}
          </div>
          <div className="notif__header-actions">
            {unreadCount > 0 && (
              <button className="notif__mark-all" onClick={markAllRead}>
                Mark all read
              </button>
            )}
            <button
              className="notif__close"
              onClick={closeNotifications}
              aria-label="Close notifications"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M3 3l12 12M15 3L3 15" />
              </svg>
            </button>
          </div>
        </div>

        {/* List */}
        <div className="notif__list">
          {notifications.length === 0 ? (
            <div className="notif__empty">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" opacity=".3">
                <path d="M20 5a13 13 0 0 1 13 13c0 7 2.5 9.5 3.5 12H3.5c1-2.5 3.5-5 3.5-12A13 13 0 0 1 20 5z" />
                <path d="M16 34a4 4 0 0 0 8 0" />
              </svg>
              <p>You&apos;re all caught up</p>
            </div>
          ) : (
            notifications.map((n: AppNotification) => (
              <React.Fragment key={n.id}>
                <NotifItem n={n} onRead={markRead} />
              </React.Fragment>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="notif__footer">
          <Link href="/notifications" className="notif__view-all" onClick={closeNotifications}>
            View all notifications →
          </Link>
        </div>
      </div>
    </>
  );
}
