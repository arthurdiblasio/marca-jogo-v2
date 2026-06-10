import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { requireAuth } from "@/shared/auth/require-auth";
import { onboardingRepository } from "@/modules/onboarding/repositories/onboarding-repository";
import { organizationRepository } from "@/modules/organizations/repositories/organization-repository";
import { getActiveOrgId } from "@/shared/orgs/active-org-cookie";

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

  const orgs = await organizationRepository.findByUserId(session.id);
  const cookieOrgId = await getActiveOrgId();
  const activeOrgId =
    orgs.find((o) => o.id === cookieOrgId)?.id ?? orgs[0]?.id ?? null;

  return (
    <AppShell orgs={orgs} activeOrgId={activeOrgId}>
      {children}
    </AppShell>
  );
}
