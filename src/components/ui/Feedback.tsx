import * as React from "react";
import { Loader2, Inbox } from "lucide-react";
import { cn } from "@/lib/cn";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded bg-slate-200", className)}
      aria-hidden="true"
      {...props}
    />
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <Loader2
      className={cn("h-4 w-4 animate-spin text-pine-700", className)}
      role="status"
      aria-label="Loading"
    />
  );
}

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        {icon ?? <Inbox className="h-5 w-5" aria-hidden="true" />}
      </div>
      <div>
        <p className="font-mono text-[12px] uppercase tracking-wide2 text-ink">{title}</p>
        {description && <p className="mt-1 max-w-sm text-[13px] text-slate-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}
