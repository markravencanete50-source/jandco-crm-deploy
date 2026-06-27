"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export interface TabItem {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Tabs({ items, value, onChange, className }: TabsProps) {
  return (
    <div role="tablist" className={cn("flex items-center gap-1 border-b border-slate-200", className)}>
      {items.map((item) => {
        const isActive = item.value === value;
        return (
          <button
            key={item.value}
            role="tab"
            aria-selected={isActive}
            disabled={item.disabled}
            onClick={() => onChange(item.value)}
            className={cn(
              "relative px-3 py-2 font-mono text-[12px] uppercase tracking-wide2 transition-colors",
              "disabled:cursor-not-allowed disabled:opacity-40",
              isActive ? "text-pine-700" : "text-slate-500 hover:text-ink"
            )}
          >
            {item.label}
            {isActive && (
              <span className="absolute inset-x-0 -bottom-px h-[2px] bg-pine-700" aria-hidden="true" />
            )}
          </button>
        );
      })}
    </div>
  );
}
