"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, MailCheck } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/Form";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/features/auth/components/FormError";
import {
  validateForgotPasswordForm,
  hasErrors,
  type FieldErrors,
} from "@/features/auth/lib/validation";
import { mockSendPasswordReset } from "@/features/auth/lib/mockAuthService";

export function ForgotPasswordForm() {
  const [email, setEmail] = React.useState("");
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [formError, setFormError] = React.useState<string>();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(undefined);
    const fieldErrors = validateForgotPasswordForm({ email });
    setErrors(fieldErrors);
    if (hasErrors(fieldErrors)) return;

    setIsSubmitting(true);
    const result = await mockSendPasswordReset(email);
    setIsSubmitting(false);

    if (!result.success) {
      setFormError(result.error ?? "Something went wrong. Try again.");
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div>
        <div className="flex items-start gap-3 rounded border border-pine-300 bg-pine-50 px-4 py-4">
          <MailCheck className="mt-0.5 h-4 w-4 shrink-0 text-pine-700" aria-hidden="true" />
          <div>
            <p className="text-[13px] font-medium text-pine-700">Check your inbox</p>
            <p className="mt-1 text-[13px] text-pine-700">
              If an account exists for <span className="font-mono">{email}</span>, a reset
              link is on its way.
            </p>
          </div>
        </div>
        <Link
          href="/login"
          className="mt-4 inline-flex items-center gap-1.5 text-[13px] text-pine-700 hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <FormError message={formError} />

      <FormField label="Email" htmlFor="forgot-email" error={errors.email}>
        <Input
          id="forgot-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!errors.email}
          placeholder="you@company.com"
        />
      </FormField>

      <Button type="submit" className="w-full" isLoading={isSubmitting}>
        Send reset link
      </Button>

      <Link
        href="/login"
        className="flex items-center justify-center gap-1.5 text-[13px] text-slate-500 hover:text-pine-700"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
      </Link>
    </form>
  );
}
