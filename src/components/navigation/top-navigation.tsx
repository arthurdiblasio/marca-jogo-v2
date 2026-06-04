"use client";

import { Bell, Search } from "lucide-react";

import { OrganizationSwitcher } from "@/components/navigation/organization-switcher";
import { Button } from "@/components/ui/button";

export function TopNavigation() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b bg-card lg:hidden">
      <div className="flex h-16 items-center justify-between gap-3 px-3">
        <OrganizationSwitcher />
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" aria-label="Buscar">
            <Search className="size-5" />
          </Button>
          <Button size="icon" variant="ghost" aria-label="Notificacoes">
            <Bell className="size-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
