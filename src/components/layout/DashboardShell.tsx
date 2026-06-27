'use client';

import React, { ReactNode } from 'react';
import { ShellProvider } from '@/context/ShellContext';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { MobileNav } from './MobileNav';
import { NotificationsPanel } from './NotificationsPanel';
import { CommandPalette } from './CommandPalette';

interface DashboardShellProps {
  children: ReactNode;
}

function ShellLayout({ children }: DashboardShellProps) {
  return (
    <div className="shell">
      <Sidebar />
      <div className="shell__main">
        <Topbar />
        <main className="shell__content" id="main-content" tabIndex={-1}>
          {children}
        </main>
      </div>
      <MobileNav />
      <NotificationsPanel />
      <CommandPalette />
    </div>
  );
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <ShellProvider>
      <ShellLayout>{children}</ShellLayout>
    </ShellProvider>
  );
}
