"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { mainNavigation } from "@/constants/navigation";
import { cn } from "@/lib/utils";

export function BottomNavigation() {
  const pathname = usePathname();
  const items = mainNavigation.slice(0, 4);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-card px-2 pb-[env(safe-area-inset-bottom)] pt-2 lg:hidden">
      <div className="grid grid-cols-4 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className={cn(
                "flex h-14 flex-col items-center justify-center gap-1 rounded-md text-[0.7rem] font-black text-muted-foreground",
                active && "bg-primary/10 text-primary"
              )}
            >
              <Icon className="size-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
