import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in"
      description="Enter your details to access your workspace."
    >
      <LoginForm />
    </AuthLayout>
  );
}
