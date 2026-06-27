"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/features/auth/components/FormError";
import { PasswordField } from "@/features/auth/components/PasswordField";
import {
  validateResetPasswordForm,
  hasErrors,
  type FieldErrors,
} from "@/features/auth/lib/validation";
import { mockResetPassword } from "@/features/auth/lib/mockAuthService";

export function ResetPasswordForm({ token }: { token?: string }) {
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [formError, setFormError] = React.useState<string>();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [succeeded, setSucceeded] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(undefined);
    const fieldErrors = validateResetPasswordForm({ password, confirmPassword });
    setErrors(fieldErrors);
    if (hasErrors(fieldErrors)) return;

    setIsSubmitting(true);
    const result = await mockResetPassword(token ?? "", password);
    setIsSubmitting(false);

    if (!result.success) {
      setFormError(result.error ?? "Something went wrong. Try again.");
      return;
    }
    setSucceeded(true);
  }

  if (succeeded) {
    return (
      <div>
        <div className="flex items-start gap-3 rounded border border-pine-300 bg-pine-50 px-4 py-4">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-pine-700" aria-hidden="true" />
          <p className="text-[13px] text-pine-700">
            Your password has been reset. Sign in with your new password.
          </p>
        </div>
        <Link
          href="/login"
          className="mt-4 inline-block text-[13px] text-pine-700 hover:underline"
        >
          Continue to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <FormError message={formError} />

      <PasswordField
        id="reset-password"
        label="New password"
        value={password}
        onChange={setPassword}
        error={errors.password}
        showRequirements
        autoComplete="new-password"
      />

      <PasswordField
        id="reset-confirm"
        label="Confirm new password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        error={errors.confirmPassword}
        autoComplete="new-password"
      />

      <Button type="submit" className="w-full" isLoading={isSubmitting}>
        Reset password
      </Button>
    </form>
  );
}
