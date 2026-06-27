"use client";

import * as React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/Form";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/features/auth/components/FormError";
import { PasswordField } from "@/features/auth/components/PasswordField";
import { validateRegisterForm, hasErrors, type FieldErrors } from "@/features/auth/lib/validation";
import { mockRegister } from "@/features/auth/lib/mockAuthService";

export function RegisterForm() {
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [formError, setFormError] = React.useState<string>();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [succeeded, setSucceeded] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(undefined);
    const fieldErrors = validateRegisterForm({ fullName, email, password, confirmPassword });
    setErrors(fieldErrors);
    if (hasErrors(fieldErrors)) return;

    setIsSubmitting(true);
    const result = await mockRegister(fullName, email, password);
    setIsSubmitting(false);

    if (!result.success) {
      setFormError(result.error ?? "Something went wrong. Try again.");
      return;
    }
    setSucceeded(true);
  }

  if (succeeded) {
    return (
      <div className="rounded border border-pine-300 bg-pine-50 px-4 py-4 text-[13px] text-pine-700">
        Account created. Sign-in after registration will be wired up once
        Firebase Auth lands in Phase 13.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <FormError message={formError} />

      <FormField label="Full name" htmlFor="register-name" error={errors.fullName}>
        <Input
          id="register-name"
          autoComplete="name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          error={!!errors.fullName}
          placeholder="Amara Reyes"
        />
      </FormField>

      <FormField label="Work email" htmlFor="register-email" error={errors.email}>
        <Input
          id="register-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!errors.email}
          placeholder="you@company.com"
        />
      </FormField>

      <PasswordField
        id="register-password"
        label="Password"
        value={password}
        onChange={setPassword}
        error={errors.password}
        showRequirements
        autoComplete="new-password"
      />

      <PasswordField
        id="register-confirm"
        label="Confirm password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        error={errors.confirmPassword}
        autoComplete="new-password"
      />

      <Button type="submit" className="w-full" isLoading={isSubmitting}>
        Create account
      </Button>

      <p className="text-center text-[13px] text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="text-pine-700 hover:underline">
          Sign in
        </Link>
      </p>

      <p className="text-center text-[11px] text-slate-400">
        Try <span className="font-mono">taken@example.com</span> to see the
        already-registered error state.
      </p>
    </form>
  );
}
