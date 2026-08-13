"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, LogOut, Search, Trophy } from "lucide-react";

import { OrganizationSwitcher } from "@/components/navigation/organization-switcher";
import { ThemeToggle } from "@/components/navigation/theme-toggle";
import { Button } from "@/components/ui/button";
import { mainNavigation } from "@/constants/navigation";
import { useOrgs } from "@/contexts/org-context";
import { cn } from "@/lib/utils";
import { logoutRequest } from "@/modules/auth/services/auth-api";

export function SidebarNavigation({ pendingInterestsCount = 0 }: { pendingInterestsCount?: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const { activeOrg } = useOrgs();
  const navigation = mainNavigation.filter(
    (item) => !item.orgTypes || (activeOrg && item.orgTypes.includes(activeOrg.type))
  );

  async function handleLogout() {
    await logoutRequest();

    router.replace("/");
    router.refresh();
  }
  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 border-r bg-card p-3 lg:block">
      <div className="flex h-full flex-col">
        <div className="mb-4 flex items-center justify-between gap-3 border-b pb-3">
          <div className="flex items-center gap-2 text-lg font-black">
            <span className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground">
              <Trophy className="size-5" />
            </span>
            Chama Time
          </div>
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" aria-label="Buscar">
              <Search className="size-5" />
            </Button>
            <Button size="icon" variant="ghost" aria-label="Notificacoes">
              <Bell className="size-5" />
            </Button>
            <ThemeToggle />
          </div>
        </div>

        <OrganizationSwitcher className="mb-4" />

        <nav className="space-y-0.5">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            const badgeCount = item.href === "/time/agenda" ? pendingInterestsCount : 0;

            return (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className={cn(
                  "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-extrabold text-muted-foreground transition hover:bg-muted hover:text-foreground",
                  active && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                )}
              >
                <Icon className="size-5" />
                <span className="flex-1">{item.label}</span>
                {badgeCount > 0 && (
                  <span className="grid min-w-5 place-items-center rounded-full bg-rose-500 px-1.5 text-xs font-black leading-5 text-white">
                    {badgeCount > 9 ? "9+" : badgeCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t pt-4">
          <p className="caption text-primary">Temporada</p>
          <p className="mt-1 text-3xl font-black leading-none">2026</p>
          <p className="body-sm mt-2 font-bold text-muted-foreground">Futebol amador em modo profissional.</p>
        </div>
        <Button
          variant="ghost"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
    </aside>
  );
}
