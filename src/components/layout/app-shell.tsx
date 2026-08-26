"use client";

import { useEffect } from "react";

import { OrgProvider, type OrgInfo } from "@/contexts/org-context";
import { BottomNavigation } from "@/components/navigation/bottom-navigation";
import { SidebarNavigation } from "@/components/navigation/sidebar-navigation";
import { TopNavigation } from "@/components/navigation/top-navigation";
import type { CallUpNotification } from "@/components/navigation/notifications-bell";
import { setActiveOrgAction } from "@/modules/organizations/actions/set-active-org";

interface AppShellProps {
  children: React.ReactNode;
  orgs: OrgInfo[];
  activeOrgId: string | null;
  syncActiveOrgId?: string | null;
  pendingInterestsCount?: number;
  pendingCallUpsCount?: number;
  notifications?: CallUpNotification[];
}

export function AppShell({
  children,
  orgs,
  activeOrgId,
  syncActiveOrgId,
  pendingInterestsCount = 0,
  pendingCallUpsCount = 0,
  notifications = [],
}: AppShellProps) {
  const activeOrg = orgs.find((o) => o.id === activeOrgId) ?? orgs[0] ?? null;

  useEffect(() => {
    if (syncActiveOrgId) {
      setActiveOrgAction(syncActiveOrgId);
    }
  }, [syncActiveOrgId]);

  return (
    <OrgProvider orgs={orgs} activeOrg={activeOrg}>
      <div className="min-h-screen">
        <TopNavigation notifications={notifications} activeOrgId={activeOrgId} />
        <SidebarNavigation
          pendingInterestsCount={pendingInterestsCount}
          pendingCallUpsCount={pendingCallUpsCount}
          notifications={notifications}
          activeOrgId={activeOrgId}
        />
        <main className="mx-auto min-h-screen w-full max-w-400 px-3 pb-24 pt-20 md:px-5 lg:pl-72 lg:pr-6 lg:pt-5">
          {children}
        </main>
        <BottomNavigation pendingInterestsCount={pendingInterestsCount} pendingCallUpsCount={pendingCallUpsCount} />
      </div>
    </OrgProvider>
  );
}
