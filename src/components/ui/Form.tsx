import * as React from "react";
import { cn } from "@/lib/cn";

export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "mb-1.5 block font-mono text-[11px] uppercase tracking-wide2 text-slate-700",
        className
      )}
      {...props}
    />
  )
);
Label.displayName = "Label";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[80px] w-full rounded border bg-paper px-3 py-2 text-[13px] text-ink placeholder:text-slate-500",
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
  )
);
Textarea.displayName = "Textarea";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "flex h-9 w-full appearance-none rounded border bg-paper px-3 text-[13px] text-ink",
        "border-slate-300 transition-colors",
        "hover:border-slate-500",
        "focus-visible:border-pine-700",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-100",
        error && "border-signal-bad focus-visible:ring-signal-bad",
        className
      )}
      aria-invalid={error || undefined}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";

export function FormField({
  label,
  htmlFor,
  error,
  hint,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("w-full", className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && !error && <p className="mt-1 text-[12px] text-slate-500">{hint}</p>}
      {error && (
        <p role="alert" className="mt-1 text-[12px] text-signal-bad">
          {error}
        </p>
      )}
    </div>
  );
}
