"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { mainNavigation } from "@/constants/navigation";
import { useOrgs } from "@/contexts/org-context";
import { cn } from "@/lib/utils";

export function BottomNavigation({ pendingInterestsCount = 0 }: { pendingInterestsCount?: number }) {
  const pathname = usePathname();
  const { activeOrg } = useOrgs();
  const items = mainNavigation
    .filter((item) => !item.orgTypes || (activeOrg && item.orgTypes.includes(activeOrg.type)))
    .slice(0, 4);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-card px-2 pb-[env(safe-area-inset-bottom)] pt-2 lg:hidden">
      <div className="grid grid-cols-4 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          const badgeCount = item.href === "/jogos" ? pendingInterestsCount : 0;

          return (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className={cn(
                "relative flex h-14 flex-col items-center justify-center gap-1 rounded-md text-[0.7rem] font-black text-muted-foreground",
                active && "bg-primary/10 text-primary"
              )}
            >
              <span className="relative">
                <Icon className="size-5" />
                {badgeCount > 0 && (
                  <span className="absolute -right-2 -top-1.5 grid min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[0.6rem] font-black leading-4 text-white">
                    {badgeCount > 9 ? "9+" : badgeCount}
                  </span>
                )}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
