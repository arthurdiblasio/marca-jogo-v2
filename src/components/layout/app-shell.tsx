"use client";

import { OrgProvider, type OrgInfo } from "@/contexts/org-context";
import { BottomNavigation } from "@/components/navigation/bottom-navigation";
import { SidebarNavigation } from "@/components/navigation/sidebar-navigation";
import { TopNavigation } from "@/components/navigation/top-navigation";

interface AppShellProps {
  children: React.ReactNode;
  orgs: OrgInfo[];
  activeOrgId: string | null;
  pendingInterestsCount?: number;
}

export function AppShell({ children, orgs, activeOrgId, pendingInterestsCount = 0 }: AppShellProps) {
  const activeOrg = orgs.find((o) => o.id === activeOrgId) ?? orgs[0] ?? null;

  return (
    <OrgProvider orgs={orgs} activeOrg={activeOrg}>
      <div className="min-h-screen">
        <TopNavigation />
        <SidebarNavigation pendingInterestsCount={pendingInterestsCount} />
        <main className="mx-auto min-h-screen w-full max-w-400 px-3 pb-24 pt-20 md:px-5 lg:pl-72 lg:pr-6 lg:pt-5">
          {children}
        </main>
        <BottomNavigation pendingInterestsCount={pendingInterestsCount} />
      </div>
    </OrgProvider>
  );
}
