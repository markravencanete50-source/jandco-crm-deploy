import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      eyebrow="Account recovery"
      title="Reset password"
      description="We'll send a reset link to your email address."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
