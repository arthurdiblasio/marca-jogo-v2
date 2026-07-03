"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Trophy, Users } from "lucide-react";

import { cn } from "@/lib/cn";

const TABS = [
  { href: "/pelada/rodadas", label: "Rodadas", icon: Trophy },
  { href: "/pelada/jogadores", label: "Jogadores", icon: Users },
  { href: "/pelada", label: "Perfil", icon: Shield },
] as const;

export function PeladaProfileTabs() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 border-b border-slate-200 pb-2">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const active = tab.href === "/pelada" ? pathname === "/pelada" : pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition",
              active
                ? "bg-primary text-primary-foreground"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-700",
            )}
          >
            <Icon className="size-4" />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
