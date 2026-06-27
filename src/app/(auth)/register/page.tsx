import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout
      eyebrow="Get started"
      title="Create account"
      description="Set up your workspace in under a minute."
    >
      <RegisterForm />
    </AuthLayout>
  );
}
