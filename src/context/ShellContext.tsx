'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';

export type NotificationPriority = 'info' | 'success' | 'warning' | 'error';

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  priority: NotificationPriority;
  read: boolean;
  timestamp: Date;
  href?: string;
}

interface ShellContextValue {
  // Sidebar
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  collapseSidebar: () => void;
  expandSidebar: () => void;

  // Mobile drawer
  mobileNavOpen: boolean;
  openMobileNav: () => void;
  closeMobileNav: () => void;

  // Command palette
  commandPaletteOpen: boolean;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;

  // Notifications
  notificationsOpen: boolean;
  openNotifications: () => void;
  closeNotifications: () => void;
  notifications: AppNotification[];
  unreadCount: number;
  markAllRead: () => void;
  markRead: (id: string) => void;
  addNotification: (n: Omit<AppNotification, 'id' | 'read' | 'timestamp'>) => void;
}

const ShellContext = createContext<ShellContextValue | null>(null);

const SEED_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    title: 'Deal closed — Acme Corp',
    body: 'Sarah Kim closed a $240,000 deal with Acme Corp. Q3 quota now at 87%.',
    priority: 'success',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 8),
    href: '/deals',
  },
  {
    id: 'n2',
    title: 'Follow-up overdue',
    body: 'Globex Industries follow-up was due 2 days ago. Mark as done or reschedule.',
    priority: 'warning',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    href: '/contacts',
  },
  {
    id: 'n3',
    title: 'New lead assigned',
    body: 'Initech LLC has been assigned to you from the inbound queue.',
    priority: 'info',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    href: '/leads',
  },
  {
    id: 'n4',
    title: 'Proposal viewed',
    body: 'Umbrella Corp opened your proposal document for the 3rd time today.',
    priority: 'info',
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    href: '/deals',
  },
  {
    id: 'n5',
    title: 'Pipeline report ready',
    body: 'Your weekly pipeline summary has been generated and is ready to review.',
    priority: 'info',
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    href: '/reports',
  },
];

export function ShellProvider({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(SEED_NOTIFICATIONS);

  const unreadCount = notifications.filter((n: AppNotification) => !n.read).length;

  // Cmd/Ctrl + K → open command palette
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev: boolean) => !prev);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
        setNotificationsOpen(false);
        setMobileNavOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications((prev: AppNotification[]) =>
      prev.map((n: AppNotification) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev: AppNotification[]) => prev.map((n: AppNotification) => ({ ...n, read: true })));
  }, []);

  const addNotification = useCallback(
    (n: Omit<AppNotification, 'id' | 'read' | 'timestamp'>) => {
      setNotifications((prev: AppNotification[]) => [
        {
          ...n,
          id: `n${Date.now()}`,
          read: false,
          timestamp: new Date(),
        },
        ...prev,
      ]);
    },
    []
  );

  return (
    <ShellContext.Provider
      value={{
        sidebarOpen: !sidebarCollapsed,
        sidebarCollapsed,
        toggleSidebar: () => setSidebarCollapsed((v: boolean) => !v),
        collapseSidebar: () => setSidebarCollapsed(true),
        expandSidebar: () => setSidebarCollapsed(false),
        mobileNavOpen,
        openMobileNav: () => setMobileNavOpen(true),
        closeMobileNav: () => setMobileNavOpen(false),
        commandPaletteOpen,
        openCommandPalette: () => setCommandPaletteOpen(true),
        closeCommandPalette: () => setCommandPaletteOpen(false),
        notificationsOpen,
        openNotifications: () => setNotificationsOpen(true),
        closeNotifications: () => setNotificationsOpen(false),
        notifications,
        unreadCount,
        markAllRead,
        markRead,
        addNotification,
      }}
    >
      {children}
    </ShellContext.Provider>
  );
}

export function useShell(): ShellContextValue {
  const ctx = useContext(ShellContext);
  if (!ctx) throw new Error('useShell must be used inside <ShellProvider>');
  return ctx;
}
