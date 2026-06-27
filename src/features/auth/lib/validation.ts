/**
 * Validation logic for auth forms. Pure functions, no side effects —
 * easy to unit test and easy to extend with server-side error mapping
 * once Firebase Auth is wired in (Phase 13).
 */

export interface FieldErrors {
  [field: string]: string | undefined;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return "Email is required.";
  if (!EMAIL_RE.test(email)) return "Enter a valid email address.";
  return undefined;
}

export interface PasswordRequirement {
  label: string;
  met: boolean;
}

export function getPasswordRequirements(password: string): PasswordRequirement[] {
  return [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One number", met: /[0-9]/.test(password) },
  ];
}

export function validatePassword(password: string): string | undefined {
  if (!password) return "Password is required.";
  const unmet = getPasswordRequirements(password).filter((r) => !r.met);
  if (unmet.length > 0) return "Password does not meet the requirements below.";
  return undefined;
}

export function validateLoginForm(values: { email: string; password: string }): FieldErrors {
  const errors: FieldErrors = {};
  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;
  if (!values.password) errors.password = "Password is required.";
  return errors;
}

export function validateRegisterForm(values: {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.fullName.trim()) errors.fullName = "Full name is required.";

  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(values.password);
  if (passwordError) errors.password = passwordError;

  if (!values.confirmPassword) {
    errors.confirmPassword = "Confirm your password.";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

export function validateForgotPasswordForm(values: { email: string }): FieldErrors {
  const errors: FieldErrors = {};
  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;
  return errors;
}

export function validateResetPasswordForm(values: {
  password: string;
  confirmPassword: string;
}): FieldErrors {
  const errors: FieldErrors = {};
  const passwordError = validatePassword(values.password);
  if (passwordError) errors.password = passwordError;

  if (!values.confirmPassword) {
    errors.confirmPassword = "Confirm your password.";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.values(errors).some(Boolean);
}
