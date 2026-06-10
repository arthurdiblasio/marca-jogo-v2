import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { requireAuth } from "@/shared/auth/require-auth";
import { onboardingRepository } from "@/modules/onboarding/repositories/onboarding-repository";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await requireAuth();

  const profile = await onboardingRepository.findProfileByUserId(session.id);

  if (!profile?.onboardingCompletedAt) {
    const nextStep = (profile?.onboardingStep ?? 0) + 1;
    redirect(`/onboarding/${nextStep}`);
  }

  return (
    <AppShell>
      {children}
    </AppShell>
  );
}