import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

export const Checkbox = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <span className="relative inline-flex h-4 w-4 shrink-0 items-center justify-center">
      <input
        ref={ref}
        type="checkbox"
        className={cn(
          "peer h-4 w-4 cursor-pointer appearance-none rounded-sm border border-slate-300 bg-paper",
          "checked:border-pine-700 checked:bg-pine-700",
          "disabled:cursor-not-allowed disabled:opacity-40",
          className
        )}
        {...props}
      />
      <Check
        className="pointer-events-none absolute h-3 w-3 text-paper opacity-0 peer-checked:opacity-100"
        aria-hidden="true"
      />
    </span>
  )
);
Checkbox.displayName = "Checkbox";

export const Radio = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <span className="relative inline-flex h-4 w-4 shrink-0 items-center justify-center">
      <input
        ref={ref}
        type="radio"
        className={cn(
          "peer h-4 w-4 cursor-pointer appearance-none rounded-full border border-slate-300 bg-paper",
          "checked:border-pine-700",
          "disabled:cursor-not-allowed disabled:opacity-40",
          className
        )}
        {...props}
      />
      <span
        className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-pine-700 opacity-0 peer-checked:opacity-100"
        aria-hidden="true"
      />
    </span>
  )
);
Radio.displayName = "Radio";

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  id?: string;
}

export function Switch({ checked, onChange, disabled, label, id }: SwitchProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors",
        checked ? "border-pine-700 bg-pine-700" : "border-slate-300 bg-slate-200",
        "disabled:cursor-not-allowed disabled:opacity-40"
      )}
    >
      <span
        className={cn(
          "inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-[18px]" : "translate-x-[3px]"
        )}
      />
    </button>
  );
}
