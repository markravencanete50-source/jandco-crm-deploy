import { AlertTriangle } from "lucide-react";

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="mb-4 flex items-start gap-2 rounded border border-[#E3B7B0] bg-[#F8E9E7] px-3 py-2.5 text-[13px] text-signal-bad"
    >
      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
