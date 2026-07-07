"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Users } from "lucide-react";

import { cn } from "@/lib/cn";

const TABS = [
  { href: "/time/jogadores", label: "Jogadores", icon: Users },
  { href: "/time", label: "Perfil", icon: Shield },
] as const;

export function TeamProfileTabs() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 border-b border-border pb-2">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const active = pathname === tab.href;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
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
