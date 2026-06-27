"use client";

import * as React from "react";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Form";
import { cn } from "@/lib/cn";
import { getPasswordRequirements } from "@/features/auth/lib/validation";

export function PasswordField({
  id,
  label,
  value,
  onChange,
  error,
  showRequirements,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  showRequirements?: boolean;
  autoComplete?: string;
}) {
  const [visible, setVisible] = React.useState(false);
  const requirements = showRequirements ? getPasswordRequirements(value) : [];

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          error={!!error}
          autoComplete={autoComplete}
          className="pr-9"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-ink"
        >
          {visible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
        </button>
      </div>

      {showRequirements && value.length > 0 && (
        <ul className="mt-2 space-y-1">
          {requirements.map((req) => (
            <li
              key={req.label}
              className={cn(
                "flex items-center gap-1.5 text-[12px]",
                req.met ? "text-pine-700" : "text-slate-500"
              )}
            >
              {req.met ? (
                <Check className="h-3 w-3" aria-hidden="true" />
              ) : (
                <X className="h-3 w-3" aria-hidden="true" />
              )}
              {req.label}
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p role="alert" className="mt-1 text-[12px] text-signal-bad">
          {error}
        </p>
      )}
    </div>
  );
}
