export type NavItemId =
  | 'dashboard'
  | 'contacts'
  | 'companies'
  | 'deals'
  | 'leads'
  | 'activities'
  | 'pipeline'
  | 'reports'
  | 'emails'
  | 'calendar'
  | 'documents'
  | 'products'
  | 'settings'
  | 'team'
  | 'employees'
  | 'integrations';

export interface NavItem {
  id: NavItemId;
  label: string;
  href: string;
  icon: NavItemId;
  badge?: number | string;
  children?: Omit<NavItem, 'children'>[];
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
    ],
  },
  {
    label: 'CRM',
    items: [
      { id: 'contacts', label: 'Contacts', href: '/contacts', icon: 'contacts' },
      { id: 'companies', label: 'Companies', href: '/companies', icon: 'companies' },
      { id: 'deals', label: 'Deals', href: '/deals', icon: 'deals', badge: 12 },
      { id: 'leads', label: 'Leads', href: '/leads', icon: 'leads', badge: 4 },
    ],
  },
  {
    label: 'Sales',
    items: [
      { id: 'pipeline', label: 'Pipeline', href: '/pipeline', icon: 'pipeline' },
      { id: 'activities', label: 'Activities', href: '/activities', icon: 'activities' },
      { id: 'calendar', label: 'Calendar', href: '/calendar', icon: 'calendar' },
      { id: 'emails', label: 'Emails', href: '/emails', icon: 'emails' },
    ],
  },
  {
    label: 'Organization',
    items: [
      { id: 'employees', label: 'Employees', href: '/employees', icon: 'employees' },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { id: 'reports', label: 'Reports', href: '/reports', icon: 'reports' },
      { id: 'documents', label: 'Documents', href: '/documents', icon: 'documents' },
      { id: 'products', label: 'Products', href: '/products', icon: 'products' },
    ],
  },
  {
    label: 'Settings',
    items: [
      { id: 'team', label: 'Team', href: '/settings/team', icon: 'team' },
      { id: 'integrations', label: 'Integrations', href: '/settings/integrations', icon: 'integrations' },
      { id: 'settings', label: 'Settings', href: '/settings', icon: 'settings' },
    ],
  },
];

// Flat list for command palette / search
export const ALL_NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);

export const COMMAND_PALETTE_ACTIONS = [
  { id: 'new-contact', label: 'New Contact', shortcut: 'N C', href: '/contacts/new', group: 'Create' },
  { id: 'new-deal', label: 'New Deal', shortcut: 'N D', href: '/deals/new', group: 'Create' },
  { id: 'new-company', label: 'New Company', shortcut: 'N O', href: '/companies/new', group: 'Create' },
  { id: 'new-activity', label: 'Log Activity', shortcut: 'N A', href: '/activities/new', group: 'Create' },
  { id: 'new-employee', label: 'New Employee', shortcut: 'N E', href: '/employees/new', group: 'Create' },
  { id: 'import', label: 'Import CSV', shortcut: '', href: '/settings/import', group: 'Data' },
  { id: 'export', label: 'Export Data', shortcut: '', href: '/settings/export', group: 'Data' },
];
