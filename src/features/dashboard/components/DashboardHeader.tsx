'use client';

interface DashboardHeaderProps {
  refreshing: boolean;
  lastUpdated: Date | null;
  onRefresh: () => void;
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export function DashboardHeader({ refreshing, lastUpdated, onRefresh }: DashboardHeaderProps) {
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="flex items-start justify-between">
      <div>
        <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
          {today}
        </p>
        <h1 className="text-2xl font-mono font-semibold text-[var(--color-text)] mt-1">
          {getGreeting()}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {lastUpdated && (
          <span className="text-[10px] font-mono text-[var(--color-text-muted)] hidden sm:block">
            Updated {lastUpdated.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="h-8 px-3 border border-[var(--color-border)] text-[10px] font-mono uppercase tracking-wide text-[var(--color-text-muted)] hover:border-[var(--color-pine)] hover:text-[var(--color-pine)] disabled:opacity-40 transition-colors flex items-center gap-1.5"
        >
          <span className={refreshing ? 'animate-spin inline-block' : ''}>↻</span>
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </button>

        {/* Date range selector — placeholder for Phase 13 real filter */}
        <select className="h-8 px-2 border border-[var(--color-border)] text-[10px] font-mono uppercase tracking-wide text-[var(--color-text-muted)] bg-[var(--color-surface)] focus:outline-none focus:border-[var(--color-pine)]">
          <option>This month</option>
          <option>Last month</option>
          <option>Last 90 days</option>
          <option>YTD</option>
        </select>
      </div>
    </div>
  );
}
