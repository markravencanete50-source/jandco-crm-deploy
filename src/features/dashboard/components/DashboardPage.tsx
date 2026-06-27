'use client';

import { useDashboard } from '../hooks/useDashboard';
import { DashboardHeader } from './DashboardHeader';
import { KPIGrid } from './KPIGrid';
import { RevenueChart } from './RevenueChart';
import { PipelineFunnel } from './PipelineFunnel';
import { ActivityFeed } from './ActivityFeed';
import { TopClients } from './TopClients';
import { TeamPerformance } from './TeamPerformance';
import { UpcomingTasks } from './UpcomingTasks';

export function DashboardPage() {
  const { data, loading, refreshing, error, refresh, lastUpdated } = useDashboard();

  if (error) {
    return (
      <div className="p-6">
        <div className="border border-[#C8693B] bg-[var(--color-surface)] p-5 max-w-md">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#C8693B] mb-2">
            Error loading dashboard
          </p>
          <p className="text-sm font-mono text-[var(--color-text)]">{error}</p>
          <button
            onClick={refresh}
            className="mt-3 text-[10px] font-mono uppercase tracking-wide text-[#C8693B] hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <DashboardHeader
        refreshing={refreshing}
        lastUpdated={lastUpdated}
        onRefresh={refresh}
      />

      {/* KPI Strip */}
      <div className="border border-[var(--color-border)]">
        <KPIGrid metrics={data?.kpis ?? []} loading={loading} />
      </div>

      {/* Row 2: Revenue chart (wide) + Pipeline funnel (narrow) */}
      <div className="grid grid-cols-1 xl:grid-cols-[3fr_2fr] gap-px bg-[var(--color-border)]">
        <RevenueChart data={data?.revenueChart ?? []} loading={loading} />
        <PipelineFunnel stages={data?.pipeline ?? []} loading={loading} />
      </div>

      {/* Row 3: Top clients (wide) + Upcoming tasks (narrow) */}
      <div className="grid grid-cols-1 xl:grid-cols-[3fr_2fr] gap-px bg-[var(--color-border)]">
        <TopClients clients={data?.topClients ?? []} loading={loading} />
        <UpcomingTasks tasks={data?.upcomingTasks ?? []} loading={loading} />
      </div>

      {/* Row 4: Activity feed + Team performance */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-px bg-[var(--color-border)]">
        <ActivityFeed items={data?.recentActivity ?? []} loading={loading} />
        <TeamPerformance members={data?.teamPerformance ?? []} loading={loading} />
      </div>
    </div>
  );
}
