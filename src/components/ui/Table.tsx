import * as React from "react";
import { cn } from "@/lib/cn";

export function Table({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto rounded border border-slate-200">
      <table className={cn("w-full border-collapse text-left text-[13px]", className)} {...props} />
    </div>
  );
}

export function TableHead({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("bg-slate-100", className)} {...props} />;
}

export function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("divide-y divide-slate-200", className)} {...props} />;
}

export function TableRow({
  className,
  active,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement> & { active?: boolean }) {
  return (
    <tr
      className={cn(
        "border-l-2 border-l-transparent transition-colors hover:bg-slate-50",
        active && "border-l-pine-700 bg-pine-50/40",
        className
      )}
      {...props}
    />
  );
}

export function TableHeaderCell({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "px-3 py-2 font-mono text-[11px] uppercase tracking-wide2 text-slate-700",
        className
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("px-3 py-2.5 text-ink", className)} {...props} />;
}
