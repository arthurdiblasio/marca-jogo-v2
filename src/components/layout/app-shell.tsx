"use client";

import { BottomNavigation } from "@/components/navigation/bottom-navigation";
import { SidebarNavigation } from "@/components/navigation/sidebar-navigation";
import { TopNavigation } from "@/components/navigation/top-navigation";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <TopNavigation />
      <SidebarNavigation />
      <main className="mx-auto min-h-screen w-full max-w-400 px-3 pb-24 pt-20 md:px-5 lg:pl-72 lg:pr-6 lg:pt-5">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
}
