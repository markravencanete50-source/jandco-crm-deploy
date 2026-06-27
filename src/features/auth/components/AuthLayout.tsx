import * as React from "react";

const stats: { label: string; value: string }[] = [
  { label: "Active accounts", value: "1,204" },
  { label: "Open pipelines", value: "86" },
  { label: "Uptime", value: "99.98%" },
];

export function AuthLayout({
  children,
  eyebrow,
  title,
  description,
}: {
  children: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Form panel */}
      <div className="flex flex-col items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-sm bg-pine-700 font-mono text-[12px] font-semibold text-paper">
              E
            </span>
            <span className="font-mono text-[12px] uppercase tracking-wide2 text-ink">
              Enterprise CRM
            </span>
          </div>

          <p className="font-mono text-[11px] uppercase tracking-wide3 text-slate-500">
            {eyebrow}
          </p>
          <h1 className="mt-1 font-mono text-[20px] uppercase tracking-wide2 text-ink">
            {title}
          </h1>
          <p className="mt-2 text-[13px] text-slate-500">{description}</p>

          <div className="mt-8">{children}</div>
        </div>
      </div>

      {/* Ledger panel — visual signature, hidden on small screens */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-pine-900 px-12 py-12 text-paper lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 27px, currentColor 27px, currentColor 28px)",
          }}
          aria-hidden="true"
        />
        <div className="relative">
          <p className="font-mono text-[11px] uppercase tracking-wide3 text-pine-300">
            System status
          </p>
          <p className="mt-2 max-w-md text-[15px] leading-relaxed text-pine-50">
            Every account, project, and task in one ledger — built for teams
            who need a clear record of what happened and when.
          </p>
        </div>

        <dl className="relative grid grid-cols-3 gap-6 border-t border-pine-700 pt-6">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="font-mono text-[10px] uppercase tracking-wide2 text-pine-300">
                {stat.label}
              </dt>
              <dd className="mt-1 font-mono text-[18px] text-paper">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
