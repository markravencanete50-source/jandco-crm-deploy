import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 font-mono text-[11px] uppercase tracking-wide2",
  {
    variants: {
      status: {
        good: "border-pine-300 bg-pine-50 text-pine-700",
        warn: "border-clay-300 bg-clay-100 text-clay-700",
        bad: "border-[#E3B7B0] bg-[#F8E9E7] text-signal-bad",
        idle: "border-slate-300 bg-slate-100 text-slate-700",
        info: "border-slate-300 bg-paper text-ink",
      },
    },
    defaultVariants: {
      status: "idle",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Show the leading status dot. Defaults to true. */
  dot?: boolean;
}

const dotColor: Record<string, string> = {
  good: "bg-signal-good",
  warn: "bg-signal-warn",
  bad: "bg-signal-bad",
  idle: "bg-signal-idle",
  info: "bg-slate-500",
};

export function Badge({ className, status = "idle", dot = true, children, ...props }: BadgeProps) {
  const key = status ?? "idle";
  return (
    <span className={cn(badgeVariants({ status }), className)} {...props}>
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", dotColor[key])} aria-hidden="true" />}
      {children}
    </span>
  );
}
