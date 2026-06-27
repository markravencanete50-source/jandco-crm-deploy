"use client";

import * as React from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/cn";

type ToastStatus = "good" | "warn" | "bad" | "info";

interface Toast {
  id: string;
  title: string;
  description?: string;
  status: ToastStatus;
}

interface ToastContextValue {
  toast: (toast: Omit<Toast, "id">) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

const iconMap: Record<ToastStatus, React.ElementType> = {
  good: CheckCircle2,
  warn: AlertTriangle,
  bad: XCircle,
  info: Info,
};

const colorMap: Record<ToastStatus, string> = {
  good: "border-pine-300 text-pine-700",
  warn: "border-clay-300 text-clay-700",
  bad: "border-[#E3B7B0] text-signal-bad",
  info: "border-slate-300 text-ink",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback(
    (input: Omit<Toast, "id">) => {
      const id = crypto.randomUUID();
      setToasts((current) => [...current, { ...input, id }]);
      window.setTimeout(() => dismiss(id), 5000);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        className="fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2"
        aria-live="polite"
      >
        {toasts.map((t) => {
          const Icon = iconMap[t.status];
          return (
            <div
              key={t.id}
              role="status"
              className={cn(
                "flex items-start gap-2.5 rounded border bg-white px-3.5 py-3 shadow-lg",
                colorMap[t.status]
              )}
            >
              <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <div className="flex-1">
                <p className="font-mono text-[12px] uppercase tracking-wide2 text-ink">{t.title}</p>
                {t.description && <p className="mt-0.5 text-[12px] text-slate-600">{t.description}</p>}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss notification"
                className="text-slate-400 hover:text-ink"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
