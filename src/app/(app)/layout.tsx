import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { requireAuth } from "@/shared/auth/require-auth";
import { onboardingRepository } from "@/modules/onboarding/repositories/onboarding-repository";
import { organizationRepository } from "@/modules/organizations/repositories/organization-repository";
import { gameListingRepository } from "@/modules/game-listings/repositories/game-listing-repository";
import { callUpRepository } from "@/modules/call-ups/repositories/call-up-repository";
import { formatListingDateTime } from "@/modules/game-listings/lib/format";
import { getActiveOrgId } from "@/shared/orgs/active-org-cookie";
import type { CallUpNotification } from "@/components/navigation/notifications-bell";

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

  const [pendingInterestsCount, pendingCallUpsCount, { peladaCallUps, matchCallUps }] = await Promise.all([
    activeOrg?.type === "TEAM" ? gameListingRepository.countPendingResponses(activeOrg.id) : Promise.resolve(0),
    activeOrg ? callUpRepository.countPendingForUserInOrg(session.id, activeOrg.id) : Promise.resolve(0),
    callUpRepository.listPendingForUserAcrossOrgs(session.id),
  ]);

  const notifications: CallUpNotification[] = [
    ...peladaCallUps.map((callUp) => ({
      id: callUp.id,
      kind: "pelada" as const,
      organizationId: callUp.peladaOccurrence.organizationId,
      organizationName: callUp.peladaOccurrence.organization.name,
      title: callUp.peladaOccurrence.title,
      subtitle: formatListingDateTime(callUp.peladaOccurrence.scheduledAt),
      href: `/pelada/rodadas/${callUp.peladaOccurrence.id}`,
    })),
    ...matchCallUps.map((callUp) => {
      const isHome = callUp.match.homeOrganizationId === callUp.organization.id;
      const opponent = isHome ? callUp.match.awayOrganization?.name : callUp.match.homeOrganization.name;
      return {
        id: callUp.id,
        kind: "match" as const,
        organizationId: callUp.organization.id,
        organizationName: callUp.organization.name,
        title: `vs ${opponent ?? callUp.match.opponentName ?? "Adversário"}`,
        subtitle: formatListingDateTime(callUp.match.scheduledAt),
        href: `/time/agenda/${callUp.match.id}`,
      };
    }),
  ];

  return (
    <AppShell
      orgs={orgs}
      activeOrgId={activeOrg?.id ?? null}
      syncActiveOrgId={syncActiveOrgId}
      pendingInterestsCount={pendingInterestsCount}
      pendingCallUpsCount={pendingCallUpsCount}
      notifications={notifications}
    >
      {children}
    </AppShell>
  );
}
