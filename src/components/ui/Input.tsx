import * as React from "react";
import { cn } from "@/lib/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-9 w-full rounded border bg-paper px-3 text-[13px] text-ink placeholder:text-slate-500",
          "border-slate-300 transition-colors",
          "hover:border-slate-500",
          "focus-visible:border-pine-700",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-100",
          error && "border-signal-bad focus-visible:ring-signal-bad",
          className
        )}
        aria-invalid={error || undefined}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
