import type { Metadata } from 'next';
import { DashboardPage } from '@/features/dashboard/components/DashboardPage';

export const metadata: Metadata = {
  title: 'Dashboard — Enterprise CRM',
};

export default function Page() {
  return <DashboardPage />;
}
