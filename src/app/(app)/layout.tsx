import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { requireAuth } from "@/shared/auth/require-auth";
import { onboardingRepository } from "@/modules/onboarding/repositories/onboarding-repository";
import { organizationRepository } from "@/modules/organizations/repositories/organization-repository";
import { gameListingRepository } from "@/modules/game-listings/repositories/game-listing-repository";
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
  const activeOrg = orgs.find((o) => o.id === cookieOrgId) ?? orgs[0] ?? null;

  // The `active_org` cookie can be unset or stale (e.g. right after signup, before the user
  // ever touches the org switcher). Server actions read the cookie directly via getActiveOrgId(),
  // so if it doesn't match what we resolved here, ask the client to persist the correction.
  const syncActiveOrgId = activeOrg && activeOrg.id !== cookieOrgId ? activeOrg.id : null;

  const pendingInterestsCount =
    activeOrg?.type === "TEAM" ? await gameListingRepository.countPendingResponses(activeOrg.id) : 0;

  return (
    <AppShell
      orgs={orgs}
      activeOrgId={activeOrg?.id ?? null}
      syncActiveOrgId={syncActiveOrgId}
      pendingInterestsCount={pendingInterestsCount}
    >
      {children}
    </AppShell>
  );
}
