"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? undefined;
  return <ResetPasswordForm token={token} />;
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      eyebrow="Account recovery"
      title="Set new password"
      description="Choose a new password for your account."
    >
      <Suspense fallback={null}>
        <ResetPasswordContent />
      </Suspense>
    </AuthLayout>
  );
}
