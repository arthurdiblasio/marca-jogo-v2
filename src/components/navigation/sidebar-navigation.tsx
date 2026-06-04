"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Search, Trophy } from "lucide-react";

import { OrganizationSwitcher } from "@/components/navigation/organization-switcher";
import { Button } from "@/components/ui/button";
import { mainNavigation } from "@/constants/navigation";
import { cn } from "@/lib/utils";

export function SidebarNavigation() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 border-r bg-card p-3 lg:block">
      <div className="flex h-full flex-col">
        <div className="mb-4 flex items-center justify-between gap-3 border-b pb-3">
          <div className="flex items-center gap-2 text-lg font-black">
            <span className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground">
              <Trophy className="size-5" />
            </span>
            Marca Jogo
          </div>
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" aria-label="Buscar">
              <Search className="size-5" />
            </Button>
            <Button size="icon" variant="ghost" aria-label="Notificacoes">
              <Bell className="size-5" />
            </Button>
          </div>
        </div>

        <OrganizationSwitcher className="mb-4" />

        <nav className="space-y-0.5">
          {mainNavigation.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

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
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t pt-4">
          <p className="caption text-primary">Temporada</p>
          <p className="mt-1 text-3xl font-black leading-none">2026</p>
          <p className="body-sm mt-2 font-bold text-muted-foreground">Futebol amador em modo profissional.</p>
        </div>
      </div>
    </aside>
  );
}
