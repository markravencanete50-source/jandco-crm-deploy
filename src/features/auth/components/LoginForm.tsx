"use client";

import * as React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/Form";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Toggle";
import { FormError } from "@/features/auth/components/FormError";
import { PasswordField } from "@/features/auth/components/PasswordField";
import { validateLoginForm, hasErrors, type FieldErrors } from "@/features/auth/lib/validation";
import { mockSignIn } from "@/features/auth/lib/mockAuthService";

export function LoginForm() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [remember, setRemember] = React.useState(true);
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [formError, setFormError] = React.useState<string>();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [succeeded, setSucceeded] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(undefined);
    const fieldErrors = validateLoginForm({ email, password });
    setErrors(fieldErrors);
    if (hasErrors(fieldErrors)) return;

    setIsSubmitting(true);
    const result = await mockSignIn(email, password);
    setIsSubmitting(false);

    if (!result.success) {
      setFormError(result.error ?? "Something went wrong. Try again.");
      return;
    }
    window.location.href = '/dashboard';
  }

  if (succeeded) {
    return (
      <div className="rounded border border-pine-300 bg-pine-50 px-4 py-4 text-[13px] text-pine-700">
        Signed in successfully. Routing to the dashboard will be wired up in
        Phase 3 — for now this confirms the auth flow works end to end.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <FormError message={formError} />

      <FormField label="Email" htmlFor="login-email" error={errors.email}>
        <Input
          id="login-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!errors.email}
          placeholder="you@company.com"
        />
      </FormField>

      <div>
        <div className="flex items-center justify-between">
          <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-wide2 text-slate-700">
            Password
          </span>
          <Link href="/forgot-password" className="text-[12px] text-pine-700 hover:underline">
            Forgot password?
          </Link>
        </div>
        <PasswordField
          id="login-password"
          label=""
          value={password}
          onChange={setPassword}
          error={errors.password}
          autoComplete="current-password"
        />
      </div>

      <label className="flex items-center gap-2 text-[13px] text-ink">
        <Checkbox checked={remember} onChange={(e) => setRemember(e.target.checked)} />
        Keep me signed in
      </label>

      <Button type="submit" className="w-full" isLoading={isSubmitting}>
        Sign in
      </Button>

      <p className="text-center text-[13px] text-slate-500">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-pine-700 hover:underline">
          Create one
        </Link>
      </p>

      <p className="text-center text-[11px] text-slate-400">
        Try <span className="font-mono">wrong@example.com</span> or{" "}
        <span className="font-mono">locked@example.com</span> to see error states.
      </p>
    </form>
  );
}
